import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  // Model loading
  const [ready, setReady] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [progressItems, setProgressItems] = useState([]);

  // Inputs and outputs
  const [input, setInput] = useState("miau");
  const [output, setOutput] = useState("");
  const [embeddings, setEmbeddings] = useState([]);
  const [comparisonArray, setComparisonArray] = useState([
    "los caninos dicen",
    "los bovinos dicen",
    "los reptiles dicen",
    "los felinos dicen",
    "los insectos dicen",
  ]);
  const [similarityPercentage, setSimilarityPercentage] = useState([]);

  // Create a reference to the worker object.
  const worker = useRef(null);

  // Función de ejemplo para obtener el embedding de una palabra.
  const getWordEmbedding = (word) => {
    // Aquí deberías implementar la lógica para obtener el embedding de la palabra.
    // Esto es solo un ejemplo, debes reemplazarlo con tu lógica real.
    return [0.1, 0.2, 0.3]; // Esto es solo un ejemplo de un embedding de tres dimensiones.
  };

  const calculateSimilarity = () => {
    if (embeddings.length === 0) {
      // Asegúrate de que los embeddings estén disponibles antes de calcular la similitud.
      return;
    }

    const similarityPercentages = [];

    for (const word of comparisonArray) {
      // Aquí deberías obtener el embedding del word y compararlo con el embedding de la frase ingresada.
      // La siguiente línea es un ejemplo, debes reemplazarla con tu lógica de comparación.
      const similarity = calculateCOSSimilarity(
        embeddings,
        getWordEmbedding(word)
      );

      similarityPercentages.push({
        word,
        similarity,
      });
    }

    // Actualiza el estado con los porcentajes de similitud.
    setSimilarityPercentage(similarityPercentages);
    console.log("Similarity Percentages:", similarityPercentages);
  };

  // Función de ejemplo para calcular el coseno de similitud.
  const calculateCOSSimilarity = (embedding1, embedding2) => {
    // Implementa aquí tu lógica para calcular el coseno de similitud entre dos embeddings.
    // Esto es solo un ejemplo, deberías usar una función real de cálculo de coseno de similitud.
    return 0.75;
  };

  // We use the `useEffect` hook to setup the worker as soon as the `App` component is mounted.
  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL("./worker.js", import.meta.url), {
        type: "module",
      });
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e) => {
      let embeddingDimensionality;

      switch (e.data.status) {
        case "complete":
          // Embedding complete: re-enable the "Search" button
          setDisabled(false);
          setEmbeddings(e.data.embeddings);

          // Obtener la dimensionalidad del embedding y mostrarla en la consola
          embeddingDimensionality = e.data.embeddings[0].length;
          console.log(
            "Dimensionalidad del embedding:",
            embeddingDimensionality
          );

          console.log("Embeddings:", e.data.embeddings);
          break;

        default:
          break;
      }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener("message", onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () =>
      worker.current.removeEventListener("message", onMessageReceived);
  }, []);

  const searchEmbeddings = () => {
    setDisabled(true);
    setOutput("");
    setSimilarityPercentage([]); // Reiniciar el estado al buscar nuevos embeddings.

    worker.current.postMessage({
      text: input,
    });
  };

  return (
    <>
      <div>
        <label>Enter a phrase for embedding:</label>
        <textarea
          value={input}
          rows={3}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
        <button disabled={disabled} onClick={searchEmbeddings}>
          Search Embeddings
        </button>
      </div>

      <div>
        <label>Embedding:</label>
        <textarea
          value={JSON.stringify(embeddings)}
          rows={3}
          readOnly
        ></textarea>
      </div>

      <div>
        <label>Comparison Array:</label>
        <textarea
          value={JSON.stringify(comparisonArray)}
          rows={3}
          readOnly
        ></textarea>
      </div>

      <div>
        <button disabled={disabled} onClick={calculateSimilarity}>
          Calculate Similarity
        </button>
        <label>Similarity Percentages:</label>
        <ul>
          {similarityPercentage.map((item) => (
            <li key={item.word}>
              {item.word}: {item.similarity * 100}%
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
