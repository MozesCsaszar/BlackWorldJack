/// <reference path="../../logic/common.ts" />
/// <reference path="../../logic/action.ts" />
/// <reference path="../../logic/player.ts" />
/// <reference path="../common.ts" />

namespace ActionPlanBarGUIs {
  class CardGUI {
    static readonly _divClass: string = ".card";
    private _card: Card;
    private _div: HTMLElement;
    constructor(div: HTMLElement, card: Card = null) {
      this._card = card;
      this._div = div;
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
        this._div.style.display = "none";
      } else {
        this._div.style.display = "block";
        this._div.innerHTML = this.card.value + "<br>" + this.card.suit;
      }
    }
    reset(): void {
      this._div.textContent = "";
      this._div.hidden = true;
      this._card = null;
    }
    setAsTemp(): void {
      this._div.style.opacity = "0.5";
    }
    setAsPerm(): void {
      this._div.style.opacity = "1";
    }
    setLeft(left: number): void {
      //set the left property of style of the div to allow for stylizing the card display format
      this._div.style.left = left.toString() + "px";
    }
  }

  class HandGUI {
    static readonly _divClass: string = ".card_holder";

    private _cardGUIs: CardGUI[] = [];
    private _div: HTMLElement;
    private _hand: Hand;
    private _tempHand: Hand;
    constructor(super_path: string) {
      let path: string = super_path + ">" + HandGUI._divClass;
      this._div = document.querySelector(path);
      document
        .querySelectorAll(path + ">" + CardGUI._divClass)
        .forEach((e) => this._cardGUIs.push(new CardGUI(e as HTMLElement)));
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
    static readonly _divClass: string = ".action";

    private _div: HTMLElement;
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
    constructor(path: string) {
      this._div = document.querySelector(
        path + ">" + ActionGUI._divClass
      ) as HTMLElement;
      this._action = null;
    }
    update(basedOnTemp = false): void {
      let a: Action.Action = basedOnTemp ? this._tempAction : this._action;
      if (a == null) {
        this._div.innerHTML = "";
      } else {
        this._div.innerHTML = a.name;
      }
    }
    reset(): void {
      this._action = null;
      this._tempAction = null;
    }
  }

  class ActionSpaceGUI {
    static readonly _divClass: string = ".action_card_space";

    private _entered: boolean = false;
    private _actionGUI: ActionGUI;
    private _handGUI: HandGUI;
    private _div: HTMLElement;
    constructor(nr: string) {
      this._handGUI = new HandGUI(ActionSpaceGUI._divClass + "._" + nr);
      this._actionGUI = new ActionGUI(ActionSpaceGUI._divClass + "._" + nr);
      this._div = document.querySelector(
        ActionSpaceGUI._divClass + "._" + nr
      ) as HTMLElement;
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
      let c_obj: ActionSpaceGUI = this;
      c_obj._div.addEventListener("mousedown", (e: MouseEvent) =>
        c_obj.onMouseDown(e, c_obj)
      );
      c_obj._div.addEventListener("mouseenter", (e: MouseEvent) =>
        c_obj.onMouseEnter(e, c_obj)
      );
      c_obj._div.addEventListener("mouseleave", (e: MouseEvent) =>
        c_obj.onMouseLeave(e, c_obj)
      );
      c_obj._div.addEventListener("mouseup", (e: MouseEvent) =>
        c_obj.onMouseUp(e, c_obj)
      );
    }
    onMouseDown(e: MouseEvent, c_obj: ActionSpaceGUI) {
      if (
        e.button == 0 &&
        c_obj._actionGUI.action != null &&
        DragAPI.dragObjectType == null
      ) {
        ActionBarGUIs.ActionBarAreaGridGUI._self.setUpActionPattern(
          c_obj._actionGUI.action.name
        );
      }
    }
    onMouseEnter(e: MouseEvent, c_obj: ActionSpaceGUI) {
      if (
        DragAPI.dragObjectType == DeckGUI._dragObjType &&
        !c_obj._handGUI.busted
      ) {
        c_obj._handGUI.addTempCard(Card.load(DragAPI.dragObjectData));
        c_obj.update();
        DragAPI.enterDragDestinationArea();
      } else if (
        DragAPI.dragObjectType ==
        ActionBarGUIs.ActionListElementGUI._dragObjType
      ) {
        c_obj._actionGUI.tempAction = Action.player_actions.find(
          (action) => action.name == DragAPI.dragObjectData
        );
        DragAPI.enterDragDestinationArea();
      }
    }
    onMouseLeave(e: MouseEvent, c_obj: ActionSpaceGUI) {
      if (
        DragAPI.dragObjectType == DeckGUI._dragObjType &&
        DragAPI.insideDragDestinationArea
      ) {
        c_obj._handGUI.removeTempCard();
        c_obj.update();
        DragAPI.exitDragDestinationArea();
      } else if (
        DragAPI.dragObjectType ==
          ActionBarGUIs.ActionListElementGUI._dragObjType &&
        DragAPI.insideDragDestinationArea
      ) {
        c_obj._actionGUI.removeTemp();
        DragAPI.exitDragDestinationArea();
      }
    }
    onMouseUp(e: MouseEvent, c_obj: ActionSpaceGUI) {
      if (DragAPI.canDropHere(DeckGUI._dragObjType) && !this._handGUI.busted) {
        c_obj._handGUI.finalizeTempCard();
        ActionHolderGUI.setFinalAll();
        c_obj._entered = false;
        DragAPI.endDrag();
      } else if (
        DragAPI.canDropHere(ActionBarGUIs.ActionListElementGUI._dragObjType)
      ) {
        c_obj._actionGUI.finalizeTemp();
        DragAPI.endDrag();
      }
    }
    update(): void {
      this._handGUI.update();
      this._actionGUI.update();
      let value = this._handGUI.tempValue;
      if (value < 14) {
        this._div.style.border = "dashed red 5px";
      } else if (value < 21) {
        this._div.style.border = "dashed green 5px";
      } else if (value == 21) {
        this._div.style.border = "solid green 5px";
      } else {
        this._div.style.border = "solid red 5px";
      }
    }
    show(): void {
      this._div.style.display = "flex";
    }
    hide(): void {
      this._div.style.display = "none";
    }
    endPlayerTurn(): void {
      this._handGUI.endPlayerTurn();
      this._actionGUI.reset();
      this.update();
    }
  }

  class DeckGUI {
    static readonly _divClass: string = ".deck";
    static readonly _dragObjType: string = "card";
    static readonly _dragProperties: string[] = [
      "width",
      "height",
      "border",
      "backgroundColor",
    ];

    private _div: HTMLElement;
    private _deck: Deck;
    constructor(div: HTMLElement) {
      this._div = div;
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
      let c_obj: DeckGUI = this;
      this._div.addEventListener("mousedown", (e: MouseEvent) =>
        c_obj.onMouseDown(e, c_obj)
      );
    }
    onMouseDown(e: MouseEvent, c_obj: DeckGUI): void {
      if (DragAPI.canStartDrag()) {
        if (!ActionPlanBarGUI._finalAll) {
          let left: number = c_obj._div.getBoundingClientRect().left - 6;
          let top: number = c_obj._div.getBoundingClientRect().top - 52;
          let c: Card = c_obj._deck.draw();
          this.setUpDragObject(left, top, c);
          DragAPI.startDrag(DeckGUI._dragObjType, c.save(), e);
        }
      }
    }
    setUpDragObject(left: number, top: number, card: Card): void {
      let styleSheet = getComputedStyle(this._div);
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
      this._div.style.display = "grid";
    }
    hide(): void {
      this._div.style.display = "none";
    }
    endPlayerTurn(): void {
      this.setContentSuitsValuesMana(Deck.suits, Deck.values);
    }
  }

  class DeckHolderGUI {
    static readonly _divClass: string = ".deck_holder";

    private static _currentDeckGUIs: number = 1;
    private _deckGUIs: DeckGUI[] = [];

    constructor() {
      //set up deck GUI's
      document
        .querySelectorAll(
          "#FightScreenActionPlanBar" +
            ">" +
            DeckHolderGUI._divClass +
            ">" +
            DeckGUI._divClass
        )
        .forEach((e: Element) => {
          this._deckGUIs.push(new DeckGUI(e as HTMLElement));
        });
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
    //private static _actionGUIConfig:number[][] = [[], [2], [1, 3], [1, 2, 3], [0, 1, 3, 4], [0, 1, 2, 3, 4], [0, 1, 3, 4, 5, 6], [0, 1, 2, 3, 4, 5, 6]]
    private static _actionGUIs: ActionSpaceGUI[] = [];

    constructor(superDivID: string) {
      //set up deck GUI's
      document
        .querySelectorAll(superDivID + ">" + ActionSpaceGUI._divClass)
        .forEach((e: Element, i: number) => {
          ActionHolderGUI._actionGUIs.push(new ActionSpaceGUI(i.toString()));
        });
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
    static readonly _divID: string = "#FightScreenActionPlanBar";
    static _finalAll: boolean = false;

    private _deckHolderGUI: DeckHolderGUI;
    private _actionHolderGUI: ActionHolderGUI;

    constructor() {
      this._deckHolderGUI = new DeckHolderGUI();
      this._actionHolderGUI = new ActionHolderGUI(ActionPlanBarGUI._divID);
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
