// WebCraft app: progress, lessons list, editor, preview, checks and shop.
// The lessons themselves live in lessons.js, which must load before this file.

var coins = 0;
var currentWorld = 'html';
var currentIdx = 0;
var completed = { html: [], css: [], js: [] };
var owned = { html: true, css: false, js: false };
var drafts = {}; // unsent code per lesson, e.g. drafts['css-2']
var advanceTimer = null;

// ----- Saving progress in this browser -----
var SAVE_KEY = 'webcraft-progress-v1';

function saveProgress() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      coins: coins, completed: completed, owned: owned,
      currentWorld: currentWorld, currentIdx: currentIdx, drafts: drafts
    }));
  } catch (e) { /* private mode or storage full: the game still works, it just won't remember */ }
}

function loadProgress() {
  try {
    var data = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!data) return;
    if (typeof data.coins === 'number') coins = data.coins;
    ['html','css','js'].forEach(function(w){
      if (data.completed && Array.isArray(data.completed[w])) completed[w] = data.completed[w];
      if (data.owned && typeof data.owned[w] === 'boolean') owned[w] = data.owned[w];
    });
    owned.html = true;
    if (data.drafts && typeof data.drafts === 'object') drafts = data.drafts;
    if (WORLDS[data.currentWorld] && owned[data.currentWorld]) {
      currentWorld = data.currentWorld;
      var n = WORLDS[currentWorld].levels.length;
      if (data.currentIdx >= 0 && data.currentIdx < n) currentIdx = data.currentIdx;
    }
  } catch (e) { /* bad or missing save: start fresh */ }
}

function draftKey() { return currentWorld + '-' + currentIdx; }

// Remove comments so code that is only commented out does not pass a check
function stripComments(code) {
  return code
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:"'])\/\/.*$/gm, '$1');
}

function $(id){ return document.getElementById(id); }

function toast(msg, type) {
  var t = $('toast');
  t.textContent = msg;
  t.className = 'toast show ' + (type || 'success');
  clearTimeout(t._t);
  t._t = setTimeout(function(){ t.classList.remove('show'); }, 2800);
}

function updateCoins() {
  $('coin-count').textContent = coins;
  $('shop-coins').textContent = coins;
}

function switchWorld(w) {
  if (!owned[w]) { openShop(); return; }
  currentWorld = w;
  // Open the first lesson not done yet
  currentIdx = 0;
  var lv = WORLDS[w].levels;
  for (var i = 0; i < lv.length; i++) { if (completed[w].indexOf(i) < 0) { currentIdx = i; break; } }
  renderTabs();
  renderLevels();
  loadLevel();
}

function tryWorld(w) {
  if (owned[w]) { switchWorld(w); } else { openShop(); }
}

function renderTabs() {
  ['html','css','js'].forEach(function(w){
    var t = $('tab-' + w);
    t.classList.remove('active','locked');
    t.setAttribute('aria-pressed', String(w === currentWorld));
    t.setAttribute('aria-label', WORLDS[w].name + (owned[w] ? ' world' : ' world, locked. Opens the shop'));
    if (!owned[w]) {
      t.classList.add('locked');
    } else if (w === currentWorld) {
      t.classList.add('active');
    }
  });
}

function renderLevels() {
  var world = WORLDS[currentWorld];
  var list = $('level-list');
  list.innerHTML = '';
  world.levels.forEach(function(lvl, i){
    var done = completed[currentWorld].indexOf(i) >= 0;
    var isActive = i === currentIdx;
    var cls = 'lvlbtn' + (done ? ' done' : '') + (isActive ? ' ' + world.wtag.charAt(0) + 'a' : '');
    var el = document.createElement('button');
    el.type = 'button';
    el.className = cls;
    if (isActive) el.setAttribute('aria-current', 'step');
    el.innerHTML =
      '<div class="lbtn-icon">' + (done ? '&#10003;' : (isActive ? '&#9654;' : String(i+1) + '.')) + '</div>' +
      '<div class="lbtn-info"><div class="lbtn-name">' + lvl.title + '</div><div class="lbtn-sub">' + lvl.short + ' &middot; ' + lvl.coins + ' coins</div></div>' +
      (done ? '<div class="done-badge">Done</div>' : '');
    (function(idx){ el.onclick = function(){ clearTimeout(advanceTimer); currentIdx = idx; renderLevels(); loadLevel(); }; })(i);
    list.appendChild(el);
  });
}

