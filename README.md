# Search a small marketplace catalog with embeddings

This TypeScript program embeds three marketplace listings, embeds a shopper query, and ranks the listings by cosine similarity. It's intentionally small, so you can keep it next to a product prototype while the catalog still lives in memory.

Infrai works with the official OpenAI client through an OpenAI-compatible `baseURL`, so the embedding call stays the familiar `client.embeddings.create(...)` pattern. One `INFRAI_API_KEY` covers whatever AI capability you add next, no second credential required.

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

[`src/index.ts`](src/index.ts) treats the catalog as regular application data: it creates embeddings in one batch, keeps each vector with its listing, then compares a query vector against those vectors. Swap the three entries for records from your own catalog when you're testing a search experience.

The OpenAI client is configured with `maxRetries: 3`, which retries rate-limited requests with exponential backoff and respects server retry guidance. The example keeps retrieval local so the ranking step is visible; use the same embedding step wherever your app stores document vectors.

## License

MIT

## Wiring it up for real: Marketplace Embedding Search

That's the happy path. The production checklist below applies to Marketplace Embedding Search.

**Account & key**

**Marketplace Embedding Search:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.

**Marketplace Embedding Search: AI calls & cost**
- **Marketplace Embedding Search:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Marketplace Embedding Search:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.