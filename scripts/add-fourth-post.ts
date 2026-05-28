import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// Read .env.local file manually
const envPath = resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
const envVars: Record<string, string> = {};

envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const newPost = {
  title: "Брекеты или элайнеры: что выбрать для исправления прикуса",
  slug: "brekety-ili-elajnery-chto-vybrat",
  excerpt: "Современная ортодонтия предлагает несколько способов исправления прикуса. Разбираемся в преимуществах и недостатках каждого метода.",
  content: `Неправильный прикус — это не только эстетическая проблема. Он может привести к повышенной стираемости зубов, заболеваниям височно-нижнечелюстного сустава и проблемам с пищеварением. Современная ортодонтия предлагает эффективные решения для исправления прикуса в любом возрасте.

Традиционные брекет-системы остаются золотым стандартом ортодонтического лечения. Они представляют собой несъемные конструкции, которые крепятся на зубы и постепенно перемещают их в правильное положение. Брекеты бывают металлическими, керамическими и сапфировыми.

Металлические брекеты — самый доступный и эффективный вариант. Они справляются даже со сложными случаями и позволяют точно контролировать перемещение зубов. Керамические и сапфировые брекеты менее заметны, но стоят дороже.

Элайнеры (прозрачные капы) — это современная альтернатива брекетам. Они практически незаметны, их можно снимать во время еды и чистки зубов. Однако элайнеры подходят не для всех случаев и требуют высокой дисциплины от пациента.

В клинике Amaterra наш ортодонт Наталья Лозова проводит детальную диагностику и подбирает оптимальный метод лечения для каждого пациента. Мы работаем с современными самолигирующими брекет-системами Damon, которые обеспечивают комфортное и быстрое лечение.

Длительность ортодонтического лечения зависит от сложности случая и обычно составляет от 12 до 24 месяцев. После снятия брекетов обязательно ношение ретейнеров для закрепления результата.`,
  source_lang: "ru" as const,
  image_url: "/spec-1.webp",
  published: true,
  published_at: new Date().toISOString(),
};

async function addPost() {
  const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .insert(newPost)
      .select()
      .single();

    if (error) {
      console.error(`Error creating post:`, error);
    } else {
      console.log(`✓ Created: ${newPost.title}`);
    }
  } catch (err) {
    console.error(`Failed to create post:`, err);
  }

  console.log("\nDone!");
}

addPost();
