import { useState } from "react"

const PRIORITIES = ["low", "medium", "high"]

const priorityConfig = {
  low:    { label: "Low",    dot: "bg-emerald-400", text: "text-emerald-600", badge: "bg-emerald-50 text-emerald-700" },
  medium: { label: "Medium", dot: "bg-amber-400",   text: "text-amber-600",   badge: "bg-amber-50  text-amber-700"  },
  high:   { label: "High",   dot: "bg-red-400",     text: "text-red-600",     badge: "bg-red-50    text-red-700"    },
}

const timeAgo = (dateStr) => {
  const mins = Math.floor((Date.now() - new Date(dateStr)) / 60000)
  if (mins < 1)  return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function TaskCard({ task, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing]      = useState(false)
  const [editTitle, setEditTitle]  = useState(task.title)
  const [editDesc, setEditDesc]    = useState(task.description || "")
  const [editPri, setEditPri]      = useState(task.priority)
  const [saving, setSaving]        = useState(false)

  const p = priorityConfig[task.priority] || priorityConfig.medium

  const cancelEdit = () => {
    setEditTitle(task.title)
    setEditDesc(task.description || "")
    setEditPri(task.priority)
    setEditing(false)
  }

  const handleSave = async () => {
    if (!editTitle.trim()) return
    setSaving(true)
    const ok = await onUpdate(task._id, {
      title: editTitle.trim(),
      description: editDesc.trim(),
      priority: editPri,
    })
    setSaving(false)
    if (ok) setEditing(false)
  }

  if (editing) {
    return (
      <div className="animate-fadeSlide bg-white rounded-2xl border border-indigo-200
        shadow-sm p-4 space-y-3">
        <input
          autoFocus
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
            text-gray-800 outline-none focus:border-indigo-400 focus:ring-2
            focus:ring-indigo-100 transition-all"
        />
        <textarea
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          rows={2}
          placeholder="Description"
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
            text-gray-700 outline-none resize-none focus:border-indigo-400
            focus:ring-2 focus:ring-indigo-100 transition-all"
        />
        <div className="flex gap-2">
          {PRIORITIES.map((pri) => (
            <button
              key={pri}
              onClick={() => setEditPri(pri)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize
                border transition-all
                ${editPri === pri
                  ? `${priorityConfig[pri].badge} border-current`
                  : "border-gray-200 text-gray-400 hover:border-gray-300"}`}
            >
              {pri}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={cancelEdit}
            className="flex-1 py-2 rounded-xl border border-gray-200 text-xs
              text-gray-500 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!editTitle.trim() || saving}
            className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700
              disabled:opacity-40 text-white text-xs font-semibold transition-colors"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`animate-fadeSlide group bg-white rounded-2xl border shadow-sm
      p-4 transition-all hover:shadow-md
      ${task.completed ? "border-gray-100 opacity-60" : "border-gray-200"}`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task._id)}
          className={`mt-0.5 w-5 h-5 shrink-0 rounded-md border-2 flex items-center
            justify-center transition-all
            ${task.completed
              ? "bg-emerald-500 border-emerald-500"
              : "border-gray-300 hover:border-indigo-400"}`}
        >
          {task.completed && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium leading-snug
            ${task.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-xs font-medium
              px-2 py-0.5 rounded-full ${p.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
              {p.label}
            </span>
            <span className="text-xs text-gray-300">{timeAgo(task.createdAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setEditing(true)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600
              hover:bg-indigo-50 transition-all"
            title="Edit"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500
              hover:bg-red-50 transition-all"
            title="Delete"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}