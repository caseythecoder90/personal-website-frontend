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

/*
 * ============================================================================
 * COMPONENT: MarkdownRenderer
 * ============================================================================
 *
 * PURPOSE:
 *   Renders a markdown string as styled React elements, matching the dark
 *   editorial design system. Wraps react-markdown with GitHub-Flavored
 *   Markdown support and a map of component overrides so every tag is
 *   styled consistently.
 *
 * HOW react-markdown WORKS (under the hood):
 *   1. Parses the markdown string into a syntax tree (AST) of nodes like
 *      "heading level 2", "paragraph", "code block".
 *   2. Walks the tree and renders each node as a React element.
 *   3. For each node, if `components[tagName]` is defined, uses OUR
 *      component; otherwise falls back to the default HTML tag.
 *
 * THE `components` OBJECT — a lookup table of overrides:
 *
 *   const components: Components = {
 *     h1: ({ children }) => <h1 className="...">{children}</h1>,
 *     p:  ({ children }) => <p className="...">{children}</p>,
 *     // ... one entry per HTML tag we want to style
 *   };
 *
 *   Keys are HTML tag names; values are React components (functions that
 *   take props, return JSX). The `: Components` is a TypeScript type from
 *   react-markdown that enforces valid tag names and prop shapes.
 *
 *   Java analogue: Strategy pattern. Think Map<String, Renderer> where
 *   the key is the element type and the value is the renderer strategy
 *   for that element. react-markdown walks the AST and for each node
 *   does components.get(nodeType).render(props) — or falls back to the
 *   default.
 *
 *   The ({ children }) on the left of => is DESTRUCTURING — pulling the
 *   `children` field out of the props object. Equivalent to:
 *     h1: (props) => <h1>{props.children}</h1>
 *
 * THE `code` OVERRIDE — inline vs block detection:
 *
 *   Both inline `foo` and fenced ```java ... ``` parse to <code> nodes.
 *   The ONLY difference: fenced blocks get className="language-xxx"
 *   attached by remark; inline code has no className.
 *
 *     code: ({ className, children, ...rest }) => {
 *       const match = /language-([\w-]+)/.exec(className ?? '');
 *       const isBlock = Boolean(match);
 *       if (isBlock) return <CodeBlock language={match![1]}>...</CodeBlock>;
 *       return <code className="...">{children}</code>;
 *     }
 *
 *   - className ?? '' → default to empty string if className is undefined
 *     so the regex doesn't crash.
 *   - match is null (inline) or an array like ['language-java', 'java']
 *     (capture group 1 is the language name).
 *   - match![1] — the ! is a TypeScript non-null assertion: "I promise
 *     match isn't null here, I just checked."
 *
 *   Block path → CodeBlock component (header strip + syntax highlighting).
 *   Inline path → simple styled <code> pill.
 *
 * WHY `pre` RETURNS A FRAGMENT:
 *
 *   Fenced code in the AST is actually <pre><code class="language-x">...
 *   So when our `code` override returns a <CodeBlock> (with its own <div>
 *   wrapper), the default <pre> would still wrap it, giving:
 *     <pre>                        ← react-markdown's default
 *       <div class="my-8 ...">...  ← our CodeBlock wrapper
 *     </pre>
 *
 *   That extra <pre> adds default styling and breaks our layout. So we
 *   override pre → <>{children}</> (a React FRAGMENT). Fragments render
 *   their children with NO wrapping DOM node — they disappear in the
 *   output. Result: CodeBlock renders clean, no extra <pre>.
 *
 *   Java analogue: returning a List<Element> instead of a wrapping parent
 *   — you get the children without the container.
 *
 * WHAT `remarkGfm` DOES:
 *
 *   remark is the markdown parser react-markdown uses internally. By
 *   default it only understands CommonMark — the minimal markdown spec.
 *
 *   GFM (GitHub-Flavored Markdown) is a SUPERSET that adds:
 *     - Tables (| col1 | col2 | syntax)
 *     - Strikethrough (~~text~~)
 *     - Task lists (- [ ] and - [x])
 *     - Autolink literals (bare URLs become <a>)
 *     - Footnotes ([^1])
 *
 *   Without the plugin, a markdown table renders as raw `| col | col |`
 *   text. Pass plugins as an array so you can stack them:
 *     remarkPlugins={[remarkGfm, remarkToc, remarkMath]}
 *
 *   Java analogue: a parser extension / dialect. Base SQL doesn't know
 *   JSON operators; the postgresql driver adds them. Same idea — the
 *   plugin teaches the parser new syntax.
 *
 * THE MAIN MarkdownRenderer FUNCTION:
 *
 *   A thin wrapper that hands markdown + plugins + components to
 *   <ReactMarkdown>. Note that `{content}` between the tags is JSX
 *   children — which IS a prop named `children`. These are equivalent:
 *     <ReactMarkdown>{content}</ReactMarkdown>
 *     <ReactMarkdown children={content} />
 *
 *   react-markdown expects the markdown string as its `children` prop.
 *
 * ============================================================================
 */
