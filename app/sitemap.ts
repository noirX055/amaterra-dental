import { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://amaterra.md'
  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]

  try {
    const supabase = createAdminClient()
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, published_at, updated_at")
      .eq("published", true)

    if (posts) {
      for (const post of posts) {
        sitemapEntries.push({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: post.updated_at ? new Date(post.updated_at) : (post.published_at ? new Date(post.published_at) : new Date()),
          changeFrequency: 'monthly',
          priority: 0.8,
        })
      }
    }
  } catch (error) {
    console.error("Failed to generate sitemap for blog posts:", error)
  }

  return sitemapEntries
}
