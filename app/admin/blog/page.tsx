"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { BlogPost } from "@/types/blog";
import { blogService } from "@/services/blogService";

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const data = await blogService.getAllPosts();
      setPosts(data);
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Вы уверены, что хотите удалить эту статью?")) return;

    try {
      await blogService.deletePost(id);
      setPosts(posts.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Ошибка при удалении статьи");
    }
  }

  async function handleTogglePublish(post: BlogPost) {
    try {
      const updated = await blogService.togglePublish(post.id, !post.published);
      setPosts(posts.map((p) => (p.id === post.id ? updated : p)));
    } catch (error) {
      console.error("Failed to toggle publish:", error);
      alert("Ошибка при изменении статуса публикации");
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredPosts = posts.filter((post) => {
    const search = query.trim().toLowerCase();
    if (!search) return true;
    return (
      post.title.toLowerCase().includes(search) ||
      post.slug.toLowerCase().includes(search)
    );
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100">
      <div className="rounded-[28px] border border-slate-800 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b1220] p-6 shadow-[0_24px_60px_rgba(2,6,23,0.6)] sm:p-8">
        {/* Header */}
        <header className="border-b border-slate-800/80 pb-6">
          <p className="text-sm font-medium text-emerald-400">Управление контентом</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            Блог
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Создавайте и редактируйте статьи для блога. Публикуйте новости и полезную информацию для пациентов
          </p>
        </header>

        {/* Search and Actions */}
        <section className="mt-6 rounded-[24px] border border-slate-700 bg-slate-900/40 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path
                    d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск по заголовку или slug"
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950/60 pl-11 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-500"
              />
            </label>

            <Link
              href="/admin/blog/new"
              className="flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-medium text-white transition hover:bg-emerald-500"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Создать статью
            </Link>
          </div>

          <p className="mt-3 text-sm text-slate-300">
            Всего статей: <span className="font-semibold text-white">{filteredPosts.length}</span>
          </p>
        </section>

        {/* Posts List */}
        {filteredPosts.length === 0 ? (
          <div className="mt-6 rounded-[24px] border border-slate-700 bg-slate-900/50 p-12 text-center shadow-[0_12px_28px_rgba(2,6,23,0.4)]">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
              <svg className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-slate-300">
              {query ? "Статьи не найдены" : "Статей пока нет"}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              {query ? "Попробуйте изменить поисковый запрос" : "Создайте первую статью для блога"}
            </p>
            {!query && (
              <Link
                href="/admin/blog/new"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Создать первую статью
              </Link>
            )}
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="rounded-[24px] border border-slate-700 bg-slate-900/50 p-5 shadow-[0_12px_28px_rgba(2,6,23,0.4)] transition hover:border-slate-600"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                  {/* Image */}
                  {post.image_url && (
                    <div className="h-24 w-full flex-shrink-0 overflow-hidden rounded-xl lg:w-32">
                      <img
                        src={post.image_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold text-white">
                          {post.title}
                        </h2>
                        <p className="mt-1 text-sm text-slate-400">
                          /{post.slug} • {post.source_lang.toUpperCase()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleTogglePublish(post)}
                        className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${
                          post.published
                            ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                            : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        }`}
                      >
                        {post.published ? "Опубликовано" : "Черновик"}
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(post.created_at)}
                      </span>
                      {post.published_at && (
                        <span className="flex items-center gap-1.5">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Опубликовано {formatDate(post.published_at)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end">
                    {post.published && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
                      >
                        Просмотр
                      </Link>
                    )}
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="rounded-lg border border-emerald-600 bg-emerald-600/10 px-3 py-2 text-sm font-medium text-emerald-400 transition hover:bg-emerald-600/20"
                    >
                      Редактировать
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="rounded-lg border border-red-600 bg-red-600/10 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-600/20"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
