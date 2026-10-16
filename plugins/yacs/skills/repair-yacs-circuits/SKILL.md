---
name: repair-yacs-circuits
description: Diagnose and repair broken, invalid, imported, or visually damaged YACS workspaces through the installed YACS Desktop MCP tools. Use for dangling connections, distorted terminals, wire overlaps, invalid references, model cycles, failed preflight, or analysis configuration that no longer matches the circuit.
---

# Repair YACS Circuits

Repair through the YACS MCP tools. Do not use Computer Use or hand-edit saved
`.yacs` data when the MCP can express the change.

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

## Diagnose before editing

1. Call `get_yacs_status` when connection state is unknown.
2. Read `get_yacs_topology` for the affected page or circuit-model owner.
3. Call `snapshot_yacs` with `view: "circuit"` and inspect its high-resolution
   native PNG schematic when geometry or routing may be involved.
   Treat the complete port circle and ground shape as occupied SVG geometry:
   except for the intended connection at its attachment point, no component
   body, lead, wire, or other symbol may overlap either marker.
   Wire routes must clear the full port and ground triangles, including their
   transparent interiors and leads, in every rotation.
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
