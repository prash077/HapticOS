# Validation guide

## Browser prototype

Serve `prototype` locally and complete the following checks. This is a manual checklist, not an assertion that every browser or assistive technology has been tested.

| Scenario | Expected result |
| --- | --- |
| Select each alert | Selected state, meaning and visual pattern agree |
| Select promotion | No priority cue; replay is disabled |
| Replay an active cue | Visual animation restarts |
| Advance navigation | Start, right turn, left turn and arrival match map position |
| Finish the route | Next step is disabled |
| Restart navigation | Position returns to the start |
| Adjust finder slider | Alignment state changes with target position |
| Centre the bottle | Target is centred and confirmation appears |
| Hide the target | Alignment stops; loss state appears; slider is disabled |
| Show the target | Target and controls return |
| Switch modes | Correct title, navigation state and scenario render |
| Open an invalid hash | Alerts mode provides the fallback |
| Open and close information | Dialog opens and closes through its controls |
| Use keyboard navigation | Focus remains visible and buttons are usable |
| Enable reduced motion | Animated cue styling respects the preference |
| Use narrow and wide viewports | Content remains readable and controls remain reachable |

Check the browser console for errors. A visual cue does not verify physical haptic output.

## Native acceptance work

Test denied permissions, redacted notifications, unavailable call integration, cold model starts, invalid model output, classification timeout, target loss, stale routes and simultaneous events. Capture actual device and OS details with the results.

After a short cue tutorial, record recognition errors and sample task completion. Report the actual sample size and conditions. Do not generalise an exploratory sample into a validated accessibility claim.

For energy comparisons, use identical workloads, duration, brightness, network state and device conditions. Compare haptics enabled against disabled to isolate cue cost, and bounded analysis against continuous analysis to evaluate sensing policy. A short battery percentage change is not a precise energy measurement.
