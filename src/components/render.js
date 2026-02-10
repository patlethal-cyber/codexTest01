import { actions, getState } from '../store/gameStore.js';

const dragPayload = (type, uid) => JSON.stringify({ type, uid });
const parsePayload = (raw) => {
  try { return JSON.parse(raw); } catch { return null; }
};

const badge = (keyword) => keyword && keyword !== 'spell' ? `<span class="badge">${keyword}</span>` : '';

const cardHtml = (c, opts = {}) => {
  const { inHand = false, canDragAttack = false, shake = false, attack = null, health = null, hideText = false } = opts;
  return `
<div class="card ${c.keyword || ''} ${shake ? 'shake' : ''}" title="${(c.text || '').replace(/"/g, '&quot;')}" draggable="${inHand || canDragAttack}" data-uid="${c.uid}" data-dragtype="${inHand ? 'play' : (canDragAttack ? 'attack' : '')}">
  <div class="cost">${c.cost ?? ''}</div>
  <div class="name">${c.name}</div>
  <div class="text ${hideText ? 'hide' : ''}">${c.text || c.keyword || ''}</div>
  <div class="stats"><span>${attack ?? (c.baseAttack ?? c.attack)}</span>/<span>${health ?? ((c.baseHealth ?? c.health) - (c.damage || 0))}</span></div>
  ${badge(c.keyword)}
</div>`;
};

const enemyBoard = (side, shakeMap) => {
  const total = 7;
  const html = [];
  for (let i = 0; i < total; i++) {
    const m = side.board[i];
    if (!m) html.push('<div class="minion-slot empty"><div class="slot-ring">•</div></div>');
    else {
      const atk = actions.effectiveAttack(m);
      const hp = actions.effectiveHealth(m) - (m.damage || 0);
      html.push(`<div class="minion-slot enemy"><div class="minion" data-target="${m.uid}">${cardHtml(m, { shake: !!shakeMap[m.uid], attack: atk, health: hp })}</div></div>`);
    }
  }
  return html.join('');
};

const playerBoard = (side, shakeMap, selectedAttacker) => {
  const html = [];
  const slot = (i) => `<div class="insert-slot" data-slot="${i}"><div class="slot-ring">+</div></div>`;
  for (let i = 0; i <= side.board.length; i++) {
    html.push(slot(i));
    if (i < side.board.length) {
      const m = side.board[i];
      const atk = actions.effectiveAttack(m);
      const hp = actions.effectiveHealth(m) - (m.damage || 0);
      html.push(`<div class="minion-slot player"><div class="minion ${m.canAttack ? 'ready' : ''} ${selectedAttacker === m.uid ? 'selected' : ''}" data-attacker="${m.uid}">${cardHtml(m, { canDragAttack: m.canAttack, shake: !!shakeMap[m.uid], attack: atk, health: hp })}</div></div>`);
    }
  }
  while (html.length < 14) {
    html.push('<div class="minion-slot empty"><div class="slot-ring">•</div></div>');
  }
  return html.join('');
};

