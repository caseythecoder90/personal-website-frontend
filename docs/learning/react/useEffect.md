# useEffect

## What It Is

`useEffect` lets you run **side effects** — code that interacts with the world outside
your component. Fetching data, updating the document title, setting up event listeners,
scrolling the window — these are all side effects.

```tsx
useEffect(() => {
  // effect code runs AFTER render
  return () => {
    // cleanup code runs before next effect or unmount (optional)
  };
}, [dependencies]);
```

- **Effect function** — runs after React paints the screen
- **Cleanup function** — optional return value; cleans up the previous effect
- **Dependency array** — controls WHEN the effect re-runs

## Java Analogy

`useEffect` is like **lifecycle callbacks** in Java frameworks:

| useEffect pattern | Java equivalent |
|---|---|
| `useEffect(() => {...}, [])` | `@PostConstruct` — runs once after initialization |
| `useEffect(() => {...}, [dep])` | A `PropertyChangeListener` that fires when `dep` changes |
| `useEffect(() => { return () => {...} }, [])` | `@PreDestroy` — cleanup before removal |

```java
// Java: lifecycle hooks
@Component
class ProjectService {
    @PostConstruct           // ← like useEffect(..., [])
    void init() {
        loadProjects();
    }

    @PreDestroy              // ← like the cleanup function
    void cleanup() {
        closeConnections();
    }
}
```

```tsx
// React: useEffect
function ProjectsPage() {
  useEffect(() => {
    loadProjects();          // ← runs once on mount
    return () => {
      cancelRequests();      // ← runs on unmount
    };
  }, []);
}
```

## The Dependency Array Is Everything

The dependency array is the most important (and most confusing) part. It answers:
**"When should this effect re-run?"**

### Empty array `[]` — run once on mount
```tsx
useEffect(() => {
  fetchProjects();    // fetch data when component first appears
}, []);
```
This is the most common pattern for data fetching. The effect runs once, after the
first render, and never again.

### With dependencies `[a, b]` — run when values change
```tsx
useEffect(() => {
  document.title = title ? `${title} | Casey Quinn` : 'Casey Quinn | Portfolio';
}, [title]);
```
React compares each dependency to its value from the previous render. If any changed,
the effect runs again. Here, the title updates whenever the `title` argument changes.

### No array at all — run on EVERY render
```tsx
useEffect(() => {
  console.log('I run after every single render');
});
```
Almost never what you want. If you call `setState` inside this, you get an
**infinite loop**: render → effect → setState → render → effect → setState → ...

## Real Examples From This Project

### Data fetching on mount (HomePage)

```tsx
// src/pages/HomePage.tsx
useEffect(() => {
  projectApi
    .getFeatured()
    .then((data) => setProjects(data))
    .catch(() => setProjectsError('Failed to load projects.'))
    .finally(() => setProjectsLoading(false));
}, []);
```

**Walk through the timeline:**
1. Component renders with initial state: `projects=[]`, `loading=true`, `error=null`
2. React paints the loading spinner to the screen
3. `useEffect` fires, kicks off the API call
4. API responds → `setProjects(data)` and `setProjectsLoading(false)` are called
5. React re-renders with the data, replaces spinner with project cards

**Why `[]`?** We only want to fetch once when the page loads. If we put `projects` in
the dependency array, setting projects would trigger the effect again → infinite loop.

### Setting the page title (usePageTitle hook)

```tsx
// src/hooks/usePageTitle.ts
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} | Casey Quinn` : 'Casey Quinn | Portfolio';
  }, [title]);
}
```

**Why `[title]`?** The title should update whenever the `title` argument changes.
For most pages this only runs once (title is a static string like `'Projects'`).
For `ProjectDetailPage`, it could change if the slug changes.

`document.title` is a side effect — it modifies something outside React's world (the
browser tab). That's exactly what `useEffect` is for.

### Scroll to top on navigation (useScrollToTop hook)

```tsx
// src/hooks/useScrollToTop.ts
export function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}
```

**Why `[pathname]`?** We want to scroll to top every time the user navigates to a
different page. `pathname` changes on navigation (`/projects` → `/projects/my-app`),
which triggers the effect.

Without this hook, clicking a link at the bottom of a page would load the new page
scrolled to the bottom — bad UX.

### Fetching with a callback dependency (ProjectsPage)

```tsx
// src/pages/ProjectsPage.tsx
const fetchPage = useCallback((pageNum: number, append: boolean) => {
  // ...fetch logic...
}, []);

