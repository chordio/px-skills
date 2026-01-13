import fs from "fs";
import path from "path";

const FIXTURES_DIR = path.join(process.cwd(), "fixtures");

export function getFixtureContent(fixtureName: string): string {
  const fixtureDir = path.join(FIXTURES_DIR, fixtureName, "design-context");

  if (!fs.existsSync(fixtureDir)) {
    return `[No fixture content available for ${fixtureName}]`;
  }

  const files = fs.readdirSync(fixtureDir);
  const contents: string[] = [];

  for (const file of files) {
    const filePath = path.join(fixtureDir, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      const content = fs.readFileSync(filePath, "utf-8");
      const ext = path.extname(file);
      const baseName = path.basename(file, ext);

      contents.push(`### ${baseName}${ext === ".json" ? " (JSON)" : ""}\n\`\`\`${ext === ".json" ? "json" : "markdown"}\n${content}\n\`\`\``);
    }
  }

  return contents.join("\n\n");
}

export function listFixtures(): string[] {
  if (!fs.existsSync(FIXTURES_DIR)) {
    return [];
  }

  return fs.readdirSync(FIXTURES_DIR).filter((name) => {
    const stat = fs.statSync(path.join(FIXTURES_DIR, name));
    return stat.isDirectory();
  });
}
