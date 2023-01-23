# Authentication

> To authorize your requests, add the `x-api-key` header like this:

```bash
curl "https://api.staging.mydaytrip.net/partners/v3/trip/search"
  -H "x-api-key: your-api-key"
```

```javascript

```

```python

```

> Make sure to replace `your-api-key` with your API key.

Daytrip API uses API keys to allow access to the API. The API key needs to be included in the `x-api-key` header with each API request.

Your API key carries many privileges, so be sure to keep it secure! Do not share your secret API key in publicly accessible areas such as GitHub, client-side code, and so forth.
