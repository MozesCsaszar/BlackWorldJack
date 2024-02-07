/// <reference path="common.ts" />

namespace Enemy {
  enum Modifier {}

  class Scaling {
    copy(): Scaling {
      return new Scaling();
    }
  }

  class EnemyBody {
    private _attributes: EntityStats;
    private _modifiers: Modifier[] = [];
    get attributes(): EntityStats {
      return this._attributes;
    }
    constructor(attributes: EntityStats, modifiers: Modifier[]) {
      this._attributes = attributes.copy();
      modifiers.forEach((e) => this._modifiers.push(e));
    }

    copy(): EnemyBody {
      return new EnemyBody(this._attributes, this._modifiers);
    }
  }

  class EnemyInfo {
    name: string;
    desc: string;
    constructor(name: string, desc: string) {
      this.name = name;
      this.desc = desc;
    }
  }

  export class EnemyWithLevel extends IEntity {
    private _body: EnemyBody;
    //private _elitenessModifiers: EnemyBody[] = [];
    private _symbol: string;
    private _level: number;
    private _info: EnemyInfo;
    private _pos: Pos;
    get pos(): Pos {
      return this._pos;
    }
    get baseStats(): EntityStats {
      return this._body.attributes;
    }
    get level(): number {
      return this._level;
    }
    get name(): string {
      return this._info.name;
    }
    get desc(): string {
      return this._info.desc;
    }
    get symbol(): string {
      return this._symbol;
    }
    set enemyInfo(info: EnemyInfo) {
      this._info = info;
    }
    set symbol(sym: string) {
      this._symbol = sym;
    }
    set pos(position: Pos) {
      this._pos = position;
    }
    constructor(body: EnemyBody, level: number) {
      super(body.attributes);

      this._body = body.copy();
      this._level = level;
    }
    copy(): EnemyWithLevel {
      let e: EnemyWithLevel = new EnemyWithLevel(
        this._body.copy(),
        this._level
      );
      e.enemyInfo = this._info;
      return e;
    }
  }

  export class Enemy {
    static copy(enemy: Enemy) {
      return enemy.copy();
    }
    private _name: string;
    private _desc: string;

    private _levels: Map<number, EnemyWithLevel> = new Map<
      number,
      EnemyWithLevel
    >();
    private _scaling: Scaling;

    constructor(
      name: string,
      desc: string,
      levels: Map<number, EnemyWithLevel>,
      scaling: Scaling = undefined
    ) {
      this._name = name;
      this._desc = desc;
      levels.forEach((e, k) => {
        e.enemyInfo = this.getInfo();
        this._levels.set(k, e.copy());
      });
      this._scaling = scaling == undefined ? undefined : scaling.copy();
    }
    copy(): Enemy {
      let e: Enemy = new Enemy(
        this._name,
        this._desc,
        this._levels,
        this._scaling == undefined ? undefined : this._scaling.copy()
      );
      return e;
    }
    getEnemyWithLevel(level: number): EnemyWithLevel {
      if (level >= 1) {
        if (this._levels.get(level) != undefined) {
          return this._levels.get(level).copy();
        } else {
          /*Cases:
                          I:      There is an enemy with lower level and scaling     -> Scale enemy from lower level
                          II:     There is an enemy with higher level and no scaling -> Get enemy from higher level
                          III:    There is no enemy with higher level and no scaling -> Throw error
                      */
          let tempLevels: number[] = [];
          for (const level of this._levels.keys()) {
            tempLevels.push(level);
          }
          tempLevels = tempLevels.sort();
          if (this._scaling != undefined) {
            console.log("SCALED");
            return this._levels.get(0).copy();
          } else {
            let higher: number = undefined;
            tempLevels.forEach((e) => {
              if (e > level) {
                if (higher == undefined) {
                  higher = e;
                }
              }
            });
            if (higher == undefined) {
              throw "ERROR: No higher level enemy to initialize this one!";
            } else {
              return this._levels.get(higher).copy();
            }
          }
        }
      } else {
        throw "ERROR: Cannot copy Enemy with level < 1";
      }
    }
    getInfo(): EnemyInfo {
      return new EnemyInfo(this._name, this._desc);
    }
  }

  export let enemies = {
    Goblin: new Enemy(
      "Goblin",
      "Stinky and foul looking, these creatures are not the bestest fighters.",
      new Map<number, EnemyWithLevel>([
        [
          1,
          new EnemyWithLevel(
            new EnemyBody(
              new EntityStats(
                10,
                new ElementalAttributes(),
                new ElementalAttributes(3),
                new ElementalAttributes()
              ),
              []
            ),
            1
          ),
        ],
      ])
    ),
  };
}
