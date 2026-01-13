import Link from "next/link";

const EVALS = [
  {
    id: "design-spec-writer",
    name: "Design Spec Writer",
    description: "Tests context-aware spec generation",
    tasks: [
      { id: "login-form", name: "Login Form", fixture: "minimal" },
      { id: "dashboard-widget", name: "Dashboard Widget", fixture: "with-system" },
      { id: "edit-profile", name: "Edit Profile Form", fixture: "full" },
    ],
    dimensions: [
      "completeness",
      "specificity",
      "token_refs",
      "pattern_adherence",
      "journey_awareness",
    ],
    status: "active",
  },
  {
    id: "design-reviewer",
    name: "Design Reviewer",
    description: "Tests visual review accuracy",
    tasks: [
      { id: "contrast-issue", name: "Contrast Issue", fixture: "screenshot" },
      { id: "truncation-bug", name: "Truncation Bug", fixture: "screenshot" },
      { id: "clean-design", name: "Clean Design (negative)", fixture: "screenshot" },
      { id: "multi-viewport", name: "Multi-Viewport", fixture: "screenshot" },
    ],
    dimensions: ["issue_detection", "false_positive_rate", "severity_accuracy"],
    status: "coming-soon",
  },
  {
    id: "review-panel",
    name: "Review Panel",
    description: "Tests expert panel selection and synthesis",
    tasks: [
      { id: "mobile-app", name: "Mobile App Review", fixture: "design" },
      { id: "landing-page", name: "Landing Page", fixture: "design" },
      { id: "dashboard", name: "Dashboard", fixture: "design" },
      { id: "synthesis", name: "Synthesis Quality", fixture: "design" },
    ],
    dimensions: ["expert_selection", "critique_distinctiveness", "synthesis_quality"],
    status: "coming-soon",
  },
];

export default function EvalsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Eval Catalog</h1>
        <p className="mt-1 text-sm text-gray-500">
          All available evaluations and their configurations
        </p>
      </div>

      <div className="grid gap-6">
        {EVALS.map((evalConfig) => (
          <div
            key={evalConfig.id}
            className="rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    {evalConfig.name}
                  </h2>
                  <p className="text-sm text-gray-500">{evalConfig.description}</p>
                </div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    evalConfig.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {evalConfig.status === "active" ? "Active" : "Coming Soon"}
                </span>
              </div>
            </div>

            <div className="px-6 py-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Tasks</h3>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {evalConfig.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded border border-gray-200 px-3 py-2"
                  >
                    <div className="font-medium text-gray-900 text-sm">
                      {task.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Fixture: {task.fixture}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Rubric Dimensions
              </h3>
              <div className="flex flex-wrap gap-2">
                {evalConfig.dimensions.map((dim) => (
                  <span
                    key={dim}
                    className="inline-flex rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                  >
                    {dim.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>

            {evalConfig.status === "active" && (
              <div className="border-t border-gray-200 px-6 py-4">
                <Link
                  href={`/evals/${evalConfig.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View Details &rarr;
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
