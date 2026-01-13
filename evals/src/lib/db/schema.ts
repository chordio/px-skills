import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "evals.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    initializeSchema(db);
  }
  return db;
}

function initializeSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS eval_runs (
      id TEXT PRIMARY KEY,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      model TEXT NOT NULL,
      evals_version TEXT NOT NULL,
      skill TEXT NOT NULL,
      task TEXT NOT NULL,
      fixture TEXT,
      score_with_skill REAL NOT NULL,
      score_baseline REAL NOT NULL,
      delta REAL NOT NULL,
      raw_output_with TEXT,
      raw_output_baseline TEXT,
      grader_reasoning TEXT
    );

    CREATE TABLE IF NOT EXISTS eval_metadata (
      evals_version TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      description TEXT,
      rubric_snapshot TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_eval_runs_skill ON eval_runs(skill);
    CREATE INDEX IF NOT EXISTS idx_eval_runs_timestamp ON eval_runs(timestamp);
    CREATE INDEX IF NOT EXISTS idx_eval_runs_model ON eval_runs(model);
  `);
}

export interface EvalRun {
  id: string;
  timestamp: string;
  model: string;
  evalsVersion: string;
  skill: string;
  task: string;
  fixture: string | null;
  scoreWithSkill: number;
  scoreBaseline: number;
  delta: number;
  rawOutputWith: string | null;
  rawOutputBaseline: string | null;
  graderReasoning: string | null;
}

export interface EvalMetadata {
  evalsVersion: string;
  createdAt: string;
  description: string | null;
  rubricSnapshot: string | null;
}
