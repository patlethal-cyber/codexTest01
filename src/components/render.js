import { actions, getState } from '../store/gameStore.js';

const dragPayload = (type, uid) => JSON.stringify({ type, uid });
const parsePayload = (raw) => {
  try { return JSON.parse(raw); } catch { return null; }
};

const cardHtml = (c, inHand = false, canDragAttack = false, shake = false) => `
<div class="card ${c.keyword || ''} ${shake ? 'shake' : ''}" draggable="${inHand || canDragAttack}" data-uid="${c.uid}" data-dragtype="${inHand ? 'play' : (canDragAttack ? 'attack' : '')}">
  <div class="cost">${c.cost ?? ''}</div>
  <div class="name">${c.name}</div>
  <div class="text">${c.text || c.keyword || ''}</div>
  <div class="stats"><span>${c.baseAttack ?? c.attack}</span>/<span>${(c.baseHealth ?? c.health) - (c.damage || 0)}</span></div>
</div>`;

export function render(root) {
  const s = getState();
  const winner = s.winner ? `<div class="overlay">${s.winner} wins!</div>` : '';
  root.innerHTML = `
  <div class="table-wrap">
    <div class="table-ornament"></div>
    <div class="table">
      ${winner}
      <section id="enemyHero" class="hero target-hero ${s.shake.Enemy ? 'shake':''}">
        <h2>Enemy HP ${s.enemy.hp}</h2><p>Mana ${s.enemy.mana}/${s.enemy.maxMana}</p>
      </section>
      <section class="board enemy">${s.enemy.board.map((m) => `<div class="minion ${s.shakeMinion[m.uid] ? 'shake' : ''}" data-target="${m.uid}">${cardHtml(m, false, false, !!s.shakeMinion[m.uid])}</div>`).join('')}</section>
      <section class="controls"><button id="endTurn">End Turn</button><span>Turn: ${s.turn}</span></section>
      <section id="playerBoard" class="board player">${s.player.board.map((m) => `<div class="minion ${m.canAttack?'ready':''} ${s.selectedAttacker===m.uid?'selected':''} ${s.shakeMinion[m.uid] ? 'shake' : ''}" data-attacker="${m.uid}">${cardHtml(m, false, m.canAttack, !!s.shakeMinion[m.uid])}</div>`).join('')}</section>
      <section class="hero ${s.shake.Player ? 'shake':''}"><h2>Player HP ${s.player.hp}</h2><p>Mana ${s.player.mana}/${s.player.maxMana}</p></section>
      <section id="hand" class="hand">${s.player.hand.map((c, i) => `<div class="fan" style="--i:${i};--n:${Math.max(s.player.hand.length,1)}">${cardHtml(c,true,false,false)}</div>`).join('')}</section>
    </div>
  </div>`;

  root.querySelector('#endTurn')?.addEventListener('click', () => actions.endTurn());

  root.querySelectorAll('[data-attacker]').forEach((el) => {
    const uid = el.dataset.attacker;
    el.addEventListener('click', () => actions.selectAttacker(uid));
  });

  root.querySelectorAll('.enemy [data-target]').forEach((el) => {
    const uid = el.dataset.target;
    el.addEventListener('click', () => actions.attackTarget(uid, false));
    el.addEventListener('dragover', (e) => {
      const payload = parsePayload(e.dataTransfer.getData('text/plain'));
      if (payload?.type === 'attack') {
        e.preventDefault();
        el.classList.add('drop-target');
      }
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
    if (payload?.type === 'attack') {
      e.preventDefault();
      enemyHero.classList.add('drop-target');
    }
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

  const hand = root.querySelector('#hand');
  const board = root.querySelector('#playerBoard');

  root.querySelectorAll('.card[draggable="true"]').forEach((card) => {
    const uid = card.dataset.uid;
    const dragtype = card.dataset.dragtype;
    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.effectAllowed = dragtype === 'play' ? 'copyMove' : 'move';
      e.dataTransfer.setData('text/plain', dragPayload(dragtype, uid));
    });
  });

  board?.addEventListener('dragover', (e) => {
    const payload = parsePayload(e.dataTransfer.getData('text/plain'));
    if (payload?.type === 'play') {
      e.preventDefault();
      board.classList.add('drop');
    }
  });
  board?.addEventListener('dragleave', () => board.classList.remove('drop'));
  board?.addEventListener('drop', (e) => {
    const payload = parsePayload(e.dataTransfer.getData('text/plain'));
    if (payload?.type !== 'play') return;
    e.preventDefault();
    board.classList.remove('drop');
    actions.playCard('player', payload.uid);
  });

  hand?.addEventListener('dragend', () => board?.classList.remove('drop'));
}
