/// <reference path="../../logic/common.ts" />
/// <reference path="../../logic/action.ts" />
/// <reference path="../../logic/player.ts" />
/// <reference path="../common.ts" />

namespace ActionPlanBarGUIs {
  class CardGUI {
    static readonly _divClass: string = "card";
    private _card: Card;
    private _div: JQuery<HTMLElement>;
    constructor(parent: JQuery<HTMLElement>, card: Card = null) {
      this._card = card;
      this._div = JQueryUtils.createDiv({
        htmlClass: CardGUI._divClass,
        parent: parent,
      });
    }
    get card(): Card {
      return this._card;
    }
    set card(card: Card) {
      this._card = card;
      this.update();
    }
    update(): void {
      if (this.card == null) {
        this._div.css("display", "none");
      } else {
        this._div.css("display", "block");

        this._div.html(this.card.value + "<br>" + this.card.suit);
      }
    }
    reset(): void {
      this._div.text("");
      this._div[0].hidden = true;
      this._card = null;
    }
    setAsTemp(): void {
      this._div.css("opacity", "0.5");
    }
    setAsPerm(): void {
      this._div.css("opacity", "1");
    }
    setLeft(left: number): void {
      //set the left property of style of the div to allow for stylizing the card display format
      this._div.css("left", left + "px");
    }
  }

  class HandGUI {
    private static readonly _divClass: string = "card_holder";
    private static readonly _nrMaxCards: number = 9;

    private _cardGUIs: CardGUI[] = [];
    private _div: JQuery<HTMLElement>;
    private _hand: Hand;
    private _tempHand: Hand;
    constructor(parent: JQuery<HTMLElement>) {
      this._div = JQueryUtils.createDiv({
        htmlClass: HandGUI._divClass,
        parent: parent,
      });
      for (let i = 0; i < HandGUI._nrMaxCards; i++) {
        this._cardGUIs.push(new CardGUI(this._div));
      }
      this._hand = new Hand();
      this._tempHand = new Hand();
      this.stylizeDeck();
    }
    get value(): number {
      return this._hand.value;
    }
    get busted(): boolean {
      return this._hand.busted;
    }
    get final(): boolean {
      return this.busted || this._hand.final;
    }
    get tempValue(): number {
      return this._tempHand.value;
    }
    get tempBusted(): boolean {
      return this._tempHand.busted;
    }
    get tempFinal(): boolean {
      return this._tempHand.final;
    }
    update(): void {
      this._cardGUIs.forEach((e, i) => (e.card = this._tempHand.get(i)));
    }
    addTempCard(card: Card): void {
      //visual changes only; change temp hand only
      this._cardGUIs[this._tempHand.length].card = card;
      this._cardGUIs[this._tempHand.length].setAsTemp();
      this._tempHand.addCard(card);
    }
    finalizeTempCard(): void {
      //visual and actual deck changes changes only
      this._cardGUIs[this._tempHand.length - 1].setAsPerm();
      this._hand.addCard(this._cardGUIs[this._tempHand.length - 1].card);
    }
    removeTempCard(): void {
      this._cardGUIs[this._tempHand.length - 1].card = null;
      this._tempHand.popCard();
    }
    stylizeDeck(): void {
      this._cardGUIs.forEach((e: CardGUI, i: number) => {
        e.setLeft(i * 20.96);
      });
    }
    endPlayerTurn(): void {
      this._hand.reset();
      this._tempHand.reset();
      this.update();
    }
  }

  class ActionGUI {
    static readonly _divClass: string = "action";

    private _div: JQuery<HTMLElement>;
    private _action: Action.Action = null;
    private _tempAction: Action.Action = null;
    get action(): Action.Action {
      return this._action;
    }
    set action(action: Action.Action) {
      this._action = action;
      this.update();
    }
    set tempAction(action: Action.Action) {
      this._tempAction = action;
      this.update(true);
    }
    removeTemp(): void {
      this._tempAction = null;
      this.update();
    }
    finalizeTemp(): void {
      this.action = this._tempAction;
    }
    constructor(parent: JQuery<HTMLElement>) {
      this._div = JQueryUtils.createDiv({
        htmlClass: ActionGUI._divClass,
        parent: parent,
      });
      this._action = null;
    }
    update(basedOnTemp = false): void {
      let a: Action.Action = basedOnTemp ? this._tempAction : this._action;
      if (a == null) {
        this._div.html("");
      } else {
        this._div.html(a.name);
      }
    }
    reset(): void {
      this._action = null;
      this._tempAction = null;
    }
  }

  class ActionSpaceGUI {
    static readonly _divClass: string = "action_card_space";

