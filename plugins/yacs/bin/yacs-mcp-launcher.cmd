#!/bin/sh
: <<'YACS_WINDOWS'
@echo off
setlocal
set "YACS_MCP="
for %%P in (
  "%LOCALAPPDATA%\Programs\Yacs\resources\backend-bin\yacs-desktop-server\yacs-desktop-server.exe"
  "%LOCALAPPDATA%\Programs\yacs-desktop\resources\backend-bin\yacs-desktop-server\yacs-desktop-server.exe"
  "%ProgramFiles%\Yacs\resources\backend-bin\yacs-desktop-server\yacs-desktop-server.exe"
) do if exist "%%~P" set "YACS_MCP=%%~P"
if defined YACS_MCP goto yacs_run
1>&2 echo YACS Desktop was not found in a standard installation location.
1>&2 echo Install and start YACS, or use Help ^& About ^> Add YACS to Claude/Codex for a nonstandard installation.
exit /b 1
:yacs_run
"%YACS_MCP%" --mcp-stdio %*
exit /b %ERRORLEVEL%
YACS_WINDOWS

set -eu

try_yacs_mcp() {
  if [ -x "$1" ]; then
    exec "$1" --mcp-stdio "$@"
  fi
}

case "$(uname -s 2>/dev/null || true)" in
  Darwin)
    try_yacs_mcp "/Applications/Yacs.app/Contents/Resources/backend-bin/yacs-desktop-server/yacs-desktop-server" "$@"
    try_yacs_mcp "${HOME:-}/Applications/Yacs.app/Contents/Resources/backend-bin/yacs-desktop-server/yacs-desktop-server" "$@"
    if command -v mdfind >/dev/null 2>&1; then
      mdfind "kMDItemCFBundleIdentifier == 'studio.yacs.desktop'" 2>/dev/null | while IFS= read -r yacs_app; do
        try_yacs_mcp "${yacs_app}/Contents/Resources/backend-bin/yacs-desktop-server/yacs-desktop-server" "$@"
      done
    fi
    ;;
  Linux)
    try_yacs_mcp "${HOME:-}/.config/Yacs/integrations/mcp/yacs-mcp" "$@"
    try_yacs_mcp "${HOME:-}/.config/yacs-desktop/integrations/mcp/yacs-mcp" "$@"
    try_yacs_mcp "/opt/Yacs/resources/backend-bin/yacs-desktop-server/yacs-desktop-server" "$@"
    try_yacs_mcp "/opt/yacs-desktop/resources/backend-bin/yacs-desktop-server/yacs-desktop-server" "$@"
    try_yacs_mcp "/usr/lib/Yacs/resources/backend-bin/yacs-desktop-server/yacs-desktop-server" "$@"
    try_yacs_mcp "/usr/lib/yacs-desktop/resources/backend-bin/yacs-desktop-server/yacs-desktop-server" "$@"
    ;;
esac

printf '%s\n' "YACS Desktop was not found in a standard installation location." >&2
printf '%s\n' "Install and start YACS, or use Help & About > Add YACS to Claude/Codex for a nonstandard installation." >&2
exit 1
