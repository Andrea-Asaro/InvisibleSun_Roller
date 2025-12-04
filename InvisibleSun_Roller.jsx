// React hooks
const { useState, useEffect, useRef } = React;

function DiceSimulator() {
  const [rollMode, setRollMode] = useState("both");
  const [beneModifier, setBeneModifier] = useState("0");

  const [magicD10Result, setMagicD10Result] = useState(null);
  const [nonMagicD10Result, setNonMagicD10Result] = useState(null);
  const [nonMagicD10Total, setNonMagicD10Total] = useState(null);
  const [d60Result, setD60Result] = useState(null);

  const [showMagicCard, setShowMagicCard] = useState(true);

  const [isMagicAlert, setIsMagicAlert] = useState(false);
  const magicRef = useRef(null);

  /* ------- Helpers ------- */
  const rollDie = (sides) => Math.floor(Math.random() * sides) + 1;

  const rollD10ZeroToNine = () => Math.floor(Math.random() * 10);

  /* ------- Magic Zero Animation ------- */
  const triggerMagicZeroAnimation = () => {
    setIsMagicAlert(true);
    setTimeout(() => setIsMagicAlert(false), 3000);
  };

  /* ------- Roll d10 ------- */
  const handleRollD10 = () => {
    const modifier = parseInt(beneModifier, 10) || 0;

    const nonMagic = rollD10ZeroToNine();
    setNonMagicD10Result(nonMagic);
    setNonMagicD10Total(nonMagic + modifier);

    if (rollMode === "both") {
      const magic = rollD10ZeroToNine();
      setMagicD10Result(magic);
      if (magic === 0) triggerMagicZeroAnimation();
    }
  };

  /* ------- Roll d60 ------- */
  const handleRollD60 = () => {
    setD60Result(rollDie(60));
  };

  /* ------- Animated appear/disappear of magic card ------- */
  const prevMode = useRef(rollMode);

  useEffect(() => {
    if (prevMode.current !== rollMode) {
      if (rollMode === "both") {
        setShowMagicCard(true);
        requestAnimationFrame(() => {
          magicRef.current?.classList.add("fade-enter");
          requestAnimationFrame(() =>
            magicRef.current?.classList.add("fade-enter-active")
          );
        });
      } else {
        if (magicRef.current) {
          magicRef.current.classList.add("fade-exit");
          requestAnimationFrame(() =>
            magicRef.current.classList.add("fade-exit-active")
          );
          setTimeout(() => {
            setShowMagicCard(false);
          }, 300);
        } else {
          setShowMagicCard(false);
        }
      }
    }
    prevMode.current = rollMode;
  }, [rollMode]);

  /* ------- Adjust Bene ------- */
  const adjustBene = (delta) => {
    const val = parseInt(beneModifier || "0", 10) || 0;
    setBeneModifier(String(val + delta));
  };

  /* ----------------------------------------------------------- */
  /* ------------------------- RENDER --------------------------- */
  /* ----------------------------------------------------------- */

  return (
    <div className="min-h-screen w-full flex items-stretch justify-center bg-gradient-to-r from-slate-950 via-slate-900 to-sky-900 text-slate-50">
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-6 md:gap-10 p-4 md:p-8">

        {/* LEFT SECTION: d10 */}
        <section className="flex-1 backdrop-blur-md bg-slate-900/40 border border-slate-700/60 rounded-3xl p-5 md:p-6 shadow-xl shadow-slate-900/40 flex flex-col gap-4">

          {/* Header */}
          <header className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">d10 Roller</h1>
            <p className="text-sm md:text-xs text-slate-300/80 max-w-md">
              Roll a magical and a non-magical d10. Add your <span className="font-semibold text-emerald-300">Bene</span>.
            </p>
          </header>

          {/* Mode selector */}
          <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-slate-900/70 p-1 w-full max-w-xs">
            <button
              className={`flex-1 px-3 py-1 text-xs rounded-full border transition-all ${
                rollMode === "both"
                  ? "bg-emerald-500/90 text-slate-950 shadow-lg shadow-emerald-500/30 border-emerald-300"
                  : "text-slate-200 hover:bg-slate-800/80"
              }`}
              onClick={() => setRollMode("both")}
            >
              Magic + Non-magic
            </button>
            <button
              className={`flex-1 px-3 py-1 text-xs rounded-full border transition-all ${
                rollMode === "nonMagical"
                  ? "bg-amber-400/90 text-slate-950 shadow-lg shadow-amber-400/30 border-amber-200"
                  : "text-slate-200 hover:bg-slate-800/80"
              }`}
              onClick={() => setRollMode("nonMagical")}
            >
              Only Non-magic
            </button>
          </div>

          {/* LAUNCHERS CONTAINER */}
          <div className="grid gap-4 mt-2 flex-1">

            {/* MAGIC d10 CARD */}
            {showMagicCard && (
              <div
                ref={magicRef}
                className={`
                  rounded-3xl overflow-hidden relative 
                  border flex flex-col md:flex-row
                  ${
                    isMagicAlert
                      ? "magic-alert border-red-500/70 bg-gradient-to-br from-red-950/80 via-red-900/70 to-rose-900/70"
                      : "border-violet-400/40 bg-gradient-to-br from-violet-900/60 via-fuchsia-800/40 to-sky-900/40"
                  }
                `}
              >
                <div className="relative flex-1 p-4 md:p-5 flex flex-col justify-between gap-3">
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-400/80 text-slate-950 text-xs font-bold">M</span>
                      Magical d10
                    </h2>
                    <p className="mt-1 text-xs text-violet-100/80">Sortilege roll, shimmering with arcane probability.</p>
                  </div>

                  <div className="mt-1 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
                    <div>
                      <span className="text-[0.7rem] text-violet-200/80 mb-1 block uppercase">Result</span>
                      <div className="text-4xl md:text-5xl font-black text-fuchsia-200">
                        {magicD10Result ?? "–"}
                      </div>
                    </div>

                    <button
                      className="px-4 py-2 rounded-2xl bg-fuchsia-200 text-slate-950 text-xs font-semibold shadow-lg hover:-translate-y-0.5 transition"
                      onClick={handleRollD10}
                    >
                      Roll d10 (both)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* NON-MAGIC d10 CARD */}
            <div
              className={`
                rounded-3xl border border-amber-300/50 
                bg-gradient-to-br from-slate-950/70 via-slate-900/70 to-amber-900/40 
                shadow-[0_0_40px_rgba(251,191,36,0.25)]
                smooth-height
              `}
            >
              <div className="relative flex-1 p-4 md:p-5 flex flex-col gap-4">

                <div className="flex justify-between">
                  <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-300 text-slate-950 text-xs font-bold">N</span>
                    Non-magical d10
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[2fr_1.7fr] gap-4 items-end">
                  <div className="flex flex-col gap-3">
                    <div>
                      <span className="text-[0.7rem] text-amber-100/80 mb-1 block uppercase">Base roll</span>
                      <div className="text-3xl md:text-4xl font-bold text-amber-200">
                        {nonMagicD10Result ?? "–"}
                      </div>
                    </div>

                    <div>
                      <span className="text-[0.7rem] text-emerald-100/90 mb-1 block uppercase">Total w/ Bene</span>
                      <div className="text-3xl md:text-4xl font-extrabold text-emerald-200">
                        {nonMagicD10Total ?? "–"}
                      </div>
                    </div>
                  </div>

                  {/* Bene modifier */}
                  <div className="flex flex-col gap-2 p-3 rounded-2xl border border-emerald-400/40 bg-slate-950/60">
                    <label className="text-[0.7rem] uppercase text-emerald-100/80">Bene modifier</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="w-16 h-16 bg-slate-900/80 border border-emerald-500/40 rounded-xl text-center text-xl text-emerald-50"
                        value={beneModifier}
                        onChange={(e) => setBeneModifier(e.target.value)}
                      />
                      <div className="flex flex-col gap-1">
                        <button
                          className="w-8 h-7 border border-emerald-400 text-emerald-300 rounded-md"
                          onClick={() => adjustBene(1)}
                        >
                          +
                        </button>
                        <button
                          className="w-8 h-7 border border-emerald-400 text-emerald-300 rounded-md"
                          onClick={() => adjustBene(-1)}
                        >
                          -
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-1">
                  <button
                    className="px-4 py-2 rounded-2xl bg-amber-300/95 text-slate-950 text-xs font-semibold shadow-lg hover:-translate-y-0.5 transition"
                    onClick={handleRollD10}
                  >
                    Roll d10 now
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* RIGHT SECTION: d60 */}
        <section className="flex-1 backdrop-blur-xl bg-gradient-to-b from-sky-900/40 via-slate-900/50 to-indigo-950/70 border border-sky-500/40 rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <header className="z-10">
            <h2 className="text-2xl md:text-3xl font-semibold">d60 Sooth Deck Dreamcaster</h2>
            <p className="text-sm text-sky-100/85">Dreamlike fate in card form.</p>
          </header>

          <div className="flex flex-col items-center justify-center gap-6 relative z-10">

            <div className="relative h-40 w-40 md:h-48 md:w-48 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(at_0%_0%,rgba(56,189,248,0.15),transparent_55%,rgba(129,140,248,0.35),transparent_85%,rgba(56,189,248,0.2))] animate-spin-slow"></div>

              <div className="absolute inset-4 rounded-full bg-slate-950/40 backdrop-blur-xl border border-sky-100/20"></div>

              <div className="relative flex flex-col items-center justify-center rounded-full h-full w-full">
                <span className="text-[0.7rem] uppercase text-sky-100/70">result</span>
                <div className="text-4xl md:text-5xl font-black text-sky-50">
                  {d60Result ?? "–"}
                </div>
              </div>
            </div>

            <button
              className="px-6 py-2.5 rounded-2xl bg-sky-300/95 text-slate-950 text-sm font-semibold shadow-lg hover:-translate-y-0.5 transition"
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

ReactDOM.createRoot(document.getElementById("root")).render(<DiceSimulator />);
