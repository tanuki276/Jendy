const assert = require("node:assert/strict");
const { JSDOM } = require("jsdom");
require("./register.cjs");
const {
  createEmptyLearningState,
  loadLearningState,
  saveLearningState,
  recordAnswer,
  recordLessonCompletion,
  upsertReviewItem,
  gradeReview,
  currentStreak,
  localDateKey,
} = require("../lib/learning-state.ts");
const RealDate = Date;
let clock = new RealDate(2026, 9, 28, 23, 58);
global.Date = class extends RealDate {
  constructor(...args) {
    super(...(args.length ? args : [clock.getTime()]));
  }
  static now() {
    return clock.getTime();
  }
};
const dom = new JSDOM('<!doctype html><div id="root"></div>', {
  url: "http://localhost",
});
global.window = dom.window;
global.self = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.IS_REACT_ACT_ENVIRONMENT = true;
const key = "jendy:learning-state:v1";

// Existing learners keep their XP, scores and longest known streak, without invented history.
window.localStorage.setItem(
  key,
  JSON.stringify({
    stats: { xp: 510, streak: 4, lastStudyDate: "2026-10-27" },
    reviews: [],
    lessonScores: { "ja-id:old": 90 },
  }),
);
let state = loadLearningState();
assert.equal(state.stats.xp, 510);
assert.equal(state.stats.longestStreak, 4);
assert.equal(state.lessonScores["ja-id:old"], 90);
assert.equal(state.dailyGoal, 12);
assert.deepEqual(state.activity, {});
assert.equal(currentStreak(state), 4);
clock = new RealDate(2026, 9, 29, 0, 1);
assert.equal(currentStreak(state), 0);
state = recordAnswer(state, true);
assert.equal(state.stats.streak, 1);
assert.equal(
  state.stats.longestStreak,
  4,
  "earned streak badge survives a break",
);

state = createEmptyLearningState();
state = recordAnswer(state, true);
state = recordAnswer(state, false);
state = recordLessonCompletion(state, "ja-id:test", 100);
state = upsertReviewItem(state, {
  lessonId: "test",
  phraseIndex: 0,
  direction: "ja-id",
});
state = gradeReview(state, state.reviews[0].key, "good");
assert.deepEqual(state.activity["2026-10-29"], { answered: 3, xp: 70 });
assert.equal(state.stats.xp, 70);
assert.deepEqual(
  gradeReview(state, "missing", "easy"),
  state,
  "unknown review cannot earn XP",
);
clock = new RealDate(2026, 9, 30, 0, 2);
state = recordAnswer(state, true);
assert.equal(state.stats.streak, 2);
assert.deepEqual(state.activity["2026-10-30"], { answered: 1, xp: 10 });
assert.equal(
  state.activity["2026-10-29"].answered,
  3,
  "midnight starts a separate day",
);
state.dailyGoal = 24;
saveLearningState(state);
assert.deepEqual(
  loadLearningState(),
  state,
  "goals and real activity survive reload",
);
window.localStorage.setItem(
  key,
  JSON.stringify({
    dailyGoal: -5,
    activity: {
      invalid: {},
      "2026-10-29": { answered: -1, xp: 5 },
      "2026-10-30": { answered: 1, xp: 10 },
    },
  }),
);
assert.equal(loadLearningState().dailyGoal, 12);
assert.deepEqual(loadLearningState().activity, {
  "2026-10-30": { answered: 1, xp: 10 },
});
state.activity = Object.fromEntries(
  Array.from({ length: 200 }, (_, i) => [
    localDateKey(new RealDate(2026, 0, i + 1)),
    { answered: 1, xp: 10 },
  ]),
);
state = recordAnswer(state, true);
assert.equal(
  Object.keys(state.activity).length,
  180,
  "history retention is bounded",
);
console.log(
  "✓ Existing progress migration, honest daily totals, midnight rollover, streak expiry, permanent badges, reload and malformed habit data",
);

const React = require("react");
const { act } = React;
const { createRoot } = require("react-dom/client");
const {
  DailyGoals,
  WeekCard,
  LearningHome,
} = require("../components/LearningHome.tsx");
const { renderToStaticMarkup } = require("react-dom/server");
const { lessons } = require("../lib/learning-content.ts");
const root = createRoot(document.getElementById("root"));
let goal;
state = createEmptyLearningState();
state.activity[localDateKey()] = { answered: 6, xp: 60 };
function renderGoal() {
  act(() =>
    root.render(
      React.createElement(DailyGoals, {
        direction: "ja-id",
        learning: state,
        now: new Date(),
        onGoal: (value) => {
          goal = value;
          state = { ...state, dailyGoal: value };
          renderGoal();
        },
      }),
    ),
  );
}
renderGoal();
assert.equal(document.querySelector("progress").value, 6);
act(() =>
  [...document.querySelectorAll("button")]
    .find((b) => b.textContent === "6問")
    .click(),
);
assert.equal(goal, 6);
assert.match(document.querySelector("[role=status]").textContent, /達成/);
assert.equal(
  document.querySelector("button[aria-pressed=true]").textContent,
  "6問",
);
act(() =>
  root.render(
    React.createElement(WeekCard, {
      direction: "ja-id",
      learning: state,
      now: new Date(),
    }),
  ),
);
assert.equal(document.querySelectorAll(".week-days>div").length, 7);
assert.equal(document.querySelectorAll(".week-days .studied").length, 1);
let selected;
act(() =>
  root.render(
    React.createElement(LearningHome, {
      direction: "ja-id",
      completed: new Set([lessons[0].id]),
      learning: state,
      now: new Date(),
      dueCount: 3,
      onStart: (lesson) => (selected = lesson),
      onGoal() {},
    }),
  ),
);
act(() => document.querySelector(".hero button").click());
assert.equal(
  selected.id,
  lessons[1].id,
  "home continues the actual next unfinished lesson",
);
assert.equal(document.querySelectorAll(".mini-path button").length, 6);
assert.equal(document.querySelectorAll("h1").length, 1);
const html = renderToStaticMarkup(
  React.createElement(LearningHome, {
    direction: "id-ja",
    completed: new Set(),
    learning: state,
    now: null,
    dueCount: 0,
    onStart() {},
    onGoal() {},
  }),
);
assert.match(html, /Target hari ini/);
assert.match(html, /Mulai belajar/);
act(() => root.unmount());
global.Date = RealDate;
console.log(
  "✓ Goal controls, achievement feedback, real weekly history, home resume and bilingual server render",
);
