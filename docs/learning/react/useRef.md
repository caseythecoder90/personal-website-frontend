# useRef

## What It Is

`useRef` creates a **mutable container** that persists across re-renders — just like
`useState` — but with one critical difference: **changing it does NOT trigger a re-render**.

```tsx
const myRef = useRef(initialValue);

myRef.current;           // read the value
myRef.current = newValue; // update it (no re-render!)
```

- **`myRef`** — a `{ current: T }` object that React keeps alive across renders
- **`myRef.current`** — the actual value; read and write it directly
- **No setter function** — you mutate `.current` directly (unlike `useState`)
- **No re-render** — changing `.current` is invisible to React

## Java Analogy

`useRef` is like a **private instance field** that you mutate directly — it holds
state, but changing it doesn't trigger any UI update:

```java
// Java: private field, mutated directly, no UI side effects
class ProjectDetailController {
    private boolean viewCounted = false;  // ← mutable, no UI binding

    public void onPageLoad(String slug) {
        Project project = projectService.findBySlug(slug);
        if (!viewCounted) {
            viewCounted = true;
            analyticsService.incrementViews(project.getId());
        }
    }
}
```

```tsx
// React: useRef, mutated directly, no re-render
function ProjectDetailPage() {
  const viewCounted = useRef(false);      // ← mutable, no re-render

  useEffect(() => {
    projectApi.getBySlug(slug).then((data) => {
      if (!viewCounted.current) {
        viewCounted.current = true;
        projectApi.incrementViews(data.id);
      }
    });
  }, [slug]);
}
```

Compare this to `useState`, which is like a field with a **setter that notifies
observers** (triggers re-render). `useRef` is the simpler version — just a field.

## useState vs useRef: When to Use Each

This is the key decision to understand:

| | useState | useRef |
|---|---|---|
| Persists across renders? | Yes | Yes |
| Triggers re-render on change? | Yes | **No** |
| How you update | `setValue(new)` | `ref.current = new` |
| Use when... | Value affects what the user **sees** | Value is internal bookkeeping |

**Rule of thumb:** If changing the value should update the screen, use `useState`.
If it's behind-the-scenes tracking that the user never sees, use `useRef`.

## Real Example From This Project

### Preventing duplicate view counts (ProjectDetailPage)

```tsx
// src/pages/ProjectDetailPage.tsx
export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<ProjectResponse | null>(null);
  const viewCounted = useRef(false);   // ← useRef, not useState

  useEffect(() => {
    if (!slug) return;

    projectApi
      .getBySlug(slug)
      .then((data: ProjectResponse) => {
        setProject(data);
        if (!viewCounted.current) {         // first time only
          viewCounted.current = true;       // mark as counted
          projectApi.incrementViews(data.id).catch(() => {});
        }
      })
      .catch((err) => { /* handle error */ })
      .finally(() => setLoading(false));
  }, [slug]);
}
```

**Why `useRef` and not `useState` here?**

The `viewCounted` flag is pure bookkeeping — the user never sees it, and no part of
the UI depends on it. If we used `useState`:

```tsx
// Using useState would work BUT:
const [viewCounted, setViewCounted] = useState(false);

// Problem: calling setViewCounted(true) triggers an UNNECESSARY re-render.
// The entire component re-runs just to update a flag the user never sees.
```

With `useRef`, setting `viewCounted.current = true` updates the value silently —
no wasted re-render. For a simple boolean flag this optimization is minor, but it's
the correct pattern and shows you understand when re-renders are needed.

**Why not just use a regular variable?**

```tsx
// WRONG — resets to false on every render
let viewCounted = false;

useEffect(() => {
  // viewCounted is ALWAYS false here because the variable
  // is recreated every time the component function runs
}, [slug]);
```

Regular variables don't survive re-renders. Your component function runs from top to
bottom on every render, so `let viewCounted = false` resets it each time. Only
`useState` and `useRef` persist values across renders.

## The Two Use Cases for useRef

### Use Case 1: Mutable values that don't affect rendering

This is what `ProjectDetailPage` does — tracking whether a view was already counted.
Other examples:

```tsx
// Tracking a timer ID so you can cancel it later
const timerId = useRef<number | null>(null);

useEffect(() => {
  timerId.current = window.setTimeout(() => {
    // do something after delay
  }, 3000);

  return () => {
    if (timerId.current) clearTimeout(timerId.current);
  };
}, []);
```

