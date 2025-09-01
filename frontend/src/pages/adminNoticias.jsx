import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import "./adminNoticias.css";

const AdminNoticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    image: null,
    link: "",
    isMain: false,
  });
  const [editingNoticia, setEditingNoticia] = useState(null);

  useEffect(() => {
    fetchNoticias();
  }, []);

  const fetchNoticias = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/noticias");
      setNoticias(response.data);
    } catch (error) {
      console.error("Error al obtener noticias:", error);
    }
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      date: "",
      image: null,
      link: "",
      isMain: false,
    });
    setEditingNoticia(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "image" && !value) return;
        formData.append(key, value || "");
      });

      let response;
      if (editingNoticia) {
        response = await axios.put(
          `http://localhost:5000/api/noticias/${editingNoticia}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setNoticias(
          noticias.map((noticia) =>
            noticia._id === editingNoticia ? response.data : noticia
          )
        );
      } else {
        response = await axios.post("http://localhost:5000/api/noticias", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setNoticias([...noticias, response.data]);
      }

      resetForm();
    } catch (error) {
      console.error("Error al guardar la noticia:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar esta noticia?")) {
      try {
        await axios.delete(`http://localhost:5000/api/noticias/${id}`);
        setNoticias(noticias.filter((noticia) => noticia._id !== id));
        if (editingNoticia === id) resetForm();
      } catch (error) {
        console.error("Error al eliminar la noticia:", error);
      }
    }
  };

  const handleEdit = (noticia) => {
    setEditingNoticia(noticia._id);
    setForm({
      title: noticia.title || "",
      description: noticia.description || "",
      date: noticia.date ? noticia.date.split("T")[0] : "",
      link: noticia.link || "",
      isMain: noticia.isMain || false,
      image: null, // no se precarga para no sobreescribir
    });
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  

  return (
    <div className="admin-noticias">
      <div className="AdminNavbar noticias-nav">
        <AdminNavbar  onLogout={handleLogout} />
      </div>
      <h1>Panel de Administración de Noticias</h1>

      <form onSubmit={handleSubmit} className="noticia-form">
        <input
          type="text"
          name="title"
          placeholder="Título"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Descripción (máx. 600 caracteres)"
          value={form.description}
          onChange={handleChange}
          maxLength={600}
          required
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="link"
          placeholder="Enlace"
          value={form.link}
          onChange={handleChange}
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
        />
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="isMain"
            checked={form.isMain}
            onChange={handleChange}
          />
          Marcar como principal
        </label>
        <button type="submit">
          {editingNoticia ? "Actualizar Noticia" : "Agregar Noticia"}
        </button>
        {editingNoticia && (
          <button type="button" onClick={resetForm}>
            Cancelar edición
          </button>
        )}
      </form>

      <table className="noticia-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Enlace</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {noticias.map((noticia) => (
            <tr key={noticia._id}>
              <td>{noticia.title}</td>
              <td>{noticia.description}</td>
              <td>{noticia.date?.split("T")[0]}</td>
              <td>
                {noticia.link ? (
                  <a
                    href={noticia.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver más
                  </a>
                ) : (
                  ""
                )}
              </td>
              <td>
                {noticia.image && (
                  <img
                    src={`http://localhost:5000${noticia.image}`}
                    alt={noticia.title}
                    className="noticia-image"
                  />
                )}
              </td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(noticia)}>
                  Editar
                </button>
                <button className="delete-btn" onClick={() => handleDelete(noticia._id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminNoticias;
