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
  `cumulativeStages: false`. It requires complete stage coverage of final
  targets and selected parameters. An isolated prefix may be followed by
  locked, focused full-circuit objective rows. If preflight rejects the
  schedule, repair its semantics, ordering, or coverage; do not repeatedly
  launch the same invalid configuration.

## Choose bounded reassembly and final reconciliation by measured work

- Distinguish circuit-evaluation scope from parameter scope. A dressed or
  cross-stage objective such as effective Exchange-J may require the complete
  physical circuit, but its stage should still vary only the smallest relevant
  parameter groups. A focused full-circuit stage is not an all-parameter
  global solve.
- For a complete exact schedule, run isolated stages, progressively reassemble
  their physical topology with bounded passes, then run any focused
  full-circuit objective rows. Use final repeated reconciliation when one
  guarded replay pass is cheaper than the joint endpoint and replay only the
  responsible stage blocks when verification misses.
- For strongly hybridized targets, prefer `Cumulative morph` during
  reassembly: jointly solve each growing rooted prefix, pace every member with
  the shared autofill step count, and keep `Repeat staged passes` as the final
  full-circuit authority. Per-mode caps calibrated on independent bare roots
  do not remain valid after linewidth and frequency redistribute across a
  dressed pair. `Cumulative morph` is a topology-building policy, not a global
  final solve.
- When the last cumulative prefix covers every target and selected parameter
  with trusted roots, carry those exact roots into final repeated verification.
  Do not launch a fresh dense root discovery at that unchanged parameter state;
  it can relabel a valid broad/narrow doublet before verification begins.
- Prefer one global finish when the complete circuit is genuinely inseparable,
  or when retained-mode guards make a full replay pass more expensive than a
  bounded joint endpoint. Estimate residual rows times active controls for the
  replay pass and the global solve; do not assume that either choice is cheaper
  from stage count alone.
- Treat a requested loaded doublet as unresolved after isolated pair-only
  stages. Repeat-only reconciliation is appropriate only when the saved
  schedule also contains an explicit full-circuit hybrid modal reassembly row
  that owns and tracks both poles. Without that row, use one bounded global
  endpoint check; replaying isolated pairs cannot establish their dressed
  identities after the shared topology is restored.

## Stabilize difficult guided setups

- Treat `isolateStages: true` and `cumulativeStages: false` as a useful guided
  pairing when local stages are intended to solve physically independent
  scopes. This is a recommendation, not a validity rule: retain cumulative
  stages when earlier isolated solutions deliberately seed later stages.
- For an isolated multi-mode network with one exceptionally broad pole, root
  tracking may need substantially larger per-mode frequency and linewidth
  windows. Start from guided setup's recommendations; scales around 20 can be
  appropriate when the broad target is roughly an order of magnitude wider
  than the other modes. Do not apply large windows indiscriminately because
  nearby roots can become ambiguous.
- Pair enlarged windows with enough root-refinement work. A budget near 100
  function evaluations can prevent a valid crossing root from degrading to a
  grid fallback; increasing the window alone does not repair an under-resolved
  root solve.
- When a distributed broadband mode drives one transmission-line length to a
  bound, inspect modal leverage before widening that bound. Retain a second
  independently authored, participating line-length control when the required
  electrical-length shift can be physically shared, while keeping a separate
  loss or coupling control for linewidth.
- If a coupled transmission line participates in the loading path and the
  requested linewidth remains unreachable, test stronger inter-trace coupling:
  reduce the trace pitch or inner spacing (for example `s_um` or
  `g_between_um`) within fabrication and impedance constraints. Re-extract the
  CTL and rerun the loaded modal analysis; closer traces usually increase
  coupling, but the linewidth response and frequency shift are topology
  dependent.
- Apply these changes as a coupled diagnosis: tracking windows, root budget,
  physical control coverage, and stage continuation semantics can each be the
  limiting factor. Re-run the ordinary guided regression cases after changing
  them; settings that rescue a broadband hub can perturb simpler crossings.

### Treat strongly hybridized filter/readout pairs atomically

