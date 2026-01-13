"use client";

import { useState } from "react";

interface EvalProgress {
  skill: string;
  task: string;
  status: "pending" | "running" | "complete" | "error";
  scoreWithSkill?: number;
  scoreBaseline?: number;
  delta?: number;
  error?: string;
}

const SKILLS = [
  {
    id: "design-spec-writer",
    name: "Design Spec Writer",
    tasks: ["login-form", "dashboard-widget", "edit-profile"],
  },
  {
    id: "design-reviewer",
    name: "Design Reviewer",
    tasks: ["contrast-issue", "truncation-bug", "clean-design", "multi-viewport"],
    disabled: true,
  },
  {
    id: "review-panel",
    name: "Review Panel",
    tasks: ["mobile-app", "landing-page", "dashboard", "synthesis"],
    disabled: true,
  },
];

export default function RunPage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<EvalProgress[]>([]);

  const handleSkillToggle = (skillId: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((s) => s !== skillId)
        : [...prev, skillId]
    );
  };

  const handleRunEvals = async () => {
    if (selectedSkills.length === 0) return;

    setRunning(true);
    setProgress([]);

    // Initialize progress for all selected tasks
    const initialProgress: EvalProgress[] = [];
    for (const skillId of selectedSkills) {
      const skill = SKILLS.find((s) => s.id === skillId);
      if (skill) {
        for (const task of skill.tasks) {
          initialProgress.push({
            skill: skillId,
            task,
            status: "pending",
          });
        }
      }
    }
    setProgress(initialProgress);

    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: selectedSkills }),
      });

      if (!response.ok) {
        throw new Error("Failed to run evals");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              setProgress((prev) =>
                prev.map((p) =>
                  p.skill === data.skill && p.task === data.task
                    ? { ...p, ...data }
                    : p
                )
              );
            } catch {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (error) {
      console.error("Error running evals:", error);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Run Evaluations</h1>
        <p className="mt-1 text-sm text-gray-500">
          Select skills to evaluate and compare with baseline Claude
        </p>
      </div>

      {/* Skill Selection */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Select Skills</h2>
        <div className="space-y-4">
          {SKILLS.map((skill) => (
            <label
              key={skill.id}
              className={`flex items-start space-x-3 ${
                skill.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedSkills.includes(skill.id)}
                onChange={() => !skill.disabled && handleSkillToggle(skill.id)}
                disabled={skill.disabled || running}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-900">{skill.name}</span>
                <p className="text-sm text-gray-500">
                  {skill.tasks.length} tasks
                  {skill.disabled && " (coming soon)"}
                </p>
              </div>
            </label>
          ))}
        </div>
        <div className="mt-6">
          <button
            onClick={handleRunEvals}
            disabled={selectedSkills.length === 0 || running}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {running ? (
              <>
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Running...
              </>
            ) : (
              "Run Selected Evals"
            )}
          </button>
        </div>
      </div>

      {/* Progress */}
      {progress.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">Progress</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {progress.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between px-6 py-4">
                <div>
                  <span className="font-medium text-gray-900">{p.skill}</span>
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-600">{p.task}</span>
                </div>
                <div className="flex items-center space-x-4">
                  {p.status === "complete" && p.scoreWithSkill !== undefined && (
                    <div className="text-sm">
                      <span className="text-gray-900">
                        {p.scoreWithSkill.toFixed(1)}
                      </span>
                      <span className="text-gray-400 mx-1">vs</span>
                      <span className="text-gray-500">
                        {p.scoreBaseline?.toFixed(1)}
                      </span>
                      <span
                        className={`ml-2 inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          (p.delta ?? 0) > 0
                            ? "bg-green-100 text-green-800"
                            : (p.delta ?? 0) < 0
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {(p.delta ?? 0) > 0 ? "+" : ""}
                        {((p.delta ?? 0) * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                  <StatusBadge status={p.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: EvalProgress["status"] }) {
  const styles = {
    pending: "bg-gray-100 text-gray-800",
    running: "bg-blue-100 text-blue-800",
    complete: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 ${styles[status]}`}
    >
      {status === "running" && (
        <svg
          className="mr-1 h-3 w-3 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {status}
    </span>
  );
}
