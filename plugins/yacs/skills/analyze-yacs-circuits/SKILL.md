---
name: analyze-yacs-circuits
description: Run, monitor, inspect, and interpret analyses in YACS through the installed YACS Desktop MCP tools. Use for scattering, impedance, detY, eigenmode, EPR, Purcell, T1, kappa, matrix, sweep, plot, or saved-result questions about a YACS circuit.
---

# Analyze YACS Circuits

Use the installed YACS Desktop MCP server instead of Computer Use or direct
editing of saved `.yacs` data.

## Establish the analysis context

1. Call `get_yacs_status` when connection state is unknown.
2. For an existing analysis, call `get_yacs_analysis_context`. Prefer this
   compact, owner-scoped response over loading the full document or raw result
   arrays.
3. Pair every analysis ID with its enclosing owner ID. Copied pages and circuit
   models can retain the same analysis ID.
4. Read `yacs://analysis-optimization-guide` before configuring modal, EPR,
   detY, Purcell, or other multi-mode work.

If the MCP tools are unavailable, ask the user to install and start YACS
Desktop, then start a new task. The plugin normally connects automatically; use
the matching setup button under **Help & About** only for a nonstandard
installation or legacy recovery.

## Configure and run

- Preserve the existing analysis configuration unless the user asks to change
  it. State material assumptions before changing ports, loads, sweeps, mode
  assignments, or objectives.
- Use the physical participation or field data recommended by the analysis
  guide when identifying modes. Never infer stable mode ownership from sorted
  frequency alone.
- Resolve preflight errors before starting the run. Do not hide warnings that
  can change the physical interpretation.
- Treat `preflight.issues`, `runtime.error`, and run errors as authoritative.
  Resolve the exact message before retrying instead of assuming a long-running
  or previously successful analysis is still valid.
- Call `run_yacs_analysis` with the owner ID and current revision information
  returned by the context tools.
- If the run is awaiting input, use `get_yacs_pending_dialog` and
  `respond_to_yacs_dialog` rather than clicking through the UI.

## Monitor and inspect

- Monitor manual or MCP-started work with `get_yacs_active_analysis` and a
  bounded `wait_ms`. Do not busy-poll.
- Use `cancel_yacs_run` only when the user asks to stop or the run is clearly
  invalid.
- Inspect saved or completed results with `inspect_yacs_result`. Request compact
  summaries or specific series instead of transferring full raw payloads.
- Compare units, sweep axes, owner, revision, and analysis configuration before
  comparing two results.
- Any parameter mutation makes source results physically stale even when a
  cached result remains visible. Rerun detY/root finding first, then dependent
  EPR, exchange-J, Purcell, T1, or optimization objectives in dependency order.
- If the root count or participation-based identity changes, rebuild the mode
  mapping before evaluating chi, self-Kerr, linewidth, or pairwise quantities.
- For magnitude constraints, retain and report the signed result as well as the
  magnitude. Do not silently turn an inferred scaling estimate into a measured
  YACS value.

## Report the result

Report the analysis and owner, the configuration that materially affects the
answer, the principal result with units, relevant warnings, and the physical
interpretation. Distinguish values read from YACS from inferences, and recommend
a next run only when it answers a concrete unresolved question.
