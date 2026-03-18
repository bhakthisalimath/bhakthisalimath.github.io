/**
 * 1) Creates public/projects/<id>/ for every project id in src/data/projects.ts
 * 2) Scans each folder for images and writes src/data/projectGalleries.auto.json
 *
 * Run: npm run sync:project-assets
 * Runs before build (prebuild) and before dev (predev).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const projectsFile = path.join(root, "src/data/projects.ts");
const publicProjectsRoot = path.join(root, "public/projects");
const manifestOut = path.join(root, "src/data/projectGalleries.auto.json");

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|avif|svg)$/i;

const text = fs.readFileSync(projectsFile, "utf8");
const ids = [...text.matchAll(/^\s+id:\s*"([^"]+)"/gm)].map((m) => m[1]);
const unique = [...new Set(ids)];

if (unique.length === 0) {
  console.warn("sync-project-assets: no project ids found in projects.ts");
  process.exit(0);
}

fs.mkdirSync(publicProjectsRoot, { recursive: true });

for (const id of unique) {
  if (!/^[a-z0-9-]+$/i.test(id)) continue;
  const dir = path.join(publicProjectsRoot, id);
  fs.mkdirSync(dir, { recursive: true });
  const gitkeep = path.join(dir, ".gitkeep");
  if (!fs.existsSync(gitkeep)) {
    fs.writeFileSync(gitkeep, "");
  }
}

/** Collect image URLs under public/projects/<id>/ (recursive). */
function listProjectImages(absDir, id, sub = "") {
  const urls = [];
  if (!fs.existsSync(absDir)) return urls;
  const entries = fs.readdirSync(absDir, { withFileTypes: true });
  for (const ent of entries) {
    const name = ent.name;
    if (name.startsWith(".")) continue;
    if (name === "README.md") continue;
    const rel = sub ? `${sub}/${name}` : name;
    const full = path.join(absDir, name);
    if (ent.isDirectory()) {
      urls.push(...listProjectImages(full, id, rel));
    } else if (IMAGE_EXT.test(name)) {
      const url = `/projects/${id}/${rel.split(path.sep).join("/")}`;
      urls.push(url);
    }
  }
  return urls;
}

const manifest = {};
for (const id of unique) {
  if (!/^[a-z0-9-]+$/i.test(id)) continue;
  const dir = path.join(publicProjectsRoot, id);
  const urls = listProjectImages(dir, id);
  urls.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  if (urls.length > 0) manifest[id] = urls;
}

fs.writeFileSync(manifestOut, JSON.stringify(manifest, null, 2) + "\n", "utf8");

const withImages = Object.keys(manifest).length;
console.log(
  `sync-project-assets: ${unique.length} folders, ${withImages} projects with images → projectGalleries.auto.json`
);
