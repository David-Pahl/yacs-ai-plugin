---
name: explore-yacs-examples
description: Discover, open, and explain maintained YACS tutorials, lesson circuits, examples, recipes, and circuit-model libraries through the installed YACS Desktop MCP tools. Use when learning YACS, finding a starting circuit, opening the tutorial course, or adapting a bundled example to a design goal.
---

# Explore YACS Examples

Use the examples shipped with the installed YACS Desktop version so the
workspace, analyses, and expected results stay mutually consistent.

## Find the right example

1. Confirm the connection with `get_yacs_status` when needed.
2. Call `list_yacs_recipes` and select the maintained item that best matches the
   user's learning or design goal. Do not invent recipe names.
3. Prefer the full tutorial-course item when the user asks to learn YACS in
   sequence. Prefer an individual lesson or example for a specific technique.
4. Explain the selected example and any document changes before replacing or
   substantially modifying the user's current workspace.

## Open and orient

- Add a maintained tutorial, example workspace, or model library with
  `add_yacs_bundled_example`.
- Use `build_yacs_circuit` only for a primitive recipe explicitly returned by
  the YACS tools.
- Navigate to the relevant page or analysis, then use `render_yacs_page` to
  confirm that the expected circuit loaded.
- If YACS presents a native choice, inspect it with
  `get_yacs_pending_dialog` and answer with `respond_to_yacs_dialog`.

## Help the user continue

Summarize what was loaded, the circuit's central idea, the analysis or control
the user should try first, and which parameters are safe to explore. Preserve
the maintained original when the user wants to experiment by working in a copy
or newly saved document. When adapting an example, switch to the drawing,
analysis, or optimization workflow appropriate to the requested change.
