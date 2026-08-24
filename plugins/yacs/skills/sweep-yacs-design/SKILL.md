---
name: sweep-yacs-design
description: Configure, run, and interpret one- or two-axis YACS Parameter Sweeps for component parameters, variables, and superconducting-loop flux. Use for sensitivity, tolerance, robustness, design maps, flux dependence, operating-region searches, or questions such as what happens when a parameter changes. Preserve physical mode identity and distinguish real trends from tracking failures.
---

# Sweep a YACS Design

Use YACS Parameter Sweep analyses and bounded result inspection. Do not export
the circuit or reproduce the sweep outside YACS.

## Define the question and baseline

1. Call `get_yacs_status` when needed and read `get_yacs_topology` for the
   affected owner.
2. Identify the measured output, the candidate control parameter or loop flux,
   and the nominal circuit state. State any inferred choice before mutation.
3. Prefer one axis. Use two axes only when the user requests a design map or the
   interaction between two controls is central to the question.
4. Reuse a suitable source analysis and verify its context. If no source
   analysis answers the question, configure and validate that analysis first.
5. Reuse an existing Parameter Sweep when its source, axes, and output match;
   otherwise create one under the same owner with `apply_yacs_plan`.

## Configure a bounded sweep

- Use only parameter, variable, or loop-flux tokens returned by YACS.
- Preserve the nominal value. If a parameter must be exposed through a variable
  or binding, make the smallest reversible change and preserve its evaluated
  baseline value.
- Honor user-provided bounds. Otherwise choose a modest local range around the
  nominal value, remain inside catalog or physical bounds, and report the
  assumed range.
- Start with the lowest resolution that reveals the trend. Increase point count
  only when curvature, a crossing, or a narrow feature requires it.
- Select one primary output that directly answers the question. Add secondary
  outputs only when they reveal an explicit tradeoff.
- For det(Y), EPR, flux, or multi-mode sweeps, read
  `yacs://analysis-optimization-guide`. Track physical modes by participation,
  fields, and root provenance; never treat sorted frequency as stable identity.
- Read the resulting context and resolve all axis, source-analysis, binding,
  port, and preflight errors before running.

## Run and interpret

Run with `run_yacs_analysis`, handle YACS-owned questions through the dialog
tools, and monitor with bounded `get_yacs_active_analysis` calls. Inspect only
the summary and bounded series or table slices needed for the conclusion.

Report:

- source analysis, axes, nominal point, ranges, units, and resolution;
- the main trend and local sensitivity near nominal;
- extrema, crossings, discontinuities, and robust or fragile regions;
- tradeoffs visible in secondary outputs; and
- any evidence of lost mode identity, failed points, or stale dependencies.

Do not describe a discontinuity as physics until tracking and convergence are
verified. Recommend a denser local follow-up only around a feature that affects
the user's decision.