- Interpret a resonant bare-filter specification before entering dressed-mode
  targets. For a lossless readout coupled on resonance to a filter with bare
  linewidth `kappa_p` and coupling `J`, the first dressed approximation is a
  pair split by `2J` with about `kappa_p / 2` linewidth on each pole. State the
  approximation and remeasure it in the complete loaded circuit.
- When the requested dressed splitting is no larger than the two target
  linewidths combined, treat the endpoint as one two-pole block from the first
  local stage. Do not precondition either pole alone; individual frequency
  ordering is not a reliable physical identity through the avoided crossing.
- Require material shared loading on both requested poles before applying that
  atomic rule. A very narrow pole passing a much broader pole is an ordinary
  collision waypoint, not a dressed doublet endpoint; keep the established
  physical assignment and collision recovery for that case.
- Resolve the requested endpoint classification once before continuation. If
  the endpoint contains no loaded doublet, keep it non-hybrid even when two
  ordinary modes overlap transiently at a waypoint; use collision recovery
  without changing their residual coordinates or physical ownership.
- Track and review pair invariants as well as individual poles: center
  frequency, positive splitting, linewidth sum, and linewidth imbalance.
  Preserve physical ownership from joint participation and root provenance,
  then assign the final lower/upper labels only after the pair is localized.
- Give the atomic pair only its local frequency/splitting and loading controls.
  Keep qubit, coupler, and neighboring-cell parameters out of that row. In a
  later derived-objective row, retain both poles as guards and use the smallest
  physically relevant controls for chi, Kerr, or Exchange-J.
- Before assembling an atomic pair with a spectrally remote qubit or coupler,
  place that remote spectator in its simpler isolated circuit. A spectator can
  be reachable before hybridization and lose its independently controllable
  branch afterward. Do not split out a third pole inside the pair bandwidth;
  keep a genuinely local three-pole hybridization joint.
- In a later pair-plus-spectator row, pace each mode coordinate independently.
  A coupler's hertz-scale linewidth cap must not reduce megahertz-scale pair
  frequency or linewidth hops through one shared interpolation fraction.
- Use marker frequency and linewidth windows that contain both members of the
  pair and their expected linewidth exchange, but do not expand them across
  unrelated poles. Refresh both markers together after any accepted change to
  filter length, filter/readout coupling, or port loading.
- If an atomic pair reaches its frequencies but not the linewidth sum or
  balance, stop and inspect physical leverage and authored bounds. Do not add
  global parameters, widen line lengths, or multiply recovery passes merely to
  force the two individual linewidth residuals.
- After each isolated pair block, verify the accepted roots in the progressively
  reassembled circuit before dependent rows. A later missing pair means the
  isolated result was not a valid full-circuit recovery point; return to the
  last verified parameters instead of reacquiring an unrelated sorted root.
- At every analysis-stage boundary, recompute modal ownership from the direct
  objective modes. If one objective mode belongs to a resolved strongly
  hybridized pair, add its partner to both the modal objective and tracking
  subspace, then optimize the union of guided owners for every mode in that
  frozen objective subspace. Freeze the result for the stage so p/r
  participation exchange cannot make ownership chatter during a solve.
- Do not activate shared p/r ownership merely because the pair appears in a
  rooted tracking closure. Tracking-only dependencies are read-only guards; in
  particular, a dressed Exchange-J row whose direct modes are qubits should
  keep its focused qubit/coupler controls instead of inheriting every resonator
  control in the rooted neighborhood.
- For a no-global finish, prefer repeated exact analysis rows with one trusted
  full-circuit verification between passes. If those rows collectively cover
  the final analysis targets and guided modal owners, keep the authored
  analysis blocks as the replay basis; do not prepend modal preconditioners or
  widen rows transitively through shared controls, because that reconstructs a
  global solve under another name.
- Treat shared ownership as a coordinate-system repair, not as evidence that a
  derived target is locally reachable. At the first loaded checkpoint, inspect
  each analysis residual's response to its expanded owner block. If chi, Kerr,
  or J remains effectively stationary while the paired modes track, report a
  local-leverage/conditioning failure. Do not multiply ramps, split every
  target into full-circuit rows, or silently relax targets: those changes can
  be slower than the joint endpoint without making the strict target feasible.
