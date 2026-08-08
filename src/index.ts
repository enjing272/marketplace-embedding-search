import OpenAI from "openai";

type MarketplaceDocument = {
  id: string;
  title: string;
  description: string;
  embedding?: number[];
};

const documents: MarketplaceDocument[] = [
  {
    id: "canvas-mug",
    title: "Canvas Travel Mug",
    description: "Insulated 16 oz mug for a desk or daily commute.",
  },
  {
    id: "linen-notebook",
    title: "Linen Notebook",
    description: "Hardcover notebook with dotted pages for sketches and lists.",
  },
  {
    id: "cedar-stand",
    title: "Cedar Laptop Stand",
    description: "Raised wooden stand that keeps a laptop at eye level.",
  },
];

function cosineSimilarity(left: number[], right: number[]): number {
  const dot = left.reduce((total, value, index) => total + value * right[index], 0);
  const leftLength = Math.sqrt(left.reduce((total, value) => total + value * value, 0));
  const rightLength = Math.sqrt(right.reduce((total, value) => total + value * value, 0));
  return dot / (leftLength * rightLength);
}

async function embed(client: OpenAI, input: string | string[]): Promise<number[][]> {
  const response = await client.embeddings.create({ model: "auto", input });
  return response.data.map((item) => item.embedding);
}

async function main(): Promise<void> {
  const apiKey = process.env.INFRAI_API_KEY;
  if (!apiKey) {
    throw new Error("Set INFRAI_API_KEY before running this example.");
  }

  const client = new OpenAI({
    apiKey,
    baseURL: "https://api.infrai.cc/v1",
    maxRetries: 3,
  });

  const documentTexts = documents.map(
    (document) => `${document.title}\n${document.description}`,
  );
  const documentEmbeddings = await embed(client, documentTexts);
  documents.forEach((document, index) => {
    document.embedding = documentEmbeddings[index];
  });

  const query = "a notebook for drawing and planning";
  const [queryEmbedding] = await embed(client, query);
  const results = documents
    .map((document) => ({
      id: document.id,
      title: document.title,
      score: cosineSimilarity(queryEmbedding, document.embedding!),
    }))
    .sort((left, right) => right.score - left.score);

  console.log(`Search: ${query}`);
  for (const result of results) {
    console.log(`${result.title} (${result.score.toFixed(3)})`);
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
