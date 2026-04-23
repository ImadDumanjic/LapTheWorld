import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { Trash2, Check, X, ShieldCheck, Eye } from 'lucide-react'
import { fetchAllUsers, removeUser, fetchAllBlogs, changeBlogStatus } from '../services/adminService'
import { getBlogImageUrl } from '../services/blogService'

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
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function DeleteButton({ onConfirm }) {
  const [confirming, setConfirming] = useState(false)

  if (confirming) {
    return (
      <span className="flex items-center gap-1.5 text-xs">
        <button onClick={() => { onConfirm(); setConfirming(false) }} className="font-medium text-red-600 hover:text-red-700 transition-colors">
          Confirm
        </button>
        <span className="text-gray-300">|</span>
        <button onClick={() => setConfirming(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
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

function BlogDetailModal({ blog, onClose, onStatusChange }) {
  const imageUrl = getBlogImageUrl(blog.image_url)
  const authorName = blog.author
    ? [[blog.author.firstName, blog.author.lastName].filter(Boolean).join(' '), blog.author.username].find(Boolean)
    : 'Unknown'

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-8"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[760px] rounded-2xl overflow-hidden bg-white flex flex-col"
        style={{ maxHeight: '90vh', boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white border border-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="size-4" />
        </button>

        {/* Cover image */}
        {imageUrl ? (
          <div className="flex-shrink-0 overflow-hidden" style={{ height: 240 }}>
            <img src={imageUrl} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="flex-shrink-0 h-2 bg-gradient-to-r from-blue-200 via-sky-300 to-blue-200" />
        )}

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-8 py-6">

          {/* Status + meta */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <StatusBadge status={blog.status} />
            <span className="text-xs text-gray-400">{formatDate(blog.created_at)}</span>
          </div>

          {/* Author */}
          <div className="mb-4 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1">Author</p>
            <p className="text-sm font-semibold text-gray-800">{authorName}</p>
            {blog.author?.email && (
              <p className="text-xs text-gray-500">{blog.author.email}</p>
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 leading-tight mb-4">{blog.title}</h2>

          <hr className="border-gray-100 mb-4" />

          {/* Content */}
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{blog.content}</p>
        </div>

        {/* Action footer */}
        <div className="flex-shrink-0 flex items-center justify-between gap-3 px-8 py-4 border-t border-gray-100 bg-gray-50/60 flex-wrap">
          <div className="flex items-center gap-2">
            {blog.status !== 'approved' && blog.status !== 'deleted' && (
              <button
                onClick={() => onStatusChange(blog.id, 'approved')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                <Check className="size-4" />
                Approve
              </button>
            )}
            {blog.status !== 'rejected' && blog.status !== 'deleted' && (
              <button
                onClick={() => onStatusChange(blog.id, 'rejected')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors"
              >
                <X className="size-4" />
                Reject
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

const TH = 'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-400'
const TD = 'px-4 py-3.5 text-sm'

export default function AdminPage() {
  const navigate = useNavigate()
  const [activeTab,   setActiveTab]   = useState('users')
  const [users,       setUsers]       = useState([])
  const [blogs,       setBlogs]       = useState([])
  const [loading,     setLoading]     = useState(true)
  const [forbidden,   setForbidden]   = useState(false)
  const [error,       setError]       = useState(null)
  const [detailBlog,  setDetailBlog]  = useState(null)

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
      if (detailBlog?.id === id) setDetailBlog(updated)
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
          <button onClick={loadData} className="text-sm text-gray-500 underline hover:text-gray-700">Retry</button>
        </div>
      </div>
    )
  }

  const pendingCount = blogs.filter(b => b.status === 'pending').length

  const tabs = [
    { id: 'users', label: 'Users', count: users.length },
    { id: 'blogs', label: 'Blog Posts', count: blogs.length, badge: pendingCount > 0 ? pendingCount : null },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" />

      {detailBlog && (
        <BlogDetailModal
          blog={detailBlog}
          onClose={() => setDetailBlog(null)}
          onStatusChange={(id, status) => handleBlogStatus(id, status)}
        />
      )}

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
                activeTab === tab.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {tab.count}
              </span>
              {tab.badge && (
                <span className="text-xs rounded-full px-2 py-0.5 bg-amber-100 text-amber-700 font-semibold">
                  {tab.badge} pending
                </span>
              )}
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
                    <td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400">No users found</td>
                  </tr>
                ) : users.map((user, idx) => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors last:border-0">
                    <td className={`${TD} text-gray-400 tabular-nums w-10`}>{idx + 1}</td>
                    <td className={`${TD} font-medium text-gray-900`}>{user.username}</td>
                    <td className={`${TD} text-gray-500`}>{user.email}</td>
                    <td className={`${TD} text-gray-500`}>{[user.firstName, user.lastName].filter(Boolean).join(' ') || '—'}</td>
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
                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">No blog posts found</td>
                  </tr>
                ) : blogs.map((blog, idx) => (
                  <tr
                    key={blog.id}
                    className={`border-b border-gray-50 transition-colors last:border-0 ${
                      blog.status === 'pending' ? 'bg-amber-50/40 hover:bg-amber-50/60' : 'hover:bg-gray-50/60'
                    }`}
                  >
                    <td className={`${TD} text-gray-400 tabular-nums w-10`}>{idx + 1}</td>
                    <td className={`${TD} font-medium text-gray-900 max-w-xs`}>
                      <span className="line-clamp-1 block">{blog.title}</span>
                    </td>
                    <td className={`${TD} text-gray-500`}>{blog.author?.username || '—'}</td>
                    <td className={TD}><StatusBadge status={blog.status} /></td>
                    <td className={`${TD} text-gray-400`}>{formatDate(blog.created_at)}</td>
                    <td className={TD}>
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => setDetailBlog(blog)}
                          className="p-1.5 rounded-md text-gray-300 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                          title="View details"
                        >
                          <Eye className="size-4" />
                        </button>
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