- Recommend repeated/no-global automatically only after loaded verification
  demonstrates strict target progress and pass-to-pass contraction. Otherwise
  preserve the no-global request by returning the unresolved strict objective
  and its owner/sensitivity diagnostics, rather than falling back to global or
  labeling an analysis-relaxed result as converged.
- If a saved strong-hybrid endpoint is used as a restart, align both members'
  frequency and linewidth markers with the dressed checkpoint; stale bare-like
  markers can make a valid checkpoint look like a missing-root failure.

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

## Learn from a successful reference run

- Compare the complete generated setup and trajectory, not only elapsed time
  or final parameters: targets, focused controls, stage membership, target-step
  caps, analysis ramps, accepted analysis-priority choices, tracking/root
  settings, reconciliation policy, root provenance, retries, and where each
  target first became satisfied. Structural setup alone does not include the
  separately recommended analysis-priority tolerances and weights.
- To diagnose a regression, morph one configuration family at a time toward a
  verified reference and rerun Guided Setup after changing an upstream setting.
  In particular, setting target-step count before setup is not equivalent to
  replacing generated per-mode caps afterward.
- Keep circuit and schedule changes separate during an A/B comparison. Do not
  attribute a slowdown to an input capacitor, model, or topology edit unless
  the target rows, ownership groups, rooted paths, stages, step caps, and final
  reconciliation policy are otherwise identical.
- For weakly split filter/readout branches with distinct linewidth targets,
  fresh local ownership, six-step homotopic reconstruction, and repeated exact
  reconciliation can be substantially faster than a stale global schedule. For
  strongly loaded doublets, begin with atomic pair rows, use cumulative morph
  with uniform step pacing, and apply the explicit full-circuit reassembly rule
  above; do not reuse singleton filter warm starts or bare-coordinate per-mode
  caps.
- Fresh setup is a candidate, not an automatic replacement for a verified
  authored schedule. Shared feedline loading can collapse participation around
  one apparent hub and produce broad owner groups. If that happens, retain the
  last converging authored ownership as the control, inspect the regenerated
  associations and paths, and morph only the disputed family.
- A good staged run completes most local objectives before its final row. If
  modes progress while analysis stalls, check physical leverage and compare the
  stage's parameter dimension with its active modal-plus-analysis residual
  dimension. Prefer a sparse physical control set over a broad owner-group
  union.
- Do not infer slowness from stage count alone. More small, conditioned stages
  can finish sooner than fewer broad solves. Watch elapsed solver work,
  accepted parameter motion, retries, and work left for final reconciliation.
- Preserve a successful configuration as a self-contained `.yacs` document,
  not as test code that reconstructs Guided Setup. It should reopen and run
  directly with the same circuit/model definitions, variable bindings,
  parameter values and bounds, targets and tolerances, groups, stage order and
  scopes, reconciliation/final modes, analysis priorities, and advanced
  continuation and root-tracking settings.
- Verify the saved document by loading and running it verbatim. Rooted paths,
  guidance associations, and reassembly records are part of the runnable
  setup; saving only the visible stage rows and step caps is incomplete even
  when an in-memory setup proposal converged.
- For optimizer development, commit that exact `.yacs` fixture and its
  verbatim-loading regression test in the same commit as the behavior or
  performance fix. Pin the configuration identity and meaningful numerical,
  stage, retry, recovery, and root-provenance contracts without committing
  bulky result payloads. Never mutate the fixture in memory to recreate the
  successful setup.
- Compare performance with live and stepwise plotting disabled, and report
  optimizer time separately from wall time. Plot-during-optimization and
  stepwise figures add checkpoint serialization and rendering work; validate
  plotting separately rather than treating that overhead as solver slowdown.
- Read the successful-run section of `yacs://analysis-optimization-guide` for
  the detailed comparison and verification checklist.

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
