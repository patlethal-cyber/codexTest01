import { actions, getState } from '../store/gameStore.js';

const cardHtml = (c, inHand = false) => `
<div class="card ${c.keyword || ''}" draggable="${inHand}" data-uid="${c.uid}">
  <div class="cost">${c.cost ?? ''}</div>
  <div class="name">${c.name}</div>
  <div class="text">${c.text || c.keyword || ''}</div>
  <div class="stats"><span>${c.baseAttack ?? c.attack}</span>/<span>${(c.baseHealth ?? c.health) - (c.damage || 0)}</span></div>
</div>`;

export function render(root) {
  const s = getState();
  const winner = s.winner ? `<div class="overlay">${s.winner} wins!</div>` : '';
  root.innerHTML = `
  <div class="table">
    ${winner}
    <section class="hero ${s.shake.Enemy ? 'shake':''}">
      <h2>Enemy HP ${s.enemy.hp}</h2><p>Mana ${s.enemy.mana}/${s.enemy.maxMana}</p>
    </section>
    <section class="board enemy">${s.enemy.board.map((m) => `<div class="minion" data-target="${m.uid}">${cardHtml(m)}</div>`).join('')}</section>
    <section class="controls"><button id="endTurn">End Turn</button><span>Turn: ${s.turn}</span></section>
    <section class="board player">${s.player.board.map((m) => `<div class="minion ${m.canAttack?'ready':''} ${s.selectedAttacker===m.uid?'selected':''}" data-attacker="${m.uid}">${cardHtml(m)}</div>`).join('')}</section>
    <section class="hero ${s.shake.Player ? 'shake':''}"><h2 id="playerHero">Player HP ${s.player.hp}</h2><p>Mana ${s.player.mana}/${s.player.maxMana}</p></section>
    <section id="hand" class="hand">${s.player.hand.map((c, i) => `<div class="fan" style="--i:${i};--n:${Math.max(s.player.hand.length,1)}">${cardHtml(c,true)}</div>`).join('')}</section>
  </div>`;

  root.querySelector('#endTurn')?.addEventListener('click', () => actions.endTurn());
  root.querySelectorAll('[data-attacker]').forEach((el) => {
    el.addEventListener('click', () => actions.selectAttacker(el.dataset.attacker));
  });
  root.querySelectorAll('.enemy [data-target]').forEach((el) => {
    el.addEventListener('click', () => actions.attackTarget(el.dataset.target, false));
  });
  root.querySelector('#playerHero')?.addEventListener('click', () => actions.attackTarget(null, true));

  const hand = root.querySelector('#hand');
  const board = root.querySelector('.board.player');
  hand?.querySelectorAll('.card[draggable="true"]').forEach((c) => {
    c.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', c.dataset.uid));
  });
  board?.addEventListener('dragover', (e) => { e.preventDefault(); board.classList.add('drop'); });
  board?.addEventListener('dragleave', () => board.classList.remove('drop'));
  board?.addEventListener('drop', (e) => {
    e.preventDefault();
    board.classList.remove('drop');
    const uid = e.dataTransfer.getData('text/plain');
    actions.playCard('player', uid);
  });
}
