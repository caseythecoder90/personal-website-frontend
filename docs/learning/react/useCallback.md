# useCallback

## What It Is

`useCallback` returns a **memoized version** of a function — meaning React gives you
back the same function reference across re-renders, instead of creating a new one
every time.

```tsx
const memoizedFn = useCallback((args) => {
  // function body
}, [dependencies]);
```

- **Function** — the function you want to stabilize
- **Dependency array** — when these values change, React creates a new function
- **Return value** — a stable reference to that function

## Why Functions Need Stabilizing

In JavaScript, every time your component renders, all functions defined inside it
are **recreated** — they look the same but are different objects in memory:

```tsx
function MyComponent() {
  // This is a BRAND NEW function object on every render
  const handleClick = () => console.log('clicked');

  // Even though the code is identical, this is !== from the last render's version
}
```

Most of the time, this doesn't matter. But it matters in two cases:

1. **When the function is a useEffect dependency** — a new reference triggers the effect
2. **When the function is passed as a prop to a memoized child** — a new reference
   causes the child to re-render unnecessarily

## Java Analogy

Think of it like **caching a lambda or method reference** instead of creating a new
anonymous class instance on each call:

```java
// Java: new anonymous instance every time — different object each call
Runnable getHandler() {
    return () -> System.out.println("click");  // new object each call
}

// Java: cached — same instance returned each time
private final Runnable handler = () -> System.out.println("click");
Runnable getHandler() {
    return handler;  // same reference every time
}
```

`useCallback` is React's version of that caching. It says: "Don't recreate this
function unless one of its dependencies changed."

## The One Real Example in This Project

### Stabilized fetch function (ProjectsPage)

```tsx
// src/pages/ProjectsPage.tsx

const fetchPage = useCallback((pageNum: number, append: boolean) => {
  if (append) {
    setLoadingMore(true);
  } else {
    setLoading(true);
  }
  setError(null);

  projectApi
    .getPaginated({ page: pageNum, size: PAGE_SIZE, sort: 'displayOrder,asc', published: true })
    .then((data) => {
      setProjects((prev) => (append ? [...prev, ...data.content] : data.content));
      setHasMore(data.page.number < data.page.totalPages - 1);
      setPage(pageNum);
    })
    .catch(() => setError('Failed to load projects.'))
    .finally(() => {
      setLoading(false);
      setLoadingMore(false);
    });
}, []);

useEffect(() => {
  fetchPage(0, false);
}, [fetchPage]);
```

**What's happening step by step:**

1. `fetchPage` is wrapped in `useCallback` with `[]` (no dependencies)
2. This means `fetchPage` is created **once** and the same reference is reused
3. `useEffect` lists `[fetchPage]` as its dependency
4. Since `fetchPage` never changes (stable reference), the effect only runs once
5. The same `fetchPage` function is also used in the "Load More" button's onClick

**Why `[]` works here:** The function only uses `setProjects`, `setLoading`, etc. —
React guarantees that state setter functions (`setState`) have **stable references**.
They never change, so they don't need to be in the dependency array.

**Why not just use `useEffect` with `[]` directly?**

```tsx
// This would also work:
useEffect(() => {
  projectApi.getPaginated(...)
    .then(...)
    .catch(...)
    .finally(...);
}, []);
```

The reason for extracting into `useCallback` is **reuse** — `fetchPage` is called in
two places:
1. The `useEffect` for initial load: `fetchPage(0, false)`
2. The "Load More" button: `onClick={() => fetchPage(page + 1, true)}`
3. The error retry: `onRetry={() => fetchPage(0, false)}`

Without `useCallback`, you'd either duplicate the fetch logic or define it outside
the effect and have the linter complain about missing dependencies.

## When You DON'T Need useCallback

Most of the time. The project's other functions don't use it, and that's correct:

```tsx
// HomePage — retry handler defined inline, no useCallback needed
const retryTechnologies = () => {
  setTechError(null);
  setTechLoading(true);
  technologyApi.getFeatured()
    .then((data) => setTechnologies(data))
    .catch(() => setTechError('Failed to load technologies.'))
    .finally(() => setTechLoading(false));
};
```

