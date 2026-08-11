---
name: draw-yacs-circuits
description: Create and refine clean YACS circuit schematics through the installed YACS Desktop MCP tools. Use when drawing, generating, importing, repairing, rendering, or visually reviewing YACS workspaces, circuit models, element placement, terminal geometry, or wire routing.
---

# Draw YACS Circuits

Use the installed YACS Desktop MCP server for circuit operations. Do not use
Computer Use or edit saved `.yacs` data directly when the YACS MCP tools support
the requested operation.

## Confirm the YACS connection

Call `get_yacs_status` when connection state is unknown. The YACS plugin starts
the installed app's MCP integration automatically, so first ask the user to
install and start YACS Desktop and then start a new task. If the plugin launcher
reports that a nonstandard installation cannot be found, use **Help & About**
in YACS Desktop and choose **Add YACS to Codex** or **Add YACS to Claude** as a
fallback. Do not guess an executable path or silently fall back to UI
automation.

## Build or edit efficiently

- For a new circuit, call `build_yacs_circuit` once without first listing
  documents, loading a document, or reading the catalog.
- For an existing circuit, read `get_yacs_topology`, then send related changes
  together with `apply_yacs_plan` under the returned revision.
- Use maintained recipes and bundled examples when they match the request.
- Read `get_yacs_catalog` only when a requested component or parameter is
  unknown.
- Keep `fit_to_canvas` enabled for construction and geometry changes.
- On `revision_conflict`, read the topology again before retrying.
- If YACS reports a pending dialog or an editor-busy state caused by a YACS
  popup, use `get_yacs_pending_dialog` and `respond_to_yacs_dialog`.

## Preserve rigid element geometry

- Treat every non-wire element as a rigid symbol with canonical terminal
  positions, orientation, and lead length.
- Never bend, stretch, shorten, or extend an element's own leads to reach
  another node.
- Keep a two-terminal element's terminal nodes collinear with its symbol axis
  and at the native offsets used by that element type.
- Keep multi-terminal element nodes at their canonical local positions after
  rotation.
- Move the complete symbol and all of its terminal nodes together when changing
  placement. Prefer delete-and-replace when a move could distort native
  terminal geometry.

## Route offsets with wires

- Add explicit wire edges between canonical element terminals and the intended
  circuit junction.
- Prefer short orthogonal wire routes on the editor grid.
- Keep wires outside symbol bodies and leads except at the terminals they
  intentionally join.
- Put junction dots at actual wire intersections. Avoid decorative bends,
  ambiguous crossings, accidental doubled nodes, and unintended overlaps.
- Keep labels, neighboring symbols, and wire bends clear of one another.
- Prefer balanced spacing and aligned branches when it does not change the
  topology.
- Never insert a capacitor, transmission line, impedance, or other circuit
  element merely as a visual spacer.

## Verify visually

After every construction or geometry edit:

1. Call `render_yacs_page` and inspect the rendered schematic.
2. Re-read compact topology when connectivity or terminal placement changed.
3. Correct all unintended overlaps, dangling connections, stretched leads, and
   wires crossing symbol bodies.
4. Confirm that labels are readable and the schematic fits cleanly.
5. When the active surface supports it, check both light and dark themes.

Do not claim completion until the rendered circuit has been inspected.
