import fs from "fs";
import path from "path";

const POST_DIR = path.join(process.cwd(), "post");
const OUTPUT = path.join(process.cwd(), "posts.json");

const files = fs.readdirSync(POST_DIR)
  .filter(f => f.endsWith(".html"))
  .sort()
  .reverse();

const posts = files.map(file => {
  const html = fs.readFileSync(path.join(POST_DIR, file), "utf8");

  const title =
    html.match(/<title>(.*?)<\/title>/)?.[1] ||
    html.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1] ||
    file;

  // 1️⃣ 先取 meta description
  let excerpt =
    html.match(/<meta name="description" content="(.*?)"/)?.[1] || "";

  // 2️⃣ 如果没有，就取正文第一个 <p>
  if (!excerpt) {
    const p = html.match(/<p[^>]*>(.*?)<\/p>/);
    if (p) {
      excerpt = p[1]
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 80);
    }
  }

  return {
    title,
    url: `/post/${file}`,
    date: new Date().toISOString().slice(0, 10),
    category: "工具观察",
    excerpt
  };
});

fs.writeFileSync(OUTPUT, JSON.stringify(posts, null, 2));
console.log("posts.json generated with excerpts");
