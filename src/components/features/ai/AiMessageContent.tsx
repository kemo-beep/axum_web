import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CodeBlock } from './CodeBlock'

type AiMessageContentProps = {
  content: string
}

export function AiMessageContent({ content }: AiMessageContentProps) {
  return (
    <div className="prose prose-sm max-w-none prose-p:my-2 prose-p:leading-relaxed prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-headings:my-3 prose-headings:font-semibold prose-strong:font-semibold prose-code:rounded prose-code:bg-muted/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-medium prose-code:before:content-none prose-code:after:content-none prose-pre:bg-transparent prose-pre:p-0 prose-pre:my-0 prose-pre:border-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre({ children }) {
            const codeEl = Array.isArray(children)
              ? (children[0] as React.ReactElement & {
                  props?: { children?: unknown; className?: string }
                })
              : (children as React.ReactElement & {
                  props?: { children?: unknown; className?: string }
                })
            const code = codeEl?.props?.children
            const codeClassName = codeEl?.props?.className
            const codeStr =
              typeof code === 'string'
                ? code
                : Array.isArray(code)
                  ? code.join('')
                  : String(code ?? '')
            return <CodeBlock className={codeClassName}>{codeStr}</CodeBlock>
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
