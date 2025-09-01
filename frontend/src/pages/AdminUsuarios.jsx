import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./AdminUsuarios.css";

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/usuarios")
      .then(res => setUsuarios(res.data))
      .catch(err => console.error("Error al obtener usuarios:", err));
  }, []);

  const exportarExcel = () => {
    const data = usuarios.map((user, index) => ({
      Nro: index + 1,
      Nombre: `${user.nombre} ${user.apellido}`,
      TipoDocumento: user.tipoDocumento,
      NumeroDocumento: user.numeroDocumento,
      FechaNacimiento: new Date(user.fechaNacimiento).toLocaleDateString(),
      Genero: user.genero,
      Discapacidad: user.discapacidad,
      Municipio: user.municipio,
      Telefono: user.telefono,
      Email: user.email,
      Cursos: user.cursosInscritos
        .filter(c => c)
        .map(c => c.title)
        .join(", "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "usuarios_con_cursos.xlsx");
  };

  return (
    <div className="admin-usuarios-container">
      <AdminNavbar />
      <h1 className="usuarios-title">Usuarios Registrados</h1>
      <button className="export-btn" onClick={exportarExcel}>
        📥 Exportar a Excel
      </button>

      <table className="usuarios-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Tipo Doc.</th>
            <th>Número Doc.</th>
            <th>Fecha Nac.</th>
            <th>Género</th>
            <th>Discapacidad</th>
            <th>Municipio</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Cursos Inscritos</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.nombre} {user.apellido}</td>
              <td>{user.tipoDocumento}</td>
              <td>{user.numeroDocumento}</td>
              <td>{new Date(user.fechaNacimiento).toLocaleDateString()}</td>
              <td>{user.genero}</td>
              <td>{user.discapacidad}</td>
              <td>{user.municipio}</td>
              <td>{user.telefono}</td>
              <td>{user.email}</td>
              <td>
                {user.cursosInscritos?.length > 0 ? (
                  <ul style={{ paddingLeft: "1rem" }}>
                    {user.cursosInscritos
                      .filter(curso => curso)
                      .map(curso => (
                        <li key={curso._id}>{curso.title}</li>
                      ))}
                  </ul>
                ) : (
                  "Ninguno"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsuarios;
