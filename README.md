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

- **48 complete lessons**: A1 30 / A2 12 / B1 6. Levels are course organization, not certification.
- **144 authored question pairs / 288 directional questions**: every question includes a prompt, correct answer, two explicit distractors, and explanation in both directions. No placeholder lessons or on-demand AI generation.
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

The complete prompts, options, answers, and explanations are in [docs/question-catalog.md](docs/question-catalog.md). Source content is in `lib/learning-content.ts` (original 6 lessons) and `lib/course-content.ts` (42 new lessons). Adding a unit requires authored example pairs, distractors in both languages, and explanations in both languages; tests reject missing fields or invalid choices.

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

176 lessons: 48 grammar/context lessons plus 128 controlled sentence-composition lessons (16 verb frames × 8 compatible objects). Total: 912 sentence/question pairs, 1,824 directional questions. The new practice lessons vary two subjects and three time expressions; they are not 128 new grammar topics. Thirty stages group six lessons each (the final stage has two). Each stage opens its next unfinished lesson, with completed stages available for replay. No hearts, attempt limits, or advertisements.
