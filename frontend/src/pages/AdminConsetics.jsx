import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import "./adminNoticias.css";

const AdminConsetics = () => {
  const [masConsejos, setMasConsejos] = useState([]);
  const [videoConsejos, setVideoConsejos] = useState([]);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);

  const [videoArchivo, setVideoArchivo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const [editingMas, setEditingMas] = useState(null);
  const [editingVideoId, setEditingVideoId] = useState(null);

  useEffect(() => {
    fetchMasConsejos();
    fetchVideoConsejos();
  }, []);

  const fetchMasConsejos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/masconsejos");
      setMasConsejos(res.data);
    } catch (err) {
      console.error("Error al obtener masConsejos:", err);
    }
  };

  const fetchVideoConsejos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/videoconsejos");
      if (Array.isArray(res.data)) {
        setVideoConsejos(res.data);
      } else {
        setVideoConsejos([]);
      }
    } catch (err) {
      console.error("Error al obtener videoConsejos:", err);
    }
  };

  const handleUploadFile = async (file) => {
    const formData = new FormData();
    formData.append("imagen", file);
    const upload = await axios.post("http://localhost:5000/api/upload", formData);
    return upload.data.url;
  };

  const handleAddMasConsejo = async (e) => {
    e.preventDefault();
    try {
      let urlImg = editingMas?.imagen;
      if (imagen) {
        urlImg = await handleUploadFile(imagen);
      }

      const nuevo = { titulo, descripcion, imagen: urlImg };

      if (editingMas) {
        await axios.put(`http://localhost:5000/api/masconsejos/${editingMas._id}`, nuevo);
      } else {
        await axios.post("http://localhost:5000/api/masconsejos", nuevo);
      }

      fetchMasConsejos();
      resetMasConsejoForm();
    } catch (err) {
      console.error("Error al guardar consejo:", err);
    }
  };

  const handleAddOrUpdateVideoConsejo = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (videoArchivo) formData.append("video", videoArchivo);
      if (thumbnail) formData.append("thumbnail", thumbnail);

      if (editingVideoId) {
        await axios.put(
          `http://localhost:5000/api/videoconsejos/${editingVideoId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axios.post("http://localhost:5000/api/videoconsejos", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchVideoConsejos();
      resetVideoConsejoForm();
    } catch (err) {
      console.error("Error al guardar video consejo:", err);
    }
  };

  const handleDeleteMasConsejo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/masconsejos/${id}`);
      fetchMasConsejos();
    } catch (err) {
      console.error("Error al eliminar consejo:", err);
    }
  };

  const handleDeleteVideoConsejo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/videoconsejos/${id}`);
      fetchVideoConsejos();
    } catch (err) {
      console.error("Error al eliminar video consejo:", err);
    }
  };

  const resetMasConsejoForm = () => {
    setTitulo("");
    setDescripcion("");
    setImagen(null);
    setEditingMas(null);
  };

  const resetVideoConsejoForm = () => {
    setVideoArchivo(null);
    setThumbnail(null);
    setEditingVideoId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const getFullUrl = (path) =>
    path?.startsWith("http") ? path : `http://localhost:5000${path}`;

  return (
    <div>
      <div className="AdminNavbar consetic-nav">
        <AdminNavbar onLogout={handleLogout} />
      </div>
      <div className="admin-noticias">
        <h1>Administrar CONSETIC</h1>

        {/* MAS CONSEJOS */}
        <form className="noticia-form" onSubmit={handleAddMasConsejo}>
          <h3>{editingMas ? "Editar MAS CONSEJO" : "Agregar MAS CONSEJO"}</h3>
          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
          <textarea
            placeholder="Descripción (máx. 350 caracteres)"
            style={{ backgroundColor: "#fff" }}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            maxLength={350}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
          />
          <button type="submit">
            {editingMas ? "Guardar Cambios" : "Agregar Consejo"}
          </button>
          {editingMas && (
            <button type="button" onClick={resetMasConsejoForm}>
              Cancelar edición
            </button>
          )}
        </form>

        <table className="noticia-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Descripción</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {masConsejos.map((item) => (
              <tr key={item._id}>
                <td>{item.titulo}</td>
                <td>{item.descripcion}</td>
                <td>
                  <img
                    src={getFullUrl(item.imagen)}
                    className="noticia-image"
                    alt="Consejo"
                  />
                </td>
                <td>
                  <button
                    onClick={() => {
                      setTitulo(item.titulo);
                      setDescripcion(item.descripcion);
                      setImagen(null);
                      setEditingMas(item);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteMasConsejo(item._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* VIDEO CONSEJOS */}
        <form className="noticia-form" onSubmit={handleAddOrUpdateVideoConsejo}>
          <h3>{editingVideoId ? "Editar VIDEO CONSEJO" : "Agregar VIDEO CONSEJO"}</h3>

          <label className="title" htmlFor="video">Selecciona el video:</label>
          <input
            id="video"
            type="file"
            accept="video/*"
            onChange={(e) => setVideoArchivo(e.target.files[0])}
          />

          <label htmlFor="thumbnail">Selecciona la imagen (thumbnail):</label>
          <input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />

          <button type="submit">
            {editingVideoId ? "Guardar Cambios" : "Agregar Video"}
          </button>
          {editingVideoId && (
            <button type="button" onClick={resetVideoConsejoForm}>
              Cancelar edición
            </button>
          )}
        </form>

        {videoConsejos.length > 0 && (
          <table className="noticia-table">
            <thead>
              <tr>
                <th>Video</th>
                <th>Thumbnail</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {videoConsejos.map((video) => (
                <tr key={video._id}>
                  <td>
                    {video.videoUrl ? (
                      <video width="200" controls>
                        <source
                          src={getFullUrl(video.videoUrl)}
                          type="video/mp4"
                        />
                      </video>
                    ) : (
                      "No hay video"
                    )}
                  </td>
                  <td>
                    {video.thumbnail ? (
                      <img
                        src={getFullUrl(video.thumbnail)}
                        className="noticia-image"
                        alt="Thumbnail"
                      />
                    ) : (
                      "Sin imagen"
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        setEditingVideoId(video._id);
                        setVideoArchivo(null);
                        setThumbnail(null);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteVideoConsejo(video._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminConsetics;
