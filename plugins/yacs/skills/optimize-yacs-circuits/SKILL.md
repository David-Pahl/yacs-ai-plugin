---
name: optimize-yacs-circuits
description: Configure, run, diagnose, and interpret guided circuit optimization in YACS through the installed YACS Desktop MCP tools. Use when tuning component parameters to targets, setting bounds, tracking modes, resolving collisions, improving convergence, or reviewing an optimizer result.
---

# Optimize YACS Circuits

Use YACS's guided optimizer and analysis tools. Do not reproduce the optimizer
outside YACS or edit `.yacs` files directly.

## Prepare the optimization

1. Confirm the connection with `get_yacs_status` when needed.
2. Read `yacs://analysis-optimization-guide` before changing an optimization.
3. Call `get_yacs_analysis_context` to identify the document, owner, analysis,
   revision, targets, tunable parameters, bounds, port loads, preflight issues,
   and compact runtime state.
4. Pair the analysis ID with its enclosing owner ID for every run and result
   inspection.

For modal objectives, establish physical mode ownership from participation,
fields, root provenance, and the guide's tracking rules. Never assign modes by
sorted frequency alone, especially near crossings or hybridization.

## Set targets and parameters

- Translate the user's goal into explicit targets with units and tolerances.
- Select the smallest physically relevant set of tunable parameters. Preserve
  fixed fabrication or design constraints.
- Use realistic bounds and initial values. Do not widen bounds merely to force
  convergence.
- Check whether each target has meaningful leverage from at least one selected
  parameter and identify incompatible or underdetermined objectives.
- Resolve topology, model-binding, port-load, and preflight errors before the
  run.

## Run and monitor

- Start the configured optimizer with `run_yacs_analysis`, passing the owner ID
  and current revision information.
- Handle native questions through `get_yacs_pending_dialog` and
  `respond_to_yacs_dialog`.
- Monitor with bounded `get_yacs_active_analysis(wait_ms=...)` calls. Do not
  busy-poll or start duplicate optimizations.
- When a stage fails, diagnose mode identity, target leverage, bounds, topology,
  or numerical conditioning before changing the problem.
- Re-check physical mode ownership after staged changes and avoided crossings.

## Verify and explain

Inspect the final result with `inspect_yacs_result`. Verify every requested
target, parameter bound, tracked mode, warning, and recovery rather than relying
on a single success flag. Report achieved values with units, residual misses,
final parameters, active constraints, mode-tracking assumptions, and any
tradeoffs. Suggest a follow-up only when it has a clear diagnostic purpose.
