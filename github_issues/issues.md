# GitHub Issues for personal-website-frontend

Copy each issue below into GitHub. Create them in order — the numbering reflects dependency priority.
Use the suggested labels and create them in your repo first: `setup`, `feature`, `enhancement`, `testing`, `documentation`, `design-system`.

---

## Issue #1: Project scaffolding and Tailwind design system configuration

**Labels:** `setup`, `design-system`

**Description:**
Set up the foundational project structure, Tailwind CSS configuration matching the Stitch design system, and core project architecture.

**Tasks:**
- [ ] Configure Tailwind with custom color tokens from DESIGN.md (surface hierarchy, primary/secondary/tertiary accents)
- [ ] Set up Google Fonts (Space Grotesk + Inter)
- [ ] Create folder structure: `api/`, `components/`, `hooks/`, `pages/`, `types/`, `utils/`, `config/`
- [ ] Configure path aliases in `tsconfig.json` for clean imports (`@/components`, `@/api`, etc.)
- [ ] Set up environment variables (`.env` with `VITE_API_BASE_URL`)
- [ ] Add `.env.example` for documentation
- [ ] Create base layout component with glass nav bar and footer

**Branch:** `feature/project-setup`

**Acceptance Criteria:**
- Dev server runs on port 3000
- Tailwind classes match Stitch design tokens
- Folder structure follows layered architecture pattern
- Environment config supports local and production API URLs

---

## Issue #2: TypeScript types and API client layer

**Labels:** `setup`, `feature`

**Description:**
Create TypeScript interfaces mirroring all backend DTOs and build a typed Axios API client that handles the `Response<T>` wrapper pattern.

**Tasks:**
- [ ] Create TypeScript interfaces for all response DTOs:
  - `ProjectResponse`, `ProjectImageResponse`, `ProjectLinkResponse`
  - `TechnologyResponse`
  - `BlogPostResponse`, `BlogCategoryResponse`, `BlogTagResponse`
  - `CertificationResponse`
  - `ContactSubmissionRequest`
  - `ResumeResponse`
  - `AuthResponse`, `LoginRequest`
  - `ApiResponse<T>` wrapper matching backend `Response<T>`
- [ ] Create enums matching backend: `ProjectType`, `ProjectStatus`, `DifficultyLevel`, `TechnologyCategory`, `ProficiencyLevel`, `CertificationStatus`, `InquiryType`, `ImageType`
- [ ] Build Axios API client with:
  - Base URL from environment variable
  - Response interceptor to unwrap `Response<T>` envelope
  - Error interceptor with typed error handling
  - JWT token injection via request interceptor
- [ ] Create service modules: `projectApi`, `technologyApi`, `blogApi`, `certificationApi`, `contactApi`, `resumeApi`, `authApi`

**Branch:** `feature/api-client`

**Acceptance Criteria:**
- All types match backend DTOs exactly
- API client successfully calls backend GET endpoints
- Console shows data from `/api/v1/projects` when tested
- TypeScript compiler catches type mismatches at build time

---

## Issue #3: Reusable UI components (design system)

**Labels:** `feature`, `design-system`

**Description:**
Build the shared component library matching the Stitch design system. These components are used across all pages.

**Tasks:**
- [ ] `Navbar` — glass effect sticky nav with active link indicator, mobile hamburger menu
- [ ] `Footer` — social links (GitHub, LinkedIn), copyright
- [ ] `PageLayout` — wraps pages with Navbar + Footer + content area
- [ ] `Button` — primary (gradient), secondary (outline), tertiary variants
- [ ] `TechPill` — technology badge with category-based styling
- [ ] `StatusBadge` — colored badge for project status (COMPLETED/IN_PROGRESS/MAINTAINED)
- [ ] `DifficultyBadge` — difficulty level indicator
- [ ] `ProjectCard` — image, title, description, status/difficulty badges, tech pills, link
- [ ] `BlogPostCard` — featured image, title, date, excerpt, category, tags
- [ ] `CertificationCard` — name, organization, status badge, date, technology pills
- [ ] `SectionHeader` — consistent section title + subtitle pattern
- [ ] `SkillBar` — technology proficiency progress bar with percentage
- [ ] `LoadingSpinner` — loading state indicator
- [ ] `ErrorDisplay` — error state component

**Branch:** `feature/ui-components`

