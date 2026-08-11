# YACS AI plugin

The official YACS plugin adds five focused circuit workflows to Codex and
Claude Code:

- draw clean, topology-safe YACS circuits;
- run and interpret YACS analyses;
- configure and diagnose guided optimizations;
- repair broken or visually damaged workspaces; and
- open maintained YACS tutorials, examples, and recipes.

The plugin contains skills, manifests, branding, and a small source-visible
launcher that locates YACS Desktop. It does **not** contain the YACS application,
simulation engine, MCP server implementation, license server, private source
code, credentials, or user circuit data.

## Prerequisite

Install, activate, and start YACS Desktop. The plugin automatically locates the
MCP mode bundled with a standard YACS installation, so Codex and Claude Code do
not normally require a separate in-app connection step. Start a new assistant
task after installing or updating the plugin.

The setup buttons under YACS **Help & About** remain as fallbacks:

- use **Add YACS to Codex** for an unusual Codex or YACS installation that the
  plugin launcher cannot locate;
- use **Add YACS to Claude** for an unusual Claude Code installation, or for
  Claude Desktop, which does not install Claude Code plugins.

## Install in Codex

Add the public marketplace repository and install YACS:

```text
codex plugin marketplace add David-Pahl/yacs-ai-plugin --ref main
codex plugin add yacs@yacs
```

Then start YACS Desktop and open a new Codex task. Once the plugin is listed in
the built-in Codex directory, users can install it from the plugin browser
instead.

For local development from the private YACS checkout:

```text
codex plugin marketplace add /absolute/path/to/yacs
codex plugin add yacs@yacs
```

## Install in Claude Code

Open `/plugin`, choose **Marketplaces**, add `David-Pahl/yacs-ai-plugin`, and
install `yacs@yacs`. The equivalent commands inside Claude Code are:

```text
/plugin marketplace add David-Pahl/yacs-ai-plugin
/plugin install yacs@yacs
```

Then start YACS Desktop and reload plugins or start a new Claude Code session.

## How automatic connection works

The plugin's public launcher checks standard YACS installation locations on
macOS, Windows, and Linux, then starts the installed
`yacs-desktop-server --mcp-stdio`. AppImage installations use the stable helper
that YACS creates after the application is opened. The launcher contains no
simulation or licensing implementation and does not copy the YACS MCP server
into the plugin.

## Public-package boundary

The public `David-Pahl/yacs-ai-plugin` repository is generated from an explicit
allowlist. Only these classes of files are exported:

- Codex and Claude plugin, marketplace, and MCP JSON manifests;
- skill `SKILL.md` files and Codex display metadata;
- this public installation guide;
- the public, source-visible installation locator; and
- the public YACS icon.

The export rejects symlinks, files outside the exact allowlist, private
filesystem paths, the private YACS repository URL, and common credential
patterns before a package can be published.
