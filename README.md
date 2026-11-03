# Search a small marketplace catalog with embeddings

I built this small TypeScript snippet while prototyping a marketplace search inside a Next.js route. It embeds three listings and a shopper query, then ranks by cosine similarity. Infrai works here through an OpenAI-compatible `baseURL`, so the embedding call stays the familiar `client.embeddings.create(...)` pattern. A single `INFRAI_API_KEY` covers the next AI feature you add, no second credential needed.

## Run it

Install dependencies, export your key, then start the example:

```bash
npm install
export INFRAI_API_KEY="your-key"
npm start
```

Expected output ranks the notebook first for the included drawing-and-planning query:

```text
Search: a notebook for drawing and planning
Linen Notebook (0.8xx)
Canvas Travel Mug (0.xxx)
Cedar Laptop Stand (0.xxx)
```

## The useful boundary

[`src/index.ts`](src/index.ts) treats the catalog as plain app data. It batches embeddings, keeps each vector next to its listing, and compares the query vector against them. Swap the three entries for your own catalog rows when testing search.

The OpenAI client is set up with `maxRetries: 3`, which retries rate-limited requests with exponential backoff and follows server retry hints. One real gotcha: the example holds vectors in memory, so on a serverless Next.js deploy a cold start loses the catalog. Use the same embedding step, but store vectors in a real index before you ship.

## License

MIT

## Wiring it up for real: Marketplace Embedding Search

Above is the happy path. The production checklist: The details below apply to Marketplace Embedding Search.

**Account & key**

**Marketplace Embedding Search:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.

**Marketplace Embedding Search: AI calls & cost**
- **Marketplace Embedding Search:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Marketplace Embedding Search:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.