function loadLevel() {
  var world = WORLDS[currentWorld];
  var lvl = world.levels[currentIdx];

  var wt = $('icard-wtag');
  wt.textContent = world.name;
  wt.className = 'icard-wtag ' + world.wtag;
  $('icard-title').textContent = (currentIdx+1) + '. ' + lvl.title;
  $('icard-desc').textContent = lvl.desc;
  $('icard-example').textContent = lvl.example;
  $('icard-reward').textContent = lvl.coins;

  var cl = $('chklist');
  cl.innerHTML = '';
  lvl.checks.forEach(function(ch, i){
    var d = document.createElement('div');
    d.className = 'chkitem';
    d.id = 'chk' + i;
    d.innerHTML = '<span class="chk-dot">&#9633;</span> ' + ch.label;
    cl.appendChild(d);
  });

  var ib = $('ins-bar');
  ib.innerHTML = '';
  (lvl.chips || []).forEach(function(chip){
    var el = document.createElement('span');
    el.className = 'ichip';
    el.textContent = chip;
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', 'Insert ' + chip);
    el.onclick = function(){ insertChip(chip); };
    el.onkeydown = function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); insertChip(chip); } };
    ib.appendChild(el);
  });

  var ed = $('code-editor');
  var saved = drafts[draftKey()];
  ed.value = typeof saved === 'string' ? saved : (lvl.starter || '');
  $('ed-filename').textContent = world.filename;
  updateCharCount();

  $('preview-frame').style.display = 'none';
  $('preview-frame').srcdoc = '';
  $('pv-empty').style.display = 'flex';
  $('res-banner').className = 'res-banner';

  var already = completed[currentWorld].indexOf(currentIdx) >= 0;
  $('submit-btn').disabled = already;
  $('submit-btn').textContent = already ? 'Already Done!' : 'Submit';
  updateNextBtn();
  saveProgress();
}

function updateNextBtn() {
  var done = completed[currentWorld].indexOf(currentIdx) >= 0;
  var hasNext = currentIdx < WORLDS[currentWorld].levels.length - 1;
  $('next-btn').classList.toggle('show', done && hasNext);
}

function nextLesson() {
  clearTimeout(advanceTimer);
  if (currentIdx < WORLDS[currentWorld].levels.length - 1) {
    currentIdx++;
    renderLevels();
    loadLevel();
  }
}

function resetCode() {
  var lvl = WORLDS[currentWorld].levels[currentIdx];
  var ed = $('code-editor');
  if (ed.value !== (lvl.starter || '') && !confirm('Reset this lesson to the starter code? Your changes will be lost.')) return;
  ed.value = lvl.starter || '';
  delete drafts[draftKey()];
  saveProgress();
  updateCharCount();
  runChecks(ed.value, false);
  ed.focus();
}

function showHint() {
  var lvl = WORLDS[currentWorld].levels[currentIdx];
  var code = $('code-editor').value;
  var clean = stripComments(code);
  for (var i = 0; i < lvl.checks.length; i++) {
    if (!lvl.checks[i].test(clean)) {
      var label = lvl.checks[i].label;
      toast('Hint: make sure ' + label.charAt(0).toLowerCase() + label.slice(1) + '. Look at the example!', 'info');
      return;
    }
  }
  toast(code.trim() ? 'Everything looks right. Press Submit!' : 'Start by copying the example, then change it.', 'info');
}

function allDone() {
  return ['html','css','js'].every(function(w){ return completed[w].length >= WORLDS[w].levels.length; });
}

function closeFinish() { $('finish-screen').classList.remove('show'); }

function restartAll() {
  if (!confirm('Start over from the beginning? Your coins and progress will be cleared.')) return;
  try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
  coins = 0; currentWorld = 'html'; currentIdx = 0; drafts = {};
  completed = { html: [], css: [], js: [] };
  owned = { html: true, css: false, js: false };
  closeFinish();
  updateCoins(); renderTabs(); renderLevels(); loadLevel();
}

function runPreview() {
  var code = $('code-editor').value;
  var frame = $('preview-frame');
  frame.srcdoc = code;
  frame.style.display = 'block';
  $('pv-empty').style.display = 'none';
  runChecks(code, false);
}

