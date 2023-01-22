namespace MathUtil {
    export function getRandomIntBelow(max: number): number {
        return Math.floor(Math.random() * max);
    }
}

enum ManaTypes {
    neutral,
    fire,
    earth,
    water,
    wind
}

class Card {
    static load(s: string): Card {
        let i: number = 0;
        let sep: string = getComputedStyle(document.body).getPropertyValue("--DEF-save-level0-sep");
        let s_a: string[] = s.split(sep);
        let suit: string = s_a[i]; i++;
        let value: string = s_a[i]; i++;
        let manaType: ManaTypes = ManaTypes[s_a[i]]; i++;
        return new Card(suit, value, manaType);
    }

    private _suit: string;
    private _value: string;
    private _manaType: ManaTypes;
    constructor(suit: string, value: string, mana: ManaTypes = ManaTypes.neutral) {
        this._suit = suit;
        this._manaType = mana;
        this._value = value;
    }
    get suit():string {
        return this._suit;
    }
    get value():string {
        return this._value;
    }
    get manaType():ManaTypes {
        return this._manaType;
    }
    get copy():Card {
        return new Card(this._suit, this._value, this._manaType);
    }
    toString(): string {
        return this._value + this._suit;
    }
    save(): string {
        let sep: string = getComputedStyle(document.body).getPropertyValue("--DEF-save-level0-sep");
        return this._suit + sep + this._value + sep + this._manaType;
    }
    load(s: string) {
        let i: number = 0;
        let sep: string = getComputedStyle(document.body).getPropertyValue("--DEF-save-level0-sep");
        let s_a: string[] = s.split(sep);
        this._suit = s_a[i]; i++;
        this._value = s_a[i]; i++;
        this._manaType = ManaTypes[s_a[i]]; i++;
    }
}

class Deck {
    static suits = ['♣', '♦', '♥', '♠'];
    static  values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'J', 'Q', 'K'];
    private _cards: Card[];
    private _nextCard: number;

    constructor() {
        this._cards = [];
    }
    get cards(): Card[] {
        return this._cards;
    }
    reset(): void {
        this._cards = [];
    }
    private afterDeckRepopulation(): void {
        this._nextCard = MathUtil.getRandomIntBelow(this._cards.length);
    }
    private setNextCard(): void {
        /* Set up next card for the drawing with removing the prev. drawn and setting new _nextCard */
        this._cards[this._nextCard] = this._cards[this._cards.length - 1];
        this._cards.pop();
        this._nextCard = MathUtil.getRandomIntBelow(this._cards.length);
    }
    pushAll(cList: Card[]): void {
        cList.forEach(element => {
            this._cards.push(element.copy);
        });
    }
    setContent(oDeck: Deck): void {
        this.reset();
        oDeck.cards.forEach(element => {
            this._cards.push(element.copy);
        });
        this.afterDeckRepopulation();
    }
    setContentSuitsValuesMana(suits: string[], values: string[], manaType: ManaTypes = ManaTypes.neutral): void {
        this.reset();
        suits.forEach(s => {
            values.forEach(v => {
                this._cards.push(new Card(s, v, manaType));
            });
        });
        this.afterDeckRepopulation();
    }
    peek(): Card {
        return this._cards[this._nextCard];
    }
    draw(): Card {
        //Get and remove a card randomly from the deck
        let next: Card = this.cards[this._nextCard];
        this.setNextCard();
        return next;
    }

    toString(): string {
        return this.cards.map(c => c.toString()).reduce((a, s) => a += s + "|", "").slice(0, -1);
    }
    get copy():Deck {
        let d: Deck = new Deck();
        d.pushAll(this._cards.map(c => c.copy).reduce((a, c) =>{a.push(c); return a;}, new Array<Card>()));
        return d;
    }
}

class Hand {
    private _cards: Card[];
    constructor(cards: Card[] = []) {
        this._cards = cards;
    }
    get cards(): Card[] {
        //get current cards
        return this._cards;
    }
    get value(): number {
        //return the numeric value of the hand
        let value: number;
        value = this._cards.map(c => c.value == 'A' ? 11 : (c.value == 'J' || c.value == 'Q' || c.value == 'K' ? 10 : Number(c.value))).reduce((a, n) => a + n, 0);
        let nr_aces: number = this._cards.map(c => c.value == 'A' ? 1 : 0).reduce((a, n) => a + n, 0);
        while(value > 21 && nr_aces > 0) {
            nr_aces -= 1;
            value -= 10;
        }
        return value;
    }
    get length(): number {
        return this._cards.length;
    }
    get busted(): boolean {
        return this.value > 21;
    }
    get final(): boolean {
        return this.value >= 21;
    }

