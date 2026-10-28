# Release readiness

## Included in this change

- Daily targets of 6 / 12 / 24 answered questions; local-calendar reset and persisted goal.
- Twelve-question lessons with new material first, then current and completed-lesson review.
- Review selection considers all earlier completed lessons, prioritizing due items and failures; direction stays separate.
- Lesson answers update review scheduling without a second XP award. Repeated correct answers in one day do not inflate intervals.
- Full-curriculum example search, root-assisted Indonesian lookup, explanations and audio playback.
- WanaKana 5.3.1 (MIT): explicit romaji-to-kana input assistance and kana-only readings. Never guesses kanji readings.
- @orama/stemmers 3.1.18 (Apache-2.0): Indonesian root candidates for search only. Does not accept different affixes as equivalent quiz answers.
- Audio fallback executes once, stops stale playback and removes voice-loading listeners. Correct answers can be replayed at normal or slow speed.
- Existing red/white/pink SVG identity, panels as primary mode, listening/typing/speaking switches, no hearts or ads retained.

## Automated verification

`npm test`, `npm run build`, `npm run test:routes`, `npm audit --omit=dev`.
The suite checks all 978 paired question records, first lessons, 12-question sessions, repair, mixed exercise plans, speech mocks, root search, kana conversion, daily goals, review selection and audio cancellation.

## Remaining release gates (not represented as completed)

- Test actual audio output and microphone permission/recognition on iOS Safari and Android Chrome. Automated mocks do not prove device compatibility. Speech recognition is transcription matching, not phoneme assessment.
- Dynamic audio currently uses the existing Google Translate TTS endpoint, which is not a contracted production speech API. The 36 bundled clips and device speech fallback do not guarantee every sentence will play on every device. Before a broad public launch, provision a supported speech provider or a reviewed, licensed recording corpus.
- Have Japanese and Indonesian language reviewers check every published lesson for naturalness and progression. Structural validation does not establish native-quality content.
- Verify the deployed Supabase signup/login/row-level access rules with real test accounts. Local daily goals and detailed review state remain device-local; existing account lesson progress behavior is unchanged.
- Test the real deployed mobile layouts and navigation. Build/DOM checks do not establish visual correctness on physical devices.

## Design sources

- https://blog.duolingo.com/spaced-repetition-for-learning/
- https://blog.duolingo.com/new-duolingo-home-screen-design/
- https://github.com/WaniKani/WanaKana
- https://github.com/oramasearch/orama

Jendy uses the learning principles of short sessions, progressive difficulty, spaced review and clear rewards. It does not copy Duolingo branding or claim equivalent course outcomes.
