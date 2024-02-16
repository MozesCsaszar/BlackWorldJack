/**
 * Contains all base classes used in other contexts as well.
 */

class Pos {
  row: number;
  col: number;
  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }

  add(pos: Pos): Pos {
    let p = new Pos(this.row, this.col);
    p.row += pos.row;
    p.col += pos.col;
    return p;
  }
  sub(pos: Pos): Pos {
    let p = new Pos(this.row, this.col);
    p.row -= pos.row;
    p.col -= pos.col;
    return p;
  }
  // rotate from left to right around O(0,0)
  rotateLeft() {
    let col = this.col;
    this.col = -this.row;
    this.row = col;
  }
}

class ElementalAttributes {
  static symbols = {
    physical: "&#x2BC0;",
    fire: "&#x2BC5;",
    water: "&#x2BC6;",
    wind: "&#x2BC7;",
    earth: "&#x2BC8;",
  };
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

  isZero(): boolean {
    return (
      this.physical == 0 &&
      this.fire == 0 &&
      this.water == 0 &&
      this.earth == 0 &&
      this.wind == 0
    );
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
  /**
   * Create an HTML div object that displays a specific stat
   * @param key which stat to create it for (physical, fire etc.)
   * @param compareTo when stat equal to this, don't display it; use -infinity if you want to display it in any case
   */
  private _getStatHTML(key: keyof ElementalAttributes, compareTo: number = 0) {
    return (this[key] as number) != compareTo
      ? `<div class="text-${key}">${this[key]}${
          ElementalAttributes.symbols[key as string]
        }</div>`
      : ``;
  }
  getHTMLText() {
    return this.isZero()
      ? `0`
      : Object.keys(this)
          .map((key) => {
            return this._getStatHTML(key as keyof ElementalAttributes);
          })
          .join("&nbsp;");
  }
}

class EntityStats {
  static symbols = {
    health: "",
  };
  private _health: number;
  private _stamina: number;
  private _mana: number;
  // flat damage reduction
  private _defense: ElementalAttributes;
  // percentage based damage reduction; applied first
  private _resistance: ElementalAttributes;

  constructor(
    health: number,
    stamina: number,
    mana: number,
    defense: ElementalAttributes,
    resistance: ElementalAttributes
  ) {
    this._health = health;
    this._stamina = stamina;
    this._mana = mana;
    this._defense = defense;
    this._resistance = resistance;
  }

  get health(): number {
    return this._health;
  }
  get stamina(): number {
    return this._stamina;
  }
  get mana(): number {
    return this._mana;
  }
  set health(val: number) {
    this._health = val;
  }
  set stamina(val: number) {
    this._stamina = val;
  }
  set mana(val: number) {
    this._mana = val;
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
      this._stamina,
      this._mana,
      this._defense.copy(),
      this._resistance.copy()
    );
  }
  private _getStatHTML(title: string, statHTML: string) {
    return `<div class="text-medium flex-container">${title}:&nbsp;${statHTML}</div>`;
  }
  getHTMLStats() {
    return `${this._getStatHTML("Defense", this._defense.getHTMLText())}
    ${this._getStatHTML("Resistance", this._resistance.getHTMLText())}`;
  }
}

abstract class AEntity implements IAffectable {
  protected _baseStats: EntityStats;
  protected _currentStats: EntityStats;
  protected _pos: Pos;
  constructor(baseStats: EntityStats, pos: Pos = new Pos(0, 0)) {
    this._baseStats = baseStats;
    this._currentStats = baseStats.copy();
    this._pos = pos;
  }
  get baseStats(): EntityStats {
    return this._baseStats;
  }
  get currentStats(): EntityStats {
    return this._currentStats;
  }
  get health(): number {
    return this._currentStats.health;
  }
  set health(val: number) {
    this._currentStats.health = val;
  }
  get stamina(): number {
    return this._currentStats.stamina;
  }
  set stamina(val: number) {
    this._currentStats.stamina = val;
  }
  get mana(): number {
    return this._currentStats.mana;
  }
  set mana(val: number) {
    this._currentStats.mana = val;
  }
  get pos(): Pos {
    return this._pos;
  }
  set pos(position: Pos) {
    this._pos = position;
  }

  takeDamage(attack: ElementalAttributes): number {
    return this._baseStats.takeDamage(attack);
  }
  isAlive(): boolean {
    return this.baseStats.health > 0;
  }
}
