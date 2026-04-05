// Enums (exported as values AND types — the const objects are runtime values)
export {
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

// Common types
export type {
  ApiResponse,
  ValidationError,
  PageResponse,
  PaginationParams,
} from './common';

// Response DTOs
export type {
  AuthResponse,
  ProjectResponse,
  ProjectImageResponse,
  ProjectLinkResponse,
  TechnologyResponse,
  CertificationResponse,
  BlogPostResponse,
  BlogCategoryResponse,
  BlogTagResponse,
  BlogPostImageResponse,
  ContactSubmissionResponse,
  ResumeResponse,
  HealthResponse,
} from './responses';

// Request DTOs
export type {
  LoginRequest,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateProjectLinkRequest,
  UpdateProjectLinkRequest,
  CreateProjectImageRequest,
  UpdateProjectImageRequest,
  CreateTechnologyRequest,
  UpdateTechnologyRequest,
  CreateCertificationRequest,
  UpdateCertificationRequest,
  CreateBlogPostRequest,
  UpdateBlogPostRequest,
  CreateBlogCategoryRequest,
  UpdateBlogCategoryRequest,
  CreateBlogTagRequest,
  UpdateBlogTagRequest,
  CreateBlogPostImageRequest,
  UpdateBlogPostImageRequest,
  ContactSubmissionRequest,
  UpdateContactStatusRequest,
} from './requests';
