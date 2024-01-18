import { useState } from "react";
import { pipeline, env } from "@xenova/transformers";
import { addItem, getListItems } from "./api"; // Asegúrate de importar correctamente las funciones desde tu archivo api.js

const App = () => {
  const [inputText, setInputText] = useState("");
  const [embedding, setEmbedding] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConvertClick = async (e) => {
    e.preventDefault();

    if (!inputText) {
      console.log("Ingrese una frase antes de convertir a embedding.");
      return;
    }

    try {
      setLoading(true);

      // Configurar la ruta local del modelo en el entorno de Transformers
      env.localModelPath = "/sites/Intranet/siteAssets/models";
      env.allowRemoteModels = false;

      // Cargar el modelo de forma local
      const model = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2" // Ruta relativa al directorio local del modelo
      );

      const embeddings = await model(inputText, {
        pooling: "mean",
        normalize: true,
      });

      console.log("Embedding generado:", embeddings.data);
      setEmbedding(embeddings.data);

      // Verificar si el embedding ya existe en la lista de SharePoint
      const existingItems = await getListItems();
      const existingEmbeddings = existingItems.map((item) => item.Embedding);

      if (!existingEmbeddings.includes(embeddings.data)) {
        // Si el embedding no existe, agregarlo a la lista de SharePoint
        await addItem({
          Texto: inputText, // Puedes ajustar el título según tus necesidades
          Embedding: embeddings.data,
        });

        console.log("Embedding agregado a la lista de SharePoint.");
      } else {
        console.log("El embedding ya existe en la lista de SharePoint.");
      }
    } catch (error) {
      console.error(
        "Error al generar el embedding o actualizar/agregar en SharePoint:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Convertir a Embedding</h1>
      <form onSubmit={handleConvertClick}>
        <label htmlFor="inputText">Ingrese una frase:</label>
        <input
          type="text"
          id="inputText"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          Convertir a Embedding
        </button>
      </form>

      {loading && <p>Cargando...</p>}

      {embedding && !loading && (
        <div>
          <h2>Resultado del Embedding:</h2>
          <pre>{JSON.stringify(embedding, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
