export function applyAuras(side) {
  side.board.forEach((m) => {
    m.auraAttack = 0;
    m.auraHealth = 0;
  });
  side.board.forEach((m, idx) => {
    if (m.keyword !== 'aura' || !m.effect) return;
    const left = side.board[idx - 1];
    const right = side.board[idx + 1];
    for (const n of [left, right]) {
      if (!n) continue;
      n.auraAttack += m.effect.attack || 0;
      n.auraHealth += m.effect.health || 0;
    }
  });
}

export function runEffect(effect, ctx) {
  if (!effect) return;
  const { me, enemy, draw, summon, damageMinion, destroyMinion, damageHero, healHero } = ctx;
  switch (effect.type) {
    case 'selfTempAttack':
      ctx.actor.tempAttack = (ctx.actor.tempAttack || 0) + effect.value;
      break;
    case 'draw':
      for (let i = 0; i < effect.value; i++) draw(me);
      break;
    case 'damageHero':
      damageHero(effect.target === 'enemy' ? enemy : me, effect.value);
      break;
    case 'healHero':
      healHero(effect.target === 'friendly' ? me : enemy, effect.value);
      break;
    case 'summon':
      summon(me, effect.card);
      break;
    case 'summonMany':
      for (let i = 0; i < effect.count; i++) summon(me, effect.card);
      break;
    case 'damageRandomEnemyMinion': {
      if (!enemy.board.length) break;
      const target = enemy.board[Math.floor(Math.random() * enemy.board.length)];
      damageMinion(target, effect.value);
      break;
    }
    case 'teamBuffAttack':
      me.board.forEach((m) => (m.baseAttack += effect.value));
      break;
    case 'damageAllEnemyMinions':
      [...enemy.board].forEach((m) => damageMinion(m, effect.value));
      break;
    case 'destroyDamagedEnemy': {
      const target = enemy.board.find((m) => m.damage > 0);
      if (target) destroyMinion(target);
      break;
    }
    case 'damageBothHeroes':
      damageHero(me, effect.value);
      damageHero(enemy, effect.value);
      break;
  }
}