**Acceptance Criteria:**
- Components match Stitch mockup visual style
- All components are typed with TypeScript props
- Components are responsive (mobile-friendly)
- Hover effects and transitions match design spec

---

## Issue #4: React Router setup and page routing

**Labels:** `feature`

**Description:**
Configure React Router with all public routes and create page skeleton components.

**Tasks:**
- [ ] Install and configure React Router v6 with `BrowserRouter`
- [ ] Define routes:
  - `/` — HomePage
  - `/projects` — ProjectsPage
  - `/projects/:slug` — ProjectDetailPage
  - `/blog` — BlogPage
  - `/blog/:slug` — BlogPostPage
  - `/certifications` — CertificationsPage
  - `/contact` — ContactPage
  - `*` — NotFoundPage (404)
- [ ] Create skeleton page components for each route
- [ ] Add active link highlighting in Navbar based on current route
- [ ] Implement scroll-to-top on route change
- [ ] Add page title updates using `document.title` or a custom hook

**Branch:** `feature/routing`

**Acceptance Criteria:**
- All routes navigate correctly
- Navbar highlights active page
- 404 page displays for unknown routes
- Browser back/forward navigation works

---

## Issue #5: Homepage — hero, featured projects, technology showcase

**Labels:** `feature`

**Description:**
Build the homepage consuming live data from the backend API.

**Tasks:**
- [ ] Hero section with name, title, tagline, CTA buttons, profile image placeholder
- [ ] Featured Projects section calling `GET /api/v1/projects/featured`
- [ ] Technology Showcase section calling `GET /api/v1/technologies/featured`
- [ ] CTA section with "Get In Touch" link to contact page
- [ ] Loading states while data fetches
- [ ] Error handling if API is unreachable
- [ ] Responsive layout matching Stitch mockup

**Branch:** `feature/homepage`

**Acceptance Criteria:**
- Page renders with real data from backend API
- Featured projects display with images, descriptions, and tech pills
- Technology bars show proficiency levels from API data
- Page is responsive on mobile

---

## Issue #6: Projects listing page with technology filtering

**Labels:** `feature`

**Description:**
Build the projects listing page with category-based filtering.

**Tasks:**
- [ ] Page header with title and description
- [ ] Filter bar with technology category buttons (All, Languages, Frameworks, Databases, DevOps, Cloud)
- [ ] Project cards grid calling `GET /api/v1/projects/published`
- [ ] Client-side filtering by technology category
- [ ] "Load More" pagination using `GET /api/v1/projects/paginated`
- [ ] Card click navigates to `/projects/:slug`
- [ ] Loading and empty states

**Branch:** `feature/projects-page`

**Acceptance Criteria:**
- All published projects display from API
- Category filters work correctly
- Clicking a project card navigates to detail page
- Pagination loads additional projects

---

## Issue #7: Project detail page

**Labels:** `feature`

**Description:**
Build the individual project detail page.

**Tasks:**
- [ ] Fetch project by slug: `GET /api/v1/projects/slug/{slug}`
- [ ] Hero image section (primary project image)
- [ ] Project metadata: status badge, difficulty, type, dates, estimated hours
- [ ] Full description rendered as formatted text
- [ ] Technology stack section with tech pills
- [ ] Links section (GitHub, Live Demo, Docker Hub, Documentation)
- [ ] Image gallery from project images
- [ ] Back to projects navigation
- [ ] 404 handling for invalid slugs

**Branch:** `feature/project-detail`

**Acceptance Criteria:**
- Page loads correct project by URL slug
- All project data displays correctly
- Links open in new tabs
- Image gallery displays all project images

---

## Issue #8: Blog listing and blog post detail pages

**Labels:** `feature`

**Description:**
Build the blog listing page with category/tag filtering and the individual post detail page.

**Tasks:**
- [ ] Blog listing page calling `GET /api/v1/blog/posts/published/paginated`
- [ ] Category filter pills from `GET /api/v1/blog/categories`
- [ ] Tag filter chips from `GET /api/v1/blog/tags`
- [ ] Filter by category: `GET /api/v1/blog/posts/category/:slug`
- [ ] Filter by tag: `GET /api/v1/blog/posts/tag/:slug`
- [ ] Search: `GET /api/v1/blog/posts/search?q=`
- [ ] Blog post detail page by slug: `GET /api/v1/blog/posts/slug/:slug`
- [ ] Markdown content rendering (install `react-markdown` + `react-syntax-highlighter`)
- [ ] Post metadata: date, category, tags, reading time
- [ ] Related posts section
- [ ] Pagination on listing page