    addCard(card: Card): void {
        //add a new card to the hand; card not copied
        this._cards.push(card);
    }
    popCard(): void {
        this._cards.pop();
    }
}

/*                                      GUI                                                 */

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
        if(this.card == null) {
            this._div.style.display = 'none';
        }
        else {
            this._div.style.display = 'block';
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
    constructor(super_path:string) {
        let path: string = super_path + ">" + HandGUI._divClass;
        this._div = document.querySelector(path);
        document.querySelectorAll(path + ">" + CardGUI._divClass).forEach(e => this._cardGUIs.push(new CardGUI(e as HTMLElement)));
        this._hand = new Hand();
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
    update(): void {
        this._cardGUIs.forEach(e => e.update());
    }
    addCard(card: Card): void {
        this._cardGUIs[this._hand.length].card = card;
        
    }
    addTempCard(card: Card): void {
        //visual and deck changes
        this._cardGUIs[this._hand.length].card = card;
        this._cardGUIs[this._hand.length].setAsTemp();
        this._hand.addCard(card);
    }
    finalizeTempCard(): void {
        //visual changes only
        this._cardGUIs[this._hand.length - 1].setAsPerm();        
    }
    removeTempCard(): void {
        this._cardGUIs[this._hand.length - 1].card = null;
        this._hand.popCard();
    }
    stylizeDeck(): void {
        this._cardGUIs.forEach((e: CardGUI, i: number) => {
            e.setLeft(i * 20.96);
        });
    }
}

class ActionGUI {
    static readonly _divClass: string = ".action_card_space";

    private _entered: boolean = false;
    private _handGUI: HandGUI;
    private _div: HTMLElement;
    constructor(nr: string) {
        this._handGUI = new HandGUI(ActionGUI._divClass + "._" + nr);
        this._div = document.querySelector(ActionGUI._divClass + "._" + nr) as HTMLElement;
        this.setUpEventListeners();
        this.update();
    }
    get busted(): boolean {
        return this._handGUI.busted;
    }
    get final(): boolean {
        return this.busted || this._handGUI.final;
    }
    setUpEventListeners() {
        let c_obj: ActionGUI = this;
        c_obj._div.addEventListener('mouseenter', (e: MouseEvent) => c_obj.onMouseEnter(e, c_obj));
        c_obj._div.addEventListener('mouseleave', (e: MouseEvent) => c_obj.onMouseLeave(e, c_obj));
        c_obj._div.addEventListener('mouseup', (e: MouseEvent) => c_obj.onMouseUp(e, c_obj));
    }
    onMouseEnter(e: MouseEvent, c_obj: ActionGUI) {
        if(FightScreenGUI.dragObjectType == DragCardGUI._dragObjType && ! c_obj._handGUI.busted) {
            c_obj._handGUI.addTempCard(Card.load(FightScreenGUI.dragObjectData));
            c_obj.update();
            c_obj._entered = true;
            FightScreenGUI.enterDragDestinationArea();

        }
    }
    onMouseLeave(e: MouseEvent, c_obj: ActionGUI) {
        if(FightScreenGUI.dragObjectType == DragCardGUI._dragObjType && c_obj._entered) {
            c_obj._handGUI.removeTempCard();
            c_obj.update();
            c_obj._entered = false;
            FightScreenGUI.exitDragDestinationArea();
        }
    }
    onMouseUp(e: MouseEvent, c_obj: ActionGUI) {
        if(FightScreenGUI.dragObjectType == DragCardGUI._dragObjType) {
            c_obj._handGUI.finalizeTempCard();
            ActionHolderGUI.setFinalAll();
            c_obj._entered = false;
            FightScreenGUI.endDrag();
            DeckGUI.resetDragCard();
        }
    }
    update(): void {
        this._handGUI.update();
        let value = this._handGUI.value;
        if(value < 14) {
            this._div.style.border = 'dashed red 5px';
        }
        else if(value < 21) {
            this._div.style.border = 'dashed green 5px';
        }
        else if(value == 21) {
            this._div.style.border = 'solid green 5px';
        }
        else {
            this._div.style.border = 'solid red 5px';
        }
    }
    show(): void {
        this._div.style.display = "flex";
    }
    hide(): void {
        this._div.style.display = "none";
    }
    addCard(card: Card): void {
        this._handGUI.addCard(card);
    }

}

class Player {
    private _nrActions: number = 2;
    private _nrDecks: number = 1;
    get nrActions(): number {
        return this._nrActions;
    } 
    set nrActions(nr: number) {
        this._nrActions = nr;
    }
}

//who implement this need to have the static field
class DraggableGUI {
    static readonly _dragObjType: string;
    moveWithMouse(e: MouseEvent): void {}
    get left(): string { return "" }
    get top(): string { return "" }
}

class DragCardGUI extends DraggableGUI {
    static readonly _divID: string = "#FSActionPlanBarDragCard";
    static readonly _dragObjType: string = 'card';
    private _card: Card;
    private _div: HTMLElement;
    constructor(div: HTMLElement, card: Card = null) {
        super();
        this._card = card;
        this._div = div;
    }
    get card(): Card {
        return this._card;
    }
    set card(card: Card) {
        this._card = card;
        this.initialUpdate();
    }
    get left(): string {
        return this._div.style.left;
    }
    get top(): string {
        return this._div.style.top;
    }
    initialUpdate(): void {
        if(this.card == null) {
            this._div.style.display = 'none';
        }
        else {
            this._div.style.display = 'block';
            this._div.innerHTML = this.card.value + "<br>" + this.card.suit;
        }
        
    }
    setPosition(x: number, y: number, adjust_y: boolean = true): void {
        let width: number = Number(getComputedStyle(this._div).getPropertyValue("--FSAPB-card-width").slice(0, -2));
        let height: number = Number(getComputedStyle(this._div).getPropertyValue("--FSAPB-card-height").slice(0, -2));
        this._div.style.left = (x ).toString() + "px";
        if(adjust_y) {
            this._div.style.top = (y - height/2).toString() + "px";
        }
        else {
            this._div.style.top = (y).toString() + "px";
        }
        
    }
    setOpacity(op: number): void {
        this._div.style.opacity = op.toString();
    }
    reset(): void {
        this._div.textContent = "";
        this.card = null;
    }
    moveWithMouse(e: MouseEvent): void {
        this._div.style.left = (e.pageX - FightScreenGUI.dragOffsetX).toString() + "px";
        this._div.style.top = (e.pageY - FightScreenGUI.dragOffsetY).toString() + "px";
    }
}

class DeckGUI {
    static readonly _divClass: string = ".deck";
    private static _dragCardGUI: DragCardGUI = new DragCardGUI(document.getElementById('FSActionPlanBarDragCard'));

    static resetDragCard(): void {
        DeckGUI._dragCardGUI.reset();
    }

    private _div: HTMLElement;
    private _deck: Deck;
    constructor(div: HTMLElement) {
        this._div = div;
        this._deck = new Deck();
        this.setUpEventListeners();
    }
    setContentSuitsValuesMana(suits: string[], values: string[], manaType: ManaTypes = ManaTypes.neutral): void {
        this._deck.setContentSuitsValuesMana(suits, values, manaType);
    }
    setUpEventListeners(): void {
        let c_obj: DeckGUI = this;
        this._div.addEventListener("mousedown", (e: MouseEvent) => c_obj.onMouseDown(e, c_obj));
    }
    onMouseDown(e: MouseEvent, c_obj: DeckGUI): void {
        if(!FightScreenActionPlanBarGUI._finalAll) {
            let c: Card = c_obj._deck.draw();
            DeckGUI._dragCardGUI.card = c;
            let left: number = c_obj._div.getBoundingClientRect().left - 12 ;
            let top: number = c_obj._div.getBoundingClientRect().top + 4;
            DeckGUI._dragCardGUI.setPosition(left, top);
            FightScreenGUI.startDrag(DragCardGUI._dragObjType, DeckGUI._dragCardGUI, DeckGUI._dragCardGUI.card.save(), e);
        }
    }
    show(): void {
        this._div.style.display = 'grid';
    }
    hide(): void {
        this._div.style.display = 'none';
    }
}

class DeckHolderGUI {
    static readonly _divClass: string = ".deck_holder";

    private  _currentDeckGUIs: number = 1;
    private _deckGUIs: DeckGUI[] = [];

    constructor() {
        //set up deck GUI's
        document.querySelectorAll('#FightScreenActionPlanBar' + '>' + DeckHolderGUI._divClass + '>' + DeckGUI._divClass).forEach(
            (e: Element) => {this._deckGUIs.push(new DeckGUI(e as HTMLElement));}
        );
        this._deckGUIs[0].setContentSuitsValuesMana(Deck.suits, Deck.values);
        this.update();
    }
    update(): void {
        this._deckGUIs.forEach(
            (e:DeckGUI, i:number) => {i < this._currentDeckGUIs ? e.show() : e.hide();}
        );
    }
}

class ActionHolderGUI {

    private static _currentActionGUIs: number = 2;
    private static _actionGUIs: ActionGUI[] = [];

    constructor(superDivID: string) {
        //set up deck GUI's
        document.querySelectorAll(superDivID + '>' + ActionGUI._divClass).forEach(
            (e: Element, i: number) => {ActionHolderGUI._actionGUIs.push(new ActionGUI(i.toString()));}
        );
        this.update();
    }
    static setFinalAll(): void {
        let foundNotFinal: boolean = false;
        ActionHolderGUI._actionGUIs.forEach((e, i) => {
            if(!e.final && i < ActionHolderGUI._currentActionGUIs) {
                FightScreenActionPlanBarGUI._finalAll = false;
                foundNotFinal = true;
                return;
            }
        });
        if(!foundNotFinal) {
            FightScreenActionPlanBarGUI._finalAll = true;
        }
    }
    update(): void {
        ActionHolderGUI._actionGUIs.forEach(
            (e:ActionGUI, i:number) => {i < ActionHolderGUI._currentActionGUIs ? e.show() : e.hide();}
        );
    }
}

class FightScreenActionPlanBarGUI {
    static readonly _divID: string = '#FightScreenActionPlanBar';
    static _finalAll: boolean = false;

    private _currentActionGUIs: number = 0;
    private _deckHolderGUI: DeckHolderGUI;
    private _actionHolderGUI: ActionHolderGUI;

    constructor() {
        this._deckHolderGUI = new DeckHolderGUI();
        this._actionHolderGUI = new ActionHolderGUI(FightScreenActionPlanBarGUI._divID);
    }
}

class FightScreenGUI {
    static readonly _divID: string = "FightScreen";
    private static _dragging: boolean = false;
    private static _releasableDrag: boolean = null;
    private static _insideDragDestArea: boolean = null;
    private static _dragObjType: string = null;
    private static _dragObj: DraggableGUI = null;
    private static _dragOffsetX: number;
    private static _dragOffsetY: number;

    static get dragging(): boolean {
        return this._dragging;
    }
    static get dragObjectType(): string {
        return this._dragObjType;
    }
    static get dragObjectData(): string {
        return this._dragging ? window.sessionStorage.getItem(this._dragObjType) : null;
    }
    static get insideDragDestinationArea(): boolean {
        return this._insideDragDestArea;
    }
    static get dragOffsetX(): number {
        return this._dragging ? this._dragOffsetX : null;
    }
    static get dragOffsetY(): number {
        return this._dragging ? this._dragOffsetY : null;
    }
    static startDrag(dragObjectType: string, dragObject: DraggableGUI, dragObjectData: string, e: MouseEvent | DragEvent, releasableDrag: boolean = false): void {
        if(this._dragging == false) {
            this._dragging = true;
            this._releasableDrag = releasableDrag;
            this._insideDragDestArea = false;
            this._dragObjType = dragObjectType;
            this._dragObj = dragObject;
            window.sessionStorage.setItem(dragObjectType, dragObjectData);
            let leftObj: number = Number(dragObject.left.slice(0, -2));
            let topObj: number = Number(dragObject.top.slice(0, -2));
            this._dragOffsetX = e.pageX - leftObj;
            this._dragOffsetY = e.pageY - topObj;
        }
    }
    static enterDragDestinationArea(): void {
        if(this.dragging) {
            this._insideDragDestArea = true;
        }
    }
    static exitDragDestinationArea(): void {
        if(this.dragging) {
            this._insideDragDestArea = false;
        }
    }
    static endDrag(): void {
        if(this.dragging) {
            window.sessionStorage.removeItem(this._dragObjType);
            this._dragging = false;
            this._releasableDrag = null;
            this._insideDragDestArea = null;
            this._dragObjType = null;
            this._dragObj = null;
        }
    }


    private _div: HTMLElement;

    constructor() {
        this._div = document.getElementById(FightScreenGUI._divID);
        this.setUpEventListeners();
    }
    setUpEventListeners(): void {
        let c_obj: FightScreenGUI = this;
        this._div.addEventListener('mousemove', (e: MouseEvent) => c_obj.onMouseMove(e, c_obj))
    }
    private onMouseMove(e: MouseEvent, c_obj: FightScreenGUI): void {
        if(FightScreenGUI.dragging) {
            FightScreenGUI._dragObj.moveWithMouse(e);
        }
    }
}

let fSAPBGUI: FightScreenActionPlanBarGUI = new FightScreenActionPlanBarGUI();

let FSGUI: FightScreenGUI = new FightScreenGUI();