import { NextRequest } from "next/server";
import { runSpecWriterEval } from "@/lib/runner/spec-writer";
import { getEvalsConfig } from "@/lib/evals-config";
import { insertEvalRun } from "@/lib/db/queries";
import { execSync } from "child_process";

function getGitSha(): string {
  try {
    return execSync("git rev-parse HEAD", { encoding: "utf-8" }).trim().slice(0, 7);
  } catch {
    return "unknown";
  }
}

export async function POST(request: NextRequest) {
  const { skills } = await request.json();

  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    return new Response(JSON.stringify({ error: "No skills selected" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const evalsConfig = getEvalsConfig();
  const evalsVersion = getGitSha();
  const model = "claude-sonnet-4-20250514";

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      for (const skillId of skills) {
        const skillConfig = evalsConfig.skills[skillId];
        if (!skillConfig) {
          send({ skill: skillId, task: "all", status: "error", error: "Skill not found" });
          continue;
        }

        for (const task of skillConfig.tasks) {
          send({ skill: skillId, task: task.id, status: "running" });

          try {
            const result = await runSpecWriterEval(task, skillId);

            // Store result in database
            await insertEvalRun({
              model,
              evalsVersion,
              skill: skillId,
              task: task.id,
              fixture: task.fixture,
              scoreWithSkill: result.withSkill.score,
              scoreBaseline: result.baseline.score,
              rawOutputWith: result.withSkill.output,
              rawOutputBaseline: result.baseline.output,
              graderReasoning: result.graderReasoning,
            });

            send({
              skill: skillId,
              task: task.id,
              status: "complete",
              scoreWithSkill: result.withSkill.score,
              scoreBaseline: result.baseline.score,
              delta: result.delta,
            });
          } catch (error) {
            send({
              skill: skillId,
              task: task.id,
              status: "error",
              error: error instanceof Error ? error.message : "Unknown error",
            });
          }
        }
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