This function is recreated on every render. That's fine because:
- It's not in any dependency array
- It's not passed to a memoized child component
- The cost of creating a function is negligible

**Rule of thumb:** Don't add `useCallback` unless you have a specific reason (it's a
dependency of `useEffect`, or it's a prop to a `React.memo` child). Premature
memoization adds complexity with no benefit.

## useCallback vs useMemo

They're closely related:

```tsx
// useCallback — memoizes a FUNCTION
const fn = useCallback(() => doSomething(a, b), [a, b]);

// useMemo — memoizes a VALUE (the result of calling a function)
const value = useMemo(() => expensiveCalculation(a, b), [a, b]);
```

In fact, `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`.

- Use `useCallback` when you need a **stable function reference**
- Use `useMemo` when you need to **cache an expensive computation**

This project doesn't use `useMemo` yet. The filtered projects list in
`TechnologyShowcase` and `ProjectsPage` is computed directly during render, which is
fine — filtering a small array is cheap. You'd reach for `useMemo` if filtering
thousands of items caused visible lag.

## The Dependency Array

Same rules as `useEffect`:

```tsx
// Empty [] — function is created once, never recreated
const fetchPage = useCallback((pageNum) => {
  // can safely use setState functions (they're stable)
  setProjects(data);
}, []);

// With deps — function is recreated when deps change
const search = useCallback((query) => {
  api.search(query, activeFilter);  // uses activeFilter from state
}, [activeFilter]);  // recreate when filter changes
```

If you use a value from outside the function (props, state) inside the callback,
it must be in the dependency array. Otherwise you get **stale closures** — the
function captures an old value and never sees updates.

## Common Mistakes

### 1. Using useCallback everywhere "for performance"
```tsx
// UNNECESSARY — no benefit, adds complexity
const handleClick = useCallback(() => {
  setOpen(!open);
}, [open]);

// JUST DO THIS
const handleClick = () => setOpen(!open);
```
`useCallback` itself has a cost (comparing dependencies). Only use it when you
have a real need.

### 2. Missing dependencies → stale closure
```tsx
// BUG — always uses the initial value of `page`
const loadMore = useCallback(() => {
  fetchPage(page + 1);    // page is always 0!
}, []);                    // ← page missing from deps

// FIX
const loadMore = useCallback(() => {
  fetchPage(page + 1);
}, [page]);                // ← recreates when page changes
```

Note: in `ProjectsPage`, this is avoided by passing `page` as an **argument** to
`fetchPage` rather than closing over it. That's a smart pattern — it keeps the
dependency array empty.

### 3. Confusing useCallback with useMemo
```tsx
// WRONG — this memoizes the function, not its result
const filtered = useCallback(() => {
  return items.filter(i => i.active);
}, [items]);
// filtered is a FUNCTION, not the filtered array!

// RIGHT — useMemo memoizes the result
const filtered = useMemo(() => {
  return items.filter(i => i.active);
}, [items]);
// filtered is the filtered array
```

## Interview Talking Points

1. **"useCallback memoizes a function reference across renders."** Without it,
   functions are recreated on every render. Usually that's fine, but it matters
   when the function is a dependency of useEffect or a prop to a memoized component.

2. **"I use it primarily to stabilize useEffect dependencies."** The main use case
   in this project — wrapping `fetchPage` so the effect that depends on it doesn't
   re-run unnecessarily.

3. **"I don't use it by default — only when there's a concrete need."** Premature
   memoization is a code smell. The cost of creating functions is nearly zero;
   the cost of unnecessary complexity is real.

4. **"The dependency array works the same as useEffect."** List the external values
   the function closes over. React recreates the function when those values change.
   State setters are stable and don't need to be listed.

5. **"A good alternative is passing values as arguments instead of closing over
   them."** In `ProjectsPage`, `fetchPage(pageNum)` takes the page number as a
   parameter rather than reading `page` from state. This keeps dependencies empty
   and avoids stale closures.
