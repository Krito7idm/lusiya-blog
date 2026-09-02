const archivePosts = Array.isArray(window.LUSIYA_POSTS) ? window.LUSIYA_POSTS : [];
const archiveList = document.querySelector('#archive-list');
const archiveDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replaceAll('/', '.');
};

if (archiveList) {
  archiveList.innerHTML = archivePosts.map((post) => `
    <a class="archive-card" href="post.html?slug=${encodeURIComponent(post.slug)}">
      <p>${post.category} · ${archiveDate(post.date)}</p>
      <h2>${post.title}</h2>
      <span>${post.description}</span>
      <i class="icon-arrow-up-right"></i>
    </a>`).join('');
}
