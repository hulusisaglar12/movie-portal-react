# Assignment 4 Report — Movie Portal: Testing, Debugging & Performance

**Project:** Movie Portal (Assignment 3 base)
**Assignment:** 4 — Unit Testing, Debugging, Performance & Responsive Design

---

## 1. Project Overview

The Movie Portal is a React SPA that fetches live movie data from the **TMDB API** (The Movie Database). Users can browse top-rated films, search by title, filter by genre, and click through to a full detail page showing the overview and cast.

**Technology stack:**
- React 19 with React Router DOM v7
- Vite 5 (stable) as the build tool
- Vitest + React Testing Library for unit testing
- Native `fetch()` for API calls
- CSS Modules for component-level styling

---

## 2. Unit Testing

### 2.1 Setup

Testing dependencies added to `package.json`:
- `vitest` — test runner integrated with Vite
- `@testing-library/react` — renders components and queries the DOM like a user would
- `@testing-library/jest-dom` — extra matchers like `toBeInTheDocument()`
- `@testing-library/user-event` — simulates real user interactions
- `jsdom` — simulates a browser DOM in Node

`vite.config.js` was updated to include a `test` block pointing to `jsdom` as the environment and `src/setupTests.js` as the setup file.

> **Note:** Vite was downgraded from `8.0.0-beta.13` to stable `5.4.x` because the beta introduced a bug (`__vite_ssr_exportName__ is not defined`) that broke the test transformer. This does not affect the app's functionality.

### 2.2 Test Files and Coverage

| File | Tests | What is Covered |
|---|---|---|
| `MovieCard.test.jsx` | 8 | Title, year, rating, poster src, placeholder fallback, click navigation, keyboard Enter navigation, aria-label |
| `MovieDetails.test.jsx` | 7 | Title, year, rating, overview, all cast members, empty cast, Back button callback |
| `Home.test.jsx` | 10 | Page heading, search input, genre dropdown, movies loaded on mount, genres loaded, search API called, client-side genre filter, Previous disabled on page 1, Next enabled, page increment |
| `Details.test.jsx` | 8 | Loading state, title/year/rating/overview after load, cast display, correct id passed to `fetchMovieDetails`, correct id passed to `fetchMovieCredits` |
| **Total** | **33** | **All pass ✅** |

### 2.3 API Mocking Strategy

The TMDB API is mocked using `vi.mock` so tests run instantly without network calls:

```js
vi.mock('../Api/Tmdb', () => ({
  fetchTopRated: vi.fn(),
  searchMovies: vi.fn(),
  fetchGenres: vi.fn(),
}))

beforeEach(() => {
  fetchTopRated.mockResolvedValue({ results: mockMovies })
  fetchGenres.mockResolvedValue({ genres: mockGenres })
})
```

This pattern isolates the component under test from the network, making tests deterministic and fast.

### 2.4 Async Testing

Components that fetch data on mount (`Home`, `Details`) were tested with `waitFor` to handle the async state updates:

```js
await waitFor(() =>
  expect(screen.getByText('The Shawshank Redemption')).toBeInTheDocument()
)
```

---

## 3. Debugging

### 3.1 Tools Used

- **Chrome DevTools Console** — monitored for runtime errors, React warnings, and failed network requests during manual app testing.
- **React DevTools** — inspected component trees and confirmed state values were correct after user interactions.
- **Vitest error output** — provided precise stack traces for every failing test.

### 3.2 Bugs Found and Fixed

**Bug 1 — `useEffect` missing dependency in `Details.jsx`**

*Symptom:* If the user navigated directly from one movie detail page to another (e.g., via browser back/forward), the movie data did not reload.

*Root cause:* The `useEffect` that calls `loadMovie()` and `loadCast()` had an empty dependency array `[]`, meaning it only ran on first mount, not when the `id` route param changed.

```js
// Before (bug)
useEffect(() => {
  loadMovie();
  loadCast();
}, []);

// After (fixed)
useEffect(() => {
  loadMovie();
  loadCast();
}, [id]);
```

**Bug 2 — Broken image when `poster_path` is `null`**

*Symptom:* Some movies returned by the TMDB API have `poster_path: null`. The original code always appended this to the image URL, producing a broken `<img>` tag.

*Root cause:* No null check before constructing the image URL.

