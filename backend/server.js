// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Configurar middleware
app.use(express.json());
app.use(cors());

// Conexión a MongoDB
mongoose.connect("mongodb://localhost:27017/weatherAppDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
db.once("open", () => {
  console.log("Conexión exitosa a MongoDB");
});

// Definir el esquema del historial de búsqueda
const searchHistorySchema = new mongoose.Schema({
  city: String,
  country: String,
  temp: Number,
  condition: String,
  icon: String,
  conditionText: String,
  timestamp: { type: Date, default: Date.now },
});

// Crear el modelo del historial de búsqueda
const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema);

// Ruta para guardar el historial de búsqueda
app.post("/save-search", async (req, res) => {
  try {
    const { city, country, temp, condition, icon, conditionText } = req.body;

    const newSearch = new SearchHistory({
      city,
      country,
      temp,
      condition,
      icon,
      conditionText,
    });

    await newSearch.save();
    res.status(201).json({ message: "Historial de búsqueda guardado correctamente" });
  } catch (error) {
    console.error("Error al guardar historial de búsqueda:", error);
    res.status(500).json({ message: "Error al guardar historial de búsqueda" });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});
