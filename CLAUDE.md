# Casey Quinn Portfolio - Frontend

## Project Overview
React + TypeScript + Vite frontend for Casey Quinn's personal portfolio website.
Consumes a Spring Boot 3.5.4 backend API at `/api/v1/`.

## Tech Stack
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Backend:** Spring Boot 3.5.4, Java 21, PostgreSQL, Redis, Cloudinary, JWT Auth
- **Design System:** "Casey Quinn." / Obsidian Forge (see `design/` folder)

## Design System: Casey Quinn.

### Creative Direction
"The Digital Curator" - editorial, high-end digital gallery feel. Intentional asymmetry, tonal depth, atmospheric glow/glass elements. NOT a template-heavy developer portfolio.

### Color Tokens (Dark Theme)
```
background/surface:        #0e0e0e
surface-container-lowest:  #000000  (input wells only)
surface-container-low:     #131313  (large content blocks, glass nav)
surface-container:         #1a1919  (card backgrounds)
surface-container-high:    #201f1f
surface-container-highest: #262626  (elevated cards, hover states)
surface-variant:           #262626  (tech pills)
surface-bright:            #2c2c2c

primary:                   #a3a6ff  (main accent - electric indigo)
primary-dim:               #6063ee  (gradient end)
secondary:                 #a28efc
secondary-dim:             #a28efc
tertiary:                  #ffa5d9  (pink - sparingly for micro-moments)
error:                     #ff6e84

on-background/on-surface:  #ffffff
on-surface-variant:        #adaaaa  (body text, muted)
on-primary:                #0f00a4  (text on primary buttons)
outline:                   #777575
outline-variant:           #494847  (ghost borders at 15% opacity)
```

### Typography
- **Headlines/Display:** Space Grotesk (bold, tight tracking)
  - Hero: 3.5rem+ with -0.02em letter-spacing
- **Body/Labels:** Inter (neutral, readable)
  - Body: 1rem, labels: small caps + 0.05em tracking for tech pills