    private _entered: boolean = false;
    private _actionGUI: ActionGUI;
    private _handGUI: HandGUI;
    private _div: JQuery<HTMLElement>;
    constructor(parent: JQuery<HTMLElement>, nr: number) {
      this._div = JQueryUtils.createDiv({
        htmlClass: `${ActionSpaceGUI._divClass} _${nr}`,
        parent: parent,
      });

      this._actionGUI = new ActionGUI(this._div);
      this._handGUI = new HandGUI(this._div);

      this.setUpEventListeners();
      this.update();
    }
    get busted(): boolean {
      return this._handGUI.busted;
    }
    get final(): boolean {
      return this.busted || this._handGUI.final;
    }
    private setUpEventListeners() {
      this._div.on("mousedown", (e) => this.onMouseDown(e.originalEvent));
      this._div.on("mouseenter", (e) => this.onMouseEnter(e.originalEvent));
      this._div.on("mouseleave", (e) => this.onMouseLeave(e.originalEvent));
      this._div.on("mouseup", (e) => this.onMouseUp(e.originalEvent));
    }
    onMouseDown(e: MouseEvent) {
      if (
        e.button == 0 &&
        this._actionGUI.action != null &&
        DragAPI.dragObjectType == null
      ) {
        ActionBarGUIs.ActionBarAreaGridGUI.self.setUpActionPattern(
          this._actionGUI.action.name
        );
      }
    }
    onMouseEnter(e: MouseEvent) {
      if (
        DragAPI.dragObjectType == DeckGUI._dragObjType &&
        !this._handGUI.busted
      ) {
        this._handGUI.addTempCard(Card.load(DragAPI.dragObjectData));
        this.update();
        DragAPI.enterDragDestinationArea();
      } else if (
        DragAPI.dragObjectType ==
        ActionBarGUIs.ActionListElementGUI._dragObjType
      ) {
        this._actionGUI.tempAction = Action.player_actions.find(
          (action) => action.name == DragAPI.dragObjectData
        );
        DragAPI.enterDragDestinationArea();
      }
    }
    onMouseLeave(e: MouseEvent) {
      if (
        DragAPI.dragObjectType == DeckGUI._dragObjType &&
        DragAPI.insideDragDestinationArea
      ) {
        this._handGUI.removeTempCard();
        this.update();
        DragAPI.exitDragDestinationArea();
      } else if (
        DragAPI.dragObjectType ==
          ActionBarGUIs.ActionListElementGUI._dragObjType &&
        DragAPI.insideDragDestinationArea
      ) {
        this._actionGUI.removeTemp();
        DragAPI.exitDragDestinationArea();
      }
    }
    onMouseUp(e: MouseEvent) {
      if (DragAPI.canDropHere(DeckGUI._dragObjType) && !this._handGUI.busted) {
        this._handGUI.finalizeTempCard();
        ActionHolderGUI.setFinalAll();
        this._entered = false;
        DragAPI.endDrag();
      } else if (
        DragAPI.canDropHere(ActionBarGUIs.ActionListElementGUI._dragObjType)
      ) {
        this._actionGUI.finalizeTemp();
        DragAPI.endDrag();
      }
    }
    update(): void {
      this._handGUI.update();
      this._actionGUI.update();
      let value = this._handGUI.tempValue;
      if (value < 14) {
        this._div.css("border", "dashed red 5px");
      } else if (value < 21) {
        this._div.css("border", "dashed green 5px");
      } else if (value == 21) {
        this._div.css("border", "solid green 5px");
      } else {
        this._div.css("border", "solid red 5px");
      }
    }
    show(): void {
      this._div.css("display", "flex");
    }
    hide(): void {
      this._div.css("display", "none");
    }
    endPlayerTurn(): void {
      this._handGUI.endPlayerTurn();
      this._actionGUI.reset();
      this.update();
    }
  }

  class DeckGUI {
    static readonly _divClass: string = "deck";
    static readonly _dragObjType: string = "card";
    static readonly _dragProperties: string[] = [
      "width",
      "height",
      "border",
      "backgroundColor",
    ];

    private _div: JQuery<HTMLElement>;
    private _deck: Deck;
    constructor(parent: JQuery<HTMLElement>) {
      this._div = JQueryUtils.createDiv({
        htmlClass: DeckGUI._divClass,
        parent: parent,
      });
      this._deck = new Deck();
      this.setUpEventListeners();
    }
    setContentSuitsValuesMana(
      suits: string[],
      values: string[],
      manaType: CardManaTypes = CardManaTypes.neutral
    ): void {
      this._deck.setContentSuitsValuesMana(suits, values, manaType);
    }
    private setUpEventListeners(): void {
      this._div.on("mousedown", (e) => this.onMouseDown(e.originalEvent));
    }
    onMouseDown(e: MouseEvent): void {
      if (DragAPI.canStartDrag()) {
        if (!ActionPlanBarGUI._finalAll) {
          let left: number = this._div[0].getBoundingClientRect().left - 6;
          let top: number = this._div[0].getBoundingClientRect().top - 52;
          let c: Card = this._deck.draw();
          this.setUpDragObject(left, top, c);
          DragAPI.startDrag(DeckGUI._dragObjType, c.save(), e);
        }
      }
    }
    setUpDragObject(left: number, top: number, card: Card): void {
      let styleSheet = getComputedStyle(this._div[0]);
      let styleNeeded = new Map<string, string>();
      DeckGUI._dragProperties.forEach((e) => {
        styleNeeded.set(DragAPI.dragPropertyToCSS(e), styleSheet[e]);
      });
      styleNeeded.set("left", left + "px");
      styleNeeded.set("top", top + "px");
      styleNeeded.set("display", "block");
      DragAPI.setUpDragObject(
        styleNeeded,
        this.createDragObjectInnerHTML(card)
      );
    }
    createDragObjectInnerHTML(card: Card): string {
      return card.HTMLString;
    }
    show(): void {
      this._div.css("display", "grid");
    }
    hide(): void {
      this._div.css("display", "none");
    }
    endPlayerTurn(): void {
      this.setContentSuitsValuesMana(Deck.suits, Deck.values);
    }
  }

