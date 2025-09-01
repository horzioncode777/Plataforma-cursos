const Citizen = require('../models/Citizen'); // Asegúrate de que la ruta sea correcta

// Controlador para actualizar el perfil del ciudadano
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // El ID del usuario se obtiene del token JWT

    // Los datos del perfil a actualizar vienen en req.body
    const updateData = req.body;

    // Si hay una nueva foto de perfil, la agregamos a los datos a actualizar
    if (req.file) {
      updateData.fotoPerfil = req.file.path; // Asignamos la ruta de la imagen al campo fotoPerfil
    }

    // Actualizamos el ciudadano en la base de datos
    const updatedCitizen = await Citizen.findByIdAndUpdate(
      userId, // ID del usuario
      updateData, // Los nuevos datos (si incluye fotoPerfil, también se actualizará)
      { new: true } // Devuelve el documento actualizado
    );

    if (!updatedCitizen) {
      return res.status(404).json({ message: 'Ciudadano no encontrado' });
    }

    // Devuelve el ciudadano actualizado
    res.json(updatedCitizen);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el perfil', error });
  }
};

module.exports = {
  updateProfile,
};
