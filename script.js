const postsData = Array.isArray(window.LUSIYA_POSTS) ? window.LUSIYA_POSTS : [];
const formatPostDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replaceAll('/', '.');
};
const postsContainer = document.querySelector('#posts');
if (postsContainer && postsData.length) {
  postsContainer.innerHTML = postsData.map((post, index) => `
    <article class="post ${index === 0 ? 'lead' : ''} ${post.category === 'DIGITAL LIFE' ? 'night' : ''}">
      ${index === 0 ? `<a class="image" href="post.html?id=${index}" aria-label="阅读 ${post.title}"></a>` : ''}
      <div>
        <p>${post.category} · ${formatPostDate(post.date)}</p>
        <h3>${post.title}</h3>
        <span>${post.description}</span>
        <a href="post.html?id=${index}">READ NOTE <i class="icon-arrow-up-right"></i></a>
      </div>
    </article>`).join('');
}
const logsContainer = document.querySelector('#logs');
if (logsContainer && postsData.length) {
  const logs = [...postsData]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  logsContainer.innerHTML = logs.map((post) => `<a href="post.html?slug=${encodeURIComponent(post.slug)}"><small>${formatPostDate(post.date)}</small><b>${post.title}</b><i class="icon-arrow-up-right"></i></a>`).join('');
}

const notes = [
  ['在噪声里，给自己留一小块静音区', `<p>有一阵子，我把“及时回复”当作一种能力。手机在桌上亮一下，手指就立刻伸过去；网页上出现一个新标签，注意力就跟着跑掉。</p><p>后来我试着在傍晚把通知关掉，给自己留出半小时的静音区。没有目标，也不强迫自己读完什么。只是泡茶、望着窗外，或者把白天没来得及想清楚的事情慢慢捡回来。</p><p>安静不是把世界关在门外，而是给内心腾出一点位置。也许我们真正需要的，不是更多输入，而是重新听见自己的声音。</p>`],
  ['适合一个人散步时听的 12 首歌', `<p>这份歌单没有明确的情绪标签。它适合傍晚六点半的街道、雨后反光的地面，或者回家的末班车。</p><p>01. Midnight City · M83<br>02. Space Song · Beach House<br>03. 505 · Arctic Monkeys<br>04. Plastic Love · 竹内まりや<br>05. Sunset Lover · Petit Biscuit</p><p>剩下的七首，留给你在散步时自己补齐。按下播放键，剩下的交给脚步。</p>`],
  ['我们如何与算法保持一点距离？', `<p>算法不是敌人。它只是特别懂得如何延长我们的停留：下一条更有趣、下一个视频更接近你的喜好、下一次刷新更像一次小小的承诺。</p><p>我给自己定过一条很笨的规则：每周至少主动找一部电影、一张专辑和一篇长文。不是因为它们一定比推荐内容更好，而是想重新练习“选择”。</p><p>选择不一定高效，却会让生活重新带一点自己的弧线。</p>`],
  ['七月的云、冰美式和一张没拍好的照片', `<p>那天的云被风吹得很低，像一整片没有晾干的白色衬衫。冰美式外面挂着水珠，桌上的相机忽然没电。</p><p>后来照片拍到了，但构图歪了，光线也过曝。我本来打算删掉它，最后还是留在了相册里。</p><p>有些记录不需要漂亮。它们只是替我们证明：那天下午的风，真的吹过。</p>`],
  ['在雨天读完一本旧书', `<p>雨声很适合读旧书。它会把房间里所有不必要的声音都盖过去，剩下纸页翻动的轻响。</p><p>书里有一行被前一个读者画了铅笔线，我停在那里很久。陌生人隔着十几年留下一点痕迹，而我刚好在这个阴天读到它。这种偶遇让人觉得，时间也许没有想象中那么直线。</p>`],
  ['关于“慢一点”这件事', `<p>慢一点不是拖延，也不是逃跑。它更像是给每一个决定留出回声。</p><p>我们太习惯迅速回答“可以”“没问题”“我马上做”。但有些事如果多等十分钟，也许就能分清：这是我真的想做的，还是只是害怕错过。</p><p>希望这个秋天，我们都能练习把步子放稳。</p>`],
  ['最近的桌面、色彩与梦', `<p>我的桌面最近是一张偏蓝的夜景图。没有放太多图标，只有一个写着“later”的文件夹，里面塞满了还没开始的灵感。</p><p>这一周常常梦见海边，也许是因为我把房间的灯换成了很淡的蓝色。颜色有时候比语言更早抵达心里。</p>`]
];
let noteIndex = 0;
const modal = document.querySelector('.modal');
const modalTitle = modal.querySelector('h2');
const modalBody = modal.querySelector('.modal-body');
function showNote(index) { noteIndex = index; modalTitle.textContent = notes[index][0]; modalBody.innerHTML = notes[index][1]; modal.classList.add('show'); modal.setAttribute('aria-hidden', 'false'); }
function bindReader(selector, getIndex) { document.querySelectorAll(selector).forEach((button, position) => button.addEventListener('click', event => { event.preventDefault(); showNote(getIndex(button, position)); })); }
bindReader('.read-post', button => [...document.querySelectorAll('.post')].indexOf(button.closest('.post')));
bindReader('.read-log', button => Number(button.dataset.note));
document.querySelector('.modal-next').addEventListener('click', () => showNote((noteIndex + 1) % notes.length));
document.querySelector('.close-modal').addEventListener('click', () => modal.classList.remove('show'));
modal.addEventListener('click', event => { if (event.target === modal) modal.classList.remove('show'); });
document.querySelector('.open-library').addEventListener('click', event => {
  if (postsData.length) return;
  event.preventDefault();
  showNote(0);
});
const searchPanel = document.querySelector('.search-panel');
document.querySelector('.search').addEventListener('click', () => { searchPanel.classList.add('show'); searchPanel.querySelector('input').focus(); });
document.querySelector('.close-search').addEventListener('click', () => searchPanel.classList.remove('show'));
searchPanel.addEventListener('click', event => { if (event.target === searchPanel) searchPanel.classList.remove('show'); });
document.querySelectorAll('.search-results button').forEach((button, index) => button.addEventListener('click', () => { searchPanel.classList.remove('show'); showNote([1, 2, 3][index]); }));
const channelButton = document.querySelector('.channel-button');
const signal = document.querySelector('.signal');
let channelPlayer = null;

