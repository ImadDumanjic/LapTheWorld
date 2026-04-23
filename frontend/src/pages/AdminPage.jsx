import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { Trash2, Check, X, ShieldCheck } from 'lucide-react'
import { fetchAllUsers, removeUser, fetchAllBlogs, changeBlogStatus } from '../services/adminService'

const STATUS_CONFIG = {
  draft:    { label: 'Draft',    cls: 'bg-gray-100 text-gray-500' },
  pending:  { label: 'Pending',  cls: 'bg-amber-100 text-amber-700' },
  approved: { label: 'Approved', cls: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-600' },
  deleted:  { label: 'Deleted',  cls: 'bg-gray-200 text-gray-400' },
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, cls: 'bg-gray-100 text-gray-500' }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.cls}`}>
      {cfg.label}
    </span>
  )
}

function RoleBadge({ role }) {
  const isAdmin = role === 'Admin'
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
      isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'
    }`}>
      {isAdmin && <ShieldCheck className="size-3" />}
      {role}
    </span>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function DeleteButton({ onConfirm }) {
  const [confirming, setConfirming] = useState(false)

  if (confirming) {
    return (
      <span className="flex items-center gap-1.5 text-xs">
        <button
          onClick={() => { onConfirm(); setConfirming(false) }}
          className="font-medium text-red-600 hover:text-red-700 transition-colors"
        >
          Confirm
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={() => setConfirming(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          Cancel
        </button>
      </span>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="p-1.5 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
      title="Delete"
    >
      <Trash2 className="size-4" />
    </button>
  )
}

const TH = 'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-400'
const TD = 'px-4 py-3.5 text-sm'

export default function AdminPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [forbidden, setForbidden] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/auth'); return }
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    setError(null)
    try {
      const [u, b] = await Promise.all([fetchAllUsers(), fetchAllBlogs()])
      setUsers(u)
      setBlogs(b)
    } catch (err) {
      if (err.status === 403) setForbidden(true)
      else setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteUser(id) {
    try {
      await removeUser(id)
      setUsers(prev => prev.filter(u => u.id !== id))
      toast.success('User deleted')
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function handleBlogStatus(id, status) {
    try {
      const updated = await changeBlogStatus(id, status)
      setBlogs(prev => prev.map(b => b.id === id ? updated : b))
      toast.success(`Blog marked as ${status}`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    )
  }

  if (forbidden) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Access Denied</h2>
          <p className="text-sm text-gray-500">You don&apos;t have permission to view this page.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-500 mb-3">{error}</p>
          <button onClick={loadData} className="text-sm text-gray-500 underline hover:text-gray-700">
            Retry
          </button>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'users', label: 'Users', count: users.length },
    { id: 'blogs', label: 'Blog Posts', count: blogs.length },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-6 pt-40 pb-10">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Admin</h1>
          <p className="text-sm text-gray-400 mt-1">Manage users and blog posts</p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 border-b border-gray-100 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
              <span className={`text-xs rounded-full px-2 py-0.5 transition-colors ${
                activeTab === tab.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Users table */}
        {activeTab === 'users' && (
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className={TH}>#</th>
                  <th className={TH}>Username</th>
                  <th className={TH}>Email</th>
                  <th className={TH}>Name</th>
                  <th className={TH}>Phone</th>
                  <th className={TH}>Role</th>
                  <th className={TH}>Joined</th>
                  <th className={TH} />
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400">
                      No users found
                    </td>
                  </tr>
                ) : users.map((user, idx) => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors last:border-0">
                    <td className={`${TD} text-gray-400 tabular-nums w-10`}>{idx + 1}</td>
                    <td className={`${TD} font-medium text-gray-900`}>{user.username}</td>
                    <td className={`${TD} text-gray-500`}>{user.email}</td>
                    <td className={`${TD} text-gray-500`}>
                      {[user.firstName, user.lastName].filter(Boolean).join(' ') || '—'}
                    </td>
                    <td className={`${TD} text-gray-500`}>{user.phone || '—'}</td>
                    <td className={TD}><RoleBadge role={user.role} /></td>
                    <td className={`${TD} text-gray-400`}>{formatDate(user.createdAt)}</td>
                    <td className={`${TD} text-right`}>
                      <DeleteButton onConfirm={() => handleDeleteUser(user.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Blog posts table */}
        {activeTab === 'blogs' && (
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className={TH}>#</th>
                  <th className={TH}>Title</th>
                  <th className={TH}>Author</th>
                  <th className={TH}>Status</th>
                  <th className={TH}>Created</th>
                  <th className={TH}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">
                      No blog posts found
                    </td>
                  </tr>
                ) : blogs.map((blog, idx) => (
                  <tr key={blog.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors last:border-0">
                    <td className={`${TD} text-gray-400 tabular-nums w-10`}>{idx + 1}</td>
                    <td className={`${TD} font-medium text-gray-900 max-w-xs`}>
                      <span className="line-clamp-1 block">{blog.title}</span>
                    </td>
                    <td className={`${TD} text-gray-500`}>{blog.author?.username || '—'}</td>
                    <td className={TD}><StatusBadge status={blog.status} /></td>
                    <td className={`${TD} text-gray-400`}>{formatDate(blog.created_at)}</td>
                    <td className={TD}>
                      <div className="flex items-center gap-0.5">
                        {blog.status !== 'approved' && blog.status !== 'deleted' && (
                          <button
                            onClick={() => handleBlogStatus(blog.id, 'approved')}
                            className="p-1.5 rounded-md text-gray-300 hover:text-green-600 hover:bg-green-50 transition-colors"
                            title="Approve"
                          >
                            <Check className="size-4" />
                          </button>
                        )}
                        {blog.status !== 'rejected' && blog.status !== 'deleted' && (
                          <button
                            onClick={() => handleBlogStatus(blog.id, 'rejected')}
                            className="p-1.5 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Reject"
                          >
                            <X className="size-4" />
                          </button>
                        )}
                        {blog.status !== 'deleted' && (
                          <DeleteButton onConfirm={() => handleBlogStatus(blog.id, 'deleted')} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  )
}
