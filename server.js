/* eslint-disable @typescript-eslint/no-require-imports */

const { execFileSync } = require("child_process");
const { existsSync } = require("fs");
const { join } = require("path");

try {
  require("@next/env").loadEnvConfig(__dirname);
} catch {
  // Hostinger normally injects env vars directly. Local file loading is best effort.
}

function ensureExecutableIfPresent(target) {
  if (!existsSync(target)) {
    return;
  }

  try {
    execFileSync("chmod", ["-R", "u+x", target], { stdio: "ignore" });
  } catch (error) {
    console.warn(`Unable to adjust execute permission for ${target}.`, error instanceof Error ? error.message : "");
  }
}

// Hostinger can rebuild/copy files between build and runtime. Prisma engines must remain executable
// when the standalone server starts, otherwise first database access can fail with EACCES.
[
  join(__dirname, ".next", "standalone", "node_modules", "@prisma"),
  join(__dirname, ".next", "standalone", "node_modules", ".prisma"),
  join(__dirname, "node_modules", "@prisma", "engines"),
  join(__dirname, "node_modules", ".prisma")
].forEach(ensureExecutableIfPresent);

const standaloneServer = join(__dirname, ".next", "standalone", "server.js");

if (!existsSync(standaloneServer)) {
  console.error(
    "Production build not found. Run `npm run build` before starting the Hostinger app."
  );
  process.exit(1);
}

require(standaloneServer);