function stopChannel() {
  if (!channelPlayer) return;
  channelPlayer.stop();
  channelPlayer = null;
}

function startChannel() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return false;

  const context = new AudioContext();
  const master = context.createGain();
  master.gain.value = 0.07;
  master.connect(context.destination);

  const pad = context.createOscillator();
  const padGain = context.createGain();
  pad.type = 'sine';
  pad.frequency.value = 110;
  padGain.gain.value = 0.11;
  pad.connect(padGain).connect(master);
  pad.start();

  const melody = [293.66, 261.63, 233.08, 220, 196, 174.61, 196, 0, 233.08, 261.63, 293.66, 0];
  let step = 0;
  let timer = null;
  const playStep = () => {
    const now = context.currentTime;
    const frequency = melody[step % melody.length];
    step += 1;
    if (!frequency) {
      timer = window.setTimeout(playStep, 900);
      return;
    }
    const oscillator = context.createOscillator();
    const noteGain = context.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.value = frequency;
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.22, now + 0.08);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.82);
    oscillator.connect(noteGain).connect(master);
    oscillator.start(now);
    oscillator.stop(now + 0.88);
    timer = window.setTimeout(playStep, 900);
  };

  channelPlayer = {
    stop() {
      window.clearTimeout(timer);
      pad.stop();
      context.close();
    }
  };
  playStep();
  return true;
}

channelButton.addEventListener('click', event => {
  event.preventDefault();
  const isPlaying = signal.classList.contains('channel-active');
  if (isPlaying) {
    stopChannel();
  } else if (!startChannel()) {
    return;
  }
  signal.classList.toggle('channel-active', !isPlaying);
  channelButton.setAttribute('aria-pressed', String(!isPlaying));
  channelButton.innerHTML = !isPlaying ? '正在播放 <i class="icon-pause"></i>' : '进入频道 <i class="icon-arrow-up-right"></i>';
});
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => { const selector = link.getAttribute('href'); if (selector.length > 1) { const target = document.querySelector(selector); if (target) { event.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); } } }));
document.addEventListener('keydown', event => { if (event.key === 'Escape') { modal.classList.remove('show'); searchPanel.classList.remove('show'); } });
