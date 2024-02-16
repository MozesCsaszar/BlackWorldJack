/// <reference path="common.ts" />

namespace Action {
  export class Action {
    private _name: string;
    private _pattern: ActionPattern;

    constructor(name: string, pattern: ActionPattern) {
      this._name = name;
      this._pattern = pattern;
    }
    get name() {
      return this._name;
    }
    get pattern() {
      return this._pattern;
    }
    save(): string {
      return this._name;
    }
    load(save: string): void {
      this._name = save;
    }
  }

  abstract class AAction {
    color: string;
    constructor(color: string) {
      this.color = color;
    }
  }

  export abstract class AMoveAction extends AAction {
    constructor() {
      super("#FFFF00");
    }
  }

  class BasicMoveAction extends AMoveAction {}

  export abstract class AAttackAction extends AAction {
    private _attack: ElementalAttributes;
    private _effect: EntityDamageEffect;
    get attack(): ElementalAttributes {
      return this._attack;
    }
    get effect(): EntityDamageEffect {
      return this._effect;
    }
    constructor(attack: ElementalAttributes) {
      super("#FF0000");

      this._attack = attack;
      this._effect = new EntityDamageEffect(this._attack);
    }
  }

  class BasicAttackAction extends AAttackAction {}

  // A position with a type annotation to figure out what each coordinate means
  class AnnotatedPos {
    annotation: string;
    pos: Pos;
    constructor(annotation: string, pos: Pos) {
      this.annotation = annotation;
      this.pos = pos;
    }

    add(pos: Pos): AnnotatedPos {
      let ap = new AnnotatedPos(this.annotation, this.pos.add(pos));
      return ap;
    }
  }

  class Pattern {
    getCurrentOccupiedSpaces(startPos: Pos): AnnotatedPos[] {
      throw "Not implemented";
    }
  }

  class ActionPattern {
    pattern: Pattern;
    actions: Map<string, AAction>;
    constructor(pattern: Pattern, actions: Map<string, AAction>) {
      this.pattern = pattern;
      this.actions = actions;
    }
    getCurrentOccupiedSpaces(startPos: Pos): AnnotatedPos[] {
      return this.pattern.getCurrentOccupiedSpaces(startPos);
    }
  }

  export let player_actions = [
    new Action(
      "Move",
      new ActionPattern(
        new Pattern(),
        new Map<string, AAction>([["m", new BasicMoveAction()]])
      )
    ),
    new Action(
      "Attack",
      new ActionPattern(
        new Pattern(),
        new Map<string, AAction>([
          ["a", new BasicAttackAction(new ElementalAttributes(1))],
        ])
      )
    ),
  ];
}
