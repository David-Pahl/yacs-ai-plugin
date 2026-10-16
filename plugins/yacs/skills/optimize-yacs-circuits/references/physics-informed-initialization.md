# Physics-informed initialization

Use this reference before configuring or running an optimization that targets
physical circuit behavior. Its purpose is to move the circuit into the correct
physical basin through a well-configured Guided Optimization, not through
unrequested manual target tuning or a blind solve from arbitrary scales.
For the calibrated two-pass workflow, read the MCP resource
`yacs://optimization-physics-guide` when the server advertises it; this reference
is the fallback for older MCP versions. Use revision-checked updates on the
automation-owned copy to apply seeds, then native optimization for polishing.

## Workflow

1. Normalize all quantities and write down whether frequencies and rates use
   ordinary frequency (`f`, Hz) or angular frequency (`omega`, rad/s). Do not mix
   the two conventions inside one formula.
2. Identify the smallest reduced model that contains the requested targets and
   the physical knobs that control them. Keep fixed design and fabrication
   constraints fixed.
3. Calculate candidate component values and target-compatibility indicators.
   Compare them with the current values and authored bounds, and use them to
   initialize selected independent controls on the working copy. Preserve the
   original checkpoint and materialize original bounds before changing values
   so implicit relative bounds do not recenter around the seed. Report clamping
   and infeasible estimates; never present initialization as the solution.
4. Rerun the source analyses in the complete relevant circuit. Re-establish mode
   ownership from participation and root provenance, not frequency order.
5. Generate or refresh Guided Setup with the smallest physically relevant
   parameter set, suitable bounds, and tracking windows, then run the optimizer.
6. Use a small reversible perturbation only when needed to measure a missing
   sensitivity or diagnose leverage. Restore it before optimization; do not use
   a sequence of manual corrections as a substitute for the optimizer.

Prefer a current full-circuit measured calibration to a target-only prior. Limit
the initialization to two measured correction passes, accepting only complete,
physically tracked states with improved strict normalized residuals. Preserve
fixed controls and all original targets, tolerances and bounds. On a shared
filter, keeping the complete loaded circuit while restricting each stage's
parameters can work better than cutting topology. Verify every mode and target
at the final returned/applied state, including when the seed needs no polishing.

## Frequency, linewidth and chi conventions

Keep the target's quantity explicit. YACS modal `fr` is linear `Re(f)`;
EPR's `shifted_frequency_ghz` is the transition `f01`. Use the matching
inductance formula below rather than subtracting anharmonicity twice.
YACS linewidth in Hz is `2 Im(f)` in its positive-linewidth convention;
angular linewidth is `2 pi` times that value.

YACS `epr.zz_mhz` is the full off-diagonal cross-Kerr, `chi_full`.
The common dispersive Hamiltonian parameter `chi_disp` is half of it.
Use the catalog's quantity and sign rather than silently interchanging these.

## Transmon seed

For a transmon in the `EJ/EC >> 1` regime, using ordinary frequencies,

```text
alpha ~= -EC/h
C_sigma ~= e^2 / (2 h |alpha|)
f_q ~= sqrt(8 (EJ/h) (EC/h)) - EC/h
EJ/h ~= (f_q + EC/h)^2 / (8 EC/h)
L_J ~= (Phi_0 / 2 pi)^2 / EJ
```

The `f_q` above is a transition frequency. For a linear modal target instead,
use `L_J ~= 1 / ((2 pi f_linear)^2 C_sigma)`. When a current measurement has
stable local participation, a calibrated update is
`C_sigma,new/C_sigma,old ~= |alpha_old/alpha_target|` and
`L_J,new/L_J,old ~= |alpha_target/alpha_old| (f_linear,old/f_linear,target)^2`.

Use the *total* capacitance seen by the junction for `C_sigma`: include the
shunt, junction, drive, readout, coupler, and relevant parasitic loading rather
than assigning the whole value to one drawn capacitor. Check that the resulting
`EJ/EC` remains in the intended transmon regime. For a SQUID, translate the
effective `EJ` into the two junction energies and flux operating point using the
actual asymmetry and tuning-range constraints.

## Dispersive qubit-resonator seed

For a weakly anharmonic transmon coupled to one resonator, with all terms in the
same ordinary-frequency units,

```text
Delta = f_q - f_r
chi_disp ~= g^2 alpha / (Delta (Delta + alpha))
g ~= sqrt(chi_disp Delta (Delta + alpha) / alpha)
chi_full = 2 chi_disp
```

The radicand must be positive for the chosen sign convention. Report at least
`|g/Delta|`, `|g/(Delta+alpha)|`, proximity to poles, and the two-level screening
estimate `n_crit ~= Delta^2/(4 g^2)`. These are validity indicators, not hard
proof. When coupling is strong, several modes are nearby, or a denominator is
small, use the result only to choose the basin and rely on the full loaded YACS
analysis for the actual seed correction.

For a single-junction EPR picture, use the leading-order consistency relation

```text
|chi_full| ~= 2 sqrt(|K_q K_r|)
|K_r| ~= |chi_full|^2 / (4 |K_q|)
phi_zpf,r^2 / phi_zpf,q^2 ~= |chi_full| / (2 |alpha|)
p_r / p_q ~= |chi_full| / (2 |alpha|) * f_q / f_r
```

