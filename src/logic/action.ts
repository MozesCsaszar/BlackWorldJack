/// <reference path="common.ts" />

namespace Action {
  enum Direction {
    up,
    right,
    down,
    left,
  }

  function addDirections(d1: Direction, d2: Direction): Direction {
    return d1 + d2 > 3 ? d1 + d2 - 4 : d1 + d2;
  }

  export class PlayerAction {
    // static load(save: string): PlayerAction {
    //   let a: PlayerAction = new PlayerAction("");
    //   a.load(save);
    //   return a;
    // }

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

  abstract class Action {
    color: string;
    constructor(color: string) {
      this.color = color;
    }
  }

  class MoveAction extends Action {
    constructor() {
      super("#FFFF00");
    }
  }

  class AttackAction extends Action {
    private _attack: ElementalAttributes;
    constructor(attack: ElementalAttributes) {
      super("#FF0000");

      this._attack = attack;
    }
  }

  class Connection {
    direction: Direction;
    pos: Pos;
    constructor(pos: Pos, direction: Direction = Direction.up) {
      this.direction = direction;
      this.pos = pos;
    }
  }

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

  // Describes different pattern pieces
  class PatternPiece {
    /**
     * Returns the elements of an arc to be used in a pattern piece
     * @param radius An integer representing the radius of the arc with which to draw a half-circle; must be a positive integer
     * @param annotation The annotation of the elements to be used
     * @returns The list of annotated positions making up the arc
     */
    static GetArcElements(radius: number, annotation: string): AnnotatedPos[] {
      let positions: AnnotatedPos[] = [
        new AnnotatedPos(annotation, new Pos(0, radius)),
      ];
      for (let i = 1; i < radius; i++) {
        positions.push(new AnnotatedPos(annotation, new Pos(-i, radius - i)));
        positions.push(new AnnotatedPos(annotation, new Pos(i, radius - i)));
      }
      return positions;
    }
    /**
     *
     * Returns a pattern piece centered on startingPos with provided connections
     * @param radius An integer representing the radius of the arc with which to draw a half-circle; must be a positive integer
     * @param annotation The annotation of the elements to be used
     * @param connections Default: []
     * @param startingPos Default: Pos(0, 0)
     * @returns
     */
    static GetArc(
      radius: number,
      annotation: string,
      connections: Connection[] = [],
      startingPos: Pos = new Pos(0, 0)
    ): PatternPiece {
      let elements = this.GetArcElements(radius, annotation);
      return new PatternPiece(elements, connections, startingPos);
    }

    /**
     * Return the elements needed to create a line shaped pattern piece
     * @param length The length of the line; must be a non-zero positive integer
     * @param annotation The annotation of the elements to be used
     * @param favor_right If true, in case of an even length, the extra element will be added to the right, else it will be added to the left
     */
    static GetSymmetricLineElements(
      length: number,
      annotation: string,
      favor_right = false
    ): AnnotatedPos[] {
      let positions: AnnotatedPos[] = [
        new AnnotatedPos(annotation, new Pos(0, 0)),
      ];
      for (let i = 1; i < length; i++) {
        if (i % 2 == 1) {
          if (favor_right) {
            positions.push(
              new AnnotatedPos(annotation, new Pos((i + 1) / 2, 0))
            );
          } else {
            positions.push(
              new AnnotatedPos(annotation, new Pos(-(i + 1) / 2, 0))
            );
          }
        } else {
          if (favor_right) {
            positions.push(
              new AnnotatedPos(annotation, new Pos(-(i + 1) / 2, 0))
            );
          } else {
            positions.push(
              new AnnotatedPos(annotation, new Pos((i + 1) / 2, 0))
            );
          }
        }
      }
      return positions;
    }

    /**
     * Return a line shaped pattern piece
     * @param length The length of the line; must be a non-zero positive integer
     * @param annotation The annotation of the elements to be used
     * @param favor_right If true, in case of an even length, the extra element will be added to the right, else it will be added to the left
     * @param connections Default: []
     * @param startingPos Default: Pos(0, 0)
     */
    static GetSymmetricLine(
      length: number,
      annotation: string,
      favor_right = false,
      connections: Connection[] = [],
      startingPos: Pos = new Pos(0, 0)
    ): PatternPiece {
      let elements = this.GetSymmetricLineElements(
        length,
        annotation,
        favor_right
      );
      return new PatternPiece(elements, connections, startingPos);
    }

    connections: Connection[];
    elements: AnnotatedPos[];
    startingPos: Pos;

    constructor(
      elements: AnnotatedPos[],
      connections: Connection[] = [],
      startingPos: Pos = new Pos(0, 0)
    ) {
      this.connections = connections;
      this.elements = elements;
      this.startingPos = startingPos;
    }
    getCurrentOccupiedSpaces(offset: Pos): AnnotatedPos[] {
      return this.elements.map((value) =>
        value.add(offset.add(this.startingPos))
      );
    }
    // in-place left-to-right rotation
    rotateLeft(): void {
      this.elements.forEach((element) => {
        element.pos.rotateLeft();
      });

      this.connections.forEach((connection) => {
        connection.pos.rotateLeft();
      });

      this.startingPos.rotateLeft();
    }
  }

  class OptionalGroupPiece extends PatternPiece {}

