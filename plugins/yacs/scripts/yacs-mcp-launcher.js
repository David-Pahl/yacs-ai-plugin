"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawn, spawnSync } = require("node:child_process");

function executableFile(candidate) {
  if (!candidate) return false;
  try {
    const stat = fs.statSync(candidate);
    if (!stat.isFile()) return false;
    if (process.platform === "win32") return true;
    fs.accessSync(candidate, fs.constants.X_OK);
    return true;
  } catch (_error) {
    return false;
  }
}

function macSpotlightCandidates() {
  const result = spawnSync(
    "mdfind",
    ["kMDItemCFBundleIdentifier == 'studio.yacs.desktop'"],
    { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
  );
  if (result.status !== 0 || !result.stdout) return [];
  return result.stdout
    .split(/\r?\n/)
    .filter(Boolean)
    .map((appPath) => path.join(
      appPath,
      "Contents",
      "Resources",
      "backend-bin",
      "yacs-desktop-server",
      "yacs-desktop-server",
    ));
}

function candidates() {
  const home = os.homedir();
  const explicit = process.env.YACS_MCP_EXECUTABLE
    ? [process.env.YACS_MCP_EXECUTABLE]
    : [];
  if (process.platform === "darwin") {
    return [
      ...explicit,
      "/Applications/Yacs.app/Contents/Resources/backend-bin/yacs-desktop-server/yacs-desktop-server",
      path.join(home, "Applications", "Yacs.app", "Contents", "Resources", "backend-bin", "yacs-desktop-server", "yacs-desktop-server"),
      ...macSpotlightCandidates(),
    ];
  }
  if (process.platform === "win32") {
    const localAppData = process.env.LOCALAPPDATA || path.join(home, "AppData", "Local");
    const programFiles = process.env.ProgramFiles || "C:\\Program Files";
    return [
      ...explicit,
      path.join(localAppData, "Programs", "Yacs", "resources", "backend-bin", "yacs-desktop-server", "yacs-desktop-server.exe"),
      path.join(localAppData, "Programs", "yacs-desktop", "resources", "backend-bin", "yacs-desktop-server", "yacs-desktop-server.exe"),
      path.join(programFiles, "Yacs", "resources", "backend-bin", "yacs-desktop-server", "yacs-desktop-server.exe"),
    ];
  }
  if (process.platform === "linux") {
    return [
      ...explicit,
      path.join(home, ".config", "Yacs", "integrations", "mcp", "yacs-mcp"),
      path.join(home, ".config", "yacs-desktop", "integrations", "mcp", "yacs-mcp"),
      "/opt/Yacs/resources/backend-bin/yacs-desktop-server/yacs-desktop-server",
      "/opt/yacs-desktop/resources/backend-bin/yacs-desktop-server/yacs-desktop-server",
      "/usr/lib/Yacs/resources/backend-bin/yacs-desktop-server/yacs-desktop-server",
      "/usr/lib/yacs-desktop/resources/backend-bin/yacs-desktop-server/yacs-desktop-server",
    ];
  }
  return explicit;
}

function backendArguments(extraArguments) {
  return ["--mcp-stdio", ...extraArguments];
}

function main() {
  const executable = candidates().find(executableFile);
  if (!executable) {
    console.error("YACS Desktop was not found in a standard installation location.");
    console.error("Install and start YACS, or use Help & About > Add YACS to Claude/Codex for a nonstandard installation.");
    process.exit(1);
  }

  const child = spawn(executable, backendArguments(process.argv.slice(2)), {
    stdio: "inherit",
    windowsHide: true,
  });

  child.on("error", (error) => {
    console.error(`Could not start the YACS MCP server: ${error.message}`);
    process.exit(1);
  });
  child.on("exit", (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    else process.exit(code ?? 1);
  });
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => child.kill(signal));
  }
}

module.exports = { backendArguments, candidates };
if (require.main === module) main();
