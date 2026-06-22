import { useState, useEffect, useMemo } from "react"
import { toast, ToastContainer } from "react-toastify"
import { taskService } from "./services/task.service"
import TaskForm from "./components/TaskForm"
import TaskCard from "./components/TaskCard"
import DeleteModal from "./components/DeleteModal"

const FILTERS = ["all", "active", "completed"]

export default function App() {
  const [tasks, setTasks]             = useState([])
  const [loading, setLoading]         = useState(true)
  const [adding, setAdding]           = useState(false)
  const [filter, setFilter]           = useState("all")
  const [taskToDelete, setTaskToDelete] = useState(null)

  useEffect(() => {
    taskService.getAll()
      .then((res) => setTasks(res.data))
      .catch(() => toast.error("Failed to load tasks"))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async (payload) => {
    setAdding(true)
    try {
      const res = await taskService.create(payload)
      setTasks((prev) => [res.data, ...prev])
      toast.success("Task added!")
      return true
    } catch (err) {
      toast.error(err.message)
      return false
    } finally {
      setAdding(false)
    }
  }

  const handleToggle = async (id) => {
    try {
      const res = await taskService.toggle(id)
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)))
      toast.info(res.data.completed ? "Marked as complete" : "Marked as active")
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleUpdate = async (id, payload) => {
    try {
      const res = await taskService.update(id, payload)
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)))
      toast.success("Task updated")
      return true
    } catch (err) {
      toast.error(err.message)
      return false
    }
  }

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return
    try {
      await taskService.delete(taskToDelete._id)
      setTasks((prev) => prev.filter((t) => t._id !== taskToDelete._id))
      toast.error(`"${taskToDelete.title}" deleted`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setTaskToDelete(null)
    }
  }

  const stats = useMemo(() => ({
    total:     tasks.length,
    active:    tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  }), [tasks])

  const filtered = useMemo(() => {
    if (filter === "active")    return tasks.filter((t) => !t.completed)
    if (filter === "completed") return tasks.filter((t) => t.completed)
    return tasks
  }, [tasks, filter])

  const pct = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-base tracking-tight">TaskManager</span>
          </div>
          <span className="text-xs font-medium text-gray-400">
            {stats.active} remaining
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total",     value: stats.total,     color: "text-gray-800",    bg: "bg-white"       },
            { label: "Active",    value: stats.active,    color: "text-amber-600",   bg: "bg-amber-50"    },
            { label: "Completed", value: stats.completed, color: "text-emerald-600", bg: "bg-emerald-50"  },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-2xl border border-gray-200 p-4 text-center shadow-sm`}>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-400 mt-0.5 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Progress */}
        {stats.total > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4">
            <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
              <span>Progress</span>
              <span>{pct}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        {/* Add task */}
        <TaskForm onAdd={handleAdd} loading={adding} />

        {/* Filters */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all
                ${filter === f
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-600"}`}
            >
              {f}
              {f === "active" && stats.active > 0 && (
                <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px]
                  ${filter === f ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                  {stats.active}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Task list */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading tasks...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-3xl mb-3">
              {filter === "completed" ? "🎉" : filter === "active" ? "✅" : "📋"}
            </p>
            <p className="text-sm font-medium text-gray-400">
              {filter === "all" ? "No tasks yet — add one above" : `No ${filter} tasks`}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggle={handleToggle}
                onUpdate={handleUpdate}
                onDelete={(t) => setTaskToDelete(t)}
              />
            ))}
          </div>
        )}
      </main>

      {taskToDelete && (
        <DeleteModal
          task={taskToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setTaskToDelete(null)}
        />
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </div>
  )
}