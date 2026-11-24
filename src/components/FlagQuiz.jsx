import {
  setFlyCoordinates,
  setHighlightedCode,
  toggleIsCountryChanged,
} from "../store/countrySlice";
import Flag from "./Flag";
import Loader from "./Loader";
import { ArrowRight, Check, Flame, Target, Trophy, X } from "lucide-react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const OPTION_COUNT = 4;
const RECENT_LIMIT = 30;
const BEST_KEY = "quizBestStreak";

const shuffle = (items) => {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
};

const makeQuestion = (pool, recent) => {
  const fresh = pool.filter((c) => !recent.includes(c.code));
  const candidates = fresh.length ? fresh : pool;
  const answer = candidates[Math.floor(Math.random() * candidates.length)];
  const others = pool.filter((c) => c.code !== answer.code);
  const sameContinent = shuffle(
    others.filter((c) =>
      c.continents.some((continent) => answer.continents.includes(continent))
    )
  ).slice(0, 2);
  const rest = shuffle(others.filter((c) => !sameContinent.includes(c))).slice(
    0,
    OPTION_COUNT - 1 - sameContinent.length
  );
  return { answer, options: shuffle([answer, ...sameContinent, ...rest]) };
};

const preloadFlag = (question) => {
  if (question?.answer.flagUrl) new Image().src = question.answer.flagUrl;
};

