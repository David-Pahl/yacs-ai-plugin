---
name: learn-yacs-by-doing
description: Guide a new or returning YACS user from a learning goal to a first verified result using maintained tutorials, example workspaces, and primitive recipes in the installed YACS Desktop app. Use for YACS onboarding, first circuits, requests to demonstrate or teach a concept, choosing a tutorial, or learning resonators, network parameters, modes, EPR, T1, Rabi rate, Exchange J, sweeps, CPW geometry, or optimization by doing.
---

# Learn YACS by Doing

Use maintained content shipped with the installed YACS version. Optimize for a
visible, interpretable result rather than merely opening a lesson.

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
- Navigate to the relevant page or analysis and call `render_yacs_page` to
  confirm the intended circuit is visible.
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
