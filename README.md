# YACS AI plugin

The official YACS plugin adds five focused circuit workflows to Codex and
Claude Code:

- draw clean, topology-safe YACS circuits;
- run and interpret YACS analyses;
- configure and diagnose guided optimizations;
- repair broken or visually damaged workspaces; and
- open maintained YACS tutorials, examples, and recipes.

The plugin contains instructions and branding only. It does **not** contain the
YACS application, simulation engine, MCP server executable, license server,
private source code, credentials, or user circuit data.

## Prerequisite: connect the installed YACS app

Install and activate YACS Desktop. In YACS, open **Help & About** and choose the
setup button for the assistant you use:

- **Add YACS to Codex** for Codex Desktop, CLI, or the IDE extension;
- **Add YACS to Claude** for Claude Code or Claude Desktop.

Restart the assistant or start a new task after changing its MCP configuration.
This connection step is still required because YACS supplies a local-only MCP
server from the installed application, and its command path differs by platform
and installation. The plugin deliberately does not bundle or hard-code that
executable.

## Install in Codex

Until the YACS plugin is accepted into the public Codex plugin directory, add
its public marketplace repository and install it:

```text
codex plugin marketplace add David-Pahl/yacs-ai-plugin --ref main
codex plugin add yacs@yacs
```

Then start a new Codex task. Once the plugin is listed in the Codex plugin
directory, users can install it from the plugin browser instead.

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

Restart Claude Code after connecting the YACS MCP server if it was already
open. Claude Desktop can use the YACS MCP tools, but Claude Code is the surface
that supports this plugin's skill marketplace.

## Public-package boundary

The public `David-Pahl/yacs-ai-plugin` repository is generated from an explicit
allowlist. Only these classes of files are exported:

- Codex and Claude plugin/marketplace JSON manifests;
- skill `SKILL.md` files and Codex display metadata;
- this public installation guide; and
- the public YACS icon.

The export rejects symlinks, source-code extensions, private filesystem paths,
the private YACS repository URL, and common credential patterns before a
package can be published.
