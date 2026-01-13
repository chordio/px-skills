import Anthropic from "@anthropic-ai/sdk";
import { getEvalsConfig, EvalTask } from "../evals-config";
import { getFixtureContent } from "../fixtures";
import { getSkillContext } from "../skill-context";

const client = new Anthropic();

export interface EvalResult {
  taskId: string;
  withSkill: { output: string; score: number };
  baseline: { output: string; score: number };
  delta: number;
  graderReasoning: string;
}

export async function runSpecWriterEval(
  task: EvalTask,
  skillId: string
): Promise<EvalResult> {
  const evalsConfig = getEvalsConfig();
  const skillConfig = evalsConfig.skills[skillId];
  if (!skillConfig) {
    throw new Error(`Skill ${skillId} not found`);
  }

  // Load fixture content
  const fixtureContent = getFixtureContent(task.fixture);

  // Load skill context (SKILL.md + reference files)
  const skillContext = getSkillContext(skillId);

  // Run with skill
  const withSkillResponse = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: `${skillContext}

## Design Context
${fixtureContent}`,
    messages: [{ role: "user", content: task.prompt }],
  });

  const withSkillOutput =
    withSkillResponse.content[0].type === "text"
      ? withSkillResponse.content[0].text
      : "";

  // Run baseline (no skill)
  const baselineResponse = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: `You are helping with UX design. Provide your best response.

## Design Context
${fixtureContent}`,
    messages: [{ role: "user", content: task.prompt }],
  });

  const baselineOutput =
    baselineResponse.content[0].type === "text"
      ? baselineResponse.content[0].text
      : "";

  // Grade both outputs
  const gradeResult = await gradeOutputs(
    withSkillOutput,
    baselineOutput,
    skillConfig.rubric.graderPrompt,
    fixtureContent,
    task.fixture
  );

  const delta =
    gradeResult.baselineScore > 0
      ? (gradeResult.withSkillScore - gradeResult.baselineScore) /
        gradeResult.baselineScore
      : gradeResult.withSkillScore > 0
      ? 1
      : 0;

  return {
    taskId: task.id,
    withSkill: { output: withSkillOutput, score: gradeResult.withSkillScore },
    baseline: { output: baselineOutput, score: gradeResult.baselineScore },
    delta,
    graderReasoning: gradeResult.reasoning,
  };
}

interface GradeResult {
  withSkillScore: number;
  baselineScore: number;
  reasoning: string;
}

async function gradeOutputs(
  withSkillOutput: string,
  baselineOutput: string,
  rubricPrompt: string,
  fixtureContent: string,
  fixtureName: string
): Promise<GradeResult> {
  // Grade with-skill output
  const withSkillGrade = await gradeOutput(
    withSkillOutput,
    rubricPrompt,
    fixtureContent,
    fixtureName
  );

  // Grade baseline output
  const baselineGrade = await gradeOutput(
    baselineOutput,
    rubricPrompt,
    fixtureContent,
    fixtureName
  );

  return {
    withSkillScore: withSkillGrade.total,
    baselineScore: baselineGrade.total,
    reasoning: `With skill: ${withSkillGrade.reasoning}\n\nBaseline: ${baselineGrade.reasoning}`,
  };
}

interface GradeOutput {
  total: number;
  reasoning: string;
}

async function gradeOutput(
  output: string,
  rubricPrompt: string,
  fixtureContent: string,
  fixtureName: string
): Promise<GradeOutput> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: `${rubricPrompt}

## Design Context Being Evaluated Against
${fixtureContent}

## Fixture Type
${fixtureName}
${fixtureName === "minimal" ? "(Only score completeness, specificity, token_refs)" : ""}
${fixtureName === "with-system" ? "(Score completeness, specificity, token_refs, pattern_adherence)" : ""}
${fixtureName === "full" ? "(Score all dimensions)" : ""}`,
    messages: [
      {
        role: "user",
        content: `Please evaluate this design specification:

${output}`,
      },
    ],
  });

  const gradeText =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Parse JSON from response
  const jsonMatch = gradeText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return { total: 0, reasoning: "Failed to parse grader response" };
  }

  try {
    const grade = JSON.parse(jsonMatch[0]);
    return {
      total: grade.total ?? 0,
      reasoning: grade.reasoning ?? "No reasoning provided",
    };
  } catch {
    return { total: 0, reasoning: "Failed to parse grader JSON" };
  }
}
