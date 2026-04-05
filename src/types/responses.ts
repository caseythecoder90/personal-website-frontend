import type {
  ProjectType,
  ProjectStatus,
  DifficultyLevel,
  ImageType,
  LinkType,
  TechnologyCategory,
  ProficiencyLevel,
  BlogImageType,
  CertificationStatus,
  InquiryType,
  SubmissionStatus,
} from './enums';

// ============================================================================
// Auth
// ============================================================================

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  username: string;
  role: string;
}

// ============================================================================
// Projects
// ============================================================================

export interface ProjectResponse {
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

export interface ProjectImageResponse {
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

export interface ProjectLinkResponse {
  id: number;
  type: LinkType;
  url: string;
  label: string | null;
  displayOrder: number;
  createdAt: string;
}

// ============================================================================
// Technologies
// ============================================================================

export interface TechnologyResponse {
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

// ============================================================================
// Certifications
// ============================================================================

export interface CertificationResponse {
  id: number;
  name: string;
  slug: string;
  issuingOrganization: string;
  credentialId: string | null;
  credentialUrl: string | null;
  issueDate: string | null;
  expirationDate: string | null;
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

// ============================================================================
// Blog
// ============================================================================

export interface BlogPostResponse {
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

export interface BlogCategoryResponse {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  postCount: number;
  createdAt: string;
}

export interface BlogTagResponse {
  id: number;
  name: string;
  slug: string;
  usageCount: number;
  createdAt: string;
}

export interface BlogPostImageResponse {
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

// ============================================================================
// Contact
// ============================================================================

export interface ContactSubmissionResponse {
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

// ============================================================================
// Resume
// ============================================================================

export interface ResumeResponse {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  contentType: string;
  uploadedAt: string;
  updatedAt: string;
}

// ============================================================================
// Operations
// ============================================================================

export interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
  version: string;
  environment: string;
}
