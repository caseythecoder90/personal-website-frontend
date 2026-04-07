# useState

## What It Is

`useState` is React's way of giving a component **memory**. Without it, every time React
re-renders your component (which happens often), all local variables reset to their
initial values. `useState` preserves values across renders.

```tsx
const [value, setValue] = useState(initialValue);
```

- `value` — the current state
- `setValue` — a function to update it (triggers a re-render)
- `initialValue` — what it starts as (only used on first render)

## Java Analogy

Think of a React component like a method that gets called over and over. Normally,
local variables inside a method don't survive between calls. `useState` is like
promoting a local variable to an **instance field** — it persists across invocations.

```java
// Java: instance field persists across method calls
class ProjectList {
    private List<Project> projects = new ArrayList<>();  // ← persists
    private boolean loading = true;                       // ← persists

    public void render() {
        // uses this.projects, this.loading
    }
}
```

```tsx
// React: useState persists across re-renders
function ProjectList() {
  const [projects, setProjects] = useState([]);    // ← persists
  const [loading, setLoading] = useState(true);     // ← persists

  return (/* uses projects, loading */);
}
```

The key difference: in Java you mutate the field directly (`this.loading = false`).
In React you **must** use the setter (`setLoading(false)`) because that's what tells
React "something changed, re-render this component."

## How It Works Under the Hood

1. You call `setLoading(false)`
2. React schedules a re-render of your component
3. Your entire function runs again from top to bottom
4. This time, `useState(true)` returns `false` (the updated value, not the initial)
5. React compares the new JSX output with the old one and updates only what changed in the DOM

This is why you can't just do `loading = false` — React wouldn't know anything changed.

## Real Examples From This Project

### Simple toggle state (Navbar)
The simplest use case — a boolean that flips between true/false:

```tsx
// src/components/layout/Navbar.tsx
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

// Toggle it:
<button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
  Menu
</button>

// Use it for conditional rendering:
{mobileMenuOpen && <nav>...mobile links...</nav>}
```

### Tab selection state (TechnologyShowcase)
Storing which tab index is active:

```tsx
// src/components/ui/TechnologyShowcase.tsx
const [activeTab, setActiveTab] = useState(0);   // 0 = Backend tab

// Tab button sets the index:
<button onClick={() => setActiveTab(index)}>
  {group.label}
</button>

// Derived data — filter based on active tab (no extra state needed):
const filteredTechs = technologies.filter((tech) =>
  activeGroup.categories.includes(tech.category)
);
```

**Key insight:** `filteredTechs` is **derived state** — it's computed from `activeTab`
and `technologies` on every render. You don't need a separate `useState` for it.
This is like computing a value from fields in Java rather than storing a redundant copy.

### Data fetching trifecta (HomePage)
The most common pattern — three related state variables for async data:

```tsx
// src/pages/HomePage.tsx
const [projects, setProjects] = useState<ProjectResponse[]>([]);
const [projectsLoading, setProjectsLoading] = useState(true);
const [projectsError, setProjectsError] = useState<string | null>(null);
```

These three always travel together because any async operation has three possible
states: **loading**, **success** (has data), or **failure** (has error).

Java analogy: this is like the three states of a `CompletableFuture<T>`:
- Pending → `loading = true`
- Completed → `loading = false`, data populated
- Failed → `loading = false`, error populated

### Pagination state (ProjectsPage)
Multiple related state variables working together:

```tsx
// src/pages/ProjectsPage.tsx
const [projects, setProjects] = useState<ProjectResponse[]>([]);
const [loading, setLoading] = useState(true);
const [loadingMore, setLoadingMore] = useState(false);   // separate from initial load
const [error, setError] = useState<string | null>(null);
const [hasMore, setHasMore] = useState(false);
const [page, setPage] = useState(0);
const [activeCategory, setActiveCategory] = useState<TechnologyCategory | null>(null);
```

Notice `loading` vs `loadingMore` — two separate booleans because the UI treats
initial load (show spinner) differently from loading the next page (show "Loading..."
on button). This is a real-world nuance you'd discuss in an interview.

## Updating State Based on Previous State

When your new value depends on the old value, use the **functional updater** form:

```tsx
// From ProjectsPage — appending new projects to existing ones:
setProjects((prev) => [...prev, ...data.content]);
```

Why not `setProjects([...projects, ...data.content])`? Because `projects` might be
stale — if multiple updates are batched, `projects` still holds the value from the
start of the render. The functional form `(prev) => ...` always gets the latest value.

Java analogy: this is like `AtomicReference.updateAndGet(prev -> ...)` — you operate
on the guaranteed-current value, not a potentially stale reference.

## Common Mistakes

### 1. Mutating state directly
```tsx
// WRONG — React won't know anything changed
projects.push(newProject);
setProjects(projects);  // same reference, React skips re-render

// RIGHT — create a new array
setProjects([...projects, newProject]);
```
React uses **reference equality** to detect changes. You need a new object/array.
Java analogy: like how `HashMap` needs a new key object if you change equality — same
concept of identity vs. equality.

### 2. Too many useState calls for related data
If you have 5+ related state variables (like the data fetching trifecta + pagination),
consider whether `useReducer` might be cleaner. But for this project's scale,
individual `useState` calls are fine and more readable.

### 3. Storing derived state
```tsx
// WRONG — redundant state that can get out of sync
const [filteredProjects, setFilteredProjects] = useState([]);

// RIGHT — compute it on every render (it's cheap)
const filteredProjects = projects.filter(...);
```

## Interview Talking Points

1. **"useState gives components memory across re-renders."** Your component function
   runs on every render. Without useState, variables reset each time.

2. **"The setter triggers a re-render."** This is the core mechanism — calling
   `setState` tells React the UI might have changed.

3. **"State updates are asynchronous and batched."** React doesn't update immediately.
   It batches multiple `setState` calls and re-renders once. This is why you use the
   functional updater `setState(prev => ...)` when the new value depends on the old.

4. **"I prefer derived state over redundant state."** Instead of syncing two pieces
   of state, compute one from the other. Fewer bugs, simpler code.

5. **"For async data, I use the loading/error/data trifecta pattern."** Three state
   variables that model the three states of an async operation. This is the standard
   pattern before adopting libraries like React Query.
