import { useState, useMemo } from "react"; import { motion } from "framer-motion"; import { Plus, Minus, RotateCcw, Type, Sparkles } from "lucide-react";

// Drop this component into App.jsx and run. Tailwind classes are used for styling. export default function Day7MiniTask() { // --- Counter state --- const [count, setCount] = useState(0); const [step, setStep] = useState(1);

// --- Live text preview state --- const [text, setText] = useState(""); const [uppercase, setUppercase] = useState(false); const [fontSize, setFontSize] = useState(18);

const displayText = useMemo( () => (uppercase ? text.toUpperCase() : text), [text, uppercase] );

const words = useMemo( () => (text.trim() ? text.trim().split(/\s+/).length : 0), [text] );

return ( <div className="min-h-screen w-full bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white"> <header className="max-w-5xl mx-auto px-4 pt-10 pb-6"> <div className="flex items-center gap-3"> <div className="p-2 rounded-2xl bg-white/10 backdrop-blur shadow"> <Sparkles className="w-6 h-6" /> </div> <div> <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight"> Day 7: State Management – Mini Task </h1> <p className="text-white/70 text-sm sm:text-base"> useState • Handling Inputs • Reactive UI </p> </div> </div> </header>

<main className="max-w-5xl mx-auto px-4 pb-20 grid gap-6 md:grid-cols-2">
    {/* Counter Card */}
    <section className="rounded-2xl bg-white/5 border border-white/10 shadow-xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-emerald-500/20">
          <Plus className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-semibold">Interactive Counter</h2>
      </div>

      <div className="flex items-center justify-center mb-6">
        <motion.div
          key={count}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="w-36 h-36 rounded-2xl bg-white/10 border border-white/10 grid place-items-center shadow-inner"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="text-5xl font-bold tabular-nums">{count}</span>
        </motion.div>
      </div>

      <div className="flex items-center gap-3 justify-center">
        <button
          onClick={() => setCount((c) => c - step)}
          className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition shadow"
          aria-label="decrement"
        >
          <Minus className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCount((c) => c + step)}
          className="px-4 py-2 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 active:scale-95 transition shadow"
          aria-label="increment"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCount(0)}
          className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition shadow flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      <div className="mt-6">
        <label htmlFor="step" className="text-sm text-white/80">
          Step: <span className="font-semibold">{step}</span>
        </label>
        <input
          id="step"
          type="range"
          min={1}
          max={10}
          value={step}
          onChange={(e) => setStep(parseInt(e.target.value))}
          className="w-full accent-emerald-400"
        />
      </div>
    </section>

    {/* Live Text Preview Card */}
    <section className="rounded-2xl bg-white/5 border border-white/10 shadow-xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-indigo-500/20">
          <Type className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-semibold">Live Text Preview</h2>
      </div>

      <label htmlFor="text" className="text-sm text-white/80">
        Type something…
      </label>
      <textarea
        id="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Hello, React!"
        className="mt-2 w-full h-28 rounded-2xl bg-black/40 border border-white/10 p-4 outline-none focus:ring-2 focus:ring-indigo-400/60"
      />

      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="accent-indigo-400"
          />
          Uppercase
        </label>

        <div>
          <label htmlFor="size" className="text-sm text-white/80">
            Font size: <span className="font-semibold">{fontSize}px</span>
          </label>
          <input
            id="size"
            type="range"
            min={12}
            max={42}
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="w-full accent-indigo-400"
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-4">
        <p className="text-xs tracking-wide text-white/60 mb-2">Preview</p>
        <p style={{ fontSize }} className="leading-relaxed break-words">
          {displayText || <span className="text-white/40">(Nothing yet…)</span>}
        </p>
      </div>

      <div className="mt-4 text-sm text-white/70 flex flex-wrap gap-x-6 gap-y-2">
        <span><strong>{text.length}</strong> chars</span>
        <span><strong>{words}</strong> words</span>
      </div>
    </section>
  </main>

  <footer className="max-w-5xl mx-auto px-4 pb-8 text-center text-white/50 text-xs">
    Built with <code>useState</code> and controlled inputs. ✨
  </footer>
</div>

); 
