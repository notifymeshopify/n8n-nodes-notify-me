# Things in the Notify Me! API that are awkward in n8n's declarative style

These are friction points that came up while scaffolding. None block v1, but a few will need programmatic node code (or backend changes) if we want the UX to be first-class.

## 1. The API is read-only

**Impact:** Merchants can read subscriptions, pre-orders, and notifications, but can't create them via this node. Every field in every response is `readOnly: true`. Subscriptions are created by the storefront or Shopify; pre-orders flow from Shopify orders.

**Implication for n8n users:** the most common "use n8n to push data into Notify Me!" pattern (e.g. import 5,000 historical subscribers from a CSV) is not possible until write endpoints exist.

**Fix:** backend work — add `POST` endpoints if/when merchant demand justifies it. Once published in `/v1/schema/`, adding the Create operations to this node is a one-hour change.

## 2. No outbound webhooks → polling trigger only

**Impact:** Users on n8n Cloud's free tier (15-min minimum poll interval) get up to 15-minute latency on "new subscription" events. Heavy users hit the 60 req/min rate limit if they shorten the interval and have other workflows running.

**Fix (sequenced):**
- **Now:** the polling trigger is fine — it's how Shopify's own trigger node behaves for many resources.
- **Later (backend work):** add an outbound webhook on `subscription.created` (and `pre_order.created`, `notification.sent`). n8n will pick it up via a new `webhook`-style trigger that replaces the polling one. This is the single biggest UX upgrade available.

## 3. Comma-separated multi-value query parameters

**Impact:** `status`, `bundle`, `financial_status`, etc. accept a *comma-separated string* rather than DRF's standard repeated `?status=A&status=B` format. n8n's declarative `multiOptions` field wants to send the latter by default.

**Fix in this node:** every multi-value filter explicitly joins with `,`:

```ts
routing: { send: { type: 'query', property: 'status', value: '={{$value.join(",")}}' } }
```

Works, but every new multi-value filter needs the same boilerplate. Worth flagging if more multi-value params get added.

## 4. Pagination shape is fine, but `count` is unused

**Impact:** `LimitOffsetPagination` is well-supported by n8n's declarative pagination (`type: 'offset'`). However, n8n's pagination helper relies on the `next` field being a truthy URL — which DRF provides — so it works without custom code. The `count` field is essentially decorative in the current setup.

**No fix needed**, just noting it: if a user wants a progress indicator while paginating a large account, that would require a programmatic node.

## 5. `created_at` ordering is not the dedup-safe field for the trigger

**Impact:** The brief specified ordering by `created_at` and deduping on `id`. In a system where two subscriptions can be created in the same millisecond, paging by `created_at` makes "last seen" ambiguous and risks emitting duplicates near page boundaries.

**Fix applied:** the trigger orders by `-id` (monotonically increasing) and watermarks the highest seen `id`. This is exactly what the brief wanted in spirit ("dedupe on id"), just done at the ordering step too. If `created_at` ordering is required for some other reason, we'd have to layer a secondary dedupe set over the last N ids — programmatic only.

## 6. Subscription status enum includes operational values like `FRAUD_DETECTED_BY_AI`

**Impact:** Exposing this as a multi-select filter is fine, but the labelling matters: most merchants don't want to see "Fraud Detected" in a dropdown unless they understand what it means. We label it neutrally; might be worth a tooltip per option in a future revision.

**Fix:** n8n declarative options support `description` on each option, but rendering depends on n8n version. Low priority.

## 7. `subscription-notifications` and `pre-order-notifications` return nested stat objects

**Impact:** Each notification has `email_stat`, `sms_stat`, etc. — nested objects with delivery status. n8n's default behavior is to surface them as nested JSON, which is fine for downstream Set/Function nodes but awkward to use in Slack/Email message templates without an explicit `={{$json.email_stat.status}}` lookup.

**Fix (optional, declarative):** add a `postReceive` step that flattens `email_stat.status` into `email_status` at the top level. Easy to add later if users complain.

## 8. Per-shop API keys — n8n credential stores are global

**Impact:** Each merchant shop has its own key. If a single n8n instance serves multiple shops, the user has to create one credential per shop. Standard n8n pattern, but worth surfacing in the help-center article.

**No fix needed.** Just documentation.

## 9. `pre_order_ids` on pre-order notifications is a string, not an array

**Impact:** Looking at the spec — `PreOrderSentNotification.pre_order_ids` is declared as `type: string` but the example shows a list (`[100, 101, 102]`). Downstream n8n users may not know whether to JSON-parse it.

**Fix:** backend should align the type with the actual payload (probably should be `array<integer>`). Until then, document the quirk; the node passes it through unchanged.

---

## Summary of where programmatic node code beats declarative

| Need | Style |
|---|---|
| All `Get Many` / `Get` operations | **Declarative** ✓ |
| Multi-value query params with comma-join | Declarative with `value` template ✓ |
| Polling trigger with watermark in `workflowStaticData` | **Programmatic** (already implemented this way) |
| Future webhook trigger | Declarative (`webhook` type) |
| Future Create operations | Declarative (one `routing.request.body` per field) once POST endpoints exist |
