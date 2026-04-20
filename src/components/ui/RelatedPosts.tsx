import { Link } from 'react-router-dom';
import type { BlogPostResponse } from '@/types';

interface RelatedPostsProps {
  posts: BlogPostResponse[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="related-posts-heading">
      <h2
        id="related-posts-heading"
        className="font-headline text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3 tracking-tight"
      >
        <span className="w-1.5 h-8 bg-primary" aria-hidden="true" />
        Related Posts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          const category = (post.categories ?? [])[0];
          return (
            <article
              key={post.id}
              className="group relative bg-surface-container p-6 rounded-xl hover:bg-surface-container-highest transition-colors"
            >
              {category && (
                <span className="text-[10px] font-bold text-tertiary-dim uppercase tracking-tighter">
                  {category.name}
                </span>
              )}
              <h3 className="font-headline font-semibold text-lg mt-2 text-on-surface group-hover:text-primary transition-colors">
                <Link
                  to={`/blog/${post.slug}`}
                  className="before:absolute before:inset-0 before:content-['']"
                >
                  {post.title}
                </Link>
              </h3>
              {post.excerpt && (
                <p className="text-sm text-on-surface-variant mt-2 line-clamp-3">
                  {post.excerpt}
                </p>
              )}
              <span className="inline-block mt-4 text-xs font-bold text-primary group-hover:underline">
                Read Article →
              </span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