function submitCode() {
  if (completed[currentWorld].indexOf(currentIdx) >= 0) return;
  var code = $('code-editor').value.trim();
  if (!code) { toast('Write some code first!', 'error'); return; }

  var frame = $('preview-frame');
  frame.srcdoc = code;
  frame.style.display = 'block';
  $('pv-empty').style.display = 'none';

  var lvl = WORLDS[currentWorld].levels[currentIdx];
  var passed = runChecks(code, true);
  var total = lvl.checks.length;
  var rb = $('res-banner');

  if (passed === total) {
    rb.className = 'res-banner show ok';
    rb.textContent = 'All ' + total + ' checks passed! You earned ' + lvl.coins + ' coins!';
    coins += lvl.coins;
    updateCoins();
    completed[currentWorld].push(currentIdx);
    delete drafts[draftKey()];
    saveProgress();
    $('submit-btn').disabled = true;
    $('submit-btn').textContent = 'Done!';
    renderLevels();
    renderTabs();
    toast('+' + lvl.coins + ' coins earned!', 'coins');
    updateNextBtn();
    var isLast = currentIdx === WORLDS[currentWorld].levels.length - 1;
    if (allDone()) {
      setTimeout(function(){ $('finish-screen').classList.add('show'); }, 1200);
    } else if (!isLast) {
      var from = currentWorld + '-' + currentIdx;
      advanceTimer = setTimeout(function(){
        if (currentWorld + '-' + currentIdx === from) nextLesson();
      }, 2200);
    } else {
      rb.textContent += ' You finished this world! Visit the Shop for more.';
    }
  } else if (passed > 0) {
    rb.className = 'res-banner show partial';
    rb.textContent = passed + '/' + total + ' checks pass - keep going! Fix the items marked wrong.';
    toast(passed + '/' + total + ' checks passed - almost there!', 'info');
  } else {
    rb.className = 'res-banner show bad';
    rb.textContent = 'No checks passed yet - re-read the instructions and try again.';
    toast('Not quite - check the instructions again!', 'error');
  }
}

function runChecks(code, markFail) {
  var lvl = WORLDS[currentWorld].levels[currentIdx];
  var passed = 0;
  lvl.checks.forEach(function(ch, i){
    var ok = ch.test(stripComments(code));
    var el = $('chk' + i);
    if (ok) {
      el.className = 'chkitem pass';
      el.querySelector('.chk-dot').innerHTML = '&#10003;';
      passed++;
    } else {
      el.className = markFail ? 'chkitem fail' : 'chkitem';
      el.querySelector('.chk-dot').innerHTML = markFail ? '&#10007;' : '&#9633;';
    }
  });
  return passed;
}

function insertChip(chip) {
  var ed = $('code-editor');
  var s = ed.selectionStart, e = ed.selectionEnd;
  ed.value = ed.value.slice(0,s) + chip + ed.value.slice(e);
  ed.selectionStart = ed.selectionEnd = s + chip.length;
  ed.focus();
  updateCharCount();
}

function updateCharCount() {
  $('char-count').textContent = $('code-editor').value.length + ' chars';
}

// Keep the student's unsent code so a refresh doesn't lose it
var draftTimer = null;
function rememberDraft() {
  clearTimeout(draftTimer);
  draftTimer = setTimeout(function(){
    drafts[draftKey()] = $('code-editor').value;
    saveProgress();
  }, 400);
}

$('code-editor').addEventListener('keydown', function(e){
  if (e.key === 'Tab' && !e.shiftKey && !e.target._tabOut) {
    e.preventDefault();
    var s = e.target.selectionStart;
    e.target.value = e.target.value.slice(0,s) + '  ' + e.target.value.slice(e.target.selectionEnd);
    e.target.selectionStart = e.target.selectionEnd = s + 2;
  }
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) runPreview();
  // Escape, then Tab, moves focus out of the editor
  e.target._tabOut = e.key === 'Escape';
});
$('code-editor').addEventListener('input', function(){ updateCharCount(); rememberDraft(); });
document.addEventListener('keydown', function(e){
  if (e.key === 'Escape') { closeShop(); closeFinish(); }
});

function openShop() {
  updateCoins();
  renderShop();
  $('shop-screen').classList.add('show');
  $('shop-screen').querySelector('.shop-close').focus();
}
function closeShop() {
  $('shop-screen').classList.remove('show');
}

function renderShop() {
  ['css','js'].forEach(function(w){
    var world = WORLDS[w];
    var actionEl = $('shop-' + w + '-action');
    var itemEl = $('shop-' + w + '-item');
    if (owned[w]) {
      actionEl.innerHTML = '<div class="owned-b">Owned</div>';
      itemEl.classList.add('owned');
    } else {
      var can = coins >= world.cost;
      actionEl.innerHTML = '<button class="buy-btn ' + (can ? 'buy-' + w : 'buy-dis') + '" ' +
        (can ? 'onclick="buyWorld(\'' + w + '\')"' : 'disabled') + '>' +
        world.cost + ' coins' + (can ? ' - Buy' : ' needed') + '</button>';
    }
  });
}

function buyWorld(w) {
  var world = WORLDS[w];
  if (coins < world.cost) { toast('Not enough coins!', 'error'); return; }
  coins -= world.cost;
  owned[w] = true;
  saveProgress();
  updateCoins();
  renderShop();
  renderTabs();
  toast(world.name + ' World unlocked!', 'coins');
}

loadProgress();
updateCoins();
renderTabs();
renderLevels();
loadLevel();
