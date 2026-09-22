# Project overview

## Product definition

hapticOS is a proposed Android application that translates selected phone events into a small vocabulary of vibration patterns. It brings important alerts, walking guidance and camera alignment into one coordinated interaction system.

## Intended users and problem

The initial audience is people who want fewer screen checks during everyday tasks. A ride arrival message, an approaching turn and an object entering the camera view are different events. Treating them as the same buzz loses useful context; adding many arbitrary rhythms creates a learning burden.

The product hypothesis is that a small vocabulary, a short tutorial and clear mode context can make these events easier to recognise. This remains a hypothesis. No user study, retention result or accessibility benefit has been established.

## Current deliverable

The concept is a static browser application. Users can choose a sample alert, replay its visual pattern, advance through a walking route, adjust simulated camera alignment and hide the target. State remains in memory. Reloading or changing modes resets the relevant scenario.

The interface resembles a mobile app and shows a phone frame on larger screens. There is no authentication, backend, database, model execution or device integration.

## Example walkthrough

1. Open Alerts and select the shopping promotion. The example produces no priority cue.
2. Select the ride arrival message. The visual preview shows two short pulses.
3. Select the incoming call. A sustained pulse distinguishes it from the message.
4. Open Navigate and advance through the route: start, right turn, left turn and arrival.
5. Open Find and move the slider toward the centre. Centre the bottle, then hide it to demonstrate loss of visibility.

The actual tactile distinguishability of these patterns still needs evaluation. Pattern reuse across modes is an explicit testing question; the current interface illustrates semantics, not a validated haptic vocabulary.

## Native implementation scope

The first native milestone is deliberately bounded: selected notification sources, one cellular call integration, one walking route and three categories supported by the chosen object detector. All three paths feed a shared cue scheduler.

The text model interprets eligible notification content into fixed categories. Rules handle configured cases and provide a deadline fallback. The detector processes frames only while finder mode is active. Route and location logic produce turn events without relying on a language model.

## Performance and resource strategy

Rule events should reach the vibration API promptly. Camera analysis should use fresh frames rather than processing a growing backlog. Text classification needs a deadline so late inference cannot produce an outdated second cue.

Proposed initial targets are p95 below 50 ms from a rule callback to the vibration request, p95 below 300 ms from an analysed camera frame to that request after target acquisition, and a 1.5 second text classification deadline. These are unmeasured targets. Confirmation delays must be counted. Software timing is separate from physical motor onset.

Keep sensing tied to active modes, bound model input and output, and avoid repeated inference for equivalent events. Compare matched workloads before claiming battery savings.

## Privacy and permissions

The native design processes selected text and frames locally and avoids retaining raw notification content or camera frames by default. Users choose eligible sources and can revoke device access. Android permission, background execution and vibration policies remain authoritative. A route provider may still require network access.

## Limits

The finder requires a visible target and adequate detection conditions. It does not locate hidden objects, measure reliable distance or prove that a path is safe. Navigation is not obstacle detection. An incoming call event does not establish caller identity or urgency. The scheduler controls hapticOS output, not every other app's vibration.

## Longer term direction

First test cue recognition, task usefulness and voluntary repeat use in a small Android beta. If the engine proves useful across different apps and devices, developer or OEM integrations could become a later distribution and licensing path. No partnerships or revenue are claimed.

Gaming requires integration with a game. Accessibility expansion requires research with intended users. Both remain outside the initial build commitment.
