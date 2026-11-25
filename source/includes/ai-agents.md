# AI Coding Agents

If you build your integration with an AI coding agent such as Claude Code, give the agent the guide below instead of this reference. The guide is written for agents: it is one Markdown file, it needs no other page, and it states the rules that integrations most often get wrong.

## Trip API integration guide

**[Daytrip Partner API v3 (Trip API): integration guide for AI coding agents](https://mydaytrip.github.io/partner-api/trip-api-v3-agent-guide.md)**

The guide contains:

- the hard rules for a correct client (timestamps, departure time, option ids, empty results, expiry);
- the request and response types of every Trip API endpoint;
- how each endpoint behaves, including adjusted pickup points, stops, updates and cancellation;
- what to do for each error status, and a recovery procedure for bookings whose outcome is unknown;
- a checklist of cases to test on the sandbox.

Link to copy and paste to your agent:

`https://mydaytrip.github.io/partner-api/trip-api-v3-agent-guide.md`

> Prompt to copy and paste to your agent:

```text
Implement a Daytrip Trip API v3 client in our backend.
Read this guide first and follow it exactly:
https://mydaytrip.github.io/partner-api/trip-api-v3-agent-guide.md
```

An index of the documents for agents is published at [llms.txt](https://mydaytrip.github.io/partner-api/llms.txt).
