import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import "./adminPanel.css";
import API_URL from "../api"; // 👈 usamos variable de entorno

const AdminPanel = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: null,
    imagenPlataforma: null,
    linkContenido: "",
  });
  const [modulos, setModulos] = useState([{ nombre: "", archivoZip: null }]);
  const [modulosSubidos, setModulosSubidos] = useState([]);
  const [modulosPorLink, setModulosPorLink] = useState([{ nombre: "", ruta: "" }]);
  const [editingCourse, setEditingCourse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/courses`);
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ---------- MÓDULOS ZIP ----------
  const handleModuloChange = (index, e) => {
    const nuevosModulos = [...modulos];
    nuevosModulos[index].nombre = e.target.value;
    setModulos(nuevosModulos);
  };

  const handleModuloFilesChange = (index, e) => {
    const nuevosModulos = [...modulos];
    nuevosModulos[index].archivoZip = e.target.files[0];
    setModulos(nuevosModulos);
  };

  const agregarModulo = () => setModulos([...modulos, { nombre: "", archivoZip: null }]);

  const eliminarModulo = (index) => {
    const nuevosModulos = [...modulos];
    nuevosModulos.splice(index, 1);
    setModulos(nuevosModulos);
  };

  const handleSubirModulos = async (e) => {
    e.preventDefault();
    const rutas = [];
    let mensaje = "✅ Módulos ZIP subidos correctamente:\n\n";

    for (let modulo of modulos) {
      const zipFormData = new FormData();
      zipFormData.append("archivoZip", modulo.archivoZip);
      zipFormData.append("curso", form.title);
      zipFormData.append("modulo", modulo.nombre);

      try {
        const res = await axios.post(`${API_URL}/api/modulos/subir-modulo`, zipFormData);
        if (res.data && res.data.ruta) {
          rutas.push({ nombre: modulo.nombre, ruta: res.data.ruta });
          mensaje += `📦 ${modulo.nombre}: ${res.data.ruta}\n`;
        }
      } catch (err) {
        console.error("Error al subir módulo:", err);
      }
    }

    setModulosSubidos(rutas);
    alert(mensaje);
  };

  // ---------- MÓDULOS POR LINK ----------
  const handleModuloLinkChange = (index, field, value) => {
    const nuevosLinks = [...modulosPorLink];
    nuevosLinks[index][field] = value;
    setModulosPorLink(nuevosLinks);
  };

  const agregarModuloLink = () => setModulosPorLink([...modulosPorLink, { nombre: "", ruta: "" }]);

  const eliminarModuloLink = (index) => {
    const nuevosLinks = [...modulosPorLink];
    nuevosLinks.splice(index, 1);
    setModulosPorLink(nuevosLinks);
  };

  // ---------- CLOUDINARY UPLOAD ----------
  const subirImagen = async (file) => {
    const formData = new FormData();
    formData.append("imagen", file);

    try {
      const { data } = await axios.post(`${API_URL}/api/upload`, formData);
      return data.url; // URL pública de Cloudinary
    } catch (err) {
      console.error("❌ Error al subir imagen:", err);
      return null;
    }
  };

  // ---------- CRUD CURSOS ----------
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este curso?")) {
      try {
        await axios.delete(`${API_URL}/api/courses/${id}`);
        fetchCourses();
        alert("✅ Curso eliminado exitosamente");
      } catch (error) {
        console.error("❌ Error al eliminar curso:", error);
      }
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course._id);
    setForm({
      title: course.title,
      description: course.description,
      linkContenido: course.linkContenido,
      image: null,
      imagenPlataforma: null,
    });
    setModulosPorLink(course.linkModulos || []);
  };

  const handleSubmitCurso = async (e) => {
    e.preventDefault();

    // Subir imágenes a Cloudinary si existen
    let imageUrl = form.image ? await subirImagen(form.image) : null;
    let plataformaUrl = form.imagenPlataforma ? await subirImagen(form.imagenPlataforma) : null;

    const payload = {
      title: form.title,
      description: form.description,
      linkContenido: form.linkContenido,
      linkModulos: [...modulosSubidos, ...modulosPorLink],
      image: imageUrl,
      imagenPlataforma: plataformaUrl,
    };

    try {
      if (editingCourse) {
        await axios.put(`${API_URL}/api/courses/${editingCourse}`, payload);
        alert("✅ Curso actualizado correctamente");
      } else {
        await axios.post(`${API_URL}/api/courses`, payload);
        alert("✅ Curso creado correctamente");
      }
      setEditingCourse(null);
      fetchCourses();
    } catch (err) {
      console.error("Error al guardar curso:", err);
    }
  };

  return (
    <div className="admin-panel">
      <AdminNavbar onLogout={handleLogout} />
      <h1>Panel de Administración</h1>

      {/* FORM SUBIR MÓDULOS ZIP */}
      <form onSubmit={handleSubirModulos} className="course-form">
        <h2>Subir Módulos ZIP</h2>
        {modulos.map((modulo, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Nombre módulo"
              value={modulo.nombre}
              onChange={(e) => handleModuloChange(index, e)}
              required
            />
            <input type="file" accept=".zip" onChange={(e) => handleModuloFilesChange(index, e)} required />
            <button className="ButtonEliminar" type="button" onClick={() => eliminarModulo(index)}>Eliminar</button>
          </div>
        ))}
        <button type="button" onClick={agregarModulo}>+ Agregar módulo ZIP</button>
        <button type="submit">Subir ZIP</button>
      </form>

      {/* MOSTRAR MÓDULOS SUBIDOS */}
      {modulosSubidos.length > 0 && (
        <div className="tabla-modulos-subidos">
          <h3>Módulos Subidos</h3>
          <table className="modulos-table">
            <thead>
              <tr>
                <th>Nombre del Módulo</th>
                <th>Ruta</th>
              </tr>
            </thead>
            <tbody>
              {modulosSubidos.map((mod, index) => (
                <tr key={index}>
                  <td>{mod.nombre}</td>
                  <td><a href={mod.ruta} target="_blank" rel="noopener noreferrer">{mod.ruta}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FORM CREAR CURSO */}
      <form onSubmit={handleSubmitCurso} className="course-form">
        <h2>Crear Curso</h2>
        <input type="text" placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input type="text" placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} required />
        <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, imagenPlataforma: e.target.files[0] })} required />

        {/* Módulos por link */}
        {modulosPorLink.map((modulo, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Nombre módulo link"
              value={modulo.nombre}
              onChange={(e) => handleModuloLinkChange(index, "nombre", e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Ruta módulo link"
              value={modulo.ruta}
              onChange={(e) => handleModuloLinkChange(index, "ruta", e.target.value)}
              required
            />
            <button type="button" onClick={() => eliminarModuloLink(index)}>Eliminar</button>
          </div>
        ))}
        <button type="button" onClick={agregarModuloLink}>+ Agregar módulo link</button>
        <button type="submit">{editingCourse ? "Actualizar Curso" : "Crear Curso"}</button>
      </form>

      {/* TABLA CURSOS */}
      <table className="course-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Imagen</th>
            <th>Imagen Plataforma</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course._id}>
              <td>{course.title}</td>
              <td>{course.description}</td>
              <td>{course.image && <img src={course.image} alt={course.title} width="100" />}</td>
              <td>{course.imagenPlataforma && <img src={course.imagenPlataforma} alt={course.title} width="100" />}</td>
              <td>
                <button onClick={() => handleEdit(course)}>Editar</button>
                <button onClick={() => handleDelete(course._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
