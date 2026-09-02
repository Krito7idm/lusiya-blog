import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const postsDir = path.join(root, 'content', 'posts');
const outputDir = path.join(root, 'generated');
const outputFile = path.join(outputDir, 'posts.js');

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const inline = (value) => escapeHtml(value)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/\*([^*]+)\*/g, '<em>$1</em>')
  .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');

function markdownToHtml(markdown) {
  const lines = markdown.trim().split(/\r?\n/);
  const html = [];
  let paragraph = [];
  let list = false;

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${inline(paragraph.join(' '))}</p>`);
      paragraph = [];
    }
  };
  const closeList = () => {
    if (list) {
      html.push('</ul>');
      list = false;
    }
  };

  for (const line of lines) {
    if (!line.trim()) {
      flushParagraph();
      closeList();
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      const level = heading[1].length;
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }
    if (line.startsWith('> ')) {
      flushParagraph();
      closeList();
      html.push(`<blockquote>${inline(line.slice(2))}</blockquote>`);
      continue;
    }
    const item = line.match(/^[-*]\s+(.+)$/);
    if (item) {
      flushParagraph();
      if (!list) {
        html.push('<ul>');
        list = true;
      }
      html.push(`<li>${inline(item[1])}</li>`);
      continue;
    }
    closeList();
    paragraph.push(line.trim());
  }
  flushParagraph();
  closeList();
  return html.join('');
}

function parsePost(file) {
  const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) throw new Error(`Invalid front matter: ${file}`);
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^([^:]+):\s*["']?(.*?)["']?\s*$/);
    if (pair) fields[pair[1].trim()] = pair[2].trim();
  }
  const slug = file.replace(/\.md$/i, '');
  return {
    slug,
    title: fields.title || slug,
    description: fields.description || '',
    date: fields.date || '',
    category: fields.category || 'THOUGHTS',
    body: markdownToHtml(match[2]),
  };
}

const files = fs.readdirSync(postsDir)
  .filter((file) => file.toLowerCase().endsWith('.md'))
  .sort()
  .reverse();
const posts = files.map(parsePost);
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(
  outputFile,
  `// Generated from content/posts. Do not edit manually.\nwindow.LUSIYA_POSTS = ${JSON.stringify(posts, null, 2)};\n`,
);
console.log(`Built ${posts.length} posts into generated/posts.js`);
