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

  const title = html.match(/<title>(.*?)<\/title>/)?.[1] || file;
  const desc =
    html.match(/<meta name="description" content="(.*?)"/)?.[1] || "";

  return {
    title,
    url: `/post/${file}`,
    date: new Date().toISOString().slice(0, 10),
    category: "工具观察",
    excerpt: desc
  };
});

fs.writeFileSync(OUTPUT, JSON.stringify(posts, null, 2));
console.log("posts.json generated");