### Key Design Rules
1. **No-Line Rule:** NO 1px solid borders. Use background color shifts for boundaries.
2. **No drop shadows.** Use tonal layering (shift surface levels) for elevation.
3. **Ghost Borders:** outline-variant at 15% opacity - felt, not seen.
4. **Glass elements:** 60-70% opacity background + backdrop-blur(12-20px)
5. **Primary CTAs:** Gradient from primary to primary-dim at 135deg + accent glow
6. **Asymmetric margins:** Hero headers use 10% left offset
7. **Generous whitespace:** 4rem-6rem between sections
8. **No pure black** except input wells. Use surface (#0e0e0e).
9. **Tertiary (#ffa5d9)** only for micro-moments (badges, section labels)
10. **All interactive elements** use primary (#a3a6ff) or secondary (#a28efc), never standard blue

### Component Patterns (from Stitch designs)

**Navigation (Glass Bar):**
- Fixed, sticky top
- bg-neutral-900/70 with backdrop-blur(20px)
- Bottom ghost border (border-white/15)
- Links: Space Grotesk, active = indigo-400 with bottom border
- CTA button: "Hire Me" / "Resume" gradient button

**Project Cards:**
- bg-surface-container, p-8, rounded-xl
- Hover: bg-surface-container-highest + primary glow top edge (inset shadow)
- Image: aspect-video, opacity-60, hover:opacity-100 + scale-105
- Tech pills: bg-surface-variant, rounded-full, 10px uppercase bold

**Blog Post Cards:**
- Horizontal layout with image left, content right
- Category badge (primary colored pill)
- Date + read time metadata
- Tag pills below excerpt

**Certification Cards:**
- Status badge (EARNED=green, IN_PROGRESS=primary, EXPIRED=outline)
- Issue date next to status
- Tech pills at bottom
- 2-column grid

**Contact Page:**
- Split layout: left side info + social links, right side form
- Form fields: bg-surface-container-lowest (#000), ghost border on focus -> solid primary
- Inquiry type dropdown
- Gradient submit button

**Footer:**
- bg-neutral-950
- Logo left, social links right
- Muted text (neutral-500)

## Pages (7 total)
1. **Home** - Hero with photo, featured projects grid (3-col), technology showcase (progress bars), CTA section
2. **Projects** - Category filter tabs, 2-column card grid with images, "Load More" pagination
3. **Project Detail** - Hero image, mission overview, system snapshots, related projects
4. **Blog** - Category filter tabs + advanced filters, search bar, paginated post list
5. **Blog Post Detail** - Full article with sidebar (related posts), code blocks, tag pills
6. **Certifications** - Status filter tabs (All/Earned/In Progress), card grid
7. **Contact** - Split layout form with social links

---

## Backend API Reference

**Base URL:** `http://localhost:8080/api/v1`
**Auth:** JWT Bearer token (24h expiry). All GET endpoints are public. POST/PUT/DELETE require ADMIN role.
**Response wrapper:** `{ status, errorCode?, message, data, timestamp, requestId }`

### Authentication
```
POST /auth/login  { username, password } -> AuthResponse
```

### Projects
```
GET    /projects                                          -> Response<List<ProjectResponse>>
GET    /projects/paginated?page&size&sort&published       -> Response<Page<ProjectResponse>>
GET    /projects/{id}                                     -> Response<ProjectResponse>
GET    /projects/technology/{tech}                        -> Response<List<ProjectResponse>>
GET    /projects/featured                                 -> Response<List<ProjectResponse>>
POST   /projects                                          -> Response<ProjectResponse>        [ADMIN]
PUT    /projects/{id}                                     -> Response<ProjectResponse>        [ADMIN]
DELETE /projects/{id}                                     -> Response<Void>                   [ADMIN]
```
Note: Use `?published=true` on the paginated endpoint for public-facing pages. There is no `/projects/slug/{slug}` or `/projects/published` endpoint.

### Project Images
```
GET    /projects/{projectId}/images          -> Response<List<ProjectImageResponse>>
GET    /projects/{projectId}/images/{id}     -> Response<ProjectImageResponse>
POST   /projects/{projectId}/images          -> multipart/form-data          [ADMIN]
PUT    /projects/{projectId}/images/{id}     -> Response<ProjectImageResponse> [ADMIN]
PUT    /projects/{projectId}/images/{id}/set-primary                         [ADMIN]
DELETE /projects/{projectId}/images/{id}                                     [ADMIN]
```

### Project Links
```
GET    /projects/{projectId}/links           -> Response<List<ProjectLinkResponse>>
GET    /projects/{projectId}/links/{id}      -> Response<ProjectLinkResponse>
POST   /projects/{projectId}/links           [ADMIN]
PUT    /projects/{projectId}/links/{id}      [ADMIN]
DELETE /projects/{projectId}/links/{id}      [ADMIN]
```

### Technologies
```
GET    /technologies                         -> Response<List<TechnologyResponse>>
GET    /technologies/{id}                    -> Response<TechnologyResponse>
GET    /technologies/category/{category}     -> Response<List<TechnologyResponse>>
GET    /technologies/proficiency/{level}     -> Response<List<TechnologyResponse>>
GET    /technologies/featured                -> Response<List<TechnologyResponse>>
GET    /technologies/most-used               -> Response<List<TechnologyResponse>>
POST   /technologies                         [ADMIN]
PUT    /technologies/{id}                    [ADMIN]
DELETE /technologies/{id}                    [ADMIN]
```

### Certifications
```
GET    /certifications                       -> Response<List<CertificationResponse>>
GET    /certifications/{id}                  -> Response<CertificationResponse>
GET    /certifications/slug/{slug}           -> Response<CertificationResponse>
GET    /certifications/status/{status}       -> Response<List<CertificationResponse>>
GET    /certifications/published             -> Response<List<CertificationResponse>>
GET    /certifications/featured              -> Response<List<CertificationResponse>>
GET    /certifications/organization/{org}    -> Response<List<CertificationResponse>>
POST   /certifications                       [ADMIN]
PUT    /certifications/{id}                  [ADMIN]
DELETE /certifications/{id}                  [ADMIN]
POST   /certifications/{id}/technologies/{techId}  [ADMIN]
DELETE /certifications/{id}/technologies/{techId}  [ADMIN]
```

### Blog Posts
```
GET    /blog/posts                           -> Response<List<BlogPostResponse>>
GET    /blog/posts/published                 -> Response<List<BlogPostResponse>>
GET    /blog/posts/published/paginated?page&size&sort -> Response<Page<BlogPostResponse>>
GET    /blog/posts/{id}                      -> Response<BlogPostResponse>
GET    /blog/posts/slug/{slug}               -> Response<BlogPostResponse>  (increments views)
GET    /blog/posts/category/{slug}           -> Response<List<BlogPostResponse>>
GET    /blog/posts/tag/{slug}                -> Response<List<BlogPostResponse>>
GET    /blog/posts/search?q={query}          -> Response<List<BlogPostResponse>>
POST   /blog/posts                           [ADMIN]
PUT    /blog/posts/{id}                      [ADMIN]
DELETE /blog/posts/{id}                      [ADMIN]
PUT    /blog/posts/{id}/publish              [ADMIN]
PUT    /blog/posts/{id}/unpublish            [ADMIN]
POST   /blog/posts/{id}/categories/{catId}   [ADMIN]
DELETE /blog/posts/{id}/categories/{catId}   [ADMIN]
POST   /blog/posts/{id}/tags/{tagId}         [ADMIN]
DELETE /blog/posts/{id}/tags/{tagId}         [ADMIN]
```

### Blog Categories
```
GET    /blog/categories                      -> Response<List<BlogCategoryResponse>>
GET    /blog/categories/{id}                 -> Response<BlogCategoryResponse>
GET    /blog/categories/slug/{slug}          -> Response<BlogCategoryResponse>
POST   /blog/categories                      [ADMIN]
PUT    /blog/categories/{id}                 [ADMIN]
DELETE /blog/categories/{id}                 [ADMIN]
```

### Blog Tags
```
GET    /blog/tags                            -> Response<List<BlogTagResponse>>
GET    /blog/tags/popular                    -> Response<List<BlogTagResponse>>
GET    /blog/tags/{id}                       -> Response<BlogTagResponse>
GET    /blog/tags/slug/{slug}                -> Response<BlogTagResponse>
POST   /blog/tags                            [ADMIN]
PUT    /blog/tags/{id}                       [ADMIN]
DELETE /blog/tags/{id}                       [ADMIN]
```

### Blog Post Images
```
GET    /blog/posts/{postId}/images           -> Response<List<BlogPostImageResponse>>
GET    /blog/posts/{postId}/images/{id}      -> Response<BlogPostImageResponse>
POST   /blog/posts/{postId}/images           multipart/form-data [ADMIN]
PUT    /blog/posts/{postId}/images/{id}      [ADMIN]
PUT    /blog/posts/{postId}/images/{id}/primary [ADMIN]
DELETE /blog/posts/{postId}/images/{id}      [ADMIN]
```

### Contact Submissions
```
POST   /contact                              -> Response<ContactSubmissionResponse>  (public)
GET    /contact                              [ADMIN]
GET    /contact/{id}                         [ADMIN]
GET    /contact/status/{status}              [ADMIN]
GET    /contact/inquiry-type/{type}          [ADMIN]
PUT    /contact/{id}/status                  [ADMIN]
DELETE /contact/{id}                         [ADMIN]
```

### Resume
```
GET    /resume                               -> Response<ResumeResponse>    (metadata)
GET    /resume/download                      -> 302 redirect               (public)
POST   /resume                               multipart/form-data          [ADMIN]
DELETE /resume                               [ADMIN]
```

### Operations
```
GET    /operations/health                    -> HealthResponse              (public)
POST   /operations/encrypt                   [ADMIN]
POST   /operations/decrypt                   [ADMIN]
POST   /operations/hash-password             [ADMIN]
```

---

## TypeScript DTOs (matching backend)

### Enums

```typescript
// Project enums
type ProjectType = 'PERSONAL' | 'PROFESSIONAL' | 'OPEN_SOURCE' | 'LEARNING' | 'FREELANCE';
type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'MAINTAINED' | 'ARCHIVED';
type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
type ImageType = 'THUMBNAIL' | 'SCREENSHOT' | 'ARCHITECTURE_DIAGRAM' | 'UI_MOCKUP' | 'LOGO';
type LinkType = 'GITHUB' | 'LIVE' | 'DEMO' | 'STAGING' | 'DOCUMENTATION' | 'DOCKER' | 'NPM' | 'MAVEN' | 'API' | 'OTHER';

// Technology enums
type TechnologyCategory = 'LANGUAGE' | 'FRAMEWORK' | 'LIBRARY' | 'DATABASE' | 'TOOL' | 'CLOUD' | 'DEPLOYMENT' | 'TESTING';
type ProficiencyLevel = 'LEARNING' | 'FAMILIAR' | 'PROFICIENT' | 'EXPERT';

// Blog enums
type BlogImageType = 'FEATURED' | 'INLINE' | 'GALLERY' | 'THUMBNAIL';

// Certification enums
type CertificationStatus = 'EARNED' | 'IN_PROGRESS' | 'EXPIRED';

// Contact enums
type InquiryType = 'GENERAL' | 'PROJECT' | 'COLLABORATION' | 'HIRING' | 'FREELANCE';
type SubmissionStatus = 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED';
```

### API Response Wrapper

```typescript
interface ApiResponse<T> {
  status: string;        // "success" | "error"
  errorCode?: string;
  message: string;
  data: T;
  timestamp: string;     // ISO datetime
  requestId: string;
}

interface ValidationError {
  field: string;
  message: string;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;        // current page (0-indexed)
  first: boolean;
  last: boolean;
}
```

### Response DTOs

```typescript
interface AuthResponse {
  token: string;
  tokenType: string;     // "Bearer"
  expiresIn: number;     // ms (86400000 = 24h)
  username: string;
  role: string;
}

interface ProjectResponse {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string | null;
  type: ProjectType;
  status: ProjectStatus;
  difficultyLevel: DifficultyLevel | null;
  startDate: string | null;
  completionDate: string | null;
  estimatedHours: number | null;
  published: boolean;
  featured: boolean;
  displayOrder: number;
  viewCount: number;
  technologies: TechnologyResponse[];
  images: ProjectImageResponse[];
  links: ProjectLinkResponse[];
  createdAt: string;
  updatedAt: string;
}

interface ProjectImageResponse {
  id: number;
  projectId: number;
  projectName: string;
  url: string;
  cloudinaryPublicId: string;
  altText: string | null;
  caption: string | null;
  imageType: ImageType;
  displayOrder: number;
  isPrimary: boolean;
  createdAt: string;
}

interface ProjectLinkResponse {
  id: number;
  type: LinkType;
  url: string;
  label: string | null;
  displayOrder: number;
  createdAt: string;
}

interface TechnologyResponse {
  id: number;
  name: string;
  version: string | null;
  category: TechnologyCategory;
  iconUrl: string | null;
  color: string | null;
  documentationUrl: string | null;
  proficiencyLevel: ProficiencyLevel | null;
  yearsExperience: number | null;
  featured: boolean;
  projectCount: number;
  createdAt: string;
  updatedAt: string;
}

interface CertificationResponse {
  id: number;
  name: string;
  slug: string;
  issuingOrganization: string;
  credentialId: string | null;
  credentialUrl: string | null;
  issueDate: string | null;       // date only (YYYY-MM-DD)
  expirationDate: string | null;  // date only
  status: CertificationStatus;
  description: string | null;
  badgeUrl: string | null;
  published: boolean;
  featured: boolean;
  displayOrder: number;
  technologies: TechnologyResponse[];
  createdAt: string;
  updatedAt: string;
}

interface BlogPostResponse {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  publishedAt: string | null;
  viewCount: number;
  readTimeMinutes: number | null;
  categories: BlogCategoryResponse[];
  tags: BlogTagResponse[];
  images: BlogPostImageResponse[];
  createdAt: string;
  updatedAt: string;
}

interface BlogCategoryResponse {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  postCount: number;
  createdAt: string;
}

interface BlogTagResponse {
  id: number;
  name: string;
  slug: string;
  usageCount: number;
  createdAt: string;
}

interface BlogPostImageResponse {
  id: number;
  url: string;
  cloudinaryPublicId: string;
  altText: string | null;
  caption: string | null;
  imageType: BlogImageType;
  displayOrder: number;
  isPrimary: boolean;
  createdAt: string;
}

interface ContactSubmissionResponse {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  inquiryType: InquiryType | null;
  status: SubmissionStatus;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  respondedAt: string | null;
}

interface ResumeResponse {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  contentType: string;
  uploadedAt: string;
  updatedAt: string;
}

interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
  version: string;
  environment: string;
}
```

### Request DTOs

```typescript
interface LoginRequest {
  username: string;
  password: string;
}

interface ContactSubmissionRequest {
  name: string;               // required, max 255
  email: string;              // required, valid email, max 255
  subject?: string;           // max 255
  message: string;            // required, min 20, max 2000
  inquiryType?: InquiryType;
}

interface CreateProjectRequest {
  name: string;                          // required, 2-100
  slug?: string;                         // 2-100
  shortDescription: string;             // required, max 200
  fullDescription?: string;             // max 5000
  type: ProjectType;                     // required
  status?: ProjectStatus;
  difficultyLevel?: DifficultyLevel;
  startDate?: string;
  completionDate?: string;
  estimatedHours?: number;              // min 0
  published?: boolean;
  featured?: boolean;
  displayOrder?: number;                // min 0
  technologyIds?: number[];
  links?: CreateProjectLinkRequest[];
}

interface UpdateProjectRequest {
  name: string;                          // required, 2-100
  slug?: string;
  shortDescription: string;             // required, max 200
  fullDescription?: string;
  type: ProjectType;                     // required
  status?: ProjectStatus;
  difficultyLevel?: DifficultyLevel;
  startDate?: string;
  completionDate?: string;
  estimatedHours?: number;
  published?: boolean;
  featured?: boolean;
  displayOrder?: number;
  technologyIds?: number[];
}

interface CreateProjectLinkRequest {
  type: LinkType;                        // required
  url: string;                           // required, valid URL, max 1000
  label?: string;                        // max 100
  displayOrder?: number;                 // default 0, min 0
}

interface UpdateProjectLinkRequest {
  type?: LinkType;
  url?: string;
  label?: string;
  displayOrder?: number;
}

interface CreateProjectImageRequest {
  imageType: ImageType;                  // required
  altText?: string;                      // max 255
  caption?: string;                      // max 500
  displayOrder?: number;                 // default 0, min 0
  isPrimary?: boolean;                   // default false
}

interface UpdateProjectImageRequest {
  imageType?: ImageType;
  altText?: string;
  caption?: string;
  displayOrder?: number;
  isPrimary?: boolean;
}

interface CreateTechnologyRequest {
  name: string;                          // required, 2-50
  version?: string;                      // max 20
  category: TechnologyCategory;          // required
  iconUrl?: string;                      // valid URL
  color?: string;                        // max 7 hex
  documentationUrl?: string;             // valid URL
  proficiencyLevel?: ProficiencyLevel;
  yearsExperience?: number;              // 0.0-50.0
  featured?: boolean;
}

interface UpdateTechnologyRequest {
  name: string;                          // required, 2-50
  version?: string;
  category: TechnologyCategory;          // required
  iconUrl?: string;
  color?: string;
  documentationUrl?: string;
  proficiencyLevel?: ProficiencyLevel;
  yearsExperience?: number;
  featured?: boolean;
}

interface CreateCertificationRequest {
  name: string;                          // required, 2-255
  issuingOrganization: string;           // required, max 255
  credentialId?: string;                 // max 255
  credentialUrl?: string;                // max 500
  issueDate?: string;                    // date YYYY-MM-DD
  expirationDate?: string;
  status: CertificationStatus;           // required
  description?: string;                  // max 5000
  badgeUrl?: string;                     // max 500
  published?: boolean;
  featured?: boolean;
  displayOrder?: number;                 // min 0
  technologyIds?: number[];
}

interface UpdateCertificationRequest {
  name?: string;                         // 2-255
  issuingOrganization?: string;
  credentialId?: string;
  credentialUrl?: string;
  issueDate?: string;
  expirationDate?: string;
  status?: CertificationStatus;
  description?: string;
  badgeUrl?: string;
  published?: boolean;
  featured?: boolean;
  displayOrder?: number;
  technologyIds?: number[];
}

interface CreateBlogPostRequest {
  title: string;                         // required, 2-200
  slug?: string;                         // max 200
  content: string;                       // required
  excerpt?: string;                      // max 500
  published?: boolean;
  readTimeMinutes?: number;              // min 1
  categoryIds?: number[];
  tagIds?: number[];
}

interface UpdateBlogPostRequest {
  title?: string;                        // 2-200
  content?: string;
  excerpt?: string;                      // max 500
  readTimeMinutes?: number;
  categoryIds?: number[];
  tagIds?: number[];
}

interface CreateBlogCategoryRequest {
  name: string;                          // required, 2-100
  description?: string;                  // max 500
  color?: string;                        // hex #XXXXXX
}

interface UpdateBlogCategoryRequest {
  name?: string;                         // 2-100
  description?: string;
  color?: string;
}

interface CreateBlogTagRequest {
  name: string;                          // required, 2-50
}

interface UpdateBlogTagRequest {
  name?: string;                         // 2-50
}

interface CreateBlogPostImageRequest {
  imageType: BlogImageType;              // required
  altText?: string;                      // max 255
  caption?: string;                      // max 500
  displayOrder?: number;                 // default 0, min 0
  isPrimary?: boolean;                   // default false
}

interface UpdateBlogPostImageRequest {
  altText?: string;
  caption?: string;
  imageType?: BlogImageType;
  displayOrder?: number;
  isPrimary?: boolean;
}

interface UpdateContactStatusRequest {
  status: SubmissionStatus;              // required
}
```

---

## Frontend Integration Notes

1. **JWT Flow:** POST `/auth/login` -> store token -> send as `Authorization: Bearer <token>` header
2. **Handle 401:** Token expired -> redirect to login
3. **Public pages:** Projects, Blog, Certifications, Resume - no auth needed
4. **Contact form:** Public POST, rate-limited (60 req/min)
5. **Image uploads:** Use `multipart/form-data` with file + metadata JSON
6. **Pagination:** Spring format - `?page=0&size=10&sort=createdAt,desc`
7. **Slug-based routes:** Blog posts increment view count on slug access
8. **Rate limits:** 60/min public, 5/min login, 30/min admin
9. **CORS:** Backend configured for frontend origin
10. **Caching:** Server-side Redis (10-60min TTL), POST/PUT/DELETE invalidate

## Design Reference Files
- `design/stitch/obsidian_forge/DESIGN.md` - Full design system specification
- `design/stitch/casey_quinn_portfolio_home/` - Home page (screen.png + code.html)
- `design/stitch/casey_quinn_portfolio_projects/` - Projects listing page
- `design/stitch/casey_quinn_portfolio_project_detail/` - Project detail page
- `design/stitch/casey_quinn_portfolio_blog/` - Blog listing page
- `design/stitch/casey_quinn_portfolio_blog_post_detail/` - Blog post detail page
- `design/stitch/casey_quinn_portfolio_certifications/` - Certifications page
- `design/stitch/casey_quinn_portfolio_contact/` - Contact page
