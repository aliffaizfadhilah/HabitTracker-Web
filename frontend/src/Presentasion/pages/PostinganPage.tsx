import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../BusinessLogic/context/AuthContext'
import { Sidebar, LogoutModal, useSidebar } from './shared/sideBar'
import { postService, type Post, type PaginationMeta } from '../../BusinessLogic/services/PostService'
import { useFeedRealtime } from '../../BusinessLogic/hooks/useFeedRealtime'
import NewPostModal from '../components/NewPostModal'
import {
  Menu, Heart, Inbox,
  ChevronLeft, Check, X, Plus, Search, ArrowUp,
  ChevronRight,
} from 'lucide-react'

const PER_PAGE_OPTIONS = [6, 8, 12, 16, 24]

const CARD_PALETTES = [
  ['#16a34a', '#059669'],
  ['#2563eb', '#1d4ed8'],
  ['#7c3aed', '#6d28d9'],
  ['#dc2626', '#b91c1c'],
  ['#d97706', '#b45309'],
  ['#0891b2', '#0e7490'],
  ['#db2777', '#be185d'],
  ['#65a30d', '#4d7c0f'],
]


function PinCard({ post, onLikeChange, onClick }: {
  post: Post
  onLikeChange: (id: number, liked: boolean, count: number) => void
  onClick: (post: Post) => void
}) {
  const [liked,    setLiked]    = useState(post.liked_by_me)
  const [hovering, setHovering] = useState(false)
  const [liking,   setLiking]   = useState(false)
  const [imgError, setImgError] = useState(false)

  const mountedRef = useRef(false)
  useEffect(() => {
    if (!mountedRef.current) { mountedRef.current = true; return }
    setLiked(post.liked_by_me)
  }, [post.liked_by_me])

  const toggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (liking) return
    setLiking(true)
    const res = await postService.toggleLike(post.id)
    if (res.success) {
      setLiked(res.liked)
      onLikeChange(post.id, res.liked, res.likes_count)
    }
    setLiking(false)
  }

  const palette = CARD_PALETTES[post.id % CARD_PALETTES.length]
  const seedNum = (post.id % 8) + 1
  const seedUrl = `/storage/posts/seed-${seedNum}.png?v=2`
  const isRealPhoto = post.image_url && !post.image_url.includes('seed-')
  const displayUrl = isRealPhoto ? post.image_url! : seedUrl

  return (
    <div
      className="relative rounded-[16px] overflow-hidden cursor-pointer"
      style={{ breakInside: 'avoid', marginBottom: 8 }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => onClick(post)}
    >
      <div style={{ aspectRatio: '256/455', position: 'relative' }}>

        {/* Background: foto asli (jika upload) atau seed cycling (dummy) */}
        {!imgError ? (
          <img
            src={displayUrl}
            alt={post.title}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="absolute inset-0" style={{
            background: `linear-gradient(145deg, ${palette[0]}, ${palette[1]})`
          }} />
        )}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-200"
          style={{ background: 'rgba(0,0,0,0.12)', opacity: hovering ? 1 : 0 }}
        />

        {/* Like button */}
        <div
          className="absolute top-2.5 right-2.5 transition-all duration-200"
          style={{ opacity: hovering || liked ? 1 : 0, transform: hovering || liked ? 'scale(1)' : 'scale(0.8)' }}
        >
          <button
            onClick={toggleLike}
            disabled={liking}
            className="w-9 h-9 rounded-full border-none cursor-pointer flex items-center justify-center shadow-md transition-transform active:scale-90 disabled:opacity-60"
            style={{ background: liked ? '#ef4444' : 'rgba(255,255,255,0.95)' }}
          >
            <Heart size={17} fill={liked ? 'white' : 'none'} color={liked ? 'white' : '#333'} strokeWidth={liked ? 0 : 2} />
          </button>
        </div>
      </div>

      {/* Caption di bawah card */}
      {(post.title || post.caption) && (
        <div className="px-3 py-2.5 bg-white border-t border-[#f0f0f0]">
          {post.title && (
            <div className="text-[13px] font-bold text-ink leading-snug">{post.title}</div>
          )}
          {post.caption && (
            <div className="text-[12px] text-muted mt-0.5 leading-snug" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {post.caption}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function PostinganPage() {
  const { user, logout }                          = useAuth()
  const { isMobile, sidebarOpen, setSidebarOpen } = useSidebar()
  const navigate = useNavigate()
  const [showLogout,    setShowLogout]    = useState(false)
  const [posts,         setPosts]         = useState<Post[]>([])
  const [loading,       setLoading]       = useState(true)
  const [showNewPost,   setShowNewPost]   = useState(false)
  const [toast,         setToast]         = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [searchQuery,   setSearchQuery]   = useState('')
  const [cursor,        setCursor]        = useState(0)
  const [rtReady,       setRtReady]       = useState(false)
  const [page,          setPage]          = useState(1)
  const [perPage,       setPerPage]       = useState(12)
  const [meta,          setMeta]          = useState<PaginationMeta>({ current_page: 1, last_page: 1, per_page: 12, total: 0 })
  const hasPagination = !loading && !searchQuery && meta.last_page > 1

  const { pendingPosts, transport, clearPending } = useFeedRealtime(cursor, rtReady)

  const displayUser = { full_name: user?.full_name ?? 'Pengguna', email: user?.email ?? '', username: user?.username ?? 'Pengguna' }

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, message: msg })
    setTimeout(() => setToast(null), 3000)
  }

  const loadPosts = useCallback((p: number, pp: number) => {
    setLoading(true)
    postService.getPosts(p, pp)
      .then(({ data, meta: m }) => {
        setPosts(data)
        setMeta(m)
        setCursor(data.length > 0 ? Math.max(...data.map(post => post.id)) : 0)
        setRtReady(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadPosts(page, perPage)
  }, [page, perPage, loadPosts])

  const handleLikeChange = (id: number, liked: boolean, count: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, liked_by_me: liked, likes_count: count } : p))
  }

  const handleLoadNew = () => {
    const existingIds = new Set(posts.map(p => p.id))
    const fresh = pendingPosts.filter(p => !existingIds.has(p.id))
    if (fresh.length > 0) {
      setPosts(prev => [...fresh, ...prev])
      setCursor(Math.max(...fresh.map(p => p.id), cursor))
    }
    clearPending()
  }

  const transportLabel: Record<string, string> = { ws: 'WS', sse: 'SSE', polling: 'Polling' }

  const cols = isMobile ? 2 : 3
  const colWidth = `calc((100% - ${(cols - 1) * 8}px) / ${cols})`

  const q = searchQuery.trim().toLowerCase()
  const filteredPosts = q
    ? posts.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.caption?.toLowerCase().includes(q)) ||
        (p.habit_title?.toLowerCase().includes(q)) ||
        (p.user.full_name?.toLowerCase().includes(q)) ||
        p.user.username.toLowerCase().includes(q),
      )
    : posts

  const columns: Post[][] = Array.from({ length: cols }, () => [])
  filteredPosts.forEach((post, i) => columns[i % cols].push(post))

  return (
    <div className="flex min-h-screen bg-surface font-body">
      <Sidebar
        open={sidebarOpen} isMobile={isMobile} currentPageId="postingan"
        displayUser={displayUser} onClose={() => setSidebarOpen(false)} onLogout={() => setShowLogout(true)}
      />

      <main className={`flex-1 overflow-y-auto min-w-0 ${isMobile ? 'p-4' : 'p-6 px-8'}`}>
        {/* Header */}
        <div className="flex flex-col gap-3 mb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="w-9 h-9 border border-border rounded-[8px] bg-white cursor-pointer flex items-center justify-center shrink-0"
            ><Menu size={16} /></button>
            <div className="flex-1 min-w-0">
              <h1 className="font-body text-xl font-bold text-ink m-0">Postingan</h1>
              <p className="text-[12px] text-muted m-0 mt-0.5">
                {meta.total > 0
                  ? `${meta.total} postingan · halaman ${meta.current_page} dari ${meta.last_page}`
                  : 'Progres habit semua pengguna'}
              </p>
            </div>
            {/* Per-page selector */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] text-muted hidden sm:inline">Tampil</span>
              <select
                value={perPage}
                onChange={e => { setPerPage(Number(e.target.value)); setPage(1) }}
                className="text-[12px] font-body border border-border rounded-lg px-2 py-1.5 bg-white text-ink outline-none cursor-pointer"
              >
                {PER_PAGE_OPTIONS.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span className="text-[11px] text-muted hidden sm:inline">/ hal</span>
            </div>
          </div>
          {/* Search bar */}
          <div className="relative">
            <Search size={15} color="#9ca3af"
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari postingan, habit, atau pengguna..."
              className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-border bg-white text-[13px] font-body outline-none text-ink focus:border-[#16a34a] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#e5e7eb] border-none cursor-pointer flex items-center justify-center"
              >
                <X size={11} color="#6b7280" />
              </button>
            )}
          </div>
        </div>

        {/* New-posts banner */}
        {pendingPosts.length > 0 && (
          <button
            onClick={handleLoadNew}
            className="w-full mb-3 py-2.5 px-4 rounded-xl border-none cursor-pointer flex items-center justify-center gap-2 text-[13px] font-bold text-white shadow-lg transition-transform active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg,#16a34a,#10b981)' }}
          >
            <ArrowUp size={15} />
            {pendingPosts.length} postingan baru — Klik untuk lihat
          </button>
        )}

        {/* Transport indicator */}
        {transport !== 'idle' && (
          <div className="mb-2 flex justify-end">
            <span className="text-[10px] text-muted px-2 py-0.5 rounded-full bg-[#f3f4f6]">
              {transportLabel[transport] ?? transport}
            </span>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div
            className={`mb-4 px-4 py-2.5 rounded-xl text-[13px] font-semibold flex items-center gap-2 border ${
              toast.type === 'error'
                ? 'bg-[#fee2e2] border-[#fca5a5] text-[#dc2626]'
                : 'bg-[#dcfce7] border-[#86efac] text-[#16a34a]'
            }`}
          >
            {toast.type === 'error' ? <X size={13} /> : <Check size={13} />}
            {toast.message}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="flex gap-2">
            {Array.from({ length: cols }).map((_, ci) => (
              <div key={ci} style={{ width: colWidth }}>
                {[320, 240, 280, 200].slice(0, ci === 0 ? 4 : 3).map((h, i) => (
                  <div key={i} className="rounded-[16px] bg-border animate-pulse mb-2" style={{ height: h }} />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Empty state — no posts at all */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-[60px] px-6">
            <div className="mb-4 flex justify-center"><Inbox size={56} color="#4b7a54" strokeWidth={1.5} /></div>
            <h3 className="font-body text-xl font-bold text-ink m-0 mb-2">Belum ada postingan</h3>
            <p className="text-sm text-muted m-0 leading-relaxed">
              Jadilah yang pertama berbagi progres habit kamu!<br />
              Buka laporan habit → klik Share → Post ke Feed.
            </p>
          </div>
        )}

        {/* Empty state — no search results */}
        {!loading && posts.length > 0 && filteredPosts.length === 0 && (
          <div className="text-center py-[60px] px-6">
            <div className="mb-4 flex justify-center"><Search size={48} color="#9ca3af" strokeWidth={1.5} /></div>
            <h3 className="font-body text-lg font-bold text-ink m-0 mb-2">Tidak ditemukan</h3>
            <p className="text-sm text-muted m-0">
              Tidak ada postingan yang cocok dengan "<strong>{searchQuery}</strong>"
            </p>
          </div>
        )}

        {/* Masonry grid */}
        {!loading && filteredPosts.length > 0 && (
          <div className={`flex gap-2 ${hasPagination ? 'pb-24' : 'pb-20'}`}>
            {columns.map((col, ci) => (
              <div key={ci} style={{ width: colWidth }}>
                {col.map(post => (
                  <PinCard
                    key={post.id}
                    post={post}
                    onLikeChange={handleLikeChange}
                    onClick={p => navigate(`/postingan/${p.id}`)}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Sticky pagination bar */}
      {hasPagination && (
        <div className="fixed bottom-0 left-0 right-0 z-[300] bg-white border-t border-border px-4 py-3 flex items-center justify-between gap-2"
          style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={meta.current_page <= 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-white text-[13px] font-semibold font-body text-ink cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={15} />
            Sebelumnya
          </button>

          <div className="flex items-center gap-1 flex-1 justify-center overflow-x-auto">
            {Array.from({ length: meta.last_page }, (_, i) => i + 1)
              .filter(n => n === 1 || n === meta.last_page || Math.abs(n - meta.current_page) <= 1)
              .reduce<(number | '...')[]>((acc, n, idx, arr) => {
                if (idx > 0 && typeof arr[idx - 1] === 'number' && (n as number) - (arr[idx - 1] as number) > 1) acc.push('...')
                acc.push(n)
                return acc
              }, [])
              .map((item, idx) =>
                item === '...'
                  ? <span key={`d-${idx}`} className="w-7 text-center text-[13px] text-muted shrink-0">…</span>
                  : <button
                      key={item}
                      onClick={() => setPage(item as number)}
                      className="w-8 h-8 rounded-lg border-none cursor-pointer text-[13px] font-semibold font-body transition-colors shrink-0"
                      style={{
                        background: meta.current_page === item ? '#16a34a' : '#f3f4f6',
                        color: meta.current_page === item ? 'white' : '#374151',
                      }}
                    >{item}</button>
              )
            }
          </div>

          <button
            onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
            disabled={meta.current_page >= meta.last_page}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-white text-[13px] font-semibold font-body text-ink cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
          >
            Selanjutnya
            <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setShowNewPost(true)}
        className="fixed z-[400] border-none cursor-pointer flex items-center justify-center shadow-lg transition-all active:scale-95 hover:scale-105"
        style={{
          bottom: hasPagination ? 76 : 28,
          right: 20,
          width: 52, height: 52,
          borderRadius: '50%',
          background: 'linear-gradient(135deg,#16a34a,#10b981)',
          boxShadow: '0 4px 18px rgba(22,163,74,0.45)',
        }}
        title="Buat Postingan"
      >
        <Plus size={24} color="white" strokeWidth={2.5} />
      </button>

      {showNewPost && (
        <NewPostModal
          onClose={() => setShowNewPost(false)}
          onPosted={() => {
            setShowNewPost(false)
            showToast('success', 'Postingan berhasil dibuat!')
            setPage(1)
            loadPosts(1, perPage)
          }}
        />
      )}

      {showLogout && (
        <LogoutModal
          onCancel={() => setShowLogout(false)}
          onConfirm={async () => { setShowLogout(false); await logout() }}
        />
      )}
    </div>
  )
}