```js
// Before (bug)
src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}

// After (fixed — falls back to placeholder)
const posterSrc = movie.poster_path
  ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
  : PLACEHOLDER;
```

**Bug 3 — Vite 8 beta incompatibility with Vitest**

*Symptom:* All test files failed immediately with `__vite_ssr_exportName__ is not defined`.

*Root cause:* Vite 8.0.0-beta.13 introduced a new OXC transformer that is incompatible with Vitest 2.x's module transformation.

*Fix:* Downgraded Vite to the stable `^5.4.0` release. The app's dev server and build pipeline are unaffected.

---

## 4. Performance Optimisation

### 4.1 `React.memo` on `MovieCard`

```js
export default memo(MovieCard);
```

Every time the user types in the search box, `Home` re-renders. Without `memo`, all currently visible `MovieCard` components would re-render even though their `movie` prop hasn't changed. `memo` tells React to skip re-rendering a card unless its props change.

### 4.2 `useMemo` for Client-Side Genre Filtering

```js
const filteredMovies = useMemo(
  () =>
    selectedGenre
      ? movies.filter((m) => m.genre_ids.includes(Number(selectedGenre)))
      : movies,
  [movies, selectedGenre]
);
```

The filtered list only recomputes when `movies` or `selectedGenre` changes — not on every render caused by unrelated state (e.g., the page counter updating).

### 4.3 `useCallback` for Event Handlers

```js
const handleSearch = useCallback((text) => { ... }, []);
const handleGenreChange = useCallback((e) => { ... }, []);
const handlePrevPage = useCallback(() => setPage((p) => p - 1), []);
const handleNextPage = useCallback(() => setPage((p) => p + 1), []);
```

Stable function references prevent child components from re-rendering unnecessarily when `Home` re-renders for an unrelated reason.

### 4.4 `useCallback` inside `MovieCard`

```js
const handleClick = useCallback(() => {
  navigate(`/movie/${movie.id}`);
}, [navigate, movie.id]);
```

Prevents a new click-handler function being allocated on every render of the card.

### 4.5 Verification with React DevTools Profiler

Steps:
1. Opened the app in Chrome with the React DevTools extension installed.
2. Opened the **Profiler** tab and clicked **Record**.
3. Typed a character in the search box.
4. Stopped recording and inspected the flame graph.

**Result:** Only `Home` and `MovieCard` components whose props actually changed were highlighted. The remaining cards showed as "Did not render" — confirming that `memo` is working correctly.

---

## 5. Responsive Design & Accessibility

### 5.1 Responsive Breakpoints

Media queries were added to `Home.module.css`, `MovieCard.module.css`, `MovieDetails.module.css`, and `index.css`:

| Breakpoint | Target | Changes |
|---|---|---|
| `max-width: 768px` | Tablet | Search and dropdown expand to 90% width |
| `max-width: 480px` | Mobile | Full-width inputs, smaller cards (140px), pagination wraps |

The movie list already used `flex-wrap: wrap` so cards naturally reflow onto fewer columns on narrower screens.

### 5.2 Accessibility Improvements

| Feature | Implementation |
|---|---|
| Keyboard navigation on movie cards | Added `role="button"`, `tabIndex={0}`, and `onKeyDown` (Enter key triggers navigation) |
| Focus ring | `:focus-visible` outline added globally in `index.css` and on `.card:focus` in `MovieCard.module.css` |
| Search input label | Added `aria-label="Search movies"` to the `<input>` |
| Genre dropdown label | Added `aria-label="Filter by genre"` to the `<select>` |
| Broken image fallback | Cards with no poster now show a placeholder rather than a broken image icon |

---

## 6. Summary

| Requirement | Status |
|---|---|
| Unit tests for all components | ✅ 33 tests across 4 files, all passing |
| Unit tests for API fetch methods | ✅ Covered via mocked calls in Home and Details tests |
| Bugs identified and fixed | ✅ 3 bugs found and fixed (missing dep array, null poster, Vite beta) |
| Performance optimisation | ✅ `React.memo`, `useMemo`, `useCallback` applied throughout |
| Responsive design | ✅ Media queries at 768px and 480px breakpoints |
| Accessibility | ✅ ARIA labels, keyboard navigation, focus ring |
