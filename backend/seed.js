import mongoose from "mongoose";
import Course from "./models/Course.js";

mongoose.connect("mongodb://localhost:27017/coursesDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const courses = [
  {
    title: "Curso 1",
    descripcion: "Descripción del curso 1",
    image: "/assets/course1.jpg",
    imagenPlataforma: "/assets/platform1.jpg",
  },
  {
    title: "Curso 2",
    descripcion: "Descripción del curso 2",
    image: "/assets/course2.jpg",
    imagenPlataforma: "/assets/platform2.jpg",
  },
  {
    title: "Curso 3",
    descripcion: "Descripción del curso 3",
    image: "/assets/course3.jpg",
    imagenPlataforma: "/assets/platform3.jpg",
  },
];

const seedDB = async () => {
  await Course.deleteMany({});
  await Course.insertMany(courses);
  console.log("📊 Base de datos poblada con cursos");
  mongoose.connection.close();
};

seedDB();
