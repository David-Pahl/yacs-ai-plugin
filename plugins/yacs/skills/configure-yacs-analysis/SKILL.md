---
name: configure-yacs-analysis
description: Translate a physical question about the open YACS circuit into the correct driven-network, det(Y), EPR, Portwise T1, Rabi-rate, or Exchange-J analysis; create or configure it through YACS, run it, and explain the result. Use when a user asks what analysis to use, how to find modes or linewidths, measure S/Z/Y response, Kerr or participation, loss channels, drive strength, or qubit coupling, especially when no suitable analysis is configured yet. Do not use for parameter or flux sweeps.
---

# Configure a YACS Analysis

Use renderer-owned YACS defaults and schemas. Do not reproduce an analysis
outside YACS or invent configuration fields.

## Route the physical question

- Transmission, reflection, or port-to-port response: `S`.
- Port impedance or admittance: `Z` or `Y`.
- Natural frequencies, linewidths, quality factors, or fields: `detY`.
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
