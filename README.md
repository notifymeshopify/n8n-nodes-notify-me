# n8n-nodes-notify-me

This is an n8n community node for [Notify Me!](https://notify-me.io) — the Shopify app for back-in-stock, pre-order, and waitlist notifications.

It exposes the Notify Me! public REST API (`https://api.notify-me.app/v1/`) as native n8n nodes, so you can read subscriptions, pre-orders, and sent notifications, create new subscriptions or pre-orders, and trigger workflows when customers sign up.

## Contents

- [Installation](#installation)
- [Credentials](#credentials)
- [Supported operations](#supported-operations)
- [Trigger node](#trigger-node)
- [Example workflow](#example-workflow)
- [Resources](#resources)

## Installation

### Option A — Community Nodes UI (self-hosted n8n)

1. In n8n, go to **Settings → Community Nodes**.
2. Click **Install**.
3. Enter `n8n-nodes-notify-me`.
4. Agree to the risks and click **Install**.

The Notify Me! and Notify Me! Trigger nodes will appear in the node picker after a refresh.

### Option B — n8n Cloud

Once verified by n8n, the package is installable directly from the in-app Community Nodes panel on n8n Cloud. Until verification is complete, n8n Cloud users will need to self-host or wait for verification.

### Option C — Manual install (development / Docker)

```bash
# Inside your n8n user data directory:
cd ~/.n8n/custom
npm init -y                 # only if this directory is fresh
npm install n8n-nodes-notify-me
# Restart n8n
```

For Docker users, mount a volume at `/home/node/.n8n/custom` and run `npm install n8n-nodes-notify-me` inside it.

## Credentials

Create one **Notify Me API** credential per shop.

| Field | Value |
|-------|-------|
| API Key | Your shop's API key (from Shopify admin → Notify Me! → Settings → API) |

The key is sent on every request as the `X-Api-Key` header. When you click **Test**, n8n calls `GET /v1/subscriptions/?limit=1` against your account to verify the key.

## Supported operations

### `Notify Me!` (action node)

| Resource | Operations |
|---|---|
| Subscription | Get · Get Many |
| Subscription Notification | Get Many |
| Pre-Order | Get · Get Many |
| Pre-Order Notification | Get Many |

All `Get Many` operations support:
- **Return All** — paginate through every result (offset pagination, 100 per page).
- **Limit** — cap result count when `Return All` is off (max 100).
- **Filters** — every query parameter exposed by the API (date ranges, statuses, IDs, ordering).

> **The Notify Me! Public API is read-only.** Subscriptions and pre-orders are created by your storefront, by Shopify, or via the Notify Me! admin — not via this API. This node exposes everything the API does. If outbound webhooks or write endpoints ship later, they'll be added in a future version.

### `Notify Me! Trigger` (trigger node)

| Event | Behaviour |
|---|---|
| New Subscription | Polls `/v1/subscriptions/?ordering=-id` on the workflow's poll interval and emits any subscription with an ID greater than the highest one seen so far. |

- Dedupe is based on `id` (monotonically increasing). Workflow restarts and renames preserve the watermark via `workflowStaticData`.
- **Emit On First Activation** is off by default — when you activate against an existing account you won't get a flood of historical items.
- Poll interval is set on the workflow itself (top-right "Trigger Interval"). The Notify Me! API rate limit is **60 req/min**, so anything from 1 minute upward is safe.

## Example workflow

**Welcome new back-in-stock subscribers via Slack:**

```
[Notify Me! Trigger]  →  [Slack: Send Message]
  Event: New Subscription          Channel: #cs-restocks
  Poll: Every 5 minutes            Text: "New signup for product
                                          {{$json.product_id}} from
                                          {{$json.email}}"
```

**Daily digest of yesterday's pending alerts:**

```
[Schedule Trigger]  →  [Notify Me!]                       →  [Email]
  Cron: 0 9 * * *      Resource: Subscription                 Subject: Pending alerts
                       Operation: Get Many                    Body: {{$json | toJson}}
                       Return All: true
                       Filters: { sent_at_isnull: true,
                                  created_at_gte:
                                    {{$now.minus({days:1})}} }
```

## Resources

- API reference: <https://api.notify-me.app/v1/docs/>
- OpenAPI schema: <https://api.notify-me.app/v1/schema/>
- Public API guide: <https://help.notify-me.io/en/articles/13184354-notify-me-public-api>
- Notify Me! Shopify app: <https://apps.shopify.com/notify-me>
- n8n community nodes documentation: <https://docs.n8n.io/integrations/community-nodes/>

## Licence

[MIT](./LICENSE.md)