const FlagQuiz = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const allCountries = useSelector((state) => state.country.allCountries);
  const isListLoading = useSelector(
    (state) => state.country.isCountryListLoading
  );

  const pool = useMemo(
    () => allCountries.filter((c) => c.flagUrl && c.coordinates?.length === 2),
    [allCountries]
  );

  const recentRef = useRef([]);
  const nextQuestionRef = useRef(null);
  const nextButtonRef = useRef(null);
  const [question, setQuestion] = useState(null);
  const [pickedCode, setPickedCode] = useState(null);
  const [score, setScore] = useState({ correct: 0, answered: 0 });
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(readBest);

  const buildQuestion = useCallback(() => {
    const q = makeQuestion(pool, recentRef.current);
    recentRef.current = [q.answer.code, ...recentRef.current].slice(
      0,
      RECENT_LIMIT
    );
    return q;
  }, [pool]);

  const goToNextQuestion = useCallback(() => {
    if (!pool.length) return;
    const next = nextQuestionRef.current || buildQuestion();
    nextQuestionRef.current = null;
    setQuestion(next);
    setPickedCode(null);
    dispatch(setHighlightedCode(null));
  }, [pool, buildQuestion, dispatch]);

  useEffect(() => {
    if (!question && pool.length) goToNextQuestion();
  }, [question, pool, goToNextQuestion]);

  useEffect(
    () => () => {
      const selectedCode = store.getState().country.selectedCountryData?.code;
      dispatch(setHighlightedCode(selectedCode ?? null));
    },
    [dispatch, store]
  );

  const answer = useCallback(
    (code) => {
      if (!question || pickedCode) return;
      setPickedCode(code);
      const isCorrect = code === question.answer.code;
      setScore((s) => ({
        correct: s.correct + (isCorrect ? 1 : 0),
        answered: s.answered + 1,
      }));
      const nextStreak = isCorrect ? streak + 1 : 0;
      setStreak(nextStreak);
      if (nextStreak > best) {
        setBest(nextStreak);
        try {
          localStorage.setItem(BEST_KEY, String(nextStreak));
        } catch (error) {
          console.warn("Couldn't save the best quiz streak.", error);
        }
      }

      const [lat, lng] = question.answer.coordinates;
      dispatch(setHighlightedCode(question.answer.code));
      dispatch(toggleIsCountryChanged());
      dispatch(setFlyCoordinates({ lat, lng }));

      nextQuestionRef.current = buildQuestion();
      preloadFlag(nextQuestionRef.current);
    },
    [question, pickedCode, streak, best, buildQuestion, dispatch]
  );

  useEffect(() => {
    if (pickedCode) nextButtonRef.current?.focus({ preventScroll: true });
  }, [pickedCode]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.target.closest?.("input, textarea, [contenteditable]")) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (!pickedCode && question) {
        const index = Number(event.key) - 1;
        if (index >= 0 && index < question.options.length) {
          event.preventDefault();
          answer(question.options[index].code);
        }
      } else if (pickedCode && (event.key === "Enter" || event.key === "n")) {
        if (event.target === nextButtonRef.current) return;
        event.preventDefault();
        goToNextQuestion();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pickedCode, question, answer, goToNextQuestion]);

  if (isListLoading) return <Loader />;
  if (!pool.length) {
    return (
      <p className="text-gray-500 dark:text-neutral-200 text-center mt-5">
        The quiz needs the country list, which couldn't be loaded. Please try
        again later.
      </p>
    );
  }
  if (!question) return <Loader />;

  const isCorrect = pickedCode === question.answer.code;

  const optionState = (code) => {
    if (!pickedCode) return "idle";
    if (code === question.answer.code) return "correct";
    if (code === pickedCode) return "wrong";
    return "dimmed";
  };

  const optionClass = {
    idle: "cursor-pointer border-[#ccc3c3] bg-[#fffbeb] dark:bg-[#222225] hover:border-amber-400 hover:bg-amber-100 dark:hover:border-neutral-500 dark:hover:bg-[#2a2a2e] hover:-translate-y-0.5 hover:shadow-sm",
    correct:
      "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
    wrong:
      "border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200",
    dimmed: "border-[#ccc3c3] bg-[#fffbeb] dark:bg-[#222225] opacity-45",
  };

  const badgeClass = {
    idle: "bg-amber-100 text-neutral-700 dark:bg-[#2f2f33] dark:text-neutral-300",
    correct: "bg-emerald-500 text-white",
    wrong: "bg-rose-500 text-white",
    dimmed: "bg-amber-100 text-neutral-700 dark:bg-[#2f2f33] dark:text-neutral-300",
  };

  return (
    <>
      <h1 className="hidden lg:block w-full font-medium text-xl mb-8 text-neutral-900 dark:text-[#eee] transition-colors duration-600">
        Put your geography to the test with the{" "}
        <span className="font-bold">Flag Quiz</span>! Pick the country each
        flag belongs to.
      </h1>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 w-full shrink-0">
        <QuizStat
          icon={<Target size={13} className="text-sky-600 dark:text-sky-400" />}
          label="Score"
        >
          {score.correct}/{score.answered}
        </QuizStat>
        <QuizStat
          icon={<Flame size={13} className="text-orange-500" />}
          label="Streak"
        >
          {streak}
        </QuizStat>
        <QuizStat
          icon={<Trophy size={13} className="text-amber-500" />}
          label="Best"
        >
          {best}
        </QuizStat>
      </div>

      <div className="bg-amber-50 dark:bg-[#1d1d20] mt-3 lg:my-6 w-full shrink-0 flex flex-col items-center p-3 lg:p-5 rounded-md text-neutral-900 dark:text-neutral-200 transition-all duration-600">
        <Flag
          key={question.answer.code}
          src={question.answer.flagUrl}
          code={question.answer.code}
          alt="Mystery flag"
          className="h-20 lg:h-[140px] w-full"
          imgClassName="max-w-[min(200px,100%)] lg:max-w-[min(260px,calc(100%_-_4.5rem))]"
        />
        <h3 className="hidden lg:block mt-3 uppercase text-xl font-bold text-center transition-all duration-600">
          Guess the country
        </h3>

        <ul className="mt-3 lg:mt-5 w-full grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-2.5">
          {question.options.map((option, i) => {
            const state = optionState(option.code);
            return (
              <li key={option.code} className="flex">
                <button
                  type="button"
                  disabled={!!pickedCode}
                  onClick={() => answer(option.code)}
                  className={`w-full min-h-[52px] lg:min-h-0 flex items-center gap-2 lg:gap-3 rounded-lg border-2 px-2 py-1.5 lg:px-3 lg:py-2.5 text-left font-semibold text-sm lg:text-lg leading-tight transition-all duration-200 ${optionClass[state]}`}
                >
                  <span
                    aria-hidden="true"
                    className={`shrink-0 w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-bold transition-colors duration-200 ${badgeClass[state]}`}
                  >
                    {state === "correct" ? (
                      <Check size={16} strokeWidth={3} />
                    ) : state === "wrong" ? (
                      <X size={16} strokeWidth={3} />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span className="flex-1 min-w-0 break-words">
                    {option.name}
                  </span>
                  {state === "correct" && (
                    <span className="sr-only">(correct answer)</span>
                  )}
                  {state === "wrong" && (
                    <span className="sr-only">(your answer)</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div
          aria-hidden={!pickedCode}
          className={`mt-3 lg:mt-5 w-full flex items-center justify-between gap-3 ${
            pickedCode ? "" : "invisible"
          }`}
        >
          <p
            role="status"
            className={`min-w-0 font-semibold text-sm lg:text-lg leading-tight ${
              isCorrect
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-rose-700 dark:text-rose-400"
            }`}
          >
            {!pickedCode ? (
              " "
            ) : isCorrect ? (
              streak > 1 ? (
                `Correct! ${streak} in a row.`
              ) : (
                "Correct!"
              )
            ) : (
              <>
                Not quite, it's{" "}
                <span className="font-bold">{question.answer.name}</span>.
              </>
            )}
          </p>
          <button
            ref={nextButtonRef}
            type="button"
            tabIndex={pickedCode ? 0 : -1}
            onClick={goToNextQuestion}
            className="shrink-0 ml-auto flex items-center gap-1.5 lg:gap-2 rounded-lg border-2 border-[#ccc3c3] bg-amber-100 dark:bg-[#141416] px-3 py-1.5 lg:px-4 lg:py-2 text-sm lg:text-base font-semibold text-neutral-900 dark:text-[#eee] cursor-pointer hover:bg-amber-200 dark:hover:bg-[#26262a] transition-colors duration-200"
          >
            Next flag
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </>
  );
};

const QuizStat = ({ icon, label, children }) => (
  <div className="h-12 lg:h-14 flex flex-col items-center justify-center rounded border-2 border-[#ccc3c3] bg-[#fffbeb] dark:bg-[#1d1d20] text-neutral-900 dark:text-[#f3f2ef] transition-all duration-600">
    <span className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
      <span aria-hidden="true" className="flex">
        {icon}
      </span>
      {label}
    </span>
    <span className="font-bold text-lg leading-tight tabular-nums">
      {children}
    </span>
  </div>
);

export default FlagQuiz;
