# Jendy

**その訳の先にある、「なぜ？」まで。**

日本語とインドネシア語の違いから、文の構造・語感・使いどころを学ぶ双方向サービスです。

## Pages

| URL | Purpose |
| --- | --- |
| `/` | Introduction and links to learning activities |
| `/login` | Sign in / create an account |
| `/lesson` | Browse and take lessons |
| `/practice` | Choice and typed practice |
| `/dictionary` | Word families |
| `/review` | Due SRS cards |
| `/dashboard` | Progress and scores |

Each URL renders its own activity. Navigation is available on desktop and mobile; learning direction and progress survive page changes. Names in introductions use Tini and Taro (太郎).

## Implemented

- **192 lessons**: 48 foundational/context lessons, 128 controlled sentence-practice lessons, and 16 scenario missions. Levels are course organization, not certification.
- **960 question pairs / 1,920 directional questions**: every question includes a prompt, correct answer, two explicit distractors, and explanation in both directions. No placeholder lessons or on-demand AI generation.
- Why? explanation for every example, including Japanese explanations for Japanese speakers and Indonesian explanations for Indonesian speakers.
- Sentence Anatomy for 12 selected examples: labeled and colored segments, tappable roles, structural gloss, and contextual register guidance. Other examples provide Why? without inventing an analysis.
- Searchable word family network: **7 roots / 39 word forms** (baca, ajar, jalan, tulis, kerja, 書く, 食べる).
- Unlimited **12-question practice sessions**: shuffled choices and question order, A1/A2/B1 filters, weak-topic priority, and weakness-only sessions. Questions within one session never repeat.
- Typed recall: matches a model example after normalizing case, punctuation, and spacing. A different answer is shown for comparison, not declared ungrammatical or unnatural. This is not open-ended AI grading.
- Direction-specific weak-topic records, lesson scores, and spaced repetition. Practice adds studied items to SRS automatically.
- Course search, theme filters, level filters, and incremental display.
- Speech synthesis, optional Supabase authentication and lesson-completion sync, local progress, XP, and streaks.
- Keyboard modal focus management, Escape to close, labeled color roles, and reduced-motion support.

**Unlimited practice means unlimited sessions from the published bank, not infinitely many distinct authored lessons.** The shipped source and the full exported question catalog are inspectable. Practice statistics and SRS remain local; existing cloud sync covers lesson completion and profile preferences.

## Curriculum

Foundation, Daily Life, Travel, Social, Relationship, Work, Internet, Natural Speech, Advanced Grammar.

Topics include sudah/belum, masih/sedang, pernah, di/ke/dari, は/が/を/に/で, negation, permission vs ability, obligations, word families, chats, airport/Grab/hotel, workplace communication, passive forms, appearance vs hearsay, changes, and conditionals.

The complete prompts, options, answers, and explanations are in [docs/question-catalog.md](docs/question-catalog.md). Source content is in `lib/learning-content.ts` (original 6 lessons) and `lib/course-content.ts` (42 contrast lessons), `lib/extended-course.ts` (128 sentence-practice lessons), and `lib/scenario-course.ts` (16 missions plus explicit word-order chunks). Adding a unit requires authored example pairs, distractors in both languages, and explanations in both languages; tests reject missing fields or invalid choices.

## Development

Next.js 16 / React 19 / TypeScript. Requires a Node.js version supported by Next.js.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Supabase is optional for local learning. To enable existing cloud synchronization, set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local`, and apply the existing migration in `supabase/migrations/`.

## Validation

```bash
npm test
npm run typecheck
npm run build
npm run test:routes
npm run content:export
```

The route test inspects production HTML for all seven pages, verifies that each contains only its intended activity, checks navigation, and rejects old names and infrastructure slogans.

Tests inspect every authored question pair, every expanded distractor and explanation, level counts, session variety and coverage, weakness isolation, recall normalization, malformed storage, SRS scheduling, and server rendering of all expression cards in both directions.

Optional browser suite (run against a running local app):

```bash
npm install --no-save playwright
npx playwright install chromium
npm run dev
# In another terminal:
npm run test:browser
```

`JENDY_TEST_URL` overrides `http://127.0.0.1:3000`; `JENDY_CHROMIUM_PATH` optionally selects an installed Chromium executable. The suite exercises all 288 directional lesson questions, saving/reload, dictionary search, practice, filters, keyboard behavior, and mobile overflow.

