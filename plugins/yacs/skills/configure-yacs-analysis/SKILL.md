---
name: configure-yacs-analysis
description: Translate a physical question about the open YACS circuit into the correct driven-network, det(Y), EPR, Portwise T1, Rabi-rate, or Exchange-J analysis; create or configure it through YACS, run it, and explain the result. Use when a user asks what analysis to use, how to find modes or linewidths, measure S/Z/Y response, Kerr or participation, loss channels, drive strength, or qubit coupling, especially when no suitable analysis is configured yet. Do not use for parameter or flux sweeps.
---

# Configure a YACS Analysis

Use renderer-owned YACS defaults and schemas. Do not reproduce an analysis
outside YACS or invent configuration fields.

## Document progress with snapshots

For hands-on YACS work, tell the user you will document progress with frequent
snapshots: at the starting state, after meaningful changes, at useful milestones
during long runs, and at the final result.

- Use PNG as the default snapshot format so it displays inline on phones and
  computers. For schematics, call `snapshot_yacs` with `view: "circuit"`.
  Keep the high-resolution default: up to two pixels per native SVG unit,
  `max_dimension: 18000`, and a 25-megapixel total allocation cap. A long
  12-pair array can render around 17,306 x 1,250 pixels. Use lower resolution
  only for a lightweight preview; do not replace the full-resolution output.
- Preserve the circuit's component names, parameter values, units, variable
  expressions, and annotations as rendered by YACS. Do not strip numerical
  labels, replace them with generic symbols, or hide values to make a snapshot
  simpler unless the user explicitly requests a value-free schematic.
- For interface views, use `snapshot_yacs` with `view: "window"` to capture PNG
  screenshots of controls, dialogs, progress, or results as shown in the app.
  Window captures retain native screen resolution rather than being enlarged.
- Share the PNG inline and link the full-resolution file for zooming. Offer SVG
  or PDF only when requested.

Inspect the rendered output and post it inline in a user-visible progress
update with a brief observation and next step. Avoid duplicate images of
unchanged state; use result tools to substantiate numerical claims.

## Route the physical question

- Transmission, reflection, or port-to-port response: `S`.
- Port impedance or admittance: `Z` or `Y`.
- Natural frequencies, linewidths, quality factors, or fields: `detY`.
- Qubit and resonator frequencies in a circuit containing Josephson junctions:
  `EPR`, reporting **f01 (GHz)** from **Frequency corrections** for both kinds
  of mode (`shifted_frequency_ghz`). Use detY to locate the linear modes when
  needed, then obtain a current EPR result at the same circuit and bias. Report
  linear eigenfrequencies separately only when requested, and label them as
  linear; if EPR cannot be obtained, say that f01 is unavailable.
- Junction participation, anharmonicity, Kerr, or thermal dephasing: `EPR`.
- Port-resolved relaxation or lifetime: `portwiseT1`.
- Drive coupling, Rabi frequency, or pi time: `rabiRate`.
- Bare or effective qubit-qubit coupling: `exchangeJ`.
- Dependence on a parameter or flux: use the `sweep-yacs-design` workflow.

State the selected analysis and why it answers the question before creating or
materially reconfiguring it.

## Inspect before configuring

1. Call `get_yacs_status` when needed.
2. Read `get_yacs_topology` for the active page or circuit-model owner.
3. Reuse an existing analysis when its kind and physical scope match. Read it
   with `get_yacs_analysis_context`.
4. If none matches, call `get_yacs_catalog` with the analysis scope, then create
   one analysis under the correct owner with `apply_yacs_plan` and the current
   revision. Let YACS materialize its defaults before reading the new context.
5. Pair the analysis ID with its owner ID throughout the workflow.

Do not change circuit parameter values merely to make an analysis run.

## Configure from actual circuit entities

- Select ports, loops, junctions, and modes returned by topology and context;
  never invent names or IDs.
- Prefer the smallest port pair, mode count, frequency window, and output set
  that answer the question.
- Use explicit user frequencies or existing configured values when available.
  If no defensible frequency window exists and the choice changes the physical
  question, ask one concise question rather than guessing.
- For modal, EPR, Purcell, or multi-mode work, read
  `yacs://analysis-optimization-guide` and establish mode ownership from
  participation or fields rather than sorted frequency alone.
- Apply related configuration changes together under the current revision, then
  read the resulting analysis context and resolve every preflight error.
- Preserve unrelated analyses, results, parameters, plot choices, and document
  structure.

## Run and explain

Start the analysis with `run_yacs_analysis`, handle native YACS questions with
the pending-dialog tools, and monitor with bounded
`get_yacs_active_analysis` calls. Inspect a compact completed result with
`inspect_yacs_result`.

Report the analysis and owner, material configuration, measured result with
units, warnings, and physical interpretation. Distinguish YACS values from
inferences. If the result is empty or implausible, diagnose the exact port,
window, connectivity, mode-ownership, or staleness issue before retrying.