useEffect(() => {
  fetchPage(0, false);
}, [fetchPage]);
```

**Why `[fetchPage]`?** The linter requires you to list all values used inside the
effect. Since `fetchPage` is created with `useCallback` and an empty dependency
array, its reference is **stable** — it never changes, so this effect only runs once.
It's equivalent to `[]` but satisfies the exhaustive-deps lint rule.

## The Cleanup Function

The cleanup function runs in two scenarios:
1. **Before the effect re-runs** (when dependencies change)
2. **When the component unmounts** (removed from the page)

This project doesn't use cleanup yet, but here's when you'd need it:

```tsx
// Example: subscribing to window resize
useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);  // cleanup!
  };
}, []);
```

Without cleanup, every re-render would add another event listener — a **memory leak**.
Java analogy: this is like closing a stream in a `finally` block or implementing
`AutoCloseable`.

### Cleanup with API calls
A common real-world pattern — canceling a fetch if the component unmounts before
the response arrives:

```tsx
useEffect(() => {
  const controller = new AbortController();

  fetch('/api/projects', { signal: controller.signal })
    .then(res => res.json())
    .then(data => setProjects(data))
    .catch(err => {
      if (err.name !== 'AbortError') setError('Failed');
    });

  return () => controller.abort();  // cancel if we navigate away
}, []);
```

This project doesn't do this yet (the API client uses `.then()` chains without
abort), but it's a good interview topic — you can discuss it as a potential
improvement.

## Common Mistakes

### 1. Missing dependency → stale values
```tsx
// BUG — count is always 0 inside the effect
const [count, setCount] = useState(0);
useEffect(() => {
  const id = setInterval(() => {
    console.log(count);  // always 0! captured the initial value
  }, 1000);
  return () => clearInterval(id);
}, []);  // ← count is missing from deps

// FIX — add count to deps, or use functional updater
```

### 2. Object/array in dependency array → infinite loop
```tsx
// BUG — new object every render, effect runs every time
useEffect(() => {
  fetchData(filters);
}, [{ status: 'active' }]);  // ← new object reference each render

// FIX — use primitives or useMemo
useEffect(() => {
  fetchData(status);
}, [status]);  // ← string comparison, stable
```

### 3. Fetching without guarding state updates
```tsx
// BUG — if component unmounts before fetch completes, setState on
// an unmounted component (React warns about this)
useEffect(() => {
  fetchData().then(data => setData(data));  // might be unmounted!
}, []);

// FIX — use an abort controller (see cleanup section above)
```

## useEffect vs Event Handlers

A common interview question: **"When should you use useEffect vs an event handler?"**

| Use useEffect when... | Use an event handler when... |
|---|---|
| The code should run because something **appeared or changed** | The code should run because the user **did something** |
| Fetching data when a page loads | Fetching data when a button is clicked |
| Updating the document title | Submitting a form |
| Setting up a subscription | Toggling a menu |

In this project, initial data fetching uses `useEffect` (runs on mount), but the
"Load More" button uses an event handler (`onClick={() => fetchPage(page + 1, true)}`).
Same fetch function, different trigger.

## Interview Talking Points

1. **"useEffect synchronizes your component with an external system."** It's for side
   effects — anything outside React's rendering: DOM manipulation, API calls, timers.

2. **"The dependency array controls when the effect re-runs."** Empty = once on mount.
   With values = when those values change. Missing = every render (usually a bug).

3. **"Effects run after render, not during."** React paints the screen first, then
   runs effects. This keeps the UI responsive — the user sees content immediately
   while background work happens after.

4. **"Cleanup prevents memory leaks."** The returned function cleans up subscriptions,
   timers, or in-flight requests. Like `@PreDestroy` or `AutoCloseable` in Java.

5. **"Not everything needs useEffect."** Derived values (filtering, mapping) should
   be computed during render, not in an effect. Effects are for synchronizing with
   things outside React.
