import { getDb, EvalRun } from "./schema";
import { randomUUID } from "crypto";

export interface RecentResult {
  id: string;
  timestamp: string;
  model: string;
  skill: string;
  task: string;
  scoreWithSkill: number;
  scoreBaseline: number;
  delta: number;
}

export interface SkillSummary {
  name: string;
  avgDelta: number;
  totalRuns: number;
  tasksCount: number;
}

export async function getRecentResults(limit = 50): Promise<RecentResult[]> {
  const db = getDb();
  const rows = db
    .prepare(
      `
    SELECT
      id, timestamp, model, skill, task,
      score_with_skill as scoreWithSkill,
      score_baseline as scoreBaseline,
      delta
    FROM eval_runs
    ORDER BY timestamp DESC
    LIMIT ?
  `
    )
    .all(limit) as RecentResult[];

  return rows;
}

export async function getSkillSummary(): Promise<SkillSummary[]> {
  const db = getDb();
  const rows = db
    .prepare(
      `
    SELECT
      skill as name,
      AVG(delta) as avgDelta,
      COUNT(*) as totalRuns,
      COUNT(DISTINCT task) as tasksCount
    FROM eval_runs
    GROUP BY skill
    ORDER BY avgDelta DESC
  `
    )
    .all() as SkillSummary[];

  return rows;
}

export interface InsertEvalRunParams {
  model: string;
  evalsVersion: string;
  skill: string;
  task: string;
  fixture?: string;
  scoreWithSkill: number;
  scoreBaseline: number;
  rawOutputWith?: string;
  rawOutputBaseline?: string;
  graderReasoning?: string;
}

export async function insertEvalRun(params: InsertEvalRunParams): Promise<string> {
  const db = getDb();
  const id = randomUUID();
  const delta =
    params.scoreBaseline > 0
      ? (params.scoreWithSkill - params.scoreBaseline) / params.scoreBaseline
      : params.scoreWithSkill > 0
      ? 1
      : 0;

  db.prepare(
    `
    INSERT INTO eval_runs (
      id, model, evals_version, skill, task, fixture,
      score_with_skill, score_baseline, delta,
      raw_output_with, raw_output_baseline, grader_reasoning
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
  ).run(
    id,
    params.model,
    params.evalsVersion,
    params.skill,
    params.task,
    params.fixture ?? null,
    params.scoreWithSkill,
    params.scoreBaseline,
    delta,
    params.rawOutputWith ?? null,
    params.rawOutputBaseline ?? null,
    params.graderReasoning ?? null
  );

  return id;
}

export async function getResultsBySkill(skill: string): Promise<RecentResult[]> {
  const db = getDb();
  const rows = db
    .prepare(
      `
    SELECT
      id, timestamp, model, skill, task,
      score_with_skill as scoreWithSkill,
      score_baseline as scoreBaseline,
      delta
    FROM eval_runs
    WHERE skill = ?
    ORDER BY timestamp DESC
  `
    )
    .all(skill) as RecentResult[];

  return rows;
}

export async function getEvalRunById(id: string): Promise<EvalRun | null> {
  const db = getDb();
  const row = db
    .prepare(
      `
    SELECT
      id, timestamp, model,
      evals_version as evalsVersion,
      skill, task, fixture,
      score_with_skill as scoreWithSkill,
      score_baseline as scoreBaseline,
      delta,
      raw_output_with as rawOutputWith,
      raw_output_baseline as rawOutputBaseline,
      grader_reasoning as graderReasoning
    FROM eval_runs
    WHERE id = ?
  `
    )
    .get(id) as EvalRun | undefined;

  return row ?? null;
}