Validation in this implementation environment: content/logic/server-render tests, TypeScript, and production build passed. Native Chromium could not launch here, so browser interactions, visual layout, and speech output remain unverified. No authenticated cloud write was performed.

## Stage expansion

192 lessons: 48 grammar/context lessons, 128 controlled sentence-composition lessons (16 verb frames × 8 compatible objects), and 16 scenario missions. Total: 960 sentence/question pairs, 1,920 directional questions. Sentence practice varies two subjects and three time expressions; these are not 128 new grammar topics. Thirty-two stages group six lessons each. Each stage opens its next unfinished lesson, with completed stages available for replay. No hearts, attempt limits, or advertisements.

## Sakura / Merah Putih update

192 lessons, 960 question pairs (1,920 directional questions), 32 stages. The additional 16 scenario lessons contain 48 authored expression pairs with bilingual explanations: train tickets, delivery, Wi-Fi, lost property, appointments, money exchange, restaurant requests, deadlines, clarification, invitations, house rules, directions, offering help, frequency, evidence, and repairs.

The 48 authored pairs also support a word-order quest in both directions. Tap tiles to assemble a model sentence, tap selected tiles to undo, reset, ask for a hint, or retry missed questions after an eight-question session. This is an additional exercise mode for those same pairs, not another 96 distinct authored sentences. Answers and chunks are explicit; alternative natural word orders are not declared ungrammatical. Quest answers feed the existing practice-topic statistics and SRS callback.

The shared theme uses Indonesian red/white and Japanese sakura pink, with inline SVG motifs for Fuji, cherry blossoms, Monas, traditional roof forms, batik-inspired geometry, stage seals, and a quest medal. No lives, attempt limits, or ad dependencies were added.

`npm test` includes DOM interaction tests for tile selection, undo/reset, hints, double-submit prevention, missed-only retry, reverse direction, and tap-to-toggle word meanings. These tests run in jsdom; native browser layout, fonts, audio, and rendering still require visual review.

## Direct lessons and optional study

`/lesson` starts with a translation question immediately. `/study` is the separate reading/audio/grammar mode and ends after the final example without automatically starting a quiz. Each lesson question offers choice or keyboard input; the mode is retained while moving to the next question. Keyboard answers are normalized model-answer matches, not unrestricted translation grading. Every answered lesson question is added to SRS.

Legacy quiz prompts consistently specify translation into Indonesian or Japanese. The old order question that displayed the correct sentence in its prompt is now a translation prompt. Word-order questions are explicit tile-construction tasks; the quest bank includes three basic SVO/possession exercises and 48 scenario exercises (51 pairs available in both directions).

## Starter progression and integrated review
198 lessons / 978 authored question pairs (1,956 directions). Six starter lessons begin with Saya and Kamu and build toward a greeting plus name and nationality. Standard lesson attempts contain 12 exercises: new expressions, repeated current expressions, and review sampled only from previously completed earlier lessons. Repetition is intentional and is not counted as new authored content. Review answers save to their original lesson/phrase SRS item.

### Adaptive learning and language support

Normal lessons now choose earlier review expressions using due dates and failed recall,
while preserving the Saya/Kamu-first introduction and 12-question panel-first sessions.
Daily goals (6/12/24 questions) persist locally. The dictionary searches all 978 paired
examples, including Indonesian root matches with `@orama/stemmers`; WanaKana supplies
explicit kana conversion and kana-only readings. Root matching is never used to grade
answers. Third-party license texts are served under `/licenses/`.

See [release readiness](docs/release-readiness.md) for verified behavior and remaining
real-device, audio-provider, content-review and account-flow release gates.
