import fs from "fs";
import path from "path";

// Path to the skills directory (relative to repo root)
const SKILLS_DIR = path.join(process.cwd(), "..", "skills");

export function getSkillContext(skillId: string): string {
  const skillDir = path.join(SKILLS_DIR, skillId);

  if (!fs.existsSync(skillDir)) {
    return `[Skill ${skillId} not found]`;
  }

  const contents: string[] = [];

  // Read main SKILL.md
  const skillMdPath = path.join(skillDir, "SKILL.md");
  if (fs.existsSync(skillMdPath)) {
    const skillMd = fs.readFileSync(skillMdPath, "utf-8");
    contents.push(`# Skill Instructions\n\n${skillMd}`);
  }

  // Read reference files
  const refsDir = path.join(skillDir, "references");
  if (fs.existsSync(refsDir)) {
    const refFiles = fs.readdirSync(refsDir).filter((f) => f.endsWith(".md"));
    for (const refFile of refFiles) {
      const refPath = path.join(refsDir, refFile);
      const refContent = fs.readFileSync(refPath, "utf-8");
      const baseName = path.basename(refFile, ".md");
      contents.push(`## Reference: ${baseName}\n\n${refContent}`);
    }
  }

  // Read template files (optional)
  const templatesDir = path.join(skillDir, "templates");
  if (fs.existsSync(templatesDir)) {
    const templateFiles = fs
      .readdirSync(templatesDir)
      .filter((f) => f.endsWith(".md"));
    for (const templateFile of templateFiles) {
      const templatePath = path.join(templatesDir, templateFile);
      const templateContent = fs.readFileSync(templatePath, "utf-8");
      const baseName = path.basename(templateFile, ".md");
      contents.push(`## Template: ${baseName}\n\n${templateContent}`);
    }
  }

  return contents.join("\n\n---\n\n");
}

export function listSkills(): string[] {
  if (!fs.existsSync(SKILLS_DIR)) {
    return [];
  }

  return fs.readdirSync(SKILLS_DIR).filter((name) => {
    const skillPath = path.join(SKILLS_DIR, name);
    const stat = fs.statSync(skillPath);
    return stat.isDirectory() && fs.existsSync(path.join(skillPath, "SKILL.md"));
  });
}
