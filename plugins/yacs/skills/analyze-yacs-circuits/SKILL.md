---
name: analyze-yacs-circuits
description: Run, monitor, inspect, and interpret analyses in YACS through the installed YACS Desktop MCP tools. Use for scattering, impedance, detY, eigenmode, EPR, Purcell, T1, kappa, matrix, sweep, plot, or saved-result questions about a YACS circuit.
---

# Analyze YACS Circuits

Use the installed YACS Desktop MCP server instead of Computer Use or direct
editing of saved `.yacs` data.

## Document progress with snapshots

For hands-on YACS work, tell the user you will document progress with frequent
snapshots. Call `snapshot_yacs` at the starting state, after meaningful changes,
at useful milestones during long runs, and at the final result. Use
`view: "circuit"` for schematics and `view: "window"` for controls, progress, and
results. Inspect each image and post it inline in a user-visible progress update
with a brief observation and next step. Avoid duplicate images of unchanged
state; use result tools to substantiate numerical claims.

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

When asked to report qubit and resonator frequencies in a circuit containing
Josephson junctions, report EPR's **f01 (GHz)** from its **Frequency corrections**
table for both kinds of mode (`shifted_frequency_ghz` in the result). Identify
the modes from participation or fields, and use a current EPR result for the
same circuit and bias. If that result is missing or stale, obtain it before
reporting f01; if it cannot be obtained, say that f01 is unavailable. When the
user explicitly requests linear eigenfrequencies, report those separately and
label them as linear (`linear_frequency_ghz`), rather than substituting them
for f01.

Report the analysis and owner, the configuration that materially affects the
answer, the principal result with units, relevant warnings, and the physical
interpretation. Distinguish values read from YACS from inferences, and recommend
a next run only when it answers a concrete unresolved question.
