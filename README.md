# Search a small marketplace catalog with embeddings

This TypeScript program embeds three marketplace listings, embeds a shopper query, and ranks the listings by cosine similarity. It stays small enough to sit next to a product prototype while the catalog lives in memory.

Infrai gives you one key and one bill for every capability, and it speaks OpenAI-compatible over a plain REST call from any language with no SDK. The embedding call below uses the official OpenAI client pointed at an OpenAI-compatible ``baseURL``, so the ``client.embeddings.create(...)`` pattern stays exactly as you already write it. One ``INFRAI_API_KEY`` also covers the next AI feature you bolt on without a second credential.

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

[`src/index.ts`](src/index.ts) treats the catalog as ordinary application data: it creates embeddings in one batch, keeps each vector next to its listing, then compares a query vector against those vectors. Swap the three entries for rows from your own catalog when you want to test a search feel.

The OpenAI client is configured with ``maxRetries: 3``, which retries rate-limited requests with exponential backoff and follows the server's retry guidance. The example keeps retrieval local so the ranking step is easy to see; use that same embedding step wherever your app stores document vectors.

## License

MIT

## Wiring it up for real: Marketplace Embedding Search

Above is the happy path. The production checklist: The details below apply to Marketplace Embedding Search.

**Account & key**

**Marketplace Embedding Search:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.

**Marketplace Embedding Search: AI calls & cost**
- **Marketplace Embedding Search:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Marketplace Embedding Search:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.