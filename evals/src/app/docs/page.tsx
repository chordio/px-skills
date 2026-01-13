export default function DocsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Chordio Evals Documentation
        </h1>
        <p className="mt-2 text-gray-600 max-w-2xl">
          This evaluation framework measures how much Chordio skills improve Claude&apos;s
          design outputs compared to baseline Claude without skills.
        </p>
      </div>

      {/* Methodology Section */}
      <section className="space-y-6">
        <h2 className="text-lg font-medium text-gray-900">Evaluation Methodology</h2>

        <div className="grid gap-4 md:grid-cols-3">
          {/* A/B Comparison Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-medium text-gray-900 mb-3">A/B Comparison</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex gap-2">
                <span className="text-green-600 font-medium">With Skill:</span>
                <span>Full skill context + fixtures</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 font-medium">Baseline:</span>
                <span>Minimal prompt + same fixtures</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Delta shows percentage improvement
            </p>
          </div>

          {/* Fixtures Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Test Fixtures</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">minimal/</code>
                <span className="text-gray-600">Product context only</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">with-system/</code>
                <span className="text-gray-600">+ tokens, typography</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">full/</code>
                <span className="text-gray-600">+ journeys, components</span>
              </div>
            </div>
          </div>

          {/* Grading Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Grading</h3>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li>Model-based (Claude grading Claude)</li>
              <li>0-3 scale per dimension</li>
              <li>0-15 total for partial credit</li>
              <li>Includes negative test cases</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="space-y-6">
        <h2 className="text-lg font-medium text-gray-900">Skills</h2>

        {/* design-spec-writer */}
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">design-spec-writer</h3>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Tests context-aware spec generation. Measures UX drift prevention by
              respecting existing patterns and user journeys.
            </p>
          </div>

          <div className="p-5 space-y-5">
            {/* Rubric */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Rubric Dimensions</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                      <th className="pb-2 pr-4 font-medium">Dimension</th>
                      <th className="pb-2 px-3 font-medium text-center w-28">0</th>
                      <th className="pb-2 px-3 font-medium text-center w-32">1</th>
                      <th className="pb-2 px-3 font-medium text-center w-36">2</th>
                      <th className="pb-2 pl-3 font-medium text-center w-40">3</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-t border-gray-100">
                      <td className="py-2.5 pr-4 font-medium text-gray-900">Completeness</td>
                      <td className="py-2.5 px-3 text-center text-xs">Missing sections</td>
                      <td className="py-2.5 px-3 text-center text-xs">Structure, incomplete</td>
                      <td className="py-2.5 px-3 text-center text-xs">Strategic + impl, minor gaps</td>
                      <td className="py-2.5 pl-3 text-center text-xs">All sections complete</td>
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td className="py-2.5 pr-4 font-medium text-gray-900">Specificity</td>
                      <td className="py-2.5 px-3 text-center text-xs">Vague, generic</td>
                      <td className="py-2.5 px-3 text-center text-xs">Some specifics</td>
                      <td className="py-2.5 px-3 text-center text-xs">Mostly specific</td>
                      <td className="py-2.5 pl-3 text-center text-xs">Exact measurements, states</td>
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td className="py-2.5 pr-4 font-medium text-gray-900">Token Refs</td>
                      <td className="py-2.5 px-3 text-center text-xs">Hardcoded values</td>
                      <td className="py-2.5 px-3 text-center text-xs">Mix</td>
                      <td className="py-2.5 px-3 text-center text-xs">Mostly tokens</td>
                      <td className="py-2.5 pl-3 text-center text-xs">All reference tokens</td>
                    </tr>
                    <tr className="border-t border-gray-100 bg-amber-50/50">
                      <td className="py-2.5 pr-4 font-medium text-gray-900">
                        Pattern Adherence
                        <span className="text-amber-600 text-xs ml-1">*</span>
                      </td>
                      <td className="py-2.5 px-3 text-center text-xs">Unnecessary new patterns</td>
                      <td className="py-2.5 px-3 text-center text-xs">Partial reuse</td>
                      <td className="py-2.5 px-3 text-center text-xs">Good reuse, minor gaps</td>
                      <td className="py-2.5 pl-3 text-center text-xs">Leverages existing</td>
                    </tr>
                    <tr className="border-t border-gray-100 bg-amber-50/50">
                      <td className="py-2.5 pr-4 font-medium text-gray-900">
                        Journey Awareness
                        <span className="text-amber-600 text-xs ml-1">*</span>
                      </td>
                      <td className="py-2.5 px-3 text-center text-xs">Isolated page thinking</td>
                      <td className="py-2.5 px-3 text-center text-xs">Mentions context</td>
                      <td className="py-2.5 px-3 text-center text-xs">Considers adjacent flows</td>
                      <td className="py-2.5 pl-3 text-center text-xs">Optimizes for journey</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-amber-600">
                * Only applies with with-system or full fixtures
              </p>
            </div>

            {/* Test Tasks */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Test Tasks</h4>
              <div className="grid gap-2 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded border border-gray-200 px-3 py-2">
                  <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">minimal</code>
                  <span className="text-sm text-gray-700">Login Form</span>
                </div>
                <div className="flex items-center gap-3 rounded border border-gray-200 px-3 py-2">
                  <code className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">with-system</code>
                  <span className="text-sm text-gray-700">Dashboard Widget</span>
                </div>
                <div className="flex items-center gap-3 rounded border border-gray-200 px-3 py-2">
                  <code className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">full</code>
                  <span className="text-sm text-gray-700">Edit Profile Form</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Skills */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium text-gray-500">design-reviewer</h3>
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                Coming Soon
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Tests visual review accuracy using screenshots with known issues.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium text-gray-500">review-panel</h3>
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                Coming Soon
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Tests expert panel selection and synthesis quality.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="space-y-6">
        <h2 className="text-lg font-medium text-gray-900">Workflow</h2>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Versioning */}
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Versioning</h3>
            <p className="text-sm text-gray-600">
              Eval definitions are versioned in <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">evals.json</code> and
              tracked via git. Each run stores the commit SHA for exact config reconstruction.
            </p>
          </div>

          {/* Adding New Evals */}
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Adding New Evals</h3>
            <ol className="text-sm text-gray-600 space-y-1.5 list-decimal list-inside">
              <li>Add task definition to <code className="text-xs bg-gray-100 px-1 rounded">evals.json</code></li>
              <li>Create or select appropriate fixture</li>
              <li>Update rubric if new dimensions needed</li>
              <li>Run evals to validate</li>
              <li>Commit with version bump</li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
