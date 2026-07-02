# Publishing checklist

Two parallel tracks. **(A)** ships immediately to all self-hosted n8n users; **(B)** ships to n8n Cloud users after n8n's verification review. (B) is built on top of (A) — you can't apply for verification without a published npm package.

---

## A. Publishing as a community node (npm)

### 1. Pre-flight code checks

- [ ] Replace placeholder SVGs in `nodes/NotifyMe/notifyMe.svg` and `nodes/NotifyMeTrigger/notifyMe.svg` with the official Notify Me! logo (60×60 viewBox, transparent background).
- [ ] Confirm package name matches the registry: `n8n-nodes-notify-me` (community-node naming rule: must start with `n8n-nodes-` and not contain `n8n` as a separate word in the rest).
- [ ] Fill in author email, repository URL, and homepage in `package.json`.
- [ ] Bump `version` from `0.1.0` to `1.0.0` for first public release (or keep `0.1.0` if you want a beta tag).
- [ ] Verify the `n8n` block in `package.json` points to compiled `dist/` paths only.

### 2. Build & lint

```bash
npm install
npm run lint
npm run build
```

The build must produce `dist/credentials/NotifyMeApi.credentials.js` and both `dist/nodes/*/...node.js` files alongside copied `.svg` icons.

### 3. Local smoke test against a real n8n instance

```bash
# In the repo:
npm pack
# Produces n8n-nodes-notify-me-1.0.0.tgz

# In a throwaway n8n directory:
mkdir n8n-test && cd n8n-test
npm init -y
npm install /path/to/n8n-nodes-notify-me-1.0.0.tgz
N8N_CUSTOM_EXTENSIONS=$(pwd)/node_modules/n8n-nodes-notify-me npx n8n start
```

Manual checks:
- [ ] Credential test against a real shop key returns green.
- [ ] `Get Many` on each resource paginates correctly with `Return All`.
- [ ] `Get` on a known subscription/pre-order ID returns the expected object.
- [ ] Trigger polls and emits new items; restart workflow and confirm no re-emission.

### 4. npm publish

```bash
# First-time login:
npm login

# Make sure you're publishing under a scope/org that maps to "Notify Me!" — not a personal account.
npm publish --access public
```

### 5. Post-publish

- [ ] Tag and push the matching git release: `git tag v1.0.0 && git push --tags`.
- [ ] Add an `npm` and `n8n verified` badge to the README once verified.
- [ ] Submit to the [community node tracking issue](https://github.com/n8n-io/n8n/discussions) so it appears in directory searches.

---

## B. Submitting for n8n's Verified Community Nodes program

Verification gets the package onto n8n Cloud (where users cannot install arbitrary npm packages) and adds a "Verified" badge in the in-app catalogue.

### Eligibility (per n8n's published criteria — verify current list at <https://docs.n8n.io/integrations/creating-nodes/deploy/submit-community-nodes/>)

- [ ] Package is published on npm and follows the `n8n-nodes-*` naming convention.
- [ ] Both nodes use `n8nNodesApiVersion: 1` and TypeScript.
- [ ] Credentials class has `documentationUrl` set.
- [ ] No runtime dependencies beyond `n8n-workflow` (peer dep only).
- [ ] No `console.log`, no network calls outside the documented base URL, no use of `eval`.
- [ ] All nodes have icons, descriptions, and category metadata.
- [ ] Repo is public (or n8n's review team has read access).
- [ ] You have an active n8n Cloud account or partner contact.

### Submission

1. Email **partnerships@n8n.io** (or use the form linked from the docs page above) with:
   - Package name: `n8n-nodes-notify-me`
   - GitHub/GitLab repo URL
   - Maintainer contact (Notify Me! support inbox)
   - Short description of the integration and target user (Shopify merchants running back-in-stock / pre-order campaigns)
   - npm download stats if any
2. Provide a test account: a real Notify Me! shop with a valid API key, scoped so n8n's reviewer can exercise every operation without touching production data.
3. n8n's review covers:
   - Code review (security, error handling, no surprise side effects)
   - UX review (node naming, descriptions, parameter defaults)
   - Branding (icon meets contrast/size guidelines)
4. Typical timeline: 2–4 weeks. Iteration on review comments is expected; verification is not a single round trip.

### After approval

- n8n adds the package to their verified registry; it surfaces on n8n Cloud's Community Nodes panel.
- The node listing on n8n.io/integrations gets a "Verified" badge.
- You commit to maintaining the package; n8n typically reaches out before deprecating any internal API the node relies on.

---

## Nice-to-haves for future versions

The Notify Me! Public API is read-only by design as of v1.0. These would be UX upgrades if the API ever exposes them:

| Item | What changes in the node |
|-----|--------|
| Outbound webhooks (e.g. `subscription.created`) | Replace the polling trigger with a webhook-based trigger — strict UX upgrade (zero-latency vs. minutes-of-latency). |
| `Retry-After` / `X-RateLimit-*` headers | The trigger could back off automatically instead of relying on the workflow's fixed poll interval. |
| Write endpoints (Create / Update / Delete) | Add corresponding operations to the node. |

None of these block v1.0 publication.

---

## Versioning policy

- `1.x` — initial verified release. Breaking changes bump major.
- Patch releases for bug fixes and added filters; minor for new operations.
- Each release should include a `CHANGELOG.md` entry; n8n's reviewers check this on subsequent verification renewals.