  class DeckHolderGUI {
    static readonly _divClass: string = ".deck_holder";

    private static _currentDeckGUIs: number = 1;
    private static readonly _nrDeckGUIs: number = 3;

    private _deckGUIs: DeckGUI[] = [];
    private _div: JQuery<HTMLElement>;

    constructor(parent: JQuery<HTMLElement>) {
      this._div = JQueryUtils.createDiv({
        htmlClass: "deck_holder",
        parent: parent,
      });
      //set up deck GUI's
      for (let i = 0; i < DeckHolderGUI._nrDeckGUIs; i++) {
        this._deckGUIs.push(new DeckGUI(this._div));
      }
      this._deckGUIs[0].setContentSuitsValuesMana(Deck.suits, Deck.values);
      this.update();
    }
    setUpFight(player: FightPlayer): void {
      DeckHolderGUI._currentDeckGUIs = player.player.nrDecks;
      this.update();
    }
    update(): void {
      this._deckGUIs.forEach((e: DeckGUI, i: number) => {
        i < DeckHolderGUI._currentDeckGUIs ? e.show() : e.hide();
      });
    }
    endPlayerTurn(): void {
      this._deckGUIs.forEach((e: DeckGUI, i: number) => {
        i < DeckHolderGUI._currentDeckGUIs ? e.endPlayerTurn() : null;
      });
    }
  }

  class ActionHolderGUI {
    private static _currentActionGUIs: number = 7;
    private static readonly _nrActionGUIs: number = 7;
    //private static _actionGUIConfig:number[][] = [[], [2], [1, 3], [1, 2, 3], [0, 1, 3, 4], [0, 1, 2, 3, 4], [0, 1, 3, 4, 5, 6], [0, 1, 2, 3, 4, 5, 6]]
    private static _actionGUIs: ActionSpaceGUI[] = [];

    private _div: JQuery<HTMLElement>;

    constructor(parent: JQuery<HTMLElement>) {
      this._div = parent;
      for (let i = 0; i < ActionHolderGUI._nrActionGUIs; i++) {
        ActionHolderGUI._actionGUIs.push(new ActionSpaceGUI(this._div, i));
      }

      this.update();
    }
    static setFinalAll(): void {
      let foundNotFinal: boolean = false;
      ActionHolderGUI._actionGUIs.forEach((e, i) => {
        if (!e.final && i < ActionHolderGUI._currentActionGUIs) {
          ActionPlanBarGUI._finalAll = false;
          foundNotFinal = true;
          return;
        }
      });
      if (!foundNotFinal) {
        ActionPlanBarGUI._finalAll = true;
      }
    }
    setUpFight(player: FightPlayer): void {
      ActionHolderGUI._currentActionGUIs = player.player.nrActions;
      this.update();
    }
    update(): void {
      ActionHolderGUI._actionGUIs.forEach((e: ActionSpaceGUI, i: number) => {
        i >= ActionHolderGUI._currentActionGUIs ? e.hide() : e.show();
      });
    }
    endPlayerTurn(): void {
      ActionHolderGUI._actionGUIs.forEach((e: ActionSpaceGUI, i: number) => {
        if (i < ActionHolderGUI._currentActionGUIs) {
          e.endPlayerTurn();
        }
      });
      ActionHolderGUI.setFinalAll();
    }
  }

  export class ActionPlanBarGUI {
    static readonly _divID: string = "FightScreenActionPlanBar";
    static _finalAll: boolean = false;

    private _div: JQuery<HTMLElement>;
    private _deckHolderGUI: DeckHolderGUI;
    private _actionHolderGUI: ActionHolderGUI;

    constructor(parent: JQuery<HTMLElement>) {
      this._div = JQueryUtils.createDiv({
        htmlID: ActionPlanBarGUI._divID,
        parent: parent,
      });
      this._actionHolderGUI = new ActionHolderGUI(this._div);
      this._deckHolderGUI = new DeckHolderGUI(this._div);
    }
    setUpFight(fightInstance: FightInstance) {
      this._actionHolderGUI.setUpFight(fightInstance.player);
      this._deckHolderGUI.setUpFight(fightInstance.player);
    }
    endPlayerTurn(): void {
      this._deckHolderGUI.endPlayerTurn();
      this._actionHolderGUI.endPlayerTurn();
    }
  }
}
