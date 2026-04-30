export { Button } from './Button';
export { TechPill } from './TechPill';
export { StatusBadge } from './StatusBadge';
export { CertificationStatusBadge } from './CertificationStatusBadge';
export { SectionHeader } from './SectionHeader';
export { SkillBar } from './SkillBar';
export { ProjectCard } from './ProjectCard';
export { BlogPostCard } from './BlogPostCard';
export { CertificationCard } from './CertificationCard';
export { TechnologyShowcase } from './TechnologyShowcase';
export { ProjectLinks } from './ProjectLinks';
export { ProjectGallery } from './ProjectGallery';
export { LoadingSpinner } from './LoadingSpinner';
export { ErrorDisplay } from './ErrorDisplay';
export { Pagination } from './Pagination';
export { CategoryTab } from './CategoryTab';
export { TagChip } from './TagChip';
export { SearchInput } from './SearchInput';
// CodeBlock and MarkdownRenderer are intentionally NOT re-exported here.
// They pull in react-markdown and react-syntax-highlighter — heavy libs
// that should only ship in the chunk for the page that actually uses
// them (BlogPostPage). Re-exporting from this barrel would poison every
// importer with those deps, since `Layout` (eager) imports from this
// file. Import these two directly from their source files instead:
//   import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
export { RelatedPosts } from './RelatedPosts';
export { NewsletterCard } from './NewsletterCard';
export { ContactInfoLink } from './ContactInfoLink';
export { MailIcon } from './MailIcon';
export { GithubIcon } from './GithubIcon';
export { LinkedinIcon } from './LinkedinIcon';
