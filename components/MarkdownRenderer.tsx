"use client"
import React, { memo } from "react"
import dynamic from "next/dynamic"

// Dynamically import heavy markdown libraries
const ReactMarkdown = dynamic(() => import("react-markdown"), {
  loading: () => <div className="animate-pulse bg-muted/20 rounded h-4 w-full" />,
})

const SyntaxHighlighter = dynamic(
  () => import("react-syntax-highlighter").then((mod) => mod.Prism),
  {
    loading: () => <div className="animate-pulse bg-muted/30 rounded h-20 w-full" />,
  }
)

// Import style lazily
let oneDarkStyle: any = null
const loadStyle = async () => {
  if (!oneDarkStyle) {
    const module = await import("react-syntax-highlighter/dist/esm/styles/prism")
    oneDarkStyle = module.oneDark
  }
  return oneDarkStyle
}

interface MarkdownRendererProps {
  content: string
  theme?: string
}

const MarkdownRenderer = memo(({ content, theme }: MarkdownRendererProps) => {
  const [style, setStyle] = React.useState<any>(null)

  React.useEffect(() => {
    loadStyle().then(setStyle)
  }, [])

  return (
    <div className="markdown-content">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "")
            const codeString = String(children).replace(/\n$/, "")
            
            if (!inline && match && style) {
              return (
                <SyntaxHighlighter
                  style={style}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    backgroundColor: "rgba(0, 20, 0, 0.9)",
                    borderRadius: "0.5rem",
                    padding: "1rem",
                    fontSize: "0.875rem",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                  }}
                  {...props}
                >
                  {codeString}
                </SyntaxHighlighter>
              )
            }
            
            return (
              <code
                className="bg-green-950/60 text-green-300 px-1.5 py-0.5 rounded text-sm border border-green-800/30"
                {...props}
              >
                {children}
              </code>
            )
          },
          p({ children }: any) {
            return <p className="mb-3 leading-relaxed text-green-100">{children}</p>
          },
          ul({ children }: any) {
            return <ul className="list-disc list-inside mb-3 space-y-1 text-green-100">{children}</ul>
          },
          ol({ children }: any) {
            return <ol className="list-decimal list-inside mb-3 space-y-1 text-green-100">{children}</ol>
          },
          li({ children }: any) {
            return <li className="ml-2 text-green-100">{children}</li>
          },
          h1({ children }: any) {
            return <h1 className="text-2xl font-bold mb-3 text-green-50 border-b border-green-800/40 pb-2">{children}</h1>
          },
          h2({ children }: any) {
            return <h2 className="text-xl font-bold mb-3 text-green-50">{children}</h2>
          },
          h3({ children }: any) {
            return <h3 className="text-lg font-semibold mb-2 text-green-50">{children}</h3>
          },
          blockquote({ children }: any) {
            return (
              <blockquote className="border-l-4 border-green-600/50 pl-4 italic mb-3 text-green-200 bg-green-950/30 py-2 rounded-r">
                {children}
              </blockquote>
            )
          },
          a({ href, children }: any) {
            return (
              <a
                href={href}
                className="text-green-400 hover:text-green-300 underline decoration-green-600 hover:decoration-green-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            )
          },
          strong({ children }: any) {
            return <strong className="font-bold text-green-50">{children}</strong>
          },
          em({ children }: any) {
            return <em className="italic text-green-200">{children}</em>
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
})

MarkdownRenderer.displayName = "MarkdownRenderer"

export default MarkdownRenderer
