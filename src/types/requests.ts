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

export interface LoginRequest {
  username: string;
  password: string;
}

// ============================================================================
// Projects
// ============================================================================

export interface CreateProjectRequest {
  name: string;
  slug?: string;
  shortDescription: string;
  fullDescription?: string;
  type: ProjectType;
  status?: ProjectStatus;
  difficultyLevel?: DifficultyLevel;
  startDate?: string;
  completionDate?: string;
  estimatedHours?: number;
  published?: boolean;
  featured?: boolean;
  displayOrder?: number;
  technologyIds?: number[];
  links?: CreateProjectLinkRequest[];
}

export interface UpdateProjectRequest {
  name: string;
  slug?: string;
  shortDescription: string;
  fullDescription?: string;
  type: ProjectType;
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

export interface CreateProjectLinkRequest {
  type: LinkType;
  url: string;
  label?: string;
  displayOrder?: number;
}

export interface UpdateProjectLinkRequest {
  type?: LinkType;
  url?: string;
  label?: string;
  displayOrder?: number;
}

export interface CreateProjectImageRequest {
  imageType: ImageType;
  altText?: string;
  caption?: string;
  displayOrder?: number;
  isPrimary?: boolean;
}

export interface UpdateProjectImageRequest {
  imageType?: ImageType;
  altText?: string;
  caption?: string;
  displayOrder?: number;
  isPrimary?: boolean;
}

// ============================================================================
// Technologies
// ============================================================================

export interface CreateTechnologyRequest {
  name: string;
  version?: string;
  category: TechnologyCategory;
  iconUrl?: string;
  color?: string;
  documentationUrl?: string;
  proficiencyLevel?: ProficiencyLevel;
  yearsExperience?: number;
  featured?: boolean;
}

export interface UpdateTechnologyRequest {
  name: string;
  version?: string;
  category: TechnologyCategory;
  iconUrl?: string;
  color?: string;
  documentationUrl?: string;
  proficiencyLevel?: ProficiencyLevel;
  yearsExperience?: number;
  featured?: boolean;
}

// ============================================================================
// Certifications
// ============================================================================

export interface CreateCertificationRequest {
  name: string;
  issuingOrganization: string;
  credentialId?: string;
  credentialUrl?: string;
  issueDate?: string;
  expirationDate?: string;
  status: CertificationStatus;
  description?: string;
  badgeUrl?: string;
  published?: boolean;
  featured?: boolean;
  displayOrder?: number;
  technologyIds?: number[];
}

export interface UpdateCertificationRequest {
  name?: string;
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

// ============================================================================
// Blog
// ============================================================================

export interface CreateBlogPostRequest {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  published?: boolean;
  readTimeMinutes?: number;
  categoryIds?: number[];
  tagIds?: number[];
}

export interface UpdateBlogPostRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  readTimeMinutes?: number;
  categoryIds?: number[];
  tagIds?: number[];
}

export interface CreateBlogCategoryRequest {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateBlogCategoryRequest {
  name?: string;
  description?: string;
  color?: string;
}

export interface CreateBlogTagRequest {
  name: string;
}

export interface UpdateBlogTagRequest {
  name?: string;
}

export interface CreateBlogPostImageRequest {
  imageType: BlogImageType;
  altText?: string;
  caption?: string;
  displayOrder?: number;
  isPrimary?: boolean;
}

export interface UpdateBlogPostImageRequest {
  altText?: string;
  caption?: string;
  imageType?: BlogImageType;
  displayOrder?: number;
  isPrimary?: boolean;
}

// ============================================================================
// Contact
// ============================================================================

export interface ContactSubmissionRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
  inquiryType?: InquiryType;
}

export interface UpdateContactStatusRequest {
  status: SubmissionStatus;
}
