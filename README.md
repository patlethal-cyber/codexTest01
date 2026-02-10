# MiniStone (Hearthstone Lite)

MiniStone is a lightweight, playable, single-player card game prototype.

## Run locally (no install needed)

From the repo root:

```bash
python3 -m http.server 4173
```

Then open:

- http://localhost:4173

## How to play

- You start at **30 HP**. Enemy starts at **30 HP**.
- Click **End Turn** to pass to enemy.
- On your turn you draw, gain max mana (up to 10), and refill mana.

### Play cards

- Drag a card from your hand to a `+` insert slot on your board to place minions in any position.
- Spell cards resolve instantly when dragged to an insert slot (they do not stay on board).

### Attack

- Click one of your glowing/ready minions to select attacker, then click enemy minion/hero.
- You can also **drag a ready friendly minion** onto an enemy minion or enemy hero to attack.
- Hover any minion on board to read full effect text via tooltip.
- If enemy has any **Taunt** minion, you must attack Taunt first.

## Notes

- This prototype is implemented as modular browser JS and CSS so it can run in a plain static server.
- No npm dependencies are required to run this version in a browser.
