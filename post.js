const posts = Array.isArray(window.LUSIYA_POSTS) ? window.LUSIYA_POSTS : [];
const params = new URLSearchParams(location.search);
const requested = params.get('id') || params.get('slug');
const numericIndex = Number.isFinite(Number(requested)) ? Number(requested) : -1;
const foundIndex = posts.findIndex((post) => post.slug === requested);
const index = numericIndex >= 0 ? numericIndex : Math.max(0, foundIndex);
const post = posts[index] || posts[0];

if (post) {
  const date = new Date(post.date);
  const formattedDate = Number.isNaN(date.getTime())
    ? post.date
    : date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replaceAll('/', '.');
  document.title = `Lusiya — ${post.title}`;
  document.querySelector('#type').textContent = `${post.category} · ${formattedDate}`;
  document.querySelector('#title').textContent = post.title;
  document.querySelector('#deck').textContent = post.description;
  document.querySelector('#date').textContent = formattedDate;
  document.querySelector('#content').innerHTML = post.body;
}

document.querySelector('#copy').addEventListener('click', async () => {
  await navigator.clipboard.writeText(location.href);
  document.querySelector('#copy').innerHTML = '<i class="icon-check"></i> 已复制';
});