```tsx
// Storing the previous value of a prop for comparison
const prevSlug = useRef(slug);

useEffect(() => {
  if (prevSlug.current !== slug) {
    // slug changed! do something
    prevSlug.current = slug;
  }
}, [slug]);
```

### Use Case 2: Referencing DOM elements

The other major use case — getting a direct handle to a DOM element. This project
doesn't use this pattern yet, but you'll encounter it frequently:

```tsx
function SearchBar() {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when the component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Or focus it on a button click
  const handleSearchClick = () => {
    inputRef.current?.focus();
  };

  return (
    <input ref={inputRef} type="text" placeholder="Search..." />
  );
}
```

**How the DOM ref works:**
1. Create the ref: `useRef<HTMLInputElement>(null)`
2. Attach it to a JSX element: `<input ref={inputRef} />`
3. After render, `inputRef.current` is the actual DOM `<input>` element
4. Call DOM methods on it: `.focus()`, `.scrollIntoView()`, `.getBoundingClientRect()`

Java analogy: this is like `document.getElementById()` but scoped to your component
and managed by React. Or think of it like getting a reference to a specific UI widget
in a Java Swing/JavaFX application so you can call methods on it directly.

## TypeScript Typing

```tsx
// For mutable values — pass the initial value
const viewCounted = useRef(false);        // type: MutableRefObject<boolean>
const timerId = useRef<number | null>(null); // type: MutableRefObject<number | null>

// For DOM elements — pass null and use the element type
const inputRef = useRef<HTMLInputElement>(null);  // type: RefObject<HTMLInputElement>
const divRef = useRef<HTMLDivElement>(null);       // type: RefObject<HTMLDivElement>
```

Common HTML element types: `HTMLInputElement`, `HTMLDivElement`, `HTMLButtonElement`,
`HTMLFormElement`, `HTMLCanvasElement`, `HTMLVideoElement`.

## Common Mistakes

### 1. Using useRef when useState is needed
```tsx
// BUG — the UI won't update when count changes
const count = useRef(0);
count.current += 1;  // value changes but screen still shows old count

// FIX — if the value is displayed, use useState
const [count, setCount] = useState(0);
setCount(c => c + 1);  // triggers re-render, screen updates
```

**The test:** ask yourself "does the user need to see this value?" If yes → `useState`.
If no → `useRef` is fine.

### 2. Reading ref.current during render
```tsx
// UNRELIABLE — ref.current might not be set yet during render
function MyComponent() {
  const divRef = useRef<HTMLDivElement>(null);

  // WRONG — divRef.current is null during the first render
  const width = divRef.current?.offsetWidth;  // always 0 or undefined

  // RIGHT — read it in an effect (runs after render, when DOM exists)
  useEffect(() => {
    const width = divRef.current?.offsetWidth;  // actual value
  }, []);

  return <div ref={divRef}>Content</div>;
}
```

DOM refs are `null` until React renders the element and attaches the ref. Always read
them inside `useEffect` or event handlers, never during render.

### 3. Using a regular variable instead of useRef
```tsx
// BUG — resets every render
let hasLogged = false;

useEffect(() => {
  if (!hasLogged) {
    console.log('First render');
    hasLogged = true;  // this gets thrown away on next render
  }
});

// FIX — useRef persists across renders
const hasLogged = useRef(false);
```

### 4. Putting ref.current in a dependency array
```tsx
// WRONG — ref.current is mutable, React can't track it
useEffect(() => {
  console.log(myRef.current);
}, [myRef.current]);  // ← ESLint will warn about this

// Refs don't trigger re-renders, so React never "sees" the change
// and won't re-run the effect when ref.current changes
```

## Interview Talking Points

1. **"useRef is for values that persist across renders but don't affect the UI."**
   It's like useState without the re-render. I use it for internal tracking like
   whether a view has been counted.

2. **"The classic two use cases are mutable values and DOM references."** Mutable
   values for bookkeeping (timers, flags, previous values). DOM refs for imperative
   operations (focusing inputs, scrolling, measuring elements).

3. **"I choose useRef over useState when the value is invisible to the user."**
   In ProjectDetailPage, `viewCounted` is a ref because no UI element displays it.
   If I used useState, I'd waste a re-render for nothing.

4. **"Regular variables reset on every render — that's why useRef exists."** Your
   component function runs from scratch on each render. Only useState and useRef
   preserve values between renders.

5. **"ref.current is mutable and doesn't participate in React's rendering cycle."**
   This means you shouldn't use it in the dependency array of useEffect, and you
   shouldn't read DOM refs during render — they're only populated after render.
