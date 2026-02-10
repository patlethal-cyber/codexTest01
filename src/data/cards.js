const makeMinion = (id, name, cost, attack, health, text, keyword = null, effect = null) => ({
  id,
  type: 'minion',
  name,
  cost,
  attack,
  health,
  text,
  keyword,
  effect,
});

const makeSpell = (id, name, cost, text, effect) => ({
  id,
  type: 'spell',
  name,
  cost,
  attack: 0,
  health: 0,
  text,
  keyword: 'spell',
  effect,
});

export const cards = [
  makeMinion('c01', 'Ashen Squire', 1, 1, 2, 'Battlecry: Gain +1 Attack this turn.', 'battlecry', { type: 'selfTempAttack', value: 1 }),
  makeMinion('c02', 'Crypt Rat', 1, 1, 1, 'Deathrattle: Deal 1 damage to enemy hero.', 'deathrattle', { type: 'damageHero', target: 'enemy', value: 1 }),
  makeMinion('c03', 'Stoneguard Pup', 1, 1, 3, 'Taunt', 'taunt', null),
  makeMinion('c04', 'Lantern Adept', 1, 2, 1, 'Aura: Adjacent minions have +1 Attack.', 'aura', { type: 'adjacentBuff', attack: 1, health: 0 }),
  makeMinion('c05', 'Grave Initiate', 2, 2, 2, 'Battlecry: Draw a card.', 'battlecry', { type: 'draw', value: 1 }),
  makeMinion('c06', 'Bone Picker', 2, 3, 1, 'Deathrattle: Summon a 1/1 Skeleton.', 'deathrattle', { type: 'summon', card: { name: 'Skeleton', attack: 1, health: 1 } }),
  makeMinion('c07', 'Catacomb Shield', 2, 2, 3, 'Taunt', 'taunt', null),
  makeMinion('c08', 'Forge Disciple', 2, 2, 2, 'Aura: Adjacent minions have +1/+1.', 'aura', { type: 'adjacentBuff', attack: 1, health: 1 }),
  makeMinion('c09', 'Vile Occultist', 3, 3, 2, 'Battlecry: Deal 2 damage to a random enemy minion.', 'battlecry', { type: 'damageRandomEnemyMinion', value: 2 }),
  makeMinion('c10', 'Dust Revenant', 3, 2, 4, 'Deathrattle: Heal your hero for 2.', 'deathrattle', { type: 'healHero', target: 'friendly', value: 2 }),
  makeMinion('c11', 'Rampart Knight', 3, 3, 4, 'Taunt', 'taunt', null),
  makeMinion('c12', 'Choir Matron', 3, 2, 3, 'Aura: Adjacent minions have +0/+2.', 'aura', { type: 'adjacentBuff', attack: 0, health: 2 }),
  makeMinion('c13', 'Riftcaller', 4, 4, 3, 'Battlecry: Summon a 2/2 Imp.', 'battlecry', { type: 'summon', card: { name: 'Rift Imp', attack: 2, health: 2 } }),
  makeMinion('c14', 'Tomb Howler', 4, 4, 4, 'Deathrattle: Give your minions +1 Attack.', 'deathrattle', { type: 'teamBuffAttack', value: 1 }),
  makeMinion('c15', 'Bulwark Golem', 4, 3, 6, 'Taunt', 'taunt', null),
  makeMinion('c16', 'Glyph Architect', 4, 3, 4, 'Aura: Adjacent minions have +2 Attack.', 'aura', { type: 'adjacentBuff', attack: 2, health: 0 }),
  makeMinion('c17', 'Dread Captain', 5, 5, 4, 'Battlecry: Deal 3 damage to enemy hero.', 'battlecry', { type: 'damageHero', target: 'enemy', value: 3 }),
  makeMinion('c18', 'Haunted Cart', 5, 4, 5, 'Deathrattle: Summon two 1/1 Wraiths.', 'deathrattle', { type: 'summonMany', count: 2, card: { name: 'Wraith', attack: 1, health: 1 } }),
  makeMinion('c19', 'Citadel Defender', 5, 4, 7, 'Taunt', 'taunt', null),
  makeMinion('c20', 'Banner Warden', 5, 3, 5, 'Aura: Adjacent minions have +1/+2.', 'aura', { type: 'adjacentBuff', attack: 1, health: 2 }),

  makeSpell('s01', 'Soul Spark', 1, 'Deal 2 damage to enemy hero.', { type: 'damageHero', target: 'enemy', value: 2 }),
  makeSpell('s02', 'War Map', 1, 'Draw a card.', { type: 'draw', value: 1 }),
  makeSpell('s03', 'Ember Volley', 2, 'Deal 1 damage to all enemy minions.', { type: 'damageAllEnemyMinions', value: 1 }),
  makeSpell('s04', 'Iron Blessing', 2, 'Give all friendly minions +1 Attack.', { type: 'teamBuffAttack', value: 1 }),
  makeSpell('s05', 'Mystic Refill', 2, 'Restore 2 Health to your hero.', { type: 'healHero', target: 'friendly', value: 2 }),
  makeSpell('s06', 'Arc Blast', 3, 'Deal 3 damage to a random enemy minion.', { type: 'damageRandomEnemyMinion', value: 3 }),
  makeSpell('s07', 'Night Tax', 3, 'Both heroes take 2 damage.', { type: 'damageBothHeroes', value: 2 }),
  makeSpell('s08', 'Treasure Ledger', 4, 'Draw 2 cards.', { type: 'draw', value: 2 }),
  makeSpell('s09', 'Scorched Earth', 4, 'Deal 2 damage to all enemy minions.', { type: 'damageAllEnemyMinions', value: 2 }),
  makeSpell('s10', 'Royal Decree', 5, 'Destroy a damaged enemy minion.', { type: 'destroyDamagedEnemy' }),
];

const shuffled = (arr) => {
  const list = [...arr];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
};

export const starterDeck = () => {
  const pool = shuffled(cards);
  const deck = [];
  const countById = {};
  while (deck.length < 15) {
    const card = pool[Math.floor(Math.random() * pool.length)];
    countById[card.id] = countById[card.id] || 0;
    if (countById[card.id] >= 2) continue;
    countById[card.id] += 1;
    deck.push({ ...card, uid: `${card.id}-${deck.length}-${Math.random().toString(36).slice(2, 7)}` });
  }
  return shuffled(deck);
};
