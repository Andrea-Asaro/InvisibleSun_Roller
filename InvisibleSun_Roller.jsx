import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Advanced Dice Roller: d10 (magic & non-magic) + d60
export default function DiceSimulator() {
  const [rollMode, setRollMode] = useState("both"); // "both" | "nonMagical"
  const [beneModifier, setBeneModifier] = useState("0");

  const [magicD10Result, setMagicD10Result] = useState<number | null>(null);
  const [nonMagicD10Result, setNonMagicD10Result] = useState<number | null>(null);
  const [nonMagicD10Total, setNonMagicD10Total] = useState<number | null>(null);

  const [d60Result, setD60Result] = useState<number | null>(null);

  // State for magic card alert animation when rolling 0
  const [isMagicAlert, setIsMagicAlert] = useState(false);

  // Helper to roll an N-sided die (1..sides)
  const rollDie = (sides: number) => {
    return Math.floor(Math.random() * sides) + 1;
  };

  // Helper to roll a d10 (0..9)
  const rollD10ZeroToNine = () => {
    return Math.floor(Math.random() * 10);
  };

  // Handle the alert animation when magic die rolls 0
  const triggerMagicZeroAnimation = () => {
    setIsMagicAlert(true);
    setTimeout(() => {
      setIsMagicAlert(false);
    }, 3000); // 1s to red, 2s hold, 1s back while class is removed
  };

  // Handle roll for d10 area (magic + non-magic)
  const handleRollD10 = () => {
    const modifier = parseInt(beneModifier, 10);
    const safeModifier = isNaN(modifier) ? 0 : modifier;

    const nonMagic = rollD10ZeroToNine();
    setNonMagicD10Result(nonMagic);
    setNonMagicD10Total(nonMagic + safeModifier);

    if (rollMode === "both") {
      const magic = rollD10ZeroToNine();
      setMagicD10Result(magic);

      if (magic === 0) {
        triggerMagicZeroAnimation();
      }
    } else {
      setMagicD10Result(null);
    }
  };

  // Handle roll for d60
  const handleRollD60 = () => {
    const value = rollDie(60);
    setD60Result(value);
  };

  // Adjust Bene using +/- buttons
  const adjustBene = (delta: number) => {
    const current = parseInt(beneModifier || "0", 10);
    const safeCurrent = isNaN(current) ? 0 : current;
    const next = safeCurrent + delta;
    setBeneModifier(String(next));
  };

  return (
    <div className="min-h-screen w-full flex items-stretch justify-center bg-gradient-to-r from-slate-950 via-slate-900 to-sky-900 text-slate-50">
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-6 md:gap-10 p-4 md:p-8">
        {/* LEFT SECTION: d10 launchers */}
        <section className="flex-1 backdrop-blur-md bg-slate-900/40 border border-slate-700/60 rounded-3xl p-5 md:p-6 shadow-xl shadow-slate-900/40 flex flex-col gap-4">
          <header className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              d10 Roller
            </h1>
            <p className="text-sm md:text-xs text-slate-300/80 max-w-md">
              Roll a magical and a non-magical d10. Add your
              <span className="font-semibold text-emerald-300"> Bene</span>
              {" "}
              modifier to the non-magical die.
            </p>
          </header>

          {/* Roll mode selector */}
          <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-slate-900/70 p-1 w-full max-w-xs">
            <button
              className={`flex-1 px-3 py-1 text-xs md:text-sm rounded-full transition-all border ${
                rollMode === "both"
                  ? "bg-emerald-500/90 text-slate-950 border-emerald-300 shadow-lg shadow-emerald-500/30"
                  : "bg-transparent text-slate-200 border-transparent hover:bg-slate-800/80"
              }`}
              onClick={() => setRollMode("both")}
            >
              Magic + Non-magic
            </button>
            <button
              className={`flex-1 px-3 py-1 text-xs md:text-sm rounded-full transition-all border ${
                rollMode === "nonMagical"
                  ? "bg-amber-400/90 text-slate-950 border-amber-200 shadow-lg shadow-amber-400/30"
                  : "bg-transparent text-slate-200 border-transparent hover:bg-slate-800/80"
              }`}
              onClick={() => setRollMode("nonMagical")}
            >
              Only Non-magic
            </button>
          </div>

          {/* Launchers container (animated layout) */}
          <motion.div
            layout
            className="grid gap-4 mt-2 flex-1 items-stretch content-stretch"
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* MAGIC d10 LAUNCHER (animated in/out) */}
            <AnimatePresence initial={false}>
              {rollMode === "both" && (
                <motion.div
                  key="magic-card"
                  layout
                  initial={{ opacity: 0, y: -12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
                  className={`relative overflow-hidden rounded-3xl flex flex-col md:flex-row items-stretch ${
                    isMagicAlert
                      ? "border border-red-500/70 bg-gradient-to-br from-red-950/80 via-red-900/70 to-rose-900/70 shadow-[0_0_45px_rgba(248,113,113,0.55)]"
                      : "border border-violet-400/40 bg-gradient-to-br from-violet-900/60 via-fuchsia-800/40 to-sky-900/40 shadow-[0_0_45px_rgba(129,140,248,0.35)]"
                  }`}
                >
                  <div className="absolute inset-x-10 -top-10 h-32 bg-fuchsia-500/20 blur-3xl pointer-events-none" />
                  <div className="relative flex-1 p-4 md:p-5 flex flex-col justify-between gap-3">
                    <div>
                      <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-400/80 text-slate-950 text-xs font-bold">
                          M
                        </span>
                        Magical d10
                      </h2>
                      <p className="mt-1 text-xs text-violet-100/80 max-w-xs">
                        Sortilege-flavoured roll, shimmering with arcane
                        probability.
                      </p>
                    </div>

                    <div className="mt-1 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
                      <div className="flex flex-col">
                        <span className="text-[0.7rem] uppercase tracking-wide text-violet-200/80 mb-1">
                          Result
                        </span>
                        <div className="text-4xl md:text-5xl font-black tracking-tight text-fuchsia-200 drop-shadow-[0_0_18px_rgba(244,114,182,0.8)] min-h-[2.5rem] flex items-center">
                          {magicD10Result !== null ? magicD10Result : "–"}
                        </div>
                      </div>

                      <button
                        className="px-4 py-2 rounded-2xl bg-fuchsia-200 text-slate-950 text-xs md:text-sm font-semibold shadow-lg shadow-fuchsia-400/40 border border-fuchsia-300/80 hover:-translate-y-0.5 hover:shadow-fuchsia-400/70 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
                        onClick={handleRollD10}
                      >
                        Roll d10 (both)
                      </button>
                    </div>
                  </div>

                  {/* Decorative column */}
                  <div className="relative w-full md:w-28 bg-gradient-to-t from-slate-950/80 via-violet-900/80 to-sky-900/60 border-l border-violet-300/30 flex items-center justify-center">
                    <div className="relative flex flex-col items-center gap-1 text-[0.6rem] tracking-[0.3em] text-violet-100/70 rotate-0 md:-rotate-90">
                      <span className="uppercase">arcane</span>
                      <span className="uppercase text-fuchsia-200">flux</span>
                    </div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_0_0,rgba(244,114,182,0.4),transparent_60%),radial-gradient(circle_at_100%_100%,rgba(129,140,248,0.4),transparent_60%)] pointer-events-none" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* NON-MAGIC d10 LAUNCHER (layout-animated so it stretches smoothly) */}
            <motion.div
              layout
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`relative overflow-hidden rounded-3xl border border-amber-300/50 bg-gradient-to-br from-slate-950/70 via-slate-900/70 to-amber-900/40 shadow-[0_0_40px_rgba(251,191,36,0.25)] flex flex-col md:flex-row items-stretch ${
                rollMode === "nonMagical" ? "md:h-full" : ""
              }`}
            >
              <div className="absolute inset-x-4 top-0 h-24 bg-amber-400/20 blur-3xl pointer-events-none" />
              <div className="relative flex-1 p-4 md:p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-300/90 text-slate-950 text-xs font-bold">
                        N
                      </span>
                      Non-magical d10
                    </h2>
                    <p className="mt-1 text-xs text-amber-100/80 max-w-xs">
                      Reliable, grounded roll to which your
                      <span className="font-semibold"> Bene</span> modifier is
                      added.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1.7fr)] gap-4 items-end">
                  {/* Results */}
                  <div className="flex flex-col gap-3">
                    <div>
                      <span className="text-[0.7rem] uppercase tracking-wide text-amber-100/80 mb-1 block">
                        Base roll
                      </span>
                      <div className="text-3xl md:text-4xl font-bold text-amber-200 drop-shadow-[0_0_16px_rgba(251,191,36,0.7)] min-h-[2.2rem] flex items-center">
                        {nonMagicD10Result !== null ? nonMagicD10Result : "–"}
                      </div>
                    </div>

                    <div>
                      <span className="text-[0.7rem] uppercase tracking-wide text-emerald-100/90 mb-1 block">
                        Total with Bene
                      </span>
                      <div className="text-3xl md:text-4xl font-extrabold text-emerald-200 drop-shadow-[0_0_18px_rgba(16,185,129,0.8)] min-h-[2.2rem] flex items-center">
                        {nonMagicD10Total !== null ? nonMagicD10Total : "–"}
                      </div>
                    </div>
                  </div>

                  {/* Bene modifier input */}
                  <div className="flex flex-col gap-2 rounded-2xl border border-emerald-400/40 bg-slate-950/60 p-3">
                    <label className="text-[0.7rem] uppercase tracking-wide text-emerald-100/80">
                      Bene modifier
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="w-16 h-16 bg-slate-900/80 border border-emerald-500/40 rounded-xl text-center text-lg md:text-xl font-semibold outline-none focus:ring-2 focus:ring-emerald-400/80 focus:border-emerald-300/80 text-emerald-50 placeholder:text-emerald-200/40"
                        value={beneModifier}
                        onChange={(e) => setBeneModifier(e.target.value)}
                        placeholder="0"
                      />
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          className="w-8 h-7 flex items-center justify-center rounded-md border border-emerald-400/70 bg-slate-900/80 text-emerald-300 text-sm font-semibold hover:bg-emerald-500/20 transition-colors"
                          onClick={() => adjustBene(1)}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className="w-8 h-7 flex items-center justify-center rounded-md border border-emerald-400/70 bg-slate-900/80 text-emerald-300 text-sm font-semibold hover:bg-emerald-500/20 transition-colors"
                          onClick={() => adjustBene(-1)}
                        >
                          -
                        </button>
                      </div>
                    </div>
                    <p className="text-[0.65rem] text-emerald-100/70 mt-0.5">
                      These units are called
                      <span className="font-semibold"> Bene</span> and are
                      always added to the non-magical die.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end mt-1">
                  <button
                    className="px-4 py-2 rounded-2xl bg-amber-300/95 text-slate-950 text-xs md:text-sm font-semibold shadow-lg shadow-amber-300/40 border border-amber-200 hover:-translate-y-0.5 hover:shadow-amber-300/70 transition-transform"
                    onClick={handleRollD10}
                  >
                    Roll d10 now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* RIGHT SECTION: d60 ethereal launcher */}
        <section className="flex-1 backdrop-blur-xl bg-gradient-to-b from-sky-900/40 via-slate-900/50 to-indigo-950/70 border border-sky-500/40 rounded-3xl p-5 md:p-6 shadow-xl shadow-sky-900/50 flex flex-col justify-between gap-4 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-40 w-40 bg-sky-400/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 h-56 w-56 bg-indigo-500/25 blur-3xl pointer-events-none" />
          <div className="absolute inset-8 border border-sky-200/10 rounded-[2rem] pointer-events-none" />

          <header className="relative z-10 flex flex-col gap-1">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-2">
              d60 Sooth Deck Dreamcaster
            </h2>
            <p className="text-sm md:text-xs text-sky-100/85 max-w-sm">
              A single d60 roll wrapped in a soft, dreamlike glow.
              Just pure fate in card form.
            </p>
          </header>

          <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6">
            {/* Ethereal halo */}
            <div className="relative h-40 w-40 md:h-48 md:w-48 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(at_0%_0%,rgba(56,189,248,0.15),transparent_55%,rgba(129,140,248,0.35),transparent_85%,rgba(56,189,248,0.2))] animate-[spin_18s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full bg-slate-950/40 backdrop-blur-xl border border-sky-100/20" />
              <div className="relative flex flex-col items-center justify-center rounded-full h-full w-full">
                <span className="text-[0.7rem] uppercase tracking-[0.25em] text-sky-100/70 mb-1">
                  result
                </span>
                <div className="text-4xl md:text-5xl font-black text-sky-50 drop-shadow-[0_0_30px_rgba(56,189,248,0.85)] min-h-[2.4rem] flex items-center">
                  {d60Result !== null ? d60Result : "–"}
                </div>
              </div>
            </div>

            <button
              className="px-6 py-2.5 rounded-2xl bg-sky-300/95 text-slate-950 text-sm font-semibold shadow-lg shadow-sky-400/40 border border-sky-200 hover:-translate-y-0.5 hover:shadow-sky-300/70 transition-transform"
              onClick={handleRollD60}
            >
              Cast d60
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
