import ReactMarkdown from "react-markdown";

// Test component to debug markdown rendering
const testMarkdown = `# Skills Gap Analysis

| Area | Gap / Needs Improvement | Why it matters for the JD |
|------|--------------------------|---------------------------|
| CI/CD tooling | No concrete mention of Jenkins or CircleCI. | The JD lists them explicitly as must‑have. |
| Scripting emphasis | Python & Ruby listed but not highlighted as core technical skill. | Scripting is the first bullet in the JD – placing it near the top signals relevance. |

## Experience Alignment

| Current bullet | Suggested rewrite | How it maps to the JD |
|-----------------|-------------------|------------------------|
| Built a framework to benchmark | Implemented a Python/Bash data‑benchmarking framework | Shows scripting, database work, and measurable impact. |

### Quick Action List

- Add Job‑Targeted Keywords
- Quantify Results  
- Re‑order Summary
- **Bold important items**
- *Emphasize key points*
`;

export default function DebugMarkdown() {
  return (
    <div className="p-8">
      <ReactMarkdown 
        components={{
          h1: ({children}) => <h1 className="text-2xl font-bold text-gray-900 mb-4">{children}</h1>,
          h2: ({children}) => <h2 className="text-xl font-semibold text-gray-900 mb-3 mt-6">{children}</h2>,
          h3: ({children}) => <h3 className="text-lg font-medium text-gray-900 mb-2 mt-4">{children}</h3>,
          table: ({children}) => (
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({children}) => <thead className="bg-gray-50">{children}</thead>,
          tbody: ({children}) => <tbody className="divide-y divide-gray-200">{children}</tbody>,
          tr: ({children}) => <tr className="hover:bg-gray-50 transition-colors">{children}</tr>,
          th: ({children}) => <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-300">{children}</th>,
          td: ({children}) => <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">{children}</td>,
          ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
          li: ({children}) => <li className="text-gray-700">{children}</li>,
          strong: ({children}) => <strong className="font-semibold text-gray-900 bg-yellow-100 px-1 rounded">{children}</strong>,
          em: ({children}) => <em className="italic text-blue-600">{children}</em>,
        }}
      >
        {testMarkdown}
      </ReactMarkdown>
    </div>
  );
}