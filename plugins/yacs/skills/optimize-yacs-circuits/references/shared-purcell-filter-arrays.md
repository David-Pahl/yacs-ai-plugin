# Shared Purcell-filter arrays: geometry, staging and acceptance

Read this when multiplexed qubit/readout pairs share a distributed filter and
linewidth tuning stalls, particularly across a band wider than the filter
linewidth. The successful twelve-pair run motivates a diagnostic workflow;
its dimensions and stage order are not universal design defaults.

## Separate the physical targets from optimizer coordinates

- Preserve the original target values, units, tolerances and mode identities
  separately from returned stage targets. Derived-analysis stages can anchor
  modal coordinates at stage entry, so a native `converged` flag can coexist
  with misses against the user's original frequencies or linewidths.
- Resolve whether each frequency means linear `Re(f)` or EPR shifted `f01`.
  If the modal optimizer requires a linear qubit proxy, measure the complete
  circuit's current EPR shift and use
  `f_linear,target = f01,target - (f01,measured - f_linear,measured)`.
  Refresh this approximation when participation changes, and accept against
  fresh EPR f01. Do not reuse a fixed anharmonicity offset across designs.
- Keep alpha's sign and full YACS cross-Kerr versus dispersive half-chi
  explicit. State the interpretation when positive values denote magnitudes.
  Distinguish linewidth in Hz, `2 Im(f)`, from angular linewidth in rad/s.

## Diagnose physical leverage before increasing solver effort

When a plain filter segment approaches its minimum length while CTLs grow,
inspect the entire distributed electrical-length budget. Longer coupled
sections can consume the filter's available length while coupling at a poor
field position still leaves a remote readout too narrow. Widening the CTL
bound alone need not make the target reachable.

If layout changes are permitted, test redistributing the fixed bus sections:
shorter inter-cell sections can cluster the couplers in a region of stronger
participation, while end sections preserve the required filter resonance.
Choose the relevant field antinode from the coupling mechanism: current for
an inductive/short-ended coupled section, voltage for a capacitive connection.
Use the loaded field distribution and measured linewidth sensitivity, rather
than assuming an unloaded sinusoid or that every coupler shares an optimum.

Compensate each resonator's electrical length when its CTL length changes, and
retain independent shared filter frequency and loading controls. Use extracted
line matrices and the actual connected trace for a short-section estimate;
verify long sections in the full distributed model. Length-only edits can
retain compatible per-unit-length matrices. Gap, cross-section or material
changes require re-extraction. Circuit-model success is not new layout/EM
validation. Preserve user-fixed geometry and fabrication bounds; if these
prevent redistribution, report the reachability conflict.

## Use small parameter blocks with complete circuit loading

When calibrated capacitances already satisfy alpha and chi, try holding those
values during a modal correction phase. A useful candidate varies one pair's
qubit inductance, plain resonator length and CTL length, plus the shared filter
frequency and loading controls. Evaluate the complete loaded array and track
the pair, filter and relevant spectators. Keep resolved hybrid doublets joint.

Tune the shared filter first if it is not a hybrid doublet requiring joint
preconditioning. Sweep through the pair blocks, then recheck earlier pairs:
later cells alter their shared loading. Repeat only while strict residuals
contract with trusted physical identities. This is block-coordinate tuning,
not evidence that every scalar objective should be converged separately.
If alpha or chi drifts outside tolerance, restore the relevant capacitance
controls in focused derived-objective blocks and recheck the modal goals.

An empty stage `analysisTargets` list does not necessarily suppress automatic
analysis-priority recovery when derived rows remain globally enabled. Inspect
active controls, target rows, timing and recovery counts before diagnosing a
slow modal pass as root-tracking failure. A separate diagnostic modal-only
configuration may temporarily disable derived optimizer rows while retaining
their original acceptance goals. Restore them for the complete final
mode/analysis checkpoint and saved handoff. Do not disable acceptance checks,
invent a recovery-off option, or call the partial phase fully converged.

## Verify the returned physical circuit

Apply the returned parameters to the task-owned circuit and recompute all
distinct loaded poles with the same port loads. Verify root residuals and
physical ownership, not sorted-frequency labels or target markers. A missing
narrow pole may be outside a search window; establish that before concluding
that field matching failed. Refresh markers only from verified physical roots.

Run fresh full-array EPR with the complete verified root pool. Check every
original f01, readout frequency, linewidth, alpha, chi, filter goal and parameter
bound. Neither the last pair's result rows nor a final checkpoint controlling
only the filter can repair earlier readout misses automatically. Preserve the
successful seeded start, endpoint, exact schedule and separate audit receipts
under the main skill's reproducibility rules.

## Recorded twelve-pair example

The request specified evenly spaced qubit f01 from 3 to 5 GHz and readout
linear resonances from 6.25 to 7.75 GHz, alpha -200 MHz, full chi -0.3 MHz,
readout kappa 0.3 MHz and a filter at 6.5 GHz with 600 MHz linewidth. There
were 25 modes and 62 scalar physical goals, with no qubit linewidth target.

An earlier native-converged endpoint passed only 47/62 original goals despite
meeting all qubit f01, alpha and chi goals. A later modal correction exhausted
the input-segment minimum with a long CTL. The successful candidate shortened
inter-cell plain sections from about 0.273 to 0.020 mm, used a 2 mm output
section, and retuned the input, CTLs and resonators. Final CTLs were about
0.064–0.282 mm. Two full-circuit pair sweeps plus a complete checkpoint passed
62/62 in a saved-input replay: 27 stages, no retries or priority recoveries,
about 338 seconds of solver work. Fresh pole/EPR audits confirmed the result.

This was a warm start from the earlier physics-seeded array, with geometry and
schedule changes. It does not isolate their individual causal contributions,
establish an optimal ordering, guarantee cold-start convergence, or set a
portable runtime budget. Native source replay and Desktop preflight were
checked separately; do not describe them as a completed Desktop/MCP replay.
