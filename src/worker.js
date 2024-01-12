import { pipeline } from "@xenova/transformers";

class MyEmbeddingPipeline {
  static task = "feature-extraction";
  static model = "Xenova/all-MiniLM-L6-v2";
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      console.log("Loading embedding pipeline...");
      this.instance = pipeline(this.task, this.model, { progress_callback });
      console.log("Embedding pipeline loaded successfully.");
    }

    return this.instance;
  }
}

self.addEventListener("message", async (event) => {
  let embedder = await MyEmbeddingPipeline.getInstance((x) => {
    console.debug("Model loading progress:", x);
    self.postMessage(x);
  });

  console.debug("Performing embedding...");
  let embeddings = await embedder(event.data.text, {
    pooling: "mean",
    normalize: true,
  });

  console.debug("Embedding complete.");
  self.postMessage({
    status: "complete",
    embeddings: embeddings.tolist(),
  });
});
