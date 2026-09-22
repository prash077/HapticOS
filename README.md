# hapticOS

### Alerts and guidance through vibration

**[Try the prototype](https://hapticos-concept.rprashasthimmanuel.chatgpt.site)**

[Watch the video walkthrough](https://youtu.be/d0YB6hC-wEo) · [View the source](https://github.com/prash077/HapticOS)

hapticOS explores how a phone can communicate useful information through touch. It brings important alerts, walking directions and guidance toward visible objects into one experience using distinct vibration patterns.

Prepared for **iQOO City Battles 2026**.

> **Current status:** A clickable browser concept with simulated scenarios and visual haptic previews. Live Android events, local AI inference and physical vibration are planned for the native build. The prototype demonstrates the interaction, not those integrations.

## Try it in two minutes

Open **[the prototype](https://hapticos-concept.rprashasthimmanuel.chatgpt.site)** in your phone or desktop browser.

1. **Alerts:** Select the ride notification and compare its visual cue with the other sample events.
2. **Navigate:** Start the sample walk and advance through the route instructions.
3. **Find:** Move the simulated bottle into the centre of the camera field, then hide the target to explore the change in state.

The waveforms illustrate proposed vibration patterns. They do not demonstrate physical haptic output. No installation is needed to explore the hosted concept.

## The problem

A vibration can get your attention without explaining what needs it. A message might be a promotion or a driver waiting outside. Walking directions require a timely cue. Finding a bottle through a camera requires knowing whether the phone is pointing at it.

hapticOS is intended for Android users who want useful information without repeatedly checking their screens. The goal is to make a small set of meanings recognisable through touch and test whether those cues help users complete everyday tasks.

## Three focused experiences

| Experience | Real world example | Planned native behaviour |
| :--- | :--- | :--- |
| Important alerts | Your driver says they have arrived. | Selected notification text and user rules determine whether to play an attention cue. A supported call event has its own pattern. |
| Walking guidance | You are following a route to a café. | Route progress triggers learned rhythms for left, right and arrival. Outdated instructions are cancelled. |
| Visible object finder | You point the camera toward a bottle. | A local detector identifies the supported target. Pulses change with camera alignment, with distinct handling for centring and target loss. |

The finder can only work with objects visible to the camera. It cannot locate a bottle hidden under a bed or infer a safe path toward it. Camera alignment does not establish distance.

## What makes the engineering interesting

The central challenge is coordinating cues when events overlap.

Imagine a turn instruction is pending when a call arrives. The engine should handle the interruption, discard the turn if it has become outdated, and resume only with current guidance. Repeated camera detections should not create a queue of unnecessary vibrations.

The proposed shared cue engine will:

1. Normalise events with their source, identity, time and expiry.
2. Reject stale or duplicate events.
3. Resolve priority and combine repeated updates.
4. Choose a learned pattern supported by the device.
5. Recheck validity before playback and cancel obsolete output.

AI interprets selected inputs. Deterministic rules decide when and how hapticOS vibrates. Users will learn a small pattern vocabulary rather than receive newly generated rhythms for every event.

## Proposed native architecture

The Android app supplies three input paths to the shared engine: selected alerts and call state, walking route progress, and camera detections. The engine sends supported effects through Android vibration APIs. Android and the device vendor manage the underlying hardware services and motor driver.

| Layer | Planned technology | Responsibility |
| :--- | :--- | :--- |
| Android interface | Kotlin and Jetpack Compose | Mode selection, cue learning and user preferences |
| Alert input | NotificationListenerService and a supported call integration | Receive permitted events and handle unavailable content |
| Text interpretation | Qwen2.5 0.5B Instruct candidate through llama.cpp | Classify eligible notification text with constrained output and a rule fallback |
| Camera input | CameraX | Supply recent frames while finder mode is active |
| Object detection | EfficientDet Lite0 candidate through MediaPipe | Identify supported visible objects and their image position |
| Navigation | Phone location and route data | Determine current manoeuvres and reject outdated guidance |
| Cue coordination | Shared deterministic scheduler | Handle priority, freshness, interruption and cancellation |
| Physical output | Android VibrationEffect APIs | Play supported patterns with device capability checks |

These are implementation choices for the proposed native build. They are not a list of dependencies already running in the browser prototype.

A CPU baseline comes first. Snapdragon NPU acceleration depends on model compatibility, runtime support and testing on the loaner device. Routing may require connectivity. No latency, battery saving or recognition results are claimed yet.


## System architecture

![Proposed native Android architecture](docs/assets/hapticOS_Architecture.png)

[Open the scalable diagram](docs/assets/hapticOS_Architecture.svg)


## Current implementation and planned work

| Capability | Clickable concept | Native build goal |
| :--- | :--- | :--- |
| Three mode interface | Available | Implement on Android |
| Haptic patterns | Visual previews | Physical vibration with tested fallbacks |
| Alerts and calls | Sample events | Selected notification sources and one supported call integration |
| Walking directions | Scripted route | One route using location and route progress |
| Object finding | Simulated camera field | Camera input and three supported object categories |
| Local AI | Not integrated | Selected text interpretation and object detection |
| Cue coordination | Illustrated interactions | Shared scheduling, cancellation and freshness checks |

## iQOO and Office Kit

The iQOO phone is where the native interaction will be tested. Its camera and location capabilities provide inputs, local computation interprets selected data, and its vibration motor delivers feedback.

Office Kit supports development through the phone and laptop connection, including screen mirroring, input, clipboard and file transfer. We will follow the event's Red Light and Green Light restrictions. Office Kit is a development tool, not a dependency for someone using the finished app.

## Build and validation plan

The 30 hour scope targets selected notification sources, one supported call integration, one walking route and three supported object categories.

1. Check device capabilities and implement cue playback, learning and cancellation.
2. Complete one live input to vibration interaction.
3. Connect the remaining scoped inputs to the shared engine.
4. Test interruptions, lost targets, unreliable location and permission changes.
5. Demonstrate the interaction on the iQOO phone.

Validation will measure cue recognition after a short tutorial, task completion and event to API dispatch time. We will also observe battery and thermal behaviour. API dispatch time is not the same as the physical onset of vibration.

## User control and limitations

The native design will request access only for the features being used and let users select sources and cue preferences. Camera processing will run during active finder use. Local inference is intended to avoid sending notification text or camera frames to a remote model.

The engine manages hapticOS cues. It does not control every other app's vibrations or bypass system settings. Accessibility benefits require dedicated user testing, and the app is not a replacement for mobility aids or safe navigation judgement.

## Technical references and component status

The native design builds on existing platform APIs and model runtimes. hapticOS contributes the proposed interaction design and coordination of cues across its three modes.

1. [Android haptic APIs](https://developer.android.com/develop/ui/views/haptics/haptics-apis)
2. [Android notification listener](https://developer.android.com/reference/android/service/notification/NotificationListenerService)
3. [CameraX image analysis](https://developer.android.com/media/camera/camerax/analyze)
4. [MediaPipe object detector](https://ai.google.dev/edge/mediapipe/solutions/vision/object_detector)
5. [Qwen2.5 0.5B Instruct](https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct)
6. [llama.cpp](https://github.com/ggml-org/llama.cpp)

Models and runtimes listed as candidates are planned components, not completed integrations. Their licences and deployment requirements must be checked before inclusion in the native app. This README does not grant a licence to third party components or establish a licence for this repository.
