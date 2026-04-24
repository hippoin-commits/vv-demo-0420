/**
 * 规范正文子集 Markdown：`**加粗**`、`-` / 嵌套 `-` 列表、`1.` 有序列表、`>` 引用、单独一行的 `---`。
 * 用于 `interactionRulesSpecData.ts` 的 `body` 字段，避免引入额外依赖。
 */
import * as React from "react"

type LiNode = { text: string; sub?: LiNode[] }

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/\*\*/)
  if (parts.length === 1) return text
  const out: React.ReactNode[] = []
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      if (parts[i]) out.push(parts[i])
    } else {
      out.push(
        <strong key={i} className="font-[var(--font-weight-semibold)] text-text">
          {parts[i]}
        </strong>,
      )
    }
  }
  return out.length ? out : text
}

function flatUlToTree(items: { indent: number; text: string }[]): LiNode[] {
  const root: LiNode[] = []
  const stack: { depth: number; items: LiNode[] }[] = [{ depth: -1, items: root }]

  for (const it of items) {
    const d = Math.floor(it.indent / 2)
    while (stack.length > 0 && stack[stack.length - 1]!.depth >= d) {
      stack.pop()
    }
    const top = stack[stack.length - 1]!
    const node: LiNode = { text: it.text, sub: [] }
    top.items.push(node)
    stack.push({ depth: d, items: node.sub! })
  }

  function stripEmptySub(n: LiNode) {
    if (n.sub?.length === 0) delete n.sub
    n.sub?.forEach(stripEmptySub)
  }
  root.forEach(stripEmptySub)
  return root
}

function UlTree({ nodes }: { nodes: LiNode[] }) {
  return (
    <ul className="my-[length:var(--space-200)] list-disc space-y-[length:var(--space-200)] pl-[1.25em] marker:text-text-tertiary">
      {nodes.map((n, i) => (
        <li key={i} className="leading-relaxed">
          {renderInline(n.text)}
          {n.sub?.length ? (
            <div className="mt-[length:var(--space-200)]">
              <UlTree nodes={n.sub} />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  )
}

type Block =
  | { type: "p"; lines: string[] }
  | { type: "ul"; items: { indent: number; text: string }[] }
  | { type: "ol"; items: string[] }
  | { type: "blockquote"; lines: string[] }
  | { type: "hr" }

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.split(/\r?\n/)
  const blocks: Block[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]!
    if (line.trim() === "") {
      i++
      continue
    }

    if (/^---+\s*$/.test(line.trim())) {
      blocks.push({ type: "hr" })
      i++
      continue
    }

    if (/^>\s?/.test(line)) {
      const q: string[] = []
      while (i < lines.length && /^>\s?/.test(lines[i]!)) {
        q.push(lines[i]!.replace(/^>\s?/, ""))
        i++
      }
      blocks.push({ type: "blockquote", lines: q })
      continue
    }

    const ulMatch = /^(\s*)-\s+(.*)$/.exec(line)
    if (ulMatch) {
      const items: { indent: number; text: string }[] = []
      while (i < lines.length) {
        const m = /^(\s*)-\s+(.*)$/.exec(lines[i]!)
        if (!m) break
        let text = m[2]!
        const indent = m[1]!.length
        i++
        while (i < lines.length) {
          const t = lines[i]!
          if (t.trim() === "") break
          if (/^---+\s*$/.test(t.trim())) break
          if (/^>\s?/.test(t)) break
          if (/^(\s*)-\s+/.test(t)) break
          if (/^\s*\d+\.\s+/.test(t)) break
          text += "\n" + t.trim()
          i++
        }
        items.push({ indent, text })
      }
      blocks.push({ type: "ul", items })
      continue
    }

    const olMatch = /^\s*\d+\.\s+(.*)$/.exec(line)
    if (olMatch) {
      const items: string[] = []
      while (i < lines.length) {
        const m = /^\s*\d+\.\s+(.*)$/.exec(lines[i]!)
        if (m) {
          items.push(m[1]!)
          i++
          continue
        }
        const t = lines[i]!
        if (t.trim() === "") {
          i++
          break
        }
        if (/^---+\s*$/.test(t.trim())) break
        if (/^>\s?/.test(t)) break
        if (/^(\s*)-\s+/.test(t)) break
        if (/^\s*\d+\.\s+/.test(t)) break
        if (items.length) {
          items[items.length - 1] += "\n" + t.trim()
          i++
        } else {
          break
        }
      }
      blocks.push({ type: "ol", items })
      continue
    }

    const paras: string[] = [line]
    i++
    while (i < lines.length) {
      const t = lines[i]!
      if (t.trim() === "") break
      if (/^---+\s*$/.test(t.trim())) break
      if (/^>\s?/.test(t)) break
      if (/^(\s*)-\s+/.test(t)) break
      if (/^\s*\d+\.\s+/.test(t)) break
      paras.push(t)
      i++
    }
    blocks.push({ type: "p", lines: paras })
  }

  return blocks
}

export function SpecDocBody({ markdown }: { markdown: string }) {
  const blocks = React.useMemo(() => parseBlocks(markdown), [markdown])

  return (
    <div className="text-[length:var(--font-size-sm)] font-[var(--font-weight-regular)] leading-relaxed text-text-secondary">
      {blocks.map((b, idx) => {
        if (b.type === "hr") {
          return (
            <hr
              key={`hr-${idx}`}
              className="my-[length:var(--space-400)] border-0 border-t border-border/60"
            />
          )
        }
        if (b.type === "blockquote") {
          return (
            <blockquote
              key={`q-${idx}`}
              className="my-[length:var(--space-300)] border-l-2 border-primary/35 bg-[var(--black-alpha-11)] py-[length:var(--space-200)] pl-[length:var(--space-400)] pr-[length:var(--space-300)] text-text-secondary"
            >
              {b.lines.map((ln, j) => (
                <p key={j} className={j ? "mt-[length:var(--space-150)]" : ""}>
                  {renderInline(ln)}
                </p>
              ))}
            </blockquote>
          )
        }
        if (b.type === "ul") {
          return <UlTree key={`ul-${idx}`} nodes={flatUlToTree(b.items)} />
        }
        if (b.type === "ol") {
          return (
            <ol
              key={`ol-${idx}`}
              className="my-[length:var(--space-200)] list-decimal space-y-[length:var(--space-200)] pl-[1.35em] marker:text-text-tertiary"
            >
              {b.items.map((it, j) => {
                const segs = it.split("\n")
                return (
                  <li key={j} className="leading-relaxed">
                    {segs.map((seg, k) =>
                      k === 0 ? (
                        <React.Fragment key={k}>{renderInline(seg)}</React.Fragment>
                      ) : (
                        <p key={k} className="mt-[length:var(--space-150)]">
                          {renderInline(seg)}
                        </p>
                      ),
                    )}
                  </li>
                )
              })}
            </ol>
          )
        }
        return (
          <div key={`p-${idx}`} className="my-[length:var(--space-200)] first:mt-0 last:mb-0">
            {b.lines.map((ln, j) => (
              <p key={j} className={j ? "mt-[length:var(--space-200)]" : ""}>
                {renderInline(ln)}
              </p>
            ))}
          </div>
        )
      })}
    </div>
  )
}
