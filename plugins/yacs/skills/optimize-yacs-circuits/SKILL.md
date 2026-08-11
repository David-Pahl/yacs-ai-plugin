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
- Treat every reported YACS error as blocking until it is resolved. Read the
  exact `preflight.issues`, `runtime.error`, or run error message; do not infer
  success from elapsed time, progress, or a previously saved result.
- `Repeat staged passes` is valid only with `stageSemantics: "exact-v2"` and
  `cumulativeStages: false`. It also requires complete, non-overlapping local
  coverage before the final row. If preflight rejects the schedule, repair the
  schedule or use global refinement; do not repeatedly launch the same invalid
  configuration.

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
- Stop a clearly invalid pass when roots become non-finite, the physical mode
  count changes unexpectedly, a retry is repeatedly rejected, or the residual
  grows far beyond its last verified value. Preserve the last verified physical
  circuit as the recovery point.
- Optimizer `parameter_updates` are proposed values. Confirm that they were
  applied to the document before treating them as the circuit state, then rerun
  the source analyses used by dependent objectives.

## Verify and explain

Inspect the final result with `inspect_yacs_result`. Verify every requested
target, parameter bound, tracked mode, warning, and recovery rather than relying
on a single success flag. Report achieved values with units, residual misses,
final parameters, active constraints, mode-tracking assumptions, and any
tradeoffs. Suggest a follow-up only when it has a clear diagnostic purpose.

For coupled qubit-readout tuning, use a physically ordered loop: establish and
separate mode frequencies, tune resonator linewidths, tune chi and exchange J,
then rerun the modal source analysis and retune linewidths because the coupling
changes can move and reload the resonators. Small local changes may use
`|chi| proportional to C_c^2` and symmetric-arm `|J|` proportional to the
product of the arm capacitances as initial estimates only; measure again after
every update. For magnitude constraints such as `abs_eq`, report both the
signed measured value and its magnitude.