**Branch:** `feature/blog`

**Acceptance Criteria:**
- Published blog posts display with pagination
- Category and tag filtering works
- Individual posts render markdown with code syntax highlighting
- Search filters posts by keyword

---

## Issue #9: Certifications page

**Labels:** `feature`

**Description:**
Build the certifications showcase page with status filtering.

**Tasks:**
- [ ] Page header with title and description
- [ ] Status filter buttons (All, Earned, In Progress)
- [ ] Certification cards grid calling `GET /api/v1/certifications/published`
- [ ] Cards show: name, organization, status badge (color-coded), date, technology pills
- [ ] Featured certifications with highlight styling
- [ ] Filter by status: `GET /api/v1/certifications/status/:status`

**Branch:** `feature/certifications`

**Acceptance Criteria:**
- All published certifications display
- Status filter works (EARNED, IN_PROGRESS, EXPIRED)
- Status badges have distinct colors matching design
- Technology pills display correctly

---

## Issue #10: Contact page with form submission

**Labels:** `feature`

**Description:**
Build the contact page with a working form that submits to the backend.

**Tasks:**
- [ ] Split layout: info section (left) + form (right)
- [ ] Contact info with email, GitHub, LinkedIn icons
- [ ] Form fields: name, email, subject, inquiry type dropdown, message textarea
- [ ] Inquiry type options matching backend enum: General, Job Opportunity, Collaboration, Freelance, Feedback, Other
- [ ] Form validation (client-side before submission)
- [ ] Submit to `POST /api/v1/contact`
- [ ] Success confirmation message after submission
- [ ] Error handling for failed submissions
- [ ] Rate limit handling (show friendly message)

**Branch:** `feature/contact`

**Acceptance Criteria:**
- Form submits successfully to backend API
- Validation prevents empty/invalid submissions
- Success message displays after submission
- Error states handled gracefully

---

## Issue #11: Resume download integration

**Labels:** `feature`

**Description:**
Integrate resume download functionality.

**Tasks:**
- [ ] "Download Resume" button in navbar and homepage hero
- [ ] Fetch resume metadata: `GET /api/v1/resume`
- [ ] Download triggers: `GET /api/v1/resume/download` (302 redirect to Cloudinary)
- [ ] Handle case where no resume is uploaded (hide button or show message)

**Branch:** `feature/resume`

**Acceptance Criteria:**
- Resume downloads as PDF when button clicked
- Button hidden gracefully when no resume exists
- Download works across browsers

---

## Issue #12: SEO, meta tags, and performance optimization

**Labels:** `enhancement`

**Description:**
Add SEO fundamentals, proper meta tags, Open Graph data, and performance optimizations.

**Tasks:**
- [ ] Dynamic page titles per route
- [ ] Meta description tags per page
- [ ] Open Graph tags for social sharing (especially project and blog post pages)
- [ ] Favicon and site manifest
- [ ] Lazy loading for images
- [ ] Code splitting per route with `React.lazy()` and `Suspense`
- [ ] Lighthouse audit and optimizations

**Branch:** `feature/seo-performance`

**Acceptance Criteria:**
- Each page has unique title and meta description
- Social media link previews show correct info
- Lighthouse performance score > 90
- Images lazy load below the fold

---

## Issue #13: Deployment setup — Docker, Nginx, CI/CD

**Labels:** `setup`, `enhancement`

**Description:**
Containerize the frontend and deploy alongside the backend on the Hetzner VPS.

**Tasks:**
- [ ] Create production Dockerfile (multi-stage: Node build → Nginx serve)
- [ ] Nginx config for SPA routing (all routes → index.html)
- [ ] Update backend `docker-compose.prod.yml` to include frontend service
- [ ] GitHub Actions workflow: build → Docker image → push to GHCR → deploy to VPS
- [ ] Configure production environment variables
- [ ] SSL/domain setup for frontend (same domain or subdomain)

**Branch:** `feature/deployment`

**Acceptance Criteria:**
- Frontend builds and runs in Docker container
- SPA routing works (direct URL access to any route)
- CI/CD pipeline deploys on push to main
- HTTPS working with valid SSL certificate