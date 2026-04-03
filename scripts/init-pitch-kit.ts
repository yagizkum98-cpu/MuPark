import { cp, mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const templateDir = path.join(rootDir, "investor-kit", "templates");
const runsDir = path.join(rootDir, "investor-kit", "runs");

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getDateLabel() {
  return new Date().toISOString().slice(0, 10);
}

async function ensureTemplatesExist() {
  try {
    await access(templateDir);
  } catch {
    throw new Error("Template klasoru bulunamadi: investor-kit/templates");
  }
}

async function createPitchKit(campaignName?: string) {
  await ensureTemplatesExist();

  const safeName = slugify(campaignName || "pitch");
  const runName = `${getDateLabel()}-${safeName || "pitch"}`;
  const runDir = path.join(runsDir, runName);

  await mkdir(path.join(runDir, "assets", "raw"), { recursive: true });
  await mkdir(path.join(runDir, "assets", "exports"), { recursive: true });
  await cp(templateDir, runDir, { recursive: true });

  const briefPath = path.join(runDir, "brief.md");
  const brief = `# Pitch Brief

- Toplanti adi:
- Hedef kurum/fon:
- Toplanti tarihi:
- Ana karar vericiler:
- Bu toplantidan beklenen sonuc:
- Odak KPI (en fazla 3):
- Takip aksiyonlari:
`;

  await writeFile(briefPath, brief, "utf8");

  return runDir;
}

async function main() {
  const campaignName = process.argv.slice(2).join(" ").trim();
  const runDir = await createPitchKit(campaignName);
  console.log(`Hazirlandi: ${path.relative(rootDir, runDir)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

