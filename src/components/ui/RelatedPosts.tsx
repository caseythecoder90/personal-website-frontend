import { Link } from 'react-router-dom';
import type { BlogPostResponse } from '@/types';

interface RelatedPostsProps {
  posts: BlogPostResponse[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="related-posts-heading">
      <h3
        id="related-posts-heading"
        className="font-headline text-xl font-bold mb-6 flex items-center gap-2"
      >
        <span className="w-1 h-6 bg-primary" aria-hidden="true" />
        Related Posts
      </h3>
      <div className="space-y-6">
        {posts.map((post) => {
          const category = (post.categories ?? [])[0];
          return (
            <article
              key={post.id}
              className="group bg-surface-container p-5 rounded-xl hover:bg-surface-container-highest transition-colors"
            >
              {category && (
                <span className="text-[10px] font-bold text-tertiary-dim uppercase tracking-tighter">
                  {category.name}
                </span>
              )}
              <h4 className="font-headline font-semibold text-lg mt-2 text-on-surface group-hover:text-primary transition-colors">
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </h4>
              {post.excerpt && (
                <p className="text-sm text-on-surface-variant mt-2 line-clamp-2">
                  {post.excerpt}
                </p>
              )}
              <Link
                to={`/blog/${post.slug}`}
                className="inline-block mt-4 text-xs font-bold text-primary group-hover:underline"
              >
                Read Article
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
