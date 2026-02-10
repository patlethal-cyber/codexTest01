const make = (id, name, cost, attack, health, text, keyword = null, effect = null) => ({
  id,
  name,
  cost,
  attack,
  health,
  text,
  keyword,
  effect,
});

export const cards = [
  make('c01','Ashen Squire',1,1,2,'Battlecry: Gain +1 Attack this turn.','battlecry',{type:'selfTempAttack',value:1}),
  make('c02','Crypt Rat',1,1,1,'Deathrattle: Deal 1 damage to enemy hero.','deathrattle',{type:'damageHero',target:'enemy',value:1}),
  make('c03','Stoneguard Pup',1,1,3,'Taunt','taunt',null),
  make('c04','Lantern Adept',1,2,1,'Aura: Adjacent minions have +1 Attack.','aura',{type:'adjacentBuff',attack:1,health:0}),
  make('c05','Grave Initiate',2,2,2,'Battlecry: Draw a card.','battlecry',{type:'draw',value:1}),
  make('c06','Bone Picker',2,3,1,'Deathrattle: Summon a 1/1 Skeleton.','deathrattle',{type:'summon',card:{name:'Skeleton',attack:1,health:1}}),
  make('c07','Catacomb Shield',2,2,3,'Taunt','taunt',null),
  make('c08','Forge Disciple',2,2,2,'Aura: Adjacent minions have +1/+1.','aura',{type:'adjacentBuff',attack:1,health:1}),
  make('c09','Vile Occultist',3,3,2,'Battlecry: Deal 2 damage to a random enemy minion.','battlecry',{type:'damageRandomEnemyMinion',value:2}),
  make('c10','Dust Revenant',3,2,4,'Deathrattle: Heal your hero for 2.','deathrattle',{type:'healHero',target:'friendly',value:2}),
  make('c11','Rampart Knight',3,3,4,'Taunt','taunt',null),
  make('c12','Choir Matron',3,2,3,'Aura: Adjacent minions have +0/+2.','aura',{type:'adjacentBuff',attack:0,health:2}),
  make('c13','Riftcaller',4,4,3,'Battlecry: Summon a 2/2 Imp.','battlecry',{type:'summon',card:{name:'Rift Imp',attack:2,health:2}}),
  make('c14','Tomb Howler',4,4,4,'Deathrattle: Give your minions +1 Attack.','deathrattle',{type:'teamBuffAttack',value:1}),
  make('c15','Bulwark Golem',4,3,6,'Taunt','taunt',null),
  make('c16','Glyph Architect',4,3,4,'Aura: Adjacent minions have +2 Attack.','aura',{type:'adjacentBuff',attack:2,health:0}),
  make('c17','Dread Captain',5,5,4,'Battlecry: Deal 3 damage to enemy hero.','battlecry',{type:'damageHero',target:'enemy',value:3}),
  make('c18','Haunted Cart',5,4,5,'Deathrattle: Summon two 1/1 Wraiths.','deathrattle',{type:'summonMany',count:2,card:{name:'Wraith',attack:1,health:1}}),
  make('c19','Citadel Defender',5,4,7,'Taunt','taunt',null),
  make('c20','Banner Warden',5,3,5,'Aura: Adjacent minions have +1/+2.','aura',{type:'adjacentBuff',attack:1,health:2}),
  make('c21','Cinder Tyrant',6,6,5,'Battlecry: Deal 2 damage to all enemy minions.','battlecry',{type:'damageAllEnemyMinions',value:2}),
  make('c22','Soul Broker',6,5,6,'Deathrattle: Draw 2 cards.','deathrattle',{type:'draw',value:2}),
  make('c23','Iron Chapel',6,4,9,'Taunt','taunt',null),
  make('c24','Runic Idol',6,4,4,'Aura: Adjacent minions have +2/+2.','aura',{type:'adjacentBuff',attack:2,health:2}),
  make('c25','Nightfall Dragon',7,7,6,'Battlecry: Destroy a damaged enemy minion.','battlecry',{type:'destroyDamagedEnemy'}),
  make('c26','Fallen Colossus',7,6,8,'Deathrattle: Deal 3 damage to all heroes.','deathrattle',{type:'damageBothHeroes',value:3}),
  make('c27','Vault Sentinel',7,5,10,'Taunt','taunt',null),
  make('c28','Cathedral Voice',7,4,7,'Aura: Adjacent minions have +3 Attack.','aura',{type:'adjacentBuff',attack:3,health:0}),
  make('c29','Abyssal Emperor',8,8,8,'Battlecry: Summon a 3/3 Demon with Taunt.','battlecry',{type:'summon',card:{name:'Abyssal Guard',attack:3,health:3,keyword:'taunt'}}),
  make('c30','Queen of Cinders',9,9,9,'Deathrattle: Summon a 5/5 Phoenix.','deathrattle',{type:'summon',card:{name:'Phoenix',attack:5,health:5}}),
];

export const starterDeck = () => {
  const list = [...cards, ...cards].slice(0, 30).map((c, i) => ({ ...c, uid: `${c.id}-${i}-${Math.random().toString(36).slice(2, 7)}` }));
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
};
