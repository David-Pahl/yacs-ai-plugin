---
name: repair-yacs-circuits
description: Diagnose and repair broken, invalid, imported, or visually damaged YACS workspaces through the installed YACS Desktop MCP tools. Use for dangling connections, distorted terminals, wire overlaps, invalid references, model cycles, failed preflight, or analysis configuration that no longer matches the circuit.
---

# Repair YACS Circuits

Repair through the YACS MCP tools. Do not use Computer Use or hand-edit saved
`.yacs` data when the MCP can express the change.

## Diagnose before editing

1. Call `get_yacs_status` when connection state is unknown.
2. Read `get_yacs_topology` for the affected page or circuit-model owner.
3. Call `render_yacs_page` and inspect the actual schematic when geometry or
   routing may be involved.
4. Use `get_yacs_analysis_context` for analysis, binding, port-load, or
   preflight failures.
5. Identify the smallest confirmed defect. Separate topology errors, visual
   defects, stale references, and physically invalid analysis assumptions.

## Apply a minimal repair

- Send related structural, placement, and cleanup actions together with
  `apply_yacs_plan` under the revision returned by the read tools.
- Preserve element IDs, parameter values, variables, model bindings, analyses,
  and saved results unless one is the source of the defect.
- Treat non-wire symbols and their terminals as rigid geometry. Move a complete
  symbol with its canonical terminals; use explicit orthogonal wires for
  offsets.
- Do not replace an unknown component or silently delete an analysis to make a
  validation error disappear.
- On `revision_conflict`, re-read topology and re-plan. Do not replay a stale
  mutation blindly.
- Handle YACS popups with `get_yacs_pending_dialog` and
  `respond_to_yacs_dialog`.

## Verify the repair

After the edit, re-read compact topology and render the page. Confirm that the
intended connectivity is preserved, symbols retain canonical terminal geometry,
no wires cross symbol bodies unintentionally, labels remain readable, and the
original error or preflight issue is resolved. If the repair affects an
analysis, run only the smallest relevant validation and report any remaining
warnings.

Explain what was wrong, what changed, what was deliberately preserved, and how
the repair was verified. Do not claim completion from a successful mutation
response alone.
