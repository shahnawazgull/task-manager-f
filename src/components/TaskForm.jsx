import { useState } from "react"

const PRIORITIES = ["low", "medium", "high"]

const priorityStyles = {
  low:    "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-400",
  medium: "bg-amber-50  text-amber-700  border-amber-200  ring-amber-400",
  high:   "bg-red-50    text-red-700    border-red-200    ring-red-400",
}

export default function TaskForm({ onAdd, loading }) {
  const [open, setOpen]         = useState(false)
  const [title, setTitle]       = useState("")
  const [description, setDesc]  = useState("")
  const [priority, setPriority] = useState("medium")

  const reset = () => {
    setTitle("")
    setDesc("")
    setPriority("medium")
    setOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    const ok = await onAdd({ title: title.trim(), description: description.trim(), priority })
    if (ok) reset()
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4
          hover:bg-gray-50 transition-colors text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <span className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-base leading-none">+</span>
          Add a task
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="border-t border-gray-100 px-5 py-4 space-y-3">
          <input
            autoFocus
            type="text"
            placeholder="Task title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
              text-gray-800 placeholder-gray-400 outline-none
              focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
          />

          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDesc(e.target.value)}
            rows={2}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
              text-gray-800 placeholder-gray-400 outline-none resize-none
              focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
          />

          <div className="flex gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize border transition-all
                  ${priority === p
                    ? `${priorityStyles[p]} ring-2`
                    : "border-gray-200 text-gray-400 hover:border-gray-300"}`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={reset}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm
                text-gray-500 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || loading}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700
                disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm
                font-semibold transition-colors"
            >
              {loading ? "Adding..." : "Add task"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}