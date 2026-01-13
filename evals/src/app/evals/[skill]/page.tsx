import { notFound } from "next/navigation";
import Link from "next/link";
import { getResultsBySkill } from "@/lib/db/queries";
import { getEvalsConfig } from "@/lib/evals-config";

interface Props {
  params: Promise<{ skill: string }>;
}

export default async function SkillDetailPage({ params }: Props) {
  const { skill } = await params;
  const evalsConfig = getEvalsConfig();
  const skillConfig = evalsConfig.skills[skill];

  if (!skillConfig) {
    notFound();
  }

  const results = await getResultsBySkill(skill);

  // Calculate stats
  const totalRuns = results.length;
  const avgWithSkill =
    totalRuns > 0
      ? results.reduce((sum, r) => sum + r.scoreWithSkill, 0) / totalRuns
      : 0;
  const avgBaseline =
    totalRuns > 0
      ? results.reduce((sum, r) => sum + r.scoreBaseline, 0) / totalRuns
      : 0;
  const avgDelta =
    totalRuns > 0 ? results.reduce((sum, r) => sum + r.delta, 0) / totalRuns : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {skill.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{skillConfig.description}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm font-medium text-gray-500">Total Runs</div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">
            {totalRuns}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm font-medium text-gray-500">
            Avg With Skill
          </div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">
            {avgWithSkill.toFixed(1)}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm font-medium text-gray-500">Avg Baseline</div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">
            {avgBaseline.toFixed(1)}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm font-medium text-gray-500">Avg Delta</div>
          <div
            className={`mt-1 text-2xl font-semibold ${
              avgDelta > 0
                ? "text-green-600"
                : avgDelta < 0
                ? "text-red-600"
                : "text-gray-900"
            }`}
          >
            {avgDelta > 0 ? "+" : ""}
            {(avgDelta * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Tasks</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {skillConfig.tasks.map((task) => (
            <div key={task.id} className="px-6 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {task.id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{task.prompt}</p>
                  <span className="mt-2 inline-flex rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                    Fixture: {task.fixture}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rubric */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Rubric Dimensions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Dimension
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  0
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  1
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  2
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  3
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  Completeness
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Missing sections
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Structure but incomplete
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Both sections, minor gaps
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Complete
                </td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  Specificity
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">Vague</td>
                <td className="px-6 py-4 text-sm text-gray-500">Some specifics</td>
                <td className="px-6 py-4 text-sm text-gray-500">Mostly specific</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Exact measurements
                </td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  Token Refs
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">Hardcoded values</td>
                <td className="px-6 py-4 text-sm text-gray-500">Mix</td>
                <td className="px-6 py-4 text-sm text-gray-500">Mostly tokens</td>
                <td className="px-6 py-4 text-sm text-gray-500">All tokens</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  Pattern Adherence*
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">New patterns</td>
                <td className="px-6 py-4 text-sm text-gray-500">Partial reuse</td>
                <td className="px-6 py-4 text-sm text-gray-500">Good reuse</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Leverages existing
                </td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  Journey Awareness*
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">Isolated</td>
                <td className="px-6 py-4 text-sm text-gray-500">Mentions context</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Considers adjacent
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Optimizes journey
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 text-xs text-gray-500">
          * Only scored when fixture includes relevant context
        </div>
      </div>

      {/* Recent Results */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Results</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  With Skill
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Baseline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Delta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {results.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No results yet. Run evals to see results here.
                  </td>
                </tr>
              ) : (
                results.slice(0, 20).map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      <Link href={`/evals/${skill}/${result.id}`} className="hover:text-blue-600">
                        {result.task}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {result.scoreWithSkill.toFixed(1)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {result.scoreBaseline.toFixed(1)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          result.delta > 0
                            ? "bg-green-100 text-green-800"
                            : result.delta < 0
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {result.delta > 0 ? "+" : ""}
                        {(result.delta * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(result.timestamp).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-blue-600">
                      <Link href={`/evals/${skill}/${result.id}`}>
                        View &rarr;
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
