"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import type { BlogPost, BlogPostCreate, Lang } from "@/types/blog";
import { blogService } from "@/services/blogService";
import { uploadBlogImage } from "@/lib/uploadImage";
import { LANG_STORAGE_KEY } from "@/app/blocks/home/i18n";
import { useAdminLang } from "../../_components/admin-lang-context";

export default function AdminBlogEditPage() {
  const { t } = useAdminLang();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string | undefined;
  const isNew = postId === "new";

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [adminLang, setAdminLang] = useState<Lang>("ru");

  const [formData, setFormData] = useState<BlogPostCreate>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    source_lang: "ru",
    image_url: "",
    published: false,
  });

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (stored === "ru" || stored === "ro" || stored === "en") {
        setAdminLang(stored);
        setFormData((prev) => ({ ...prev, source_lang: stored }));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!isNew && postId) {
      loadPost(postId);
    }
  }, [postId, isNew]);

  async function loadPost(id: string) {
    try {
      const post = await blogService.getPostById(id);
      if (!post) {
        router.push("/admin/blog");
        return;
      }
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content,
        source_lang: post.source_lang,
        image_url: post.image_url || "",
        published: post.published,
      });
      setAdminLang(post.source_lang);
    } catch (error) {
      console.error("Failed to load post:", error);
      alert(t("blog.loadError"));
      router.push("/admin/blog");
    } finally {
      setIsLoading(false);
    }
  }

  function generateSlug(title: string) {
    // Транслитерация кириллицы в латиницу
    const translitMap: { [key: string]: string } = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
      'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
      'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
      'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
      'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
      'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
      'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
      'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
      'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
    };

    return title
      .split('')
      .map(char => translitMap[char] || char)
      .join('')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function handleChange(field: keyof BlogPostCreate, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "title" && typeof value === "string" && isNew) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(value) }));
    }
  }

  async function handleImageUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      alert(t("blog.selectImageMsg"));
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadBlogImage(file);
      handleChange("image_url", url);
    } catch (error) {
      console.error("Upload error:", error);
      alert(error instanceof Error ? error.message : t("blog.uploadError"));
    } finally {
      setIsUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.title) {
      alert(t("blog.fillTitle"));
      return;
    }

    if (!formData.slug) {
      alert(t("blog.fillSlug"));
      return;
    }

    if (!formData.content) {
      alert(t("blog.fillContent"));
      return;
    }

    setIsSaving(true);

    try {
      if (isNew) {
        await blogService.createPost(formData);
      } else {
        await blogService.updatePost({ id: postId!, ...formData });
      }
      router.push("/admin/blog");
    } catch (error) {
      console.error("Failed to save post:", error);
      alert(t("blog.saveError"));
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100">
      <div className="rounded-[28px] border border-slate-800 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b1220] p-4 sm:p-6 lg:p-8 shadow-[0_24px_60px_rgba(2,6,23,0.6)]">
        {/* Header */}
        <header className="border-b border-slate-800/80 pb-6">
          <p className="text-sm font-medium text-emerald-400">{t("blog.management")}</p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            {isNew ? t("blog.createArticle") : t("blog.editArticle")}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {t("blog.formDesc")}
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">


          {/* Image Upload */}
          <div className="rounded-[24px] border border-slate-700 bg-slate-900/40 p-4 sm:p-5">
            <label className="mb-2 block text-sm font-medium text-white">
              {t("blog.imageTitle")}
            </label>

            {/* Drag & Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative rounded-xl border-2 border-dashed transition-colors ${
                isDragging
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-slate-700 bg-slate-950/60"
              }`}
            >
              {formData.image_url ? (
                <div className="relative">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="h-64 w-full rounded-xl object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                    <label className="cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isUploading}
                      />
                      {t("blog.replaceImage")}
                    </label>
                    <button
                      type="button"
                      onClick={() => handleChange("image_url", "")}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 mt-2 sm:mt-0"
                    >
                      {t("blog.deleteImage")}
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center p-12 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isUploading}
                  />
                  {isUploading ? (
                    <>
                      <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-500" />
                      <p className="text-sm text-slate-400">Загрузка...</p>
                    </>
                  ) : (
                    <>
                      <svg
                        className="mb-4 h-12 w-12 text-slate-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="mb-2 text-sm font-medium text-white">
                        {t("blog.dragImage")}
                      </p>
                      <p className="text-xs text-slate-400">
                        {t("blog.clickImage")}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        PNG, JPG, WEBP
                      </p>
                    </>
                  )}
                </label>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="rounded-[24px] border border-slate-700 bg-slate-900/40 p-5">
            <h3 className="mb-4 text-lg font-medium text-white">
              {t("blog.fieldTitle")}
            </h3>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-500"
              required
            />
          </div>

          {/* Slug */}
          <div className="rounded-[24px] border border-slate-700 bg-slate-900/40 p-5">
            <label className="mb-2 block text-sm font-medium text-white">
              Slug (URL) *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-500"
              placeholder="moya-statya"
              required
            />
            <p className="mt-2 text-sm text-slate-400">
              {t("blog.urlLabel")}: /blog/{formData.slug || "slug"}
            </p>
          </div>

          {/* Excerpt */}
          <div className="rounded-[24px] border border-slate-700 bg-slate-900/40 p-5">
            <h3 className="mb-4 text-lg font-medium text-white">
              {t("blog.fieldExcerpt")}
            </h3>
            <textarea
              value={formData.excerpt}
              onChange={(e) => handleChange("excerpt", e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-500"
              rows={3}
            />
          </div>

          {/* Content */}
          <div className="rounded-[24px] border border-slate-700 bg-slate-900/40 p-5">
            <h3 className="mb-4 text-lg font-medium text-white">
              {t("blog.fieldContent")}
            </h3>
            <p className="mb-4 text-sm text-slate-400">
              {t("blog.fieldContentHint")}
            </p>
            <textarea
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-500"
              rows={12}
              required
              placeholder={t("blog.fieldContentPlaceholder")}
            />
          </div>

          {/* Published */}
          <div className="rounded-[24px] border border-slate-700 bg-slate-900/40 p-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => handleChange("published", e.target.checked)}
                className="h-5 w-5 rounded border-slate-700 bg-slate-950/60 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-900"
              />
              <span className="text-sm font-medium text-white">
                {t("blog.publishArticle")}
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-800/80 pt-6">
            <button
              type="button"
              onClick={() => router.push("/admin/blog")}
              className="w-full sm:w-auto rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
            >
              {t("blog.cancel")}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? t("blog.saving") : t("blog.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
