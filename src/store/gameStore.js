import { starterDeck } from '../data/cards.js';
import { applyAuras, runEffect } from '../logic/effects.js';

const hero = (name) => ({ name, hp: 30, mana: 0, maxMana: 0, deck: starterDeck(), hand: [], board: [] });

const state = {
  player: hero('Player'),
  enemy: hero('Enemy'),
  turn: 'player',
  winner: null,
  selectedAttacker: null,
  shake: {},
};

const listeners = new Set();
const emit = () => listeners.forEach((l) => l(getState()));
export const subscribe = (fn) => (listeners.add(fn), () => listeners.delete(fn));
export const getState = () => structuredClone(state);
const sideRef = (side) => (side === 'player' ? state.player : state.enemy);
const other = (side) => (side === 'player' ? state.enemy : state.player);

function draw(sideObj) {
  if (!sideObj.deck.length) {
    damageHero(sideObj, 1);
    return;
  }
  if (sideObj.hand.length >= 10) return;
  sideObj.hand.push(sideObj.deck.pop());
}

function summon(sideObj, cardData) {
  if (sideObj.board.length >= 7) return;
  sideObj.board.push({
    uid: `${cardData.name}-${Math.random().toString(36).slice(2, 8)}`,
    name: cardData.name,
    cost: 0,
    baseAttack: cardData.attack,
    baseHealth: cardData.health,
    damage: 0,
    canAttack: false,
    keyword: cardData.keyword || null,
    effect: null,
    tempAttack: 0,
    auraAttack: 0,
    auraHealth: 0,
  });
}

function damageHero(sideObj, amount) {
  sideObj.hp -= amount;
  state.shake[sideObj.name] = Date.now();
  if (sideObj.hp <= 0) state.winner = sideObj.name === 'Player' ? 'Enemy' : 'Player';
}
function healHero(sideObj, amount) { sideObj.hp = Math.min(30, sideObj.hp + amount); }

function effectiveAttack(m) { return m.baseAttack + (m.tempAttack || 0) + (m.auraAttack || 0); }
function effectiveHealth(m) { return m.baseHealth + (m.auraHealth || 0); }

function destroyMinion(target) {
  const owner = state.player.board.find((m) => m.uid === target.uid) ? state.player : state.enemy;
  owner.board = owner.board.filter((m) => m.uid !== target.uid);
  if (target.keyword === 'deathrattle' && target.effect) {
    runEffect(target.effect, effectCtx(owner === state.player ? 'player' : 'enemy', target));
  }
}

function damageMinion(target, amount) {
  target.damage += amount;
  if (target.damage >= effectiveHealth(target)) destroyMinion(target);
}

function effectCtx(side, actor) {
  return { me: sideRef(side), enemy: other(side), draw, summon, damageMinion, destroyMinion, damageHero, healHero, actor };
}

function recalc() {
  applyAuras(state.player);
  applyAuras(state.enemy);
}

export const actions = {
  startGame() {
    for (let i = 0; i < 3; i++) { draw(state.player); draw(state.enemy); }
    this.startTurn('player');
  },
  startTurn(side) {
    state.turn = side;
    const me = sideRef(side);
    me.maxMana = Math.min(10, me.maxMana + 1);
    me.mana = me.maxMana;
    draw(me);
    me.board.forEach((m) => { m.canAttack = true; m.tempAttack = 0; });
    recalc();
    emit();
  },
  endTurn() {
    if (state.winner) return;
    const next = state.turn === 'player' ? 'enemy' : 'player';
    this.startTurn(next);
    if (next === 'enemy') setTimeout(() => this.runEnemyTurn(), 450);
  },
  playCard(side, uid) {
    if (state.turn !== side || state.winner) return false;
    const me = sideRef(side);
    const i = me.hand.findIndex((c) => c.uid === uid);
    if (i < 0 || me.board.length >= 7) return false;
    const c = me.hand[i];
    if (c.cost > me.mana) return false;
    me.mana -= c.cost;
    me.hand.splice(i, 1);
    const minion = {
      uid: c.uid,
      name: c.name,
      cost: c.cost,
      baseAttack: c.attack,
      baseHealth: c.health,
      damage: 0,
      canAttack: false,
      keyword: c.keyword,
      effect: c.effect,
      tempAttack: 0,
      auraAttack: 0,
      auraHealth: 0,
    };
    me.board.push(minion);
    if (minion.keyword === 'battlecry' && minion.effect) runEffect(minion.effect, effectCtx(side, minion));
    recalc();
    emit();
    return true;
  },
  selectAttacker(uid) { state.selectedAttacker = uid; emit(); },
  attackTarget(targetUid, targetHero = false) {
    const me = sideRef(state.turn);
    const enemy = other(state.turn);
    const attacker = me.board.find((m) => m.uid === state.selectedAttacker);
    if (!attacker || !attacker.canAttack) return;
    const enemyTaunts = enemy.board.filter((m) => m.keyword === 'taunt');
    if (targetHero) {
      if (enemyTaunts.length) return;
      damageHero(enemy, effectiveAttack(attacker));
    } else {
      const target = enemy.board.find((m) => m.uid === targetUid);
      if (!target) return;
      if (enemyTaunts.length && target.keyword !== 'taunt') return;
      damageMinion(target, effectiveAttack(attacker));
      damageMinion(attacker, effectiveAttack(target));
    }
    attacker.canAttack = false;
    state.selectedAttacker = null;
    recalc();
    emit();
  },
  runEnemyTurn() {
    if (state.turn !== 'enemy' || state.winner) return;
    const me = state.enemy;
    me.hand.sort((a, b) => b.cost - a.cost);
    let played = true;
    while (played) {
      played = false;
      for (const c of [...me.hand]) {
        if (c.cost <= me.mana && me.board.length < 7) {
          this.playCard('enemy', c.uid);
          played = true;
          break;
        }
      }
    }
    me.board.forEach((m) => {
      if (!m.canAttack || state.winner) return;
      state.selectedAttacker = m.uid;
      const taunts = state.player.board.filter((x) => x.keyword === 'taunt');
      if (taunts.length) this.attackTarget(taunts[0].uid, false);
      else if (state.player.board.length && Math.random() < 0.6) this.attackTarget(state.player.board[0].uid, false);
      else this.attackTarget(null, true);
    });
    this.endTurn();
  },
};
