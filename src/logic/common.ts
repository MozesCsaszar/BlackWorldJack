/**
 * Contains all base classes used in other contexts as well.
 */

class Pos {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(pos: Pos): Pos {
    let p = new Pos(this.x, this.y);
    p.x += pos.x;
    p.y += pos.y;
    return p;
  }
  sub(pos: Pos): Pos {
    let p = new Pos(this.x, this.y);
    p.x -= pos.x;
    p.y -= pos.y;
    return p;
  }
  // rotate from left to right around O(0,0)
  rotateLeft() {
    let y = this.y;
    this.y = -this.x;
    this.x = y;
  }
}

class ElementalAttributes {
  fire: Number;
  water: Number;
  earth: Number;
  wind: Number;
  physical: Number;

  constructor(
    physical: Number = 0,
    fire: Number = 0,
    water: Number = 0,
    earth: Number = 0,
    wind: Number = 0
  ) {
    this.physical = physical;
    this.fire = fire;
    this.water = water;
    this.earth = earth;
    this.wind = wind;
  }

  copy() {
    return new ElementalAttributes(
      this.physical,
      this.fire,
      this.water,
      this.earth,
      this.water
    );
  }
}

class EntityStats {
  private _health: Number;
  private _defense: ElementalAttributes;
  private _attack: ElementalAttributes;
  private _resistance: ElementalAttributes;

  constructor(
    health: Number,
    defense: ElementalAttributes,
    attack: ElementalAttributes,
    resistance: ElementalAttributes
  ) {
    this._health = health;
    this._defense = defense;
    this._attack = attack;
    this._resistance = resistance;
  }

  copy(): EntityStats {
    return new EntityStats(
      this._health,
      this._defense.copy(),
      this._attack.copy(),
      this._resistance.copy()
    );
  }
}

interface Entity {
  get baseStats(): EntityStats;
  get pos(): Pos;
  set pos(position: Pos);
}
