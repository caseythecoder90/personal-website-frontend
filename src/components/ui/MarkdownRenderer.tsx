import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
}

const components: Components = {
  h1: ({ children }) => (
    <h1 className="font-headline text-4xl md:text-5xl font-bold text-on-background tracking-tight mt-12 mb-6">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-headline text-2xl md:text-3xl font-bold text-on-background tracking-tight mt-10 mb-5">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-headline text-xl md:text-2xl font-bold text-on-background tracking-tight mt-8 mb-4">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="font-body text-on-surface-variant text-lg leading-relaxed mb-6">
      {children}
    </p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer' : undefined}
      className="text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary transition-colors"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="font-body text-on-surface-variant text-lg leading-relaxed mb-6 ml-6 list-disc space-y-2 marker:text-primary/60">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="font-body text-on-surface-variant text-lg leading-relaxed mb-6 ml-6 list-decimal space-y-2 marker:text-primary/60">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-8 pl-6 border-l-2 border-primary/40 bg-surface-container-low/50 py-4 pr-6 rounded-r-lg">
      <div className="text-on-surface italic text-lg [&>p]:mb-0">{children}</div>
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="my-8 overflow-x-auto rounded-lg bg-surface-container-low">
      <table className="w-full text-left font-body text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-surface-container-highest/50 text-on-surface uppercase tracking-wider text-xs">
      {children}
    </thead>
  ),
  th: ({ children }) => <th className="px-4 py-3 font-semibold">{children}</th>,
  td: ({ children }) => (
    <td className="px-4 py-3 text-on-surface-variant border-t border-outline-variant/10">
      {children}
    </td>
  ),
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt ?? ''}
      className="my-8 w-full rounded-lg bg-surface-container"
    />
  ),
  hr: () => <hr className="my-12 border-0 h-px bg-outline-variant/20" />,
  strong: ({ children }) => (
    <strong className="text-on-surface font-semibold">{children}</strong>
  ),
  pre: ({ children }) => <>{children}</>,
  code: ({ className, children, ...rest }) => {
    const match = /language-([\w-]+)/.exec(className ?? '');
    const isBlock = Boolean(match);
    if (isBlock) {
      return (
        <CodeBlock language={match![1]}>
          {String(children)}
        </CodeBlock>
      );
    }
    return (
      <code
        className="bg-surface-variant text-tertiary px-1.5 py-0.5 rounded font-mono text-[0.9em]"
        {...rest}
      >
        {children}
      </code>
    );
  },
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
