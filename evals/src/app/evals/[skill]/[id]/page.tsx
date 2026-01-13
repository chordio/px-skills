import { notFound } from "next/navigation";
import Link from "next/link";
import { getEvalRunById } from "@/lib/db/queries";

interface Props {
  params: Promise<{ skill: string; id: string }>;
}

export default async function EvalResultDetailPage({ params }: Props) {
  const { skill, id } = await params;
  const result = await getEvalRunById(id);

  if (!result || result.skill !== skill) {
    notFound();
  }

  // Parse grader reasoning into sections
  const parseReasoning = (reasoning: string | null) => {
    if (!reasoning) return { withSkill: "", baseline: "" };

    const parts = reasoning.split(/\n\nBaseline:/i);
    return {
      withSkill: parts[0]?.replace(/^With skill:\s*/i, "").trim() || "",
      baseline: parts[1]?.trim() || "",
    };
  };

  const { withSkill, baseline } = parseReasoning(result.graderReasoning);

  // Parse dimension scores from baseline text (e.g., "COMPLETENESS (3):")
  const parseDimensionScores = (text: string) => {
    const regex = /(\w+)\s*\((\d)\):\s*([^A-Z]+(?=[A-Z]|$))/gi;
    const dimensions: { name: string; score: number; description: string }[] = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      dimensions.push({
        name: match[1].toLowerCase().replace(/_/g, " "),
        score: parseInt(match[2]),
        description: match[3].trim(),
      });
    }
    return dimensions;
  };

  const baselineDimensions = parseDimensionScores(baseline);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href={`/evals/${skill}`}
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          &larr; Back to {skill.replace(/-/g, " ")}
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          {result.task.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Result
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {new Date(result.timestamp).toLocaleString()} · {result.model}
        </p>
      </div>

      {/* Score Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm font-medium text-gray-500">With Skill</div>
          <div className="mt-1 text-3xl font-bold text-gray-900">
            {result.scoreWithSkill.toFixed(1)}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm font-medium text-gray-500">Baseline</div>
          <div className="mt-1 text-3xl font-bold text-gray-900">
            {result.scoreBaseline.toFixed(1)}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm font-medium text-gray-500">Delta</div>
          <div
            className={`mt-1 text-3xl font-bold ${
              result.delta > 0
                ? "text-green-600"
                : result.delta < 0
                ? "text-red-600"
                : "text-gray-900"
            }`}
          >
            {result.delta > 0 ? "+" : ""}
            {(result.delta * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Grader Analysis */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* With Skill Analysis */}
        <div className="rounded-lg border border-green-200 bg-green-50 shadow-sm">
          <div className="border-b border-green-200 px-6 py-4">
            <h2 className="text-lg font-medium text-green-900">With Skill Analysis</h2>
            <div className="mt-1 text-2xl font-bold text-green-700">
              {result.scoreWithSkill.toFixed(1)}
            </div>
          </div>
          <div className="px-6 py-4">
            <p className="text-sm text-green-800 whitespace-pre-wrap">{withSkill || "No detailed analysis available"}</p>
          </div>
        </div>

        {/* Baseline Analysis */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">Baseline Analysis</h2>
            <div className="mt-1 text-2xl font-bold text-gray-700">
              {result.scoreBaseline.toFixed(1)}
            </div>
          </div>
          <div className="px-6 py-4">
            {baselineDimensions.length > 0 ? (
              <div className="space-y-4">
                {baselineDimensions.map((dim) => (
                  <div key={dim.name} className="border-b border-gray-200 pb-3 last:border-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 capitalize">{dim.name}</span>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          dim.score >= 2
                            ? "bg-green-100 text-green-800"
                            : dim.score === 1
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {dim.score}/3
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{dim.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{baseline || "No detailed analysis available"}</p>
            )}
          </div>
        </div>
      </div>

      {/* Raw Outputs (Collapsible) */}
      <div className="space-y-4">
        <details className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <summary className="cursor-pointer px-6 py-4 text-lg font-medium text-gray-900 hover:bg-gray-50">
            Raw Output (With Skill)
          </summary>
          <div className="border-t border-gray-200 px-6 py-4">
            <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded">
              {result.rawOutputWith || "No raw output available"}
            </pre>
          </div>
        </details>

        <details className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <summary className="cursor-pointer px-6 py-4 text-lg font-medium text-gray-900 hover:bg-gray-50">
            Raw Output (Baseline)
          </summary>
          <div className="border-t border-gray-200 px-6 py-4">
            <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded">
              {result.rawOutputBaseline || "No raw output available"}
            </pre>
          </div>
        </details>
      </div>
    </div>
  );
}
