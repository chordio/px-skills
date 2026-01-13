import { getRecentResults, getSkillSummary } from "@/lib/db/queries";

export default async function Dashboard() {
  const results = await getRecentResults();
  const summary = await getSkillSummary();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Eval Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Compare skill performance: with Chordio vs baseline Claude
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((skill) => (
          <div
            key={skill.name}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-sm font-medium text-gray-500">{skill.name}</h3>
            <div className="mt-2 flex items-baseline">
              <span className="text-2xl font-semibold text-gray-900">
                {skill.avgDelta > 0 ? "+" : ""}
                {(skill.avgDelta * 100).toFixed(0)}%
              </span>
              <span className="ml-2 text-sm text-gray-500">avg improvement</span>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              {skill.totalRuns} runs | {skill.tasksCount} tasks
            </p>
          </div>
        ))}
      </div>

      {/* Results Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Results</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Skill
                </th>
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
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {results.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No eval results yet. Run your first eval to see results here.
                  </td>
                </tr>
              ) : (
                results.map((result) => (
                  <tr key={result.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {result.skill}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {result.task}
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
                      {result.model}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(result.timestamp).toLocaleDateString()}
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