export function render(root) {
  const s = getState();
  const winner = s.winner ? `<div class="overlay">${s.winner} wins!</div>` : '';

  root.innerHTML = `
  <div class="table-wrap">
    <div class="table-ornament"></div>
    <div class="table">
      ${winner}
      <section id="enemyHero" class="hero target-hero ${s.shake.Enemy ? 'shake' : ''}">
        <h2>Enemy HP ${s.enemy.hp}</h2>
        <p>Mana ${s.enemy.mana}/${s.enemy.maxMana} · Deck ${s.enemy.deck.length}/15 · Hand ${s.enemy.hand.length}</p>
      </section>
      <section id="enemyBoard" class="board enemy">${enemyBoard(s.enemy, s.shakeMinion)}</section>
      <section class="controls"><button id="endTurn">End Turn</button><span>Turn: ${s.turn}</span></section>
      <section id="playerBoard" class="board player">${playerBoard(s.player, s.shakeMinion, s.selectedAttacker)}</section>
      <section class="hero ${s.shake.Player ? 'shake' : ''}">
        <h2>Player HP ${s.player.hp}</h2>
        <p>Mana ${s.player.mana}/${s.player.maxMana} · Deck ${s.player.deck.length}/15 · Hand ${s.player.hand.length}</p>
      </section>
      <section id="hand" class="hand">${s.player.hand.map((c, i) => `<div class="fan" style="--i:${i};--n:${Math.max(s.player.hand.length, 1)}">${cardHtml(c, { inHand: true, hideText: false })}</div>`).join('')}</section>
      <section class="log"><h3>Battle Log</h3>${s.log.map((x) => `<p>${x}</p>`).join('')}</section>
    </div>
  </div>`;

  root.querySelector('#endTurn')?.addEventListener('click', () => actions.endTurn());

  root.querySelectorAll('[data-attacker]').forEach((el) => {
    const uid = el.dataset.attacker;
    el.addEventListener('click', () => actions.selectAttacker(uid));
  });

  root.querySelectorAll('[data-target]').forEach((el) => {
    const uid = el.dataset.target;
    el.addEventListener('click', () => actions.attackTarget(uid, false));
    el.addEventListener('dragover', (e) => {
      const payload = parsePayload(e.dataTransfer.getData('text/plain'));
      if (payload?.type === 'attack') { e.preventDefault(); el.classList.add('drop-target'); }
    });
    el.addEventListener('dragleave', () => el.classList.remove('drop-target'));
    el.addEventListener('drop', (e) => {
      const payload = parsePayload(e.dataTransfer.getData('text/plain'));
      if (payload?.type !== 'attack') return;
      e.preventDefault();
      el.classList.remove('drop-target');
      actions.selectAttacker(payload.uid);
      actions.attackTarget(uid, false);
    });
  });

  const enemyHero = root.querySelector('#enemyHero');
  enemyHero?.addEventListener('click', () => actions.attackTarget(null, true));
  enemyHero?.addEventListener('dragover', (e) => {
    const payload = parsePayload(e.dataTransfer.getData('text/plain'));
    if (payload?.type === 'attack') { e.preventDefault(); enemyHero.classList.add('drop-target'); }
  });
  enemyHero?.addEventListener('dragleave', () => enemyHero.classList.remove('drop-target'));
  enemyHero?.addEventListener('drop', (e) => {
    const payload = parsePayload(e.dataTransfer.getData('text/plain'));
    if (payload?.type !== 'attack') return;
    e.preventDefault();
    enemyHero.classList.remove('drop-target');
    actions.selectAttacker(payload.uid);
    actions.attackTarget(null, true);
  });

  root.querySelectorAll('.card[draggable="true"]').forEach((card) => {
    const uid = card.dataset.uid;
    const dragtype = card.dataset.dragtype;
    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.effectAllowed = dragtype === 'play' ? 'copyMove' : 'move';
      e.dataTransfer.setData('text/plain', dragPayload(dragtype, uid));
    });
  });

  root.querySelectorAll('#playerBoard [data-slot]').forEach((slotEl) => {
    const slot = Number(slotEl.dataset.slot);
    slotEl.addEventListener('dragover', (e) => {
      const payload = parsePayload(e.dataTransfer.getData('text/plain'));
      if (payload?.type === 'play') { e.preventDefault(); slotEl.classList.add('drop'); }
    });
    slotEl.addEventListener('dragleave', () => slotEl.classList.remove('drop'));
    slotEl.addEventListener('drop', (e) => {
      const payload = parsePayload(e.dataTransfer.getData('text/plain'));
      if (payload?.type !== 'play') return;
      e.preventDefault();
      slotEl.classList.remove('drop');
      actions.playCard('player', payload.uid, slot);
    });
  });
}
