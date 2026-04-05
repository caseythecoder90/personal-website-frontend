// ============================================================================
// Project Domain
// ============================================================================

export const ProjectType = {
  PERSONAL: 'PERSONAL',
  PROFESSIONAL: 'PROFESSIONAL',
  OPEN_SOURCE: 'OPEN_SOURCE',
  LEARNING: 'LEARNING',
  FREELANCE: 'FREELANCE',
} as const;
export type ProjectType = (typeof ProjectType)[keyof typeof ProjectType];

export const ProjectStatus = {
  PLANNING: 'PLANNING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  MAINTAINED: 'MAINTAINED',
  ARCHIVED: 'ARCHIVED',
} as const;
export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export const DifficultyLevel = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
  EXPERT: 'EXPERT',
} as const;
export type DifficultyLevel = (typeof DifficultyLevel)[keyof typeof DifficultyLevel];

export const ImageType = {
  THUMBNAIL: 'THUMBNAIL',
  SCREENSHOT: 'SCREENSHOT',
  ARCHITECTURE_DIAGRAM: 'ARCHITECTURE_DIAGRAM',
  UI_MOCKUP: 'UI_MOCKUP',
  LOGO: 'LOGO',
} as const;
export type ImageType = (typeof ImageType)[keyof typeof ImageType];

export const LinkType = {
  GITHUB: 'GITHUB',
  LIVE: 'LIVE',
  DEMO: 'DEMO',
  STAGING: 'STAGING',
  DOCUMENTATION: 'DOCUMENTATION',
  DOCKER: 'DOCKER',
  NPM: 'NPM',
  MAVEN: 'MAVEN',
  API: 'API',
  OTHER: 'OTHER',
} as const;
export type LinkType = (typeof LinkType)[keyof typeof LinkType];

// ============================================================================
// Technology Domain
// ============================================================================

export const TechnologyCategory = {
  LANGUAGE: 'LANGUAGE',
  FRAMEWORK: 'FRAMEWORK',
  LIBRARY: 'LIBRARY',
  DATABASE: 'DATABASE',
  TOOL: 'TOOL',
  CLOUD: 'CLOUD',
  DEPLOYMENT: 'DEPLOYMENT',
  TESTING: 'TESTING',
} as const;
export type TechnologyCategory = (typeof TechnologyCategory)[keyof typeof TechnologyCategory];

export const ProficiencyLevel = {
  LEARNING: 'LEARNING',
  FAMILIAR: 'FAMILIAR',
  PROFICIENT: 'PROFICIENT',
  EXPERT: 'EXPERT',
} as const;
export type ProficiencyLevel = (typeof ProficiencyLevel)[keyof typeof ProficiencyLevel];

// ============================================================================
// Blog Domain
// ============================================================================

export const BlogImageType = {
  FEATURED: 'FEATURED',
  INLINE: 'INLINE',
  GALLERY: 'GALLERY',
  THUMBNAIL: 'THUMBNAIL',
} as const;
export type BlogImageType = (typeof BlogImageType)[keyof typeof BlogImageType];

// ============================================================================
// Certification Domain
// ============================================================================

export const CertificationStatus = {
  EARNED: 'EARNED',
  IN_PROGRESS: 'IN_PROGRESS',
  EXPIRED: 'EXPIRED',
} as const;
export type CertificationStatus = (typeof CertificationStatus)[keyof typeof CertificationStatus];

// ============================================================================
// Contact Domain
// ============================================================================

export const InquiryType = {
  GENERAL: 'GENERAL',
  PROJECT: 'PROJECT',
  COLLABORATION: 'COLLABORATION',
  HIRING: 'HIRING',
  FREELANCE: 'FREELANCE',
} as const;
export type InquiryType = (typeof InquiryType)[keyof typeof InquiryType];

export const SubmissionStatus = {
  NEW: 'NEW',
  READ: 'READ',
  REPLIED: 'REPLIED',
  ARCHIVED: 'ARCHIVED',
} as const;
export type SubmissionStatus = (typeof SubmissionStatus)[keyof typeof SubmissionStatus];