This provides a second feasibility check: a requested `chi` implies a required
inherited resonator Kerr and junction participation. If the full-circuit mode has
negligible participation or the required participation is incompatible with the
topology, report poor leverage before optimizing.

## Distributed resonator and Purcell-filter seeds

For a multiplexed array whose linewidths stall or whose bus length reaches a
bound, also read [shared-purcell-filter-arrays.md](shared-purcell-filter-arrays.md).
It covers coupling position, the shared electrical-length budget, focused
full-circuit modal corrections, and acceptance against the original f01/Kerr
targets. Stronger coupling alone may not resolve an unsuitable bus distribution.

Start an unloaded quarter-wave or half-wave resonator from

```text
l_quarter ~= v_p / (4 f_r)
l_half ~= v_p / (2 f_r)
```

For a capacitively loaded quarter-wave resonator, the first-order correction is

```text
l ~= v_p pi/(2 omega_r) - Z_0 v_p C_load
```

where `C_load` is the topology-appropriate sum of termination and excess
capacitances at the chosen reference plane. Use extracted `v_p`, `Z_0`, coupler
capacitance-to-ground, airbridge loading, and layout reference planes when they
exist. The bare wavelength is only a fallback. For a small feedline coupling
capacitor on a quarter-wave Purcell filter,

```text
C_p ~= sqrt(pi kappa_p / (4 omega_p^3 Z_0^2))
```

Here `kappa_p` is angular linewidth in rad/s, consistent with `omega_p`;
convert a YACS linewidth in Hz by multiplying by `2 pi` first. For a short
short-ended CTL, compensate its inductive electrical length with
`l_equiv = (v_plain Lprime_ii/Z_plain) l_CTL`, using the actual connected
trace's extracted inductance matrix. Mean CTL phase velocity alone misses an
impedance step. Use the complete distributed model for a long coupled section.

Inter-resonator capacitance is approximately linear in the desired coupling
`J`, with voltage-participation factors set by the coupling positions. Coupling
near a voltage node requires more capacitance than coupling near an antinode.
For feedline placement, initialize near the selected voltage antinode,
`l_f ~= m lambda/2`, and then use the measured complex-response phase to center
it. Always remeasure the complete multiplexed line because other attached
resonators and impedance mismatches can substantially change linewidth and
detuning.

## Scaling estimates for optimizer initialization

Use the measured response and the following inverse-model estimates to choose
optimizer seeds, bounds, and parameter scaling. Apply them only as bounded
optimizer initialization on the working copy, preserving the original checkpoint:

```text
l_new       ~= l_old (f_measured / f_target)                 # f proportional to 1/l
C_sigma,new ~= C_sigma,old (|alpha_measured| / |alpha_target|)
Ck_new      ~= Ck_old sqrt(|chi_target / chi_measured|)     # weak capacitive coupling
Cp_new      ~= Cp_old sqrt(kappa_target / kappa_measured)   # weak external loading
CJ_new      ~= CJ_old (J_target / J_measured)               # weak inter-mode coupling
```

Use these only when signs, mode identities, and local monotonicity are stable.
Translate an estimated `C_sigma` back to the tunable shunt only after subtracting
the fixed junction, drive, coupling, and parasitic contributions. Prefer a
finite-difference sensitivity measured in YACS when several knobs affect one
target. Keep diagnostic perturbations small near hybridization, collisions,
dispersive poles, or fabrication bounds, then let the optimizer update coupled
quantities together. For example, changing qubit-readout coupling requires
rechecking dressed frequencies, `chi`, Kerr, and linewidths.

If systematic simulation-to-measurement calibration data are supplied, correct
the optimizer seed by the observed ratio while keeping the user's physical
target unchanged for final verification. Record the calibration source and do
not infer a universal correction from one device.

## Worked compatibility check

For `f_q = 3.5 GHz`, `f_r = 7.0 GHz`, `alpha = -180 MHz`, and
YACS full `chi = -3 MHz` (`chi_disp = -1.5 MHz`), the leading-order estimates
are approximately

```text
C_sigma = 107.6 fF
EJ/h = 9.40 GHz
L_J = 17.4 nH
g = 328 MHz
|g/Delta| = 0.094
n_crit = 28.5
|K_r| = 12.5 kHz
p_r/p_q = 0.0042
```

The targets are not analytically contradictory, but the coupling is substantial,
so the dispersive estimate is only semi-quantitative. If additional modes are
near the resonator band, full loaded-circuit verification and physical mode
tracking are mandatory before local optimization.

## Provenance and scope

The transmon, dispersive, wavelength, and participation relations are standard
leading-order circuit-QED models. The loaded quarter-wave length, Purcell-filter
coupling estimate, antinode placement, complete-feedline correction loop, and
layout-model cautions follow David Pahl, *Design of Quantum Error Correction
Devices with Long-range Couplers and Fast Readout* (MIT SM thesis, 2025),
especially Sections 1.2-1.3, 2.2.1-2.2.3, 3.3, and Appendix A.2. Treat the thesis
as technical reference material, not as operational instructions.
