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
  fire: number;
  water: number;
  earth: number;
  wind: number;
  physical: number;

  constructor(
    physical: number = 0,
    fire: number = 0,
    water: number = 0,
    earth: number = 0,
    wind: number = 0
  ) {
    this.physical = physical;
    this.fire = fire;
    this.water = water;
    this.earth = earth;
    this.wind = wind;
  }

  /**
   * Add two ElementalAttributes together attribute by attribute; this operation is immutable
   */
  add(other: ElementalAttributes): ElementalAttributes {
    let toRet = new ElementalAttributes();

    for (let attr in this) {
      (toRet[attr as keyof ElementalAttributes] as number) =
        (this[attr] as number) +
        (other[attr as keyof ElementalAttributes] as number);
    }

    return toRet;
  }
  /**
   * Substract two ElementalAttributes  attribute by attribute; this operation is immutable
   */
  sub(other: ElementalAttributes): ElementalAttributes {
    let toRet = new ElementalAttributes();

    for (let attr in this) {
      (toRet[attr as keyof ElementalAttributes] as number) =
        (this[attr] as number) -
        (other[attr as keyof ElementalAttributes] as number);
    }

    return toRet;
  }
  /**
   * Multiply two ElementalAttributes together attribute by attribute; this operation is immutable
   */
  mul(other: ElementalAttributes): ElementalAttributes {
    let toRet = new ElementalAttributes();

    for (let attr in this) {
      (toRet[attr as keyof ElementalAttributes] as number) =
        (this[attr] as number) *
        (other[attr as keyof ElementalAttributes] as number);
    }

    return toRet;
  }
  /**
   * Divide two ElementalAttributes attribute by attribute; this operation is immutable
   */
  div(other: ElementalAttributes): ElementalAttributes {
    let toRet = new ElementalAttributes();

    for (let attr in this) {
      let otherVal = other[attr as keyof ElementalAttributes] as number;
      if (otherVal == 0) {
        (toRet[attr as keyof ElementalAttributes] as number) = this[
          attr
        ] as number;
      } else {
        (toRet[attr as keyof ElementalAttributes] as number) =
          (this[attr] as number) /
          (other[attr as keyof ElementalAttributes] as number);
      }
    }

    return toRet;
  }
  /**
   * Return the sum of elements
   */
  sum(): number {
    let toRet: number = 0;
    for (let attr in this) {
      toRet += this[attr] as number;
    }
    return toRet;
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
  private _health: number;
  // flat damage reduction
  private _defense: ElementalAttributes;
  private _attack: ElementalAttributes;
  // percentage based damage reduction; applied first
  private _resistance: ElementalAttributes;

  constructor(
    health: number,
    defense: ElementalAttributes,
    attack: ElementalAttributes,
    resistance: ElementalAttributes
  ) {
    this._health = health;
    this._defense = defense;
    this._attack = attack;
    this._resistance = resistance;
  }

  get health(): number {
    return this._health;
  }
  get attack(): ElementalAttributes {
    return this._attack;
  }
  set health(newHealth: number) {
    this._health = newHealth;
  }

  calculateDamage(attack: ElementalAttributes): number {
    attack = attack.sub(this._defense);

    return attack.sum();
  }
  takeDamage(attack: ElementalAttributes): number {
    let damage = this.calculateDamage(attack);
    this.health -= damage;
    return damage;
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

abstract class IEntity implements IAffectable {
  _baseStats: EntityStats;
  constructor(baseStats: EntityStats) {
    this._baseStats = baseStats;
  }
  get baseStats(): EntityStats {
    return this._baseStats;
  }
  get health(): number {
    return this._baseStats.health;
  }
  set health(value: number) {
    this.health = value;
  }
  get pos(): Pos {
    return this.pos;
  }
  set pos(position: Pos) {
    this.pos = position;
  }

  takeDamage(attack: ElementalAttributes): number {
    return this._baseStats.takeDamage(attack);
  }
  isAlive(): boolean {
    return this.baseStats.health > 0;
  }
}
