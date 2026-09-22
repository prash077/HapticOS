# Proposed Android architecture

![Architecture](assets/hapticOS_Architecture.png)

This document describes the native application proposal. The `prototype` directory implements visual interaction scenarios only.

## Input and interpretation

| Path | Input | Processing | Output event |
| --- | --- | --- | --- |
| Alerts | User selected notification sources | Rules and bounded local text classification | A permitted attention category |
| Calls | Supported cellular call state | Deterministic state mapping | Incoming call state |
| Navigation | Location and a walking route | Route progress and instruction validation | Left, right or arrival |
| Finder | CameraX image frames | Local detection and stable target association | Alignment, centred or lost |

Notification access requires the user's permission and available content. Android can redact sensitive content. Cellular call state support does not imply universal coverage of third party calling apps. The route provider and its terms remain an integration decision.

## Event contract

Each event should contain:

* Event kind and source.
* Monotonic creation timestamp and expiry.
* Source sequence number.
* Route instruction or tracked target identity where applicable.
* Deduplication key.
* Validated payload from a fixed schema.

Model output must be mapped to an allowed category. A model's self reported confidence is not a calibrated probability and must not be treated as one.

## Shared cue scheduler

Use one owner for application haptic output. Validate access and freshness before arbitration and immediately before dispatch. Drop duplicates and expired events. Keep the latest camera state instead of queueing every frame. Resolve competing cues through documented priorities and cooldowns.

An interruption should invalidate obsolete output. After a call cue, obtain current route state rather than resuming an expired turn. Target loss should stop the old alignment cue. The scheduler can request cancellation of this application's output; it cannot promise global suppression of other apps.

## Local inference

The text candidate is Qwen2.5 0.5B Instruct with quantisation through llama.cpp. Restrict classification to selected short inputs, validate its output and discard results that arrive after the deadline. Apply the authorised fallback rule or remain quiet if no valid fallback exists.

The vision candidate is EfficientDet Lite0 through MediaPipe. CameraX latest frame semantics prevent stale analysis backlog. Add target association, a short confirmation window and hysteresis before changing alignment cues. Begin with three categories supported by the detector.

CPU inference is the initial baseline. NPU execution requires demonstrated model, runtime and device compatibility. Neither native inference performance nor hardware acceleration is implemented in the browser concept.

## Device output boundary

The app chooses the meaning, timing and supported effect. Android vibration APIs pass the request through system services to the manufacturer vibrator HAL, driver and actuator. Query support and provide tested fallbacks.

HAL means hardware abstraction layer. App waveform timings and amplitudes are not raw PWM commands. The application does not replace the driver, assume independent axis control or bypass Do Not Disturb.

## Observability

Record event categories, timestamps, dropped event reasons and inference timeouts without raw message bodies or camera frames by default. Distinguish cold model load, warm inference, scheduling, API dispatch and physical onset. Actual motor onset needs a suitable external measurement method.

## Primary references

* [Android haptic APIs](https://developer.android.com/develop/ui/views/haptics/haptics-apis)
* [Android haptic principles](https://developer.android.com/develop/ui/views/haptics/haptics-principles)
* [VibratorManager](https://developer.android.com/reference/android/os/VibratorManager)
* [NotificationListenerService](https://developer.android.com/reference/android/service/notification/NotificationListenerService)
* [CallStateListener](https://developer.android.com/reference/android/telephony/TelephonyCallback.CallStateListener)
* [CameraX image analysis](https://developer.android.com/media/camera/camerax/analyze)
* [MediaPipe object detection](https://developers.google.com/edge/mediapipe/solutions/vision/object_detector)
* [Qwen2.5 0.5B Instruct](https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct)
* [llama.cpp](https://github.com/ggml-org/llama.cpp)
* [Android haptics implementation](https://source.android.com/docs/core/interaction/haptics/haptics-implement)

These references support the design's platform boundaries. They do not establish achieved hapticOS performance.
