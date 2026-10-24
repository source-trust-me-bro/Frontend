import ReactMarkdown, { type Components } from "react-markdown";

// The story card owns the h2 headline, so headings inside a story start one level lower.
const components: Components = {
  h1: ({ children }) => <h3>{children}</h3>,
  h2: ({ children }) => <h3>{children}</h3>,
  h3: ({ children }) => <h3>{children}</h3>,
  h4: ({ children }) => <h4>{children}</h4>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
};

/**
 * Renders a story's markdown. Raw HTML in the text is never rendered, so a story can only
 * produce the formatting markdown itself allows.
 */
export function Markdown({ text }: { text: string }) {
  return <ReactMarkdown components={components}>{text}</ReactMarkdown>;
}
