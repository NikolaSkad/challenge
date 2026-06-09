# Solution

## Frontend

**Memory leak**
The original code called `setItems` after the component unmounted if the fetch was slow. Fixed by using `AbortController` in both `Items.js` and `ItemDetail.js` - when the component unmounts it cancels the request so no state update happens on a dead component.

**Pagination and search**
Added page and search state to `Items.js`. Each change triggers a new fetch with `page`, `limit` and `q` params. Search is debounced 300ms so we don't hit the API on every keystroke.

**Virtualization**
Used `react-window` (`FixedSizeList`) so only visible rows are rendered in the DOM. Matters when the list grows large.

**UI polish**
Added skeleton loading state, error message with `role="alert"`, and `aria-label` on buttons and inputs.

## Backend

**Async I/O**
Replaced all `fs.readFileSync` and `fs.writeFileSync` calls with `fs.promises` so the event loop is never blocked.

**Stats caching**
`GET /api/stats` was recalculating on every request. Added a simple in-memory cache that gets cleared via `fs.watch` whenever `items.json` changes.

**Validation**
`POST /api/items` now returns 400 if `name`, `price` or `category` are missing.

**Tests**
Added Jest + Supertest tests for all three routes covering happy path and error cases.
