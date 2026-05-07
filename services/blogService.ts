import { createClient } from "@/lib/supabase/client";
import type { BlogPost, BlogPostCreate, BlogPostUpdate } from "@/types/blog";

export const blogService = {
  // Get all published posts
  async getPublishedPosts(): Promise<BlogPost[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get post by slug
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // Not found
      throw error;
    }
    return data;
  },

  // Get all posts (admin)
  async getAllPosts(): Promise<BlogPost[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get post by ID (admin)
  async getPostById(id: string): Promise<BlogPost | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data;
  },

  // Create post
  async createPost(post: BlogPostCreate): Promise<BlogPost> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .insert(post)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update post
  async updatePost(post: BlogPostUpdate): Promise<BlogPost> {
    const supabase = createClient();
    const { id, ...updates } = post;
    const { data, error } = await supabase
      .from("blog_posts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete post
  async deletePost(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  // Toggle publish status
  async togglePublish(id: string, published: boolean): Promise<BlogPost> {
    const supabase = createClient();
    const updates: any = { published };

    if (published && !updates.published_at) {
      updates.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