  // Made out of multiple pattern pieces placed on strategic locations
  class SubPattern {
    private patternPieces: PatternPiece[];
    private direction: Direction = Direction.up;
    constructor(patternPieces: PatternPiece[]) {
      this.patternPieces = patternPieces;
    }
    getCurrentOccupiedSpaces(startPos: Pos): AnnotatedPos[] {
      return this.patternPieces
        .map((value) => value.getCurrentOccupiedSpaces(startPos))
        .reduce((prev, current) => prev.concat(current));
    }
    getConnections(): Connection[] {
      return this.patternPieces
        .map((value) => value.connections)
        .reduce((prev, current) => prev.concat(current));
    }
    private rotateLeft(): void {
      this.patternPieces.forEach((piece) => piece.rotateLeft());
      this.direction = addDirections(this.direction, 1);
    }
    rotateBy(dir: Direction): SubPattern {
      for (let i = 0; i < dir; i++) {
        this.rotateLeft();
      }
      return this;
    }
    rotateTo(dir: Direction): SubPattern {
      while (this.direction != dir) {
        this.rotateLeft();
      }
      return this;
    }
  }

  // Used to chain multiple sub-patterns together, one after the other in connection points
  class Pattern {
    private subPatterns: SubPattern[];
    private currentStep: number = 1;
    private chosenConnections: number[] = [0];
    constructor(subPatterns: SubPattern[]) {
      this.subPatterns = [
        new SubPattern([
          new PatternPiece(
            [],
            [
              new Connection(new Pos(0, 1), Direction.up),
              new Connection(new Pos(1, 0), Direction.right),
              new Connection(new Pos(0, -1), Direction.down),
              new Connection(new Pos(-1, 0), Direction.left),
            ]
          ),
        ]),
      ].concat(subPatterns);
    }
    getCurrentSubPattern(): SubPattern {
      return this.subPatterns[this.currentStep];
    }
    getNextSubPattern(): SubPattern {
      return this.subPatterns[this.currentStep + 1];
    }
    getCurrentConnections(): Connection[] {
      return this.subPatterns[this.currentStep - 1].getConnections();
    }
    getConnections(index: number): Connection[] {
      return this.subPatterns[index].getConnections();
    }
    /**
     * Take the next step in the pattern
     * @param pos Choose the closest connection to pos
     * @returns true if a new step could be taken, false otherwise
     */
    nextStep(pos: Pos): boolean {
      if (this.currentStep + 1 < this.subPatterns.length) {
        this.currentStep++;
        this.chosenConnections.push(0);
        this.chooseClosesConnection(pos);
        return true;
      }
      return false;
    }
    /**
     * Go back a step in the
     * @param pos Choose the closest connection to pos
     * @returns true if a previous step could be taken, false otherwise
     */
    prevStep(pos: Pos): boolean {
      if (this.currentStep > 1) {
        this.currentStep--;
        this.chosenConnections.pop();
        this.chooseClosesConnection(pos);
        return true;
      }
      return false;
    }
    getCurrentOccupiedSpaces(startPos: Pos): AnnotatedPos[] {
      let dir = Direction.up;
      return this.subPatterns
        .slice(1)
        .map((value, i) => {
          if (i < this.currentStep) {
            dir = addDirections(
              dir,
              this.getConnections(i)[this.chosenConnections[i]].direction
            );

            value.rotateTo(dir);

            startPos = startPos.add(
              this.getConnections(i)[this.chosenConnections[i]].pos
            );

            let to_ret = value.getCurrentOccupiedSpaces(startPos);
            return to_ret;
          } else {
            return [];
          }
        })
        .reduce((prev, current) => prev.concat(current));
    }
    getClosestConnection(pos: Pos): number {
      let dists = this.getCurrentConnections().map((value) => {
        let x = -pos.x + value.pos.x;
        let y = -pos.y + value.pos.y;
        return x * x + y * y;
      });

      let min = dists[0];
      let min_i = 0;
      for (let i = 1; i < dists.length; i++) {
        if (dists[i] < min) {
          min_i = i;
          min = dists[i];
        }
      }
      return min_i;
    }
    chooseConnection(i: number) {
      this.chosenConnections.pop();
      this.chosenConnections.push(i);
    }
    chooseClosesConnection(pos: Pos): void {
      this.chooseConnection(this.getClosestConnection(pos));
    }
  }

  // A pattern where each cell is mapped to an action
  class ActionPattern {
    pattern: Pattern;
    actions: Map<string, Action>;
    constructor(pattern: Pattern, actions: Map<string, Action>) {
      this.pattern = pattern;
      this.actions = actions;
    }
    getCurrentOccupiedSpaces(startPos: Pos): AnnotatedPos[] {
      return this.pattern.getCurrentOccupiedSpaces(startPos);
    }
    chooseClosesConnection(pos: Pos): void {
      this.pattern.chooseClosesConnection(pos);
    }
    nextStep(pos: Pos): boolean {
      return this.pattern.nextStep(pos);
    }
    prevStep(pos: Pos): boolean {
      return this.pattern.prevStep(pos);
    }
  }

  export let player_actions = [
    new PlayerAction(
      "Move",
      new ActionPattern(
        new Pattern([
          new SubPattern([
            new PatternPiece([new AnnotatedPos("m", new Pos(0, 0))]),
          ]),
        ]),
        new Map<string, Action>([["m", new MoveAction()]])
      )
    ),
    new PlayerAction(
      "Attack",
      new ActionPattern(
        new Pattern([
          new SubPattern([
            new PatternPiece([new AnnotatedPos("a", new Pos(0, 0))]),
          ]),
        ]),
        new Map<string, Action>([
          ["a", new AttackAction(new ElementalAttributes(1))],
        ])
      )
    ),
  ];
}
