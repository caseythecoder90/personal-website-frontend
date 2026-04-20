import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  /** Language identifier from the fenced code block (e.g. "java", "typescript"). Empty string means no highlighting. */
  language: string;
  /** Optional filename shown in the header strip. Format support: ```java:Foo.java or ```java title="Foo.java" */
  filename?: string;
  children: string;
}

export function CodeBlock({ language, filename, children }: CodeBlockProps) {
  const displayLang = language || 'text';
  const code = children.replace(/\n$/, '');

  return (
    <div className="my-8 rounded-lg overflow-hidden bg-surface-container-lowest">
      <div className="flex items-center justify-between px-4 py-2 bg-surface-container-highest/50">
        <span className="text-xs font-mono text-on-surface-variant uppercase tracking-wider">
          {filename ?? ' '}
        </span>
        <span className="text-xs text-primary/70 uppercase tracking-wide">
          {displayLang}
        </span>
      </div>
      <SyntaxHighlighter
        language={displayLang}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: '1.5rem',
          background: 'transparent',
          fontSize: '0.875rem',
          lineHeight: 1.6,
        }}
        codeTagProps={{ style: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
