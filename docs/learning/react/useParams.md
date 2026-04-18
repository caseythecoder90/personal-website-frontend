# useParams

## What It Is

`useParams` is a React Router hook that reads **URL parameters** from the current route.
When you define a route with a `:param` placeholder, `useParams` gives you the actual
value from the URL.

```tsx
const { slug } = useParams<{ slug: string }>();
```

- **Returns** an object with key-value pairs of URL parameters
- **Keys** match the `:param` names defined in your route
- **Values** are always strings (or `undefined` if the param is optional)

## Java Analogy

This is directly equivalent to Spring's `@PathVariable`:

```java
// Java Spring: @PathVariable extracts from the URL
@GetMapping("/projects/{slug}")
public ResponseEntity<Project> getBySlug(@PathVariable String slug) {
    // URL: /projects/my-cool-app → slug = "my-cool-app"
    return projectService.findBySlug(slug);
}
```

```tsx
// React Router: useParams extracts from the URL
// Route definition: <Route path="/projects/:slug" element={<ProjectDetailPage />} />

function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  // URL: /projects/my-cool-app → slug = "my-cool-app"
}
```

The two-step process is the same:
1. **Define** the parameter in the route pattern (`:slug` in React, `{slug}` in Spring)
2. **Extract** the value in the handler (`useParams()` in React, `@PathVariable` in Spring)

## How It Works With React Router

The route definition and `useParams` are a pair — the route defines the parameters,
and the component reads them:

```tsx
// Step 1: Define routes with :param placeholders (App.tsx)
<Route path="/projects/:slug" element={<ProjectDetailPage />} />
<Route path="/blog/:slug" element={<BlogPostPage />} />

// Step 2: Read the param in the component
function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  // slug is now whatever follows /projects/ in the URL
}
```

When a user navigates to `/projects/portfolio-website`, React Router:
1. Matches the URL against `/projects/:slug`
2. Extracts `slug = "portfolio-website"`
3. Renders `ProjectDetailPage`
4. Makes `{ slug: "portfolio-website" }` available via `useParams()`

## Real Examples From This Project

### Project detail page (ProjectDetailPage)

```tsx
// src/pages/ProjectDetailPage.tsx
export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!slug) return;          // guard against undefined

    setLoading(true);
    projectApi
      .getBySlug(slug)          // pass slug to the API call
      .then((data) => setProject(data))
      .catch((err) => { /* handle error */ })
      .finally(() => setLoading(false));
  }, [slug]);                   // re-fetch if slug changes
}
```

**Walk through what happens:**
1. User clicks a project card linking to `/projects/portfolio-website`
2. React Router matches the route and renders `ProjectDetailPage`
3. `useParams()` returns `{ slug: "portfolio-website" }`
4. The `useEffect` fires because `slug` is in its dependency array
5. `projectApi.getBySlug("portfolio-website")` calls `GET /api/v1/projects/slug/portfolio-website`
6. The project data comes back and renders on screen

**Why `slug` is in the `useEffect` dependency array:** If the user navigates from
`/projects/app-one` to `/projects/app-two` without leaving the page (e.g., via a
"related projects" link), the component doesn't unmount — it just gets a new `slug`.
Putting `slug` in the dependency array ensures the effect re-runs and fetches the new
project.

### Blog post page (BlogPostPage)

```tsx
// src/pages/BlogPostPage.tsx
export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  usePageTitle(slug ?? 'Blog Post');

  // slug is used to fetch and display the blog post (coming in Issue #8)
}
```

Same pattern — reads the slug from the URL to identify which blog post to load.

### The route definitions that make this work (App.tsx)

```tsx
// src/App.tsx
<Route path="/projects/:slug" element={<ProjectDetailPage />} />
<Route path="/blog/:slug" element={<BlogPostPage />} />
```

Both use `:slug` as the parameter name. This is a convention — you could name it
`:id` or `:postSlug` or anything else. Whatever name you put after the colon is the
key you destructure from `useParams()`.

## TypeScript Generic: `useParams<{ slug: string }>()`

The generic parameter tells TypeScript what shape to expect:

```tsx
// Without generic — slug is `string | undefined`, TypeScript doesn't know what params exist
const params = useParams();
params.slug;        // type: string | undefined
params.anything;    // type: string | undefined — no type safety

// With generic — TypeScript knows exactly what params to expect
const { slug } = useParams<{ slug: string }>();
slug;               // type: string | undefined (still possibly undefined)
```

It's still `string | undefined` because TypeScript can't guarantee the route matched
correctly at compile time. That's why you see the `if (!slug) return` guard in
`ProjectDetailPage` — handle the case where it could be missing.

## Multiple Parameters

You can have multiple parameters in a route (this project doesn't, but it's good to know):

```tsx
// Route: /users/:userId/posts/:postId
<Route path="/users/:userId/posts/:postId" element={<UserPost />} />

function UserPost() {
  const { userId, postId } = useParams<{ userId: string; postId: string }>();
  // URL: /users/42/posts/7 → userId = "42", postId = "7"
}
```

Java equivalent:
```java
@GetMapping("/users/{userId}/posts/{postId}")
public Post getPost(@PathVariable Long userId, @PathVariable Long postId) { ... }
```

Note: URL params are always strings in React Router. If you need a number, you have
to convert it: `Number(userId)`. In Spring, the `Long` type annotation handles the
conversion automatically.

## Common Mistakes

### 1. Forgetting the param name must match the route
```tsx
// Route defines :slug
<Route path="/projects/:slug" element={<ProjectDetailPage />} />

// WRONG — typo, this will always be undefined
const { id } = useParams<{ id: string }>();

// RIGHT — matches the route parameter name
const { slug } = useParams<{ slug: string }>();
```

### 2. Not guarding against undefined
```tsx
// BUG — slug could be undefined if the route doesn't match properly
const { slug } = useParams<{ slug: string }>();
projectApi.getBySlug(slug);  // TypeScript error: might be undefined

// FIX — guard it
if (!slug) return;
projectApi.getBySlug(slug);  // safe
```

### 3. Forgetting to put the param in the useEffect dependency array
```tsx
// BUG — navigating from /projects/app-one to /projects/app-two
// won't re-fetch because slug isn't in the dependency array
useEffect(() => {
  projectApi.getBySlug(slug);
}, []);  // ← slug is missing!

// FIX — include slug so the effect re-runs when the URL changes
useEffect(() => {
  projectApi.getBySlug(slug);
}, [slug]);
```

### 4. Assuming params are numbers
```tsx
// WRONG — params are always strings
const { id } = useParams<{ id: number }>();  // misleading type!

// RIGHT — parse it yourself
const { id } = useParams<{ id: string }>();
const numericId = Number(id);
```

## Interview Talking Points

1. **"useParams reads URL parameters defined in the route."** It's the React equivalent
   of Spring's `@PathVariable`. The route defines `:slug`, the component reads it.

2. **"I use slug-based routing for SEO-friendly URLs."** Instead of `/projects/42`,
   we use `/projects/portfolio-website`. The slug is human-readable and search-engine
   friendly.

3. **"The param goes in the useEffect dependency array."** If the slug changes (same
   component, different URL), the effect re-runs and fetches the new data. Without
   this, navigating between detail pages would show stale data.

4. **"Params are always strings."** Unlike Spring's `@PathVariable` which can auto-convert
   to `Long` or other types, React Router params are raw strings. You parse them yourself.

5. **"I guard against undefined before using the param."** TypeScript correctly types
   it as `string | undefined` — you need a null check before passing it to an API call.
