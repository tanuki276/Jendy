# Learning experience redesign

## Research
Official sources reviewed on 2026-10-28:
- https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/ — path guidance, easier recognition progressing toward production, personalized review.
- https://blog.duolingo.com/guide-to-duolingo-practice-hub/ — targeted mistakes, listening, words, speaking, and explanations.
- https://blog.duolingo.com/whats-the-best-way-to-learn-with-duolingo/ — advancing through new content, repeated listening, optional focused practice.

The old Jendy interface displayed 32 stage buttons plus a lesson catalog, then repeated translation choices. This redesign makes the next uncompleted lesson the primary action and presents six lessons at a time on a visible path. The catalog remains optional. It uses original Japan/Indonesia red-white-pink SVG artwork, without copying Duolingo brand assets.

## Delivered
- Path nodes show completed/current/available lessons, stage switching, XP and streak.
- Full-screen lesson player, progress, numbered choices, continuous correct-answer feedback.
- Four answer modes for Japanese-speaking learners: choice, keyboard, Indonesian word tiles, listening transcription. Reverse direction supports choice, keyboard, and Japanese listening.
- Tiles preserve authored sentence words, repeated words have distinct indices, and can be removed and reinserted.
- Mistake-only repair uses an explicit queue. Another miss goes to the queue's end. It never changes the first-pass score or bypasses the original completion threshold.
- Listening hides the written prompt, offers normal/slow replay, and allows switching modes if browser audio fails.
- HP, advertisements, paywalls, and attempt limits remain absent.

## Limits
This does not claim parity with Duolingo. No speech recognition or pronunciation scoring, no new authored story engine, and no proficiency assessment are provided. Listening uses device speech synthesis; voice availability and quality vary. Typed and tile answers match normalized reference strings, not arbitrary valid translations. Lesson content remains 192 lessons / 960 bilingual pairs; this work adds exercise modes, not new unique source sentences. The continue action selects the next incomplete lesson, not a saved mid-question session.

## Automatic mixed exercises update
Panels are now the default. A ten-slot sequence prioritizes panels, reserves choice slots for authored alternatives sharing words, and occasionally asks for typed recall or listening. Switching a mode applies to the current question only. Japanese panels use word segmentation.

36 bundled MP3 files cover both directions of the original six lessons (18 question pairs). They were generated from the authored reference sentences using Google Translate speech synthesis during development; runtime playback uses local files, without a third-party request. Other sentences load MP3 through a server route restricted to existing lesson question IDs and ja/id language codes. This route depends on Google Translate speech synthesis availability and caches successful responses; it uses no private learner input. A matching device voice is a fallback. Voice initialization waits for voiceschanged, cancellation is ignored, and an unsupported voice is reported.

## Random attempts and effects
The fixed modulo assignment has been replaced by a newly shuffled plan on every attempt. The first question is a panel; a majority remain panels, with randomly positioned choice/typing/listening exercises. Retry generates another plan. Practice also defaults to this mixed mode instead of choice-only. Correct, wrong, lesson completion and newly completed six-lesson stage events have separate Web Audio melodies; the header toggle persists mute preference and does not mute word pronunciation. AudioContext starts/resumes on an answer/button gesture.

## Listening response and speaking
Listening now defaults to sentence panels and offers an in-question keyboard toggle without revealing the translation. Speaking displays the target sentence and starts microphone recognition only from a button gesture, then requires confirmation of the recognized transcript. Recognition is a reference-text match, not a phonetic pronunciation score. SpeechRecognition / webkitSpeechRecognition support and browser service availability vary; permission denial and unsupported browsers are handled without blocking the lesson. Speech may be processed by the browser provider. Turning either listening or speaking OFF replaces that exercise with panels, stops recording/playback, and persists the preference across questions. The response-method menu is collapsed so its controls are not confused with multiple-choice answers. Practice no longer offers a choice-only preset.
