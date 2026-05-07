export type Lang = "ru" | "ro" | "en";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  source_lang: Lang;
  image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface BlogPostCreate {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  source_lang: Lang;
  image_url?: string;
  published?: boolean;
  published_at?: string;
}

export interface BlogPostUpdate extends Partial<BlogPostCreate> {
  id: string;
}
