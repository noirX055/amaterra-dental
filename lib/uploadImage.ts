import { createClient } from "@/lib/supabase/client";

export async function uploadBlogImage(file: File): Promise<string> {
  const supabase = createClient();

  // Generate unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `blog/${fileName}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from("images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Ошибка загрузки: ${error.message}`);
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("images").getPublicUrl(filePath);

  return publicUrl;
}
