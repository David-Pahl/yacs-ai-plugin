---
name: learn-yacs-by-doing
description: Guide a new or returning YACS user from a learning goal to a first verified result using maintained tutorials, example workspaces, and primitive recipes in the installed YACS Desktop app. Use for YACS onboarding, first circuits, requests to demonstrate or teach a concept, choosing a tutorial, or learning resonators, network parameters, modes, EPR, T1, Rabi rate, Exchange J, sweeps, CPW geometry, or optimization by doing.
---

# Learn YACS by Doing

Use maintained content shipped with the installed YACS version. Optimize for a
visible, interpretable result rather than merely opening a lesson.

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

## Choose the shortest successful path

1. Call `get_yacs_status` when connection state is unknown.
2. Call `list_yacs_recipes` and match the user's goal to the smallest maintained
   tutorial, example, model library, or primitive recipe that can demonstrate it.
3. Prefer a focused lesson with a configured analysis over the full course when
   the user names a concept. Prefer the course only for sequential learning.
4. When the request is vague, choose the fastest introductory circuit-and-result
   path. Ask a question only when different choices would teach materially
   different physics.
5. Explain what will be added before changing the document. Add examples beside
   existing work; never replace the user's workspace.

## Produce a verified result

- Add maintained content with `add_yacs_bundled_example`. Use
  `build_yacs_circuit` only for a primitive recipe returned by YACS.
- Call `snapshot_yacs` with `view: "circuit"` for the relevant owner and inspect
  the high-resolution PNG to confirm the intended circuit. Use `view: "window"`
  when explaining the interface.
- Select the configured analysis that directly answers the learning goal. Read
  its compact configuration with `get_yacs_analysis_context` before running it.
- Resolve preflight issues, then run with `run_yacs_analysis`. Handle YACS-owned
  questions with `get_yacs_pending_dialog` and `respond_to_yacs_dialog`.
- Monitor with bounded `get_yacs_active_analysis` calls and inspect the completed
  result with `inspect_yacs_result`.
- Treat a maintained saved result as a reference only when its owner, analysis
  configuration, units, and circuit revision match. Never invent an expected
  numerical value.

If the selected construction lesson has no analysis, verify its schematic and
continue to the nearest maintained analysis lesson that uses the same circuit.

## Teach from the result

Report:

- what was loaded and why it matches the goal;
- the principal measured result with units;
- the physical idea the result demonstrates;
- two or three parameters that are safe to explore and the expected qualitative
  direction of change; and
- the next single action the user can take in YACS.

Keep the maintained baseline unchanged. When the user wants an experiment, work
in a duplicate page or newly added copy, state the prediction first, make one
bounded change, rerun the dependent analysis, and compare the measured result
with the prediction.
