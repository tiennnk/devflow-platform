'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import { Pencil, Plus } from 'lucide-react';
import { getTasks, createTask, updateTask, deleteTask, Task, TaskStatus } from '@/lib/api';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const STATUS_ORDER: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

const STATUS_STYLES: Record<TaskStatus, string> = {
  TODO: 'bg-todo text-white',
  IN_PROGRESS: 'bg-in-progress text-white',
  DONE: 'bg-done text-white'
};

export default function TasksPage() {
  const translations = useTranslations();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [search, setSearch] = useState('');

  // create modal
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newStatus, setNewStatus] = useState<TaskStatus>('TODO');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const createInputRef = useRef<HTMLInputElement>(null);

  // edit modal
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editStatus, setEditStatus] = useState<TaskStatus>('TODO');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as { username?: string; email?: string };
      setUsername(payload.username ?? payload.email ?? '');
    } catch {}

    getTasks()
      .then((res) => setTasks(res.data))
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));

    const socket = io(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000');

    socket.on('task:created', (task: Task) => {
      setTasks((prev) => (prev.find((t) => t.id === task.id) ? prev : [...prev, task]));
    });
    socket.on('task:updated', (task: Task) => {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    });
    socket.on('task:deleted', (data: { id: number }) => {
      setTasks((prev) => prev.filter((t) => t.id !== data.id));
    });

    return () => {
      socket.disconnect();
    };
  }, [router]);

  // --- create ---
  function openCreate() {
    setNewTitle('');
    setNewStatus('TODO');
    setCreateError('');
    setShowCreate(true);
    setTimeout(() => createInputRef.current?.focus(), 50);
  }

  function closeCreate() {
    setShowCreate(false);
    setNewTitle('');
    setNewStatus('TODO');
    setCreateError('');
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    setCreateError('');
    try {
      const res = await createTask(newTitle.trim(), newStatus);
      setTasks((prev) => [...prev, res.data]);
      closeCreate();
    } catch {
      setCreateError(translations('CREATE_ERROR'));
    } finally {
      setCreating(false);
    }
  }

  // --- edit ---
  function openEdit(task: Task, e: React.MouseEvent) {
    e.stopPropagation();
    setEditTask(task);
    setEditTitle(task.title);
    setEditStatus(task.status);
    setEditError('');
  }

  function closeEdit() {
    setEditTask(null);
    setEditError('');
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editTask || !editTitle.trim()) return;
    setSaving(true);
    setEditError('');
    try {
      const res = await updateTask(editTask.id, { title: editTitle.trim(), status: editStatus });
      setTasks((prev) => prev.map((t) => (t.id === editTask.id ? res.data : t)));
      closeEdit();
    } catch {
      setEditError(translations('UPDATE_ERROR'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!editTask) return;
    setDeleting(true);
    try {
      await deleteTask(editTask.id);
      setTasks((prev) => prev.filter((t) => t.id !== editTask.id));
      closeEdit();
    } catch {
      setEditError(translations('UPDATE_ERROR'));
    } finally {
      setDeleting(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    router.push('/login');
  }

  const filtered = search.trim() ? tasks.filter((t) => t.title.toLowerCase().includes(search.trim().toLowerCase())) : tasks;

  const grouped = STATUS_ORDER.reduce(
    (acc, status) => {
      acc[status] = filtered.filter((t) => t.status === status);
      return acc;
    },
    {} as Record<TaskStatus, Task[]>
  );

  const STATUS_LABELS: Record<TaskStatus, string> = {
    TODO: translations('TODO'),
    IN_PROGRESS: translations('IN_PROGRESS'),
    DONE: translations('DONE')
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{translations('LOADING')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-primary">{translations('TASK_TITLE')}</h1>
          <div className="flex items-center gap-4">
            {username && <span className="text-sm font-medium text-gray-700">{username}</span>}
            <LanguageSwitcher />
            <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-primary transition-colors">
              {translations('LOGOUT')}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="flex justify-end">
          <button onClick={openCreate} className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-hover transition-colors flex items-center gap-2">
            <Plus size={16} />
            {translations('CREATE')}
          </button>
        </div>

        {/* Create modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={closeCreate}>
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-semibold mb-4">{translations('CREATE')}</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{translations('TITLE_LABEL')}</label>
                  <input
                    ref={createInputRef}
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={translations('TITLE_LABEL')}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{translations('STATUS_LABEL')}</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as TaskStatus)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                  >
                    {STATUS_ORDER.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </div>
                {createError && <p className="text-sm text-red-600">{createError}</p>}
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={closeCreate} className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50 transition-colors">
                    {translations('CANCEL')}
                  </button>
                  <button
                    type="submit"
                    disabled={creating || !newTitle.trim()}
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-hover disabled:opacity-50 transition-colors"
                  >
                    {creating ? translations('LOADING') : translations('SAVE')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit modal */}
        {editTask && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={closeEdit}>
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-semibold mb-4">{translations('EDIT_TASK')}</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{translations('TITLE_LABEL')}</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{translations('STATUS_LABEL')}</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as TaskStatus)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                  >
                    {STATUS_ORDER.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </div>
                {editError && <p className="text-sm text-red-600">{editError}</p>}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-4 py-2 text-sm rounded-lg text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-50 transition-colors"
                  >
                    {deleting ? translations('LOADING') : translations('DELETE')}
                  </button>
                  <div className="flex gap-3">
                    <button type="button" onClick={closeEdit} className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50 transition-colors">
                      {translations('CANCEL')}
                    </button>
                    <button
                      type="submit"
                      disabled={saving || !editTitle.trim()}
                      className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-hover disabled:opacity-50 transition-colors"
                    >
                      {saving ? translations('LOADING') : translations('SAVE')}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STATUS_ORDER.map((status) => (
            <div key={status} className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[status]}`}>{STATUS_LABELS[status]}</span>
                <span className="text-xs text-gray-400">{grouped[status].length}</span>
              </div>

              {grouped[status].length === 0 ? (
                <p className="text-sm text-gray-400 italic">{translations('NO_TASKS')}</p>
              ) : (
                <ul className="space-y-2">
                  {grouped[status].map((task) => (
                    <li key={task.id} className="text-sm px-3 py-2 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 flex items-center justify-between group">
                      <span>{task.title}</span>
                      <button onClick={(e) => openEdit(task, e)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-primary transition-all ml-2 shrink-0" aria-label="Edit task">
                        <Pencil size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
