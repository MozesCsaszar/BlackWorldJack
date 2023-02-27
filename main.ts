/*                                      Util Namespaces */

namespace MathUtil {
    export function getRandomIntBelow(max: number): number {
        return Math.floor(Math.random() * max);
    }
}
namespace StringUtil {
    export function padRightUntilLength(str: string, length: number, char: string): string {
        while (str.length < length) {
            str = char + str;
        }
        return str;
    }
}

/*                                      Storage namespaces */

class ElementalAttributes {
    fire: Number;
    water: Number;
    earth: Number;
    wind: Number;
    physical: Number;

    constructor(physical: Number = 0, fire: Number = 0, water: Number = 0, earth: Number = 0, wind: Number = 0) {
        this.physical = physical;
        this.fire = fire;
        this.water = water;
        this.earth = earth;
        this.wind = wind;
    }

    copy() {
        return new ElementalAttributes(this.physical, this.fire, this.water, this.earth, this.water);
    }
}

namespace Enemy {
    enum Modifier {

    }

    class Scaling {
        copy(): Scaling {
            return new Scaling();
        }
    }

    class EnemyStats {
        private _health: Number;
        private _defense: ElementalAttributes;
        private _attack: ElementalAttributes;
        private _resistance: ElementalAttributes;

        constructor(health: Number, defense: ElementalAttributes,  attack: ElementalAttributes, resistance: ElementalAttributes) {
            this._health = health;
            this._defense = defense;
            this._attack = attack;
            this._resistance = resistance;
        }

        copy(): EnemyStats {
            return new EnemyStats(this._health, this._defense.copy(), this._attack.copy(), this._resistance.copy());
        }
    }

    class EnemyBody {
        private _attributes: EnemyStats;
        private _modifiers: Modifier[] = [];

        constructor(attributes: EnemyStats, modifiers: Modifier[]) {
            this._attributes = attributes.copy();
            modifiers.forEach( e => this._modifiers.push(e) );
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

    export class EnemyWithLevel {
        private _body: EnemyBody;
        //private _elitenessModifiers: EnemyBody[] = [];
        private _level: number;
        private _info: EnemyInfo;
        constructor(body: EnemyBody, level: number) {
            this._body = body.copy(); 
            this._level = level;
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
        copy(): EnemyWithLevel {
            let e: EnemyWithLevel = new EnemyWithLevel(this._body.copy(), this._level);
            return e;
        }
        setEnemyInfo(info: EnemyInfo) {
            this._info = info;
        }
    }
    
    export class Enemy {
        static copy(enemy: Enemy) {
            return enemy.copy();
        }
        private _name: string;
        private _desc: string;

        private _levels: Map<number, EnemyWithLevel> = new Map<number, EnemyWithLevel>();
        private _scaling: Scaling;
    
        constructor(name: string, desc: string, levels: Map<number, EnemyWithLevel>, scaling: Scaling = undefined) {
            this._name = name;
            this._desc = desc;
            levels.forEach( (e, k) => { e.setEnemyInfo(this.getInfo()); this._levels.set(k, e.copy()); } );
            this._scaling = scaling == undefined ? undefined : scaling.copy();
        }
        copy(): Enemy {
            let e: Enemy = new Enemy(this._name, this._desc, this._levels, this._scaling == undefined ? undefined : this._scaling.copy());
            return e;
        }
        getEnemyWithLevel(level: number): EnemyWithLevel {
            if(level >= 1) {
                if(this._levels.get(level) != undefined) {
                    return this._levels.get(level).copy();
                }
                /*Cases:
                    I:      There is an enemy with lower level and scaling     -> Scale enemy from lower level
                    II:     There is an enemy with higher level and no scaling -> Get enemy from higher level
                    III:    There is no enemy with higher level and no scaling -> Throw error
                */
                let tempLevels: number[] = [];
                for(const level of this._levels.keys()) {
                        tempLevels.push(level);
                }
                tempLevels = tempLevels.sort();
                if(this._scaling != undefined) {
                    console.log("SCALED");
                    return this._levels.get(0).copy();
                }
                else {
                    let higher: number = undefined;
                    tempLevels.forEach(
                        e => {
                            if(e > level) {
                                if(higher == undefined) {
                                    higher = e;
                                }
                            }
                        }
                    );
                    if(higher == undefined) {
                        throw "ERROR: No higher level enemy to initialize this one!";
                    }
                    else {
                        return this._levels.get(higher).copy();
                    }
                }
            }
            else {
                throw "ERROR: Cannot copy Enemy with level < 1";
            }
        }
        getInfo(): EnemyInfo {
            return new EnemyInfo(this._name, this._desc);
        }
    }

    export let enemies = {
        'Goblin': new Enemy('Goblin', 'Stinky and foul looking, these creatures are not the bestest fighters.', new Map<number, EnemyWithLevel>(
            [
                [1, new EnemyWithLevel(new EnemyBody(new EnemyStats(10, new ElementalAttributes(), new ElementalAttributes(3), new ElementalAttributes()), []), 1)]
            ])),
        
    };
}

/*                                      Underlying Classes */


enum CardManaTypes {
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
        let manaType: CardManaTypes = CardManaTypes[s_a[i]]; i++;
        return new Card(suit, value, manaType);
    }

    private _suit: string;
    private _value: string;
    private _manaType: CardManaTypes;
    constructor(suit: string, value: string, mana: CardManaTypes = CardManaTypes.neutral) {
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
    get manaType():CardManaTypes {
        return this._manaType;
    }
    get copy():Card {
        return new Card(this._suit, this._value, this._manaType);
    }
    get HTMLString(): string {
        return this._value + "<br>" + this._suit;
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
        this._manaType = CardManaTypes[s_a[i]]; i++;
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
    setContentSuitsValuesMana(suits: string[], values: string[], manaType: CardManaTypes = CardManaTypes.neutral): void {
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

    get(i: number): Card {
        if (i >= this._cards.length) {
            return null;
        }
        return this._cards[i];
    }
    addCard(card: Card): void {
        //add a new card to the hand; card not copied
        if(card != null) {
            this._cards.push(card);
        }
    }
    popCard(): void {
        this._cards.pop();
    }
    reset() {
        this._cards = [];
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

class Action {
    static load(save: string): Action {
        let a: Action = new Action('');
        a.load(save);
        return a;
    }

    private _name: string;
    constructor(name: string) {
        this._name = name;
    }
    get name() {
        return this._name;
    }
    save(): string {
        return this._name;
    }
    load(save: string): void {
        let i: number = 0;
        let s_list = save.split("\\e\\");
        this._name = s_list[i]; i++;
    }
}

class FightInstance {
    private _enemies: Enemy.EnemyWithLevel[] = [];

    get enemies(): readonly Enemy.EnemyWithLevel[] {
        return this._enemies;
    }

    addEnemy(e: Enemy.EnemyWithLevel) {
        this._enemies.push(e);
    }
}

class Fight {
    private _enemies: string[] = [];

    constructor(enemyNames: string[]) {
        enemyNames.forEach(e => this._enemies.push(e));
    }
    createFightInstance(level: number): FightInstance {
        let fightInstance = new FightInstance();
        this._enemies.forEach(
            e => fightInstance.addEnemy(GameController.getEnemyByName(e).getEnemyWithLevel(level))
        )
        return fightInstance;
    }
}

/*                                      GUI                                                 */

class DraggableGUI {
    static readonly _dragObjType: string;
    moveWithMouse(e: MouseEvent): void {}
    get left(): string { return "" }
    get top(): string { return "" }
}

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
        private _tempHand: Hand;
        constructor(super_path:string) {
            let path: string = super_path + ">" + HandGUI._divClass;
            this._div = document.querySelector(path);
            document.querySelectorAll(path + ">" + CardGUI._divClass).forEach(e => this._cardGUIs.push(new CardGUI(e as HTMLElement)));
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
            this._cardGUIs.forEach((e, i) => e.card = this._tempHand.get(i));
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
        resetFightRound(): void {
            this._hand.reset();
            this._tempHand.reset();
            this.update();
        }
    }

    class ActionGUI {
        static readonly _divClass: string = ".action";

        private _div: HTMLElement;
        private _action: Action = null;
        private _tempAction: Action = null;
        get action(): Action {
            return this._action;
        }
        set action(action: Action) {
            this._action = action;
            this.update();
        }
        set tempAction(action: Action) {
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
            this._div = document.querySelector(path + ">" + ActionGUI._divClass) as HTMLElement;
            this._action = null;
        }
        update(basedOnTemp = false): void {
            let a: Action = basedOnTemp ? this._tempAction : this._action;
            if(a == null) {
                this._div.innerHTML = "";
            }
            else {
                this._div.innerHTML = a.name;
            }
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
            this._div = document.querySelector(ActionSpaceGUI._divClass + "._" + nr) as HTMLElement;
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
            let c_obj: ActionSpaceGUI = this;
            c_obj._div.addEventListener('mouseenter', (e: MouseEvent) => c_obj.onMouseEnter(e, c_obj));
            c_obj._div.addEventListener('mouseleave', (e: MouseEvent) => c_obj.onMouseLeave(e, c_obj));
            c_obj._div.addEventListener('mouseup', (e: MouseEvent) => c_obj.onMouseUp(e, c_obj));
        }
        onMouseEnter(e: MouseEvent, c_obj: ActionSpaceGUI) {
            if(DragAPI.dragObjectType == DeckGUI._dragObjType && ! c_obj._handGUI.busted) {
                c_obj._handGUI.addTempCard(Card.load(DragAPI.dragObjectData));
                c_obj.update();
                DragAPI.enterDragDestinationArea();
            }
            else if(DragAPI.dragObjectType == ActionBarGUIs.ActionListElementGUI._dragObjType) {
                c_obj._actionGUI.tempAction = Action.load(DragAPI.dragObjectData);
                DragAPI.enterDragDestinationArea();
            }
            
        }
        onMouseLeave(e: MouseEvent, c_obj: ActionSpaceGUI) {
            if(DragAPI.dragObjectType == DeckGUI._dragObjType && DragAPI.insideDragDestinationArea) {
                c_obj._handGUI.removeTempCard();
                c_obj.update();
                DragAPI.exitDragDestinationArea();
            }
            else if(DragAPI.dragObjectType == ActionBarGUIs.ActionListElementGUI._dragObjType  && DragAPI.insideDragDestinationArea) {
                c_obj._actionGUI.removeTemp();
                DragAPI.exitDragDestinationArea();
            }
            
        }
        onMouseUp(e: MouseEvent, c_obj: ActionSpaceGUI) {
            if(DragAPI.canDropHere(DeckGUI._dragObjType) && !this._handGUI.busted) {
                c_obj._handGUI.finalizeTempCard();
                ActionHolderGUI.setFinalAll();
                c_obj._entered = false;
                DragAPI.endDrag();
            }
            else if(DragAPI.canDropHere(ActionBarGUIs.ActionListElementGUI._dragObjType)) {
                c_obj._actionGUI.finalizeTemp();
                DragAPI.endDrag();
            }
        }
        update(): void {
            this._handGUI.update();
            this._actionGUI.update();
            let value = this._handGUI.tempValue;
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
        resetFightRound(): void {
            this._handGUI.resetFightRound();
            this.update();
        }
    }
    
    class DeckGUI {
        static readonly _divClass: string = ".deck";
        static readonly _dragObjType: string = 'card';
        static readonly _dragProperties: string[] = ['width', 'height', 'border', 'backgroundColor'];    
    
        private _div: HTMLElement;
        private _deck: Deck;
        constructor(div: HTMLElement) {
            this._div = div;
            this._deck = new Deck();
            this.setUpEventListeners();
        }
        setContentSuitsValuesMana(suits: string[], values: string[], manaType: CardManaTypes = CardManaTypes.neutral): void {
            this._deck.setContentSuitsValuesMana(suits, values, manaType);
        }
        setUpEventListeners(): void {
            let c_obj: DeckGUI = this;
            this._div.addEventListener("mousedown", (e: MouseEvent) => c_obj.onMouseDown(e, c_obj));
        }
        onMouseDown(e: MouseEvent, c_obj: DeckGUI): void {
            if(DragAPI.canStartDrag()) {
                if(!ActionPlanBarGUI._finalAll) {
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
            DeckGUI._dragProperties.forEach(
                (e) => {styleNeeded.set(DragAPI.dragPropertyToCSS(e), styleSheet[e])}
            )
            styleNeeded.set('left', left + "px");
            styleNeeded.set('top', top + "px");
            styleNeeded.set('display', 'block');
            DragAPI.setUpDragObject(styleNeeded, this.createDragObjectInnerHTML(card));
        }
        createDragObjectInnerHTML(card: Card): string {
            return card.HTMLString;
        }
        show(): void {
            this._div.style.display = 'grid';
        }
        hide(): void {
            this._div.style.display = 'none';
        }
        resetFightRound(): void {
            this.setContentSuitsValuesMana(Deck.suits, Deck.values);
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
        resetFightRound(): void {
            this._deckGUIs.forEach(
                (e:DeckGUI, i:number) => {i < this._currentDeckGUIs ? e.resetFightRound() : null;}
            );
        }
    }
    
    class ActionHolderGUI {
    
        private static _currentActionGUIs: number = 7;
        private static _actionGUIs: ActionSpaceGUI[] = [];
    
        constructor(superDivID: string) {
            //set up deck GUI's
            document.querySelectorAll(superDivID + '>' + ActionSpaceGUI._divClass).forEach(
                (e: Element, i: number) => {ActionHolderGUI._actionGUIs.push(new ActionSpaceGUI(i.toString()));}
            );
            this.update();
        }
        static setFinalAll(): void {
            let foundNotFinal: boolean = false;
            ActionHolderGUI._actionGUIs.forEach((e, i) => {
                if(!e.final && i < ActionHolderGUI._currentActionGUIs) {
                    ActionPlanBarGUI._finalAll = false;
                    foundNotFinal = true;
                    return;
                }
            });
            if(!foundNotFinal) {
                ActionPlanBarGUI._finalAll = true;
            }
        }
        update(): void {
            ActionHolderGUI._actionGUIs.forEach(
                (e:ActionSpaceGUI, i:number) => {i < ActionHolderGUI._currentActionGUIs ? e.show() : e.hide();}
            );
        }
        resetFightRound(): void {
            ActionHolderGUI._actionGUIs.forEach(
                (e:ActionSpaceGUI, i:number) => {
                    if(i < ActionHolderGUI._currentActionGUIs) { e.resetFightRound(); };
                }
            );
            ActionHolderGUI.setFinalAll();
        }
    }
    
    export class ActionPlanBarGUI {
        
        static readonly _divID: string = '#FightScreenActionPlanBar';
        static _finalAll: boolean = false;
    
        private _deckHolderGUI: DeckHolderGUI;
        private _actionHolderGUI: ActionHolderGUI;
    
        constructor() {
            this._deckHolderGUI = new DeckHolderGUI();
            this._actionHolderGUI = new ActionHolderGUI(ActionPlanBarGUI._divID);
        }
        resetFightRound():void  {
            this._deckHolderGUI.resetFightRound();
            this._actionHolderGUI.resetFightRound();
        }
    }
}

namespace ActionBarGUIs {
    class AreaGridCellGUI {
        static readonly _divClass: string = ".cell";
        static get classFullPath(): string {
            return AreaGridRowGUI.classFullPath + ">" + this._divClass;
        }

        private _div: HTMLElement;
        constructor(div: HTMLElement) {
            this._div = div;
            this.setUpEventListeners();
        }
        setUpEventListeners() {
            let c_obj: AreaGridCellGUI = this;
            this._div.addEventListener('mouseenter', (e: MouseEvent) => c_obj.onMouseEnter(e, c_obj));
            this._div.addEventListener('mouseleave', (e: MouseEvent) => c_obj.onMouseLeave(e, c_obj));
        }
        onMouseEnter(e: MouseEvent, c_obj: AreaGridCellGUI) {
            if(!DragAPI.dragging) {
                c_obj._div.style.backgroundColor = 'rgb(0,0,255)';
            }
        }
        onMouseLeave(e: MouseEvent, c_obj: AreaGridCellGUI) {
            if(!DragAPI.dragging) {
                c_obj._div.style.backgroundColor = 'rgb(0,0,0)';
            }
        }
    }
    
    class AreaGridRowGUI {
        static readonly _divClass: string = ".row";
        private static readonly _rowOffset: number = 28;
        static get classFullPath(): string {
            return ActionBarAreaGridGUI.fullPath + ">" + this._divClass;
        }
    
        private _div: HTMLElement;
        private _cellGUIs: AreaGridCellGUI[] = [];
        constructor(div: HTMLElement, nr: number, offsetInd: number) {
            this._div = div;
            this._div.style.left = (offsetInd * AreaGridRowGUI._rowOffset).toString() + "px";
            document.querySelectorAll(AreaGridRowGUI.classFullPath + "._" + nr + ">" + AreaGridCellGUI._divClass).forEach(
                (e) => this._cellGUIs.push(new AreaGridCellGUI(e as HTMLElement))
            );
        }
    }
    
    class ActionBarAreaGridGUI {
        static readonly _divID: string = "FSActionBarAreaGrid";
        private static _nrInstances: number = 0;
    
        static get fullPath(): string {
            return ActionBarGUI.fullPath + ">#" + this._divID;
        }
    
        private _div: HTMLElement;
        private _rowGUIs: AreaGridRowGUI[] = [];
        constructor() {
            if(ActionBarAreaGridGUI._nrInstances > 0) {
                throw "ActionBarAreaGridGUI already has an instance running!";
            }
            ActionBarAreaGridGUI._nrInstances += 1;
            this._div = document.getElementById(ActionBarAreaGridGUI._divID);
            document.querySelectorAll(AreaGridRowGUI.classFullPath).forEach(
                (e, i, l) => {this._rowGUIs.push(new AreaGridRowGUI(e as HTMLElement, i, l.length - i - 1))}
            )
        }
    }

    export class ActionListElementGUI {
        static readonly _elementClass: string = ".action_list_element";
        static readonly _dragObjType: string = "action";
        static readonly _dragProperties: string[] = ['width', 'height', 'border', 'backgroundColor', 'display'];
        private _action: Action;
        private _div: HTMLElement;
        get action(): Action {
            return this._action;
        }
        set action(a: Action) {
            this._action = a;
            this.display();
        }
        constructor(div: HTMLElement) {
            this._div = div;
            this.setUpEventListeners();
        }
        setUpEventListeners() {
            let c_obj: ActionListElementGUI = this;
            this._div.addEventListener('mousedown', (e: MouseEvent) => c_obj.onMouseDown(e, c_obj));
        }
        display(): void {
            this._div.innerHTML = this.repr();
        }
        repr(): string {
            return this._action != null ? this._action.name : "";
        }
        setHeight(height: number) {
            this._div.style.height = (height - 2 * Number(getComputedStyle(this._div).borderWidth.slice(0, -2))) + "px";
        }
        onMouseDown(e: MouseEvent, c_obj: ActionListElementGUI): void {
            if(!DragAPI.dragging && c_obj.action != null) {
                let left: number = c_obj._div.getBoundingClientRect().left - 8;
                let top: number = c_obj._div.getBoundingClientRect().top - 52;
                c_obj.setUpDragObject(left, top);
                DragAPI.startDrag(ActionListElementGUI._dragObjType, c_obj.action.save(), e);
            }
        }
        setUpDragObject(left: number, top: number): void {
            let styleSheet = getComputedStyle(this._div);
            let styleNeeded = new Map<string, string>();
            ActionListElementGUI._dragProperties.forEach(
                (e) => {styleNeeded.set(DragAPI.dragPropertyToCSS(e), styleSheet[e])}
            )
            styleNeeded.set('left', left + "px");
            styleNeeded.set('top', top + "px");
            DragAPI.setUpDragObject(styleNeeded, this.createDragObjectInnerHTML());
        }
        createDragObjectInnerHTML(): string {
            return this._action.name;
        }
    }
    
    class ActionListGUI {
        private _listElements: ActionListElementGUI[] = [];
        private _elements: Action[] = [];
        private _currentPage: number;
        private _div: HTMLElement;
    
    
        constructor(div: HTMLElement, elementsPerPage: number) {
            this._div = div;
            this.elementsPerPage = elementsPerPage;
            this._currentPage = 0;
        }
        set elementsPerPage(nr: number) {
            if(nr != this._listElements.length) {
                while(this._listElements.length < nr) {
                    let newDiv: HTMLElement = document.createElement('div') as HTMLElement;
                    newDiv.classList.add(ActionListElementGUI._elementClass.slice(1));
                    this._div.appendChild(newDiv);
                    this._listElements.push(new ActionListElementGUI(newDiv));
                }
                while(this._listElements.length > nr) {
                    this._listElements.pop();
                }
                let height: number = this._div.clientHeight / this._listElements.length;
                this._listElements.forEach(
                    (e) => (e.setHeight(height))
                );
                this.update();
            }
        }
        get elementsPerPage() {
            return this._listElements.length;
        }
        get currentPage() {
            return this._currentPage;
        }
        get nrPages() {
            return Math.ceil(this._elements.length / this.elementsPerPage);
        }
        nextPage(): void {
            if(this.currentPage < this.nrPages) {
                this._currentPage++;
            }
        }
        getElementOnCurrentPage(i: number): Action {
            let ind: number = this._currentPage * this._listElements.length + i;
            if(i > this.elementsPerPage || ind >= this._elements.length) {
                throw "ListGUI ERROR: Element requested not in list!";
            }
            return this._elements[ind];
        }
        addToEnd(elem: Action): void {
            this._elements.push(elem);
        }
        update() {
            let offsetInd = this._currentPage * this.elementsPerPage;
            this._listElements.forEach(
                (e, i) => {
                    i + offsetInd < this._elements.length ? e.action = this._elements[i + offsetInd] : e.action = null;
                }
            )
        }
    }
    
    export class ActionBarGUI {
        static readonly _divID: string = "FightScreenActionBar";
        private static readonly _nrElementsPerList: number = 10;
        private static readonly _spellListID: string = "FSActionBarSpellActions";
        private static readonly _otherListID: string = "FSActionBarOtherActions";
        private static _nrInstances: number = 0;
    
        static get fullPath(): string {
            return FightScreenGUI.fullPath + ">#" + this._divID;
        }
    
        private _div: HTMLElement;
        private _spellActionList: ActionListGUI;
        private _otherActionList: ActionListGUI;
        private _areaGridGUI: ActionBarAreaGridGUI;
        constructor() {
            if(ActionBarGUI._nrInstances > 0) {
                throw "InfoBarGUI already has an instance running!";
            }
            ActionBarGUI._nrInstances += 1;
            this._div = document.getElementById(ActionBarGUI._divID);

            this._spellActionList = new ActionListGUI(document.getElementById(ActionBarGUI._spellListID) as HTMLElement, ActionBarGUI._nrElementsPerList);
            this._areaGridGUI = new ActionBarAreaGridGUI();
            this._otherActionList = new ActionListGUI(document.getElementById(ActionBarGUI._otherListID) as HTMLElement, ActionBarGUI._nrElementsPerList);
            this._otherActionList.addToEnd(new Action('A'));
            this._otherActionList.addToEnd(new Action('B'));
            this._otherActionList.addToEnd(new Action('C'));
            
            this.update();
        }
        update(): void {
            this._spellActionList.update();
            this._otherActionList.update();
        }
    }
}

namespace InfoBarGUIs {
    class InfoBarStatusBarsGUI {
    
        static readonly _divID: string = "FSInfoBarStatusBars";
        private static _nrInstances: number = 0;
    
        private _div: HTMLElement;
        constructor() {
            if(InfoBarStatusBarsGUI._nrInstances > 0) {
                throw "InfoBarStatusBarsGUI already has an instance running!";
            }
            InfoBarStatusBarsGUI._nrInstances += 1;
            this._div = document.getElementById(InfoBarStatusBarsGUI._divID);
        }
        resetFightRound() {
        
        }
    }
    
    class EnemyGridGUI {
        static readonly _divClass: string = ".enemy_cell";
    
        private static _divDisplay: string = null;
    
        private _div: HTMLElement;
        private _enemy: Enemy.EnemyWithLevel;
        private _number: HTMLElement;
        private _name: HTMLElement;
        private _desc: HTMLElement;
        private _mods: HTMLElement;
        private _symbol: string;
        constructor(div: HTMLElement, symbol: string) {
            this._div = div;
            if(EnemyGridGUI._divDisplay == null) {
                EnemyGridGUI._divDisplay = this._div.style.display;
            }
            this._number = this._div.childNodes[1].childNodes[1] as HTMLElement;
            this._number.innerHTML = symbol;
            this._name = this._div.childNodes[1].childNodes[3] as HTMLElement;
            this._desc = this._div.childNodes[3] as HTMLElement;
            this._mods = this._div.childNodes[5] as HTMLElement;
            this._symbol = symbol;
        }
        setEnemy(enemy: Enemy.EnemyWithLevel) {
            this._enemy = enemy;
            if(enemy == undefined) {
                this.hide();
            }
            else {
                this.show();
            }
        }
        show() {
            this.update();
            this._div.style.display = EnemyGridGUI._divDisplay;
        }
        hide() {
            this.update();
            this._div.style.display = 'none';
        }
        update() {
            if(this._enemy == undefined) {
                this._name.innerHTML = "";
                this._desc.innerHTML = "";
                this._mods.innerHTML = "";
            }
            else {
                this._name.innerHTML = this._enemy.name;
                this._desc.innerHTML = this._enemy.desc;
                this._mods.innerHTML = "";
            }
        }
    }
    
    class TimerGridStopPlanningGUI {
        static readonly _divClass: string = ".end_planning";
        static get classFullPath(): string {
            return EnemyGridTimerGridGUI.fullPath + ">" + this._divClass;
        }
        private _div: HTMLElement;
        constructor(div: HTMLElement) {
            this._div = div;
            this.setUpEventListeners();
        }
        setUpEventListeners() {
            let c_obj: TimerGridStopPlanningGUI = this;
            c_obj._div.addEventListener('mousedown', (e: MouseEvent) => this.onMouseDown(e, c_obj));
        }
        onMouseDown(e: MouseEvent, c_obj: TimerGridStopPlanningGUI) {
            FightScreenGUI.resetFightRound();
        }
    }
    
    class TimerGridTimerGUI {
        static readonly _divClass: string = ".timer";
    
        private _timer: number;
        private _timerIntervalID: number = null;
        static get fullPath(): string {
            return EnemyGridTimerGridGUI.fullPath + ">" + this._divClass;
        }
    
        private _div: HTMLElement;
        constructor() {
            this._div = document.querySelector(TimerGridTimerGUI.fullPath) as HTMLElement;
        }
        setTime(sep: string = ":") {
            let time: number = this._timer;
            let msec: string = (time % 1000).toString();
            msec = StringUtil.padRightUntilLength(msec, 3, '0');
            time = Math.floor(time / 1000)
            let sec: string = (time % 60).toString();
            sec = StringUtil.padRightUntilLength(sec, 2, '0');
            time = Math.floor(time / 60);
            let min: string = (time % 60).toString();
            min = StringUtil.padRightUntilLength(min, 2, '0');
            this._div.innerHTML = min + sep + sec + sep + msec;
        }
        resetTimer(time: number): void {
            this._timer = time;
        }
        stopTimer(): void {
            if(this._timerIntervalID != null) {
                clearInterval(this._timerIntervalID);
                this._timerIntervalID = null;
            }
        }
        startTimer(): void {
            if(this._timerIntervalID == null) {
                this._timerIntervalID = setInterval(() => {this._timer -= 33; this.setTime()}, 33);
            }
        }
    }
    
    class EnemyGridTimerGridGUI {
        static readonly _divClass: string = ".plan_countdown";
        static get fullPath(): string {
            return InfoBarEnemyGridGUI.fullPath + ">" + this._divClass;
        }
    
        private _div: HTMLElement;
        private _stopPlanningGUIs: TimerGridStopPlanningGUI[] = [];
        private _timerGUI: TimerGridTimerGUI;
        private _maxTime: number = 30 * 1000;
        constructor() {
            this._div = document.querySelector(EnemyGridTimerGridGUI.fullPath) as HTMLElement;
            document.querySelectorAll(TimerGridStopPlanningGUI.classFullPath).forEach(
                (e) => this._stopPlanningGUIs.push(new TimerGridStopPlanningGUI(e as HTMLElement))
            );
            this._timerGUI = new TimerGridTimerGUI();
            this.setUp();
        }
        setUp() {
            this.reset();
            this._timerGUI.startTimer();
            this.update();
    
        }
        reset() {
            this._timerGUI.resetTimer(this._maxTime);
        }
        resetFightRound() {
            this._maxTime -= 500;
            this._timerGUI.resetTimer(this._maxTime);
        }
        update() {
    
        }
    }
    
    class InfoBarEnemyGridGUI {
        
        static readonly _divID: string = "FSInfoBarEnemyGrid";
        private static _nrInstances: number = 0;
        private static readonly _nrEnemyGridGUIs = 1;
    
        static get fullPath(): string {
            return InfoBarGUI.fullPath + ">#" + InfoBarEnemyGridGUI._divID;
        }
    
        private _div: HTMLElement;
        private _enemyGrindGUIs: EnemyGridGUI[] = [];
        private _timerGridGUI: EnemyGridTimerGridGUI;
        constructor() {
            if(InfoBarEnemyGridGUI._nrInstances > 0) {
                throw "InfoBarEnemyGridGUI already has an instance running!";
            }
            InfoBarEnemyGridGUI._nrInstances += 1;
            this._div = document.getElementById(InfoBarEnemyGridGUI._divID);
            document.querySelectorAll(InfoBarEnemyGridGUI.fullPath + ">" + EnemyGridGUI._divClass).forEach(
                (e, i) => this._enemyGrindGUIs.push(new EnemyGridGUI(e as HTMLElement, String(i + 1)))
            );
            this._timerGridGUI = new EnemyGridTimerGridGUI();
            this.update();
        }
        update() {
            this._enemyGrindGUIs.forEach((e, i) => {i < InfoBarEnemyGridGUI._nrEnemyGridGUIs ? e.show() : e.hide()});
        }
        resetTimer() {
            this._timerGridGUI.reset();
        }
        resetFightRound() {
            this._timerGridGUI.resetFightRound();
        }
    }
    
    class InfoBarPlayerInfoGUI {
        
        static readonly _divID: string = "FSInfOBarPlayerInfo";
        private static _nrInstances: number = 0;
    
        private _div: HTMLElement;
        constructor() {
            if(InfoBarPlayerInfoGUI._nrInstances > 0) {
                throw "InfoBarPlayerInfoGUI already has an instance running!";
            }
            InfoBarPlayerInfoGUI._nrInstances += 1;
            this._div = document.getElementById(InfoBarPlayerInfoGUI._divID);
        }
        resetFightRound() {
            
        }
    }
    
    export class InfoBarGUI {
        static readonly _divID: string = "FightScreenInfoBar";
        private static _nrInstances: number = 0;
    
        static get fullPath() {
            return FightScreenGUI.fullPath + ">#" + InfoBarGUI._divID;
        }
    
        private _div: HTMLElement;
        private _statusBarsGUI: InfoBarStatusBarsGUI;
        private _enemyGridGUI: InfoBarEnemyGridGUI;
        private _playerInfoGUI: InfoBarPlayerInfoGUI;
        constructor() {
            if(InfoBarGUI._nrInstances > 0) {
                throw "InfoBarGUI already has an instance running!";
            }
            InfoBarGUI._nrInstances += 1;
            this._div = document.getElementById(InfoBarGUI._divID);
            this._statusBarsGUI = new InfoBarStatusBarsGUI();
            this._enemyGridGUI = new InfoBarEnemyGridGUI();
            this._playerInfoGUI = new InfoBarPlayerInfoGUI();
        }
        resetFightRound(): void {
            this._statusBarsGUI.resetFightRound();
            this._enemyGridGUI.resetFightRound();
            this._playerInfoGUI.resetFightRound();
        }
        setUpEnemiesGUI(fightInstance: FightInstance): void {
            
        }
    }
}

class DragObejctGUI {
    static readonly _divID = "FightScreenDragObject";

    private _div: HTMLElement;
    private _style: Map<string, string>;
    get left(): string {
        return this._div.style.left;
    }
    get top(): string {
        return this._div.style.top;
    }
    constructor() {
        this._div = document.getElementById(DragObejctGUI._divID) as HTMLElement;
    }
    setPosition(x: number, y: number, adjust_y: boolean = true): void {
        let width: number = Number(getComputedStyle(this._div).getPropertyValue("width").slice(0, -2));
        let height: number = Number(getComputedStyle(this._div).getPropertyValue('height').slice(0, -2));
        this._div.style.left = (x ).toString() + "px";
        if(adjust_y) {
            this._div.style.top = (y - height).toString() + "px";
        }
        else {
            this._div.style.top = (y).toString() + "px";
        }
    }
    setInnerHTML(innerHTML: string) {
        this._div.innerHTML = innerHTML;
    }
    setOpacity(op: number): void {
        this._div.style.opacity = op.toString();
    }
    setStyle(style: Map<string, string>) {
        this._style = style;
        style.forEach(
            (v, k) => {this._div.style[k] = v;}
        )
    }
    reset(): void {
        //clear class list
        this._div.classList.forEach(
            (k) => this._div.classList.remove(k)
        );
        //clear style
        this._style.forEach(
            (v, k) => this._div.style[k] = ""
        );
        //clear innerHTML
        this._div.innerHTML = "";
        //hide
        this._div.style.display = "none";
    }
    moveWithMouse(e: MouseEvent): void {
        this._div.style.left = (e.pageX - DragAPI.dragOffsetX).toString() + "px";
        this._div.style.top = (e.pageY - DragAPI.dragOffsetY).toString() + "px";
    }
}

class DragAPI {
    private static _body: HTMLElement = document.body;
    private static _dragging: boolean = false;
    private static _releasableDrag: boolean = null;
    private static _insideDragDestArea: boolean = null;
    private static _dragObjType: string = null;
    private static _dragObj: DragObejctGUI = new DragObejctGUI();
    private static _dragOffsetX: number;
    private static _dragOffsetY: number;

    static dragPropertyToCSS(property: string): string {
        let ret: string = "";
        for(let i = 0; i < property.length; i++) {
            if(property[i].toLowerCase() == property[i]) {
                ret += property[i];
            }
            else {
                ret += "-" + property[i].toLowerCase();
            }
        }
        return ret;
    }
    static canDropHere(dragObjType:string): boolean {
        if(this._dragging) {
            if(this._releasableDrag) {
                return true;
            }
            else {
                return this._insideDragDestArea && this._dragObjType == dragObjType;
            }
            
        }
        return false;
    }
    static canStartDrag(): boolean {
        if(!this._dragging) {
            return true;
        }
        return false;
    }
    static canMouseDownHere(): boolean {
        if(this._dragging && !this._insideDragDestArea) {
            return false;
        }
        return true;
    }

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
    static setUpDragObject(style: Map<string, string>, innerHTML: string) {
        if(!this._dragging) {
            this._dragObj.setStyle(style);
            this._dragObj.setInnerHTML(innerHTML);
        }
    }
    static startDrag(dragObjectType: string, dragObjectData: string, e: MouseEvent | DragEvent, releasableDrag: boolean = false): void {
        if(this._dragging == false) {
            this._dragging = true;
            this._releasableDrag = releasableDrag;
            this._insideDragDestArea = false;
            this._dragObjType = dragObjectType;
            window.sessionStorage.setItem(dragObjectType, dragObjectData);
            let leftObj: number = Number(this._dragObj.left.slice(0, -2));
            let topObj: number = Number(this._dragObj.top.slice(0, -2));
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
            this._dragObj.reset();
        }
    }
    static moveWithMouse(e: MouseEvent) {
        this._dragObj.moveWithMouse(e);
    }
    static setUpEventListeners(): void {
        DragAPI._body.addEventListener('mousemove', (e: MouseEvent) => DragAPI.onMouseMove(e))
    }
    private static onMouseMove(e: MouseEvent): void {
        if(this.dragging) {
            DragAPI._dragObj.moveWithMouse(e);
        }
    }
}

class FightScreenGUI {
    static readonly _divID: string = "FightScreen";
    
    private static _self: FightScreenGUI;

    static get fullPath(): string {
        return "#" + FightScreenGUI._divID;
    }
    static resetFightRound(): void {
        this._self.resetFightRound();
    }

    private _div: HTMLElement;
    private _infoBarGUI: InfoBarGUIs.InfoBarGUI;
    private _actionBarGUI: ActionBarGUIs.ActionBarGUI;
    private _actoinPlanBarGUI: ActionPlanBarGUIs.ActionPlanBarGUI;
    constructor() {
        FightScreenGUI._self = this;
        this._div = document.getElementById(FightScreenGUI._divID);
        this._infoBarGUI = new InfoBarGUIs.InfoBarGUI();
        this._actionBarGUI = new ActionBarGUIs.ActionBarGUI();
        this._actoinPlanBarGUI = new ActionPlanBarGUIs.ActionPlanBarGUI();
        this.setUpEventListeners();
    }
    setUpEventListeners(): void {
        let c_obj: FightScreenGUI = this;
        this._div.addEventListener('mousemove', (e: MouseEvent) => c_obj.onMouseMove(e, c_obj))
    }
    setUpFight(fightInstance: FightInstance) {

    }
    private onMouseMove(e: MouseEvent, c_obj: FightScreenGUI): void {
        if(DragAPI.dragging) {
            DragAPI.moveWithMouse(e);
        }
    }
    private resetFightRound(): void {
        this._infoBarGUI.resetFightRound();
        this._actoinPlanBarGUI.resetFightRound();
    }
}

class FightScreenController {
    static _fightScreenGUI: FightScreenGUI;
    private static _initialized: boolean = false;
    private static _fightInstance: FightInstance = undefined;
    static init(): void {
        if(this._initialized) {
            throw "ERROR: FightScreenController can only be initialized once!";
        }
        this._initialized = true;
        this._fightScreenGUI = new FightScreenGUI();
    }
    static startFight(fightInstance: FightInstance): void {
        this._fightInstance = fightInstance;
        this._fightScreenGUI.setUpFight(this._fightInstance);
    }
}

class GameController {
    private static _initialized: boolean = false;
    private static _enemies: Map<string, Enemy.Enemy> = new Map<string, Enemy.Enemy>();

    static getEnemyByName(name: string): Enemy.Enemy {
        return Enemy.enemies[name];
    }

    private static initAPIs() {
        DragAPI.setUpEventListeners();
    }
    private static initControllers() {
        FightScreenController.init();
    }
    static init() {
        if(this._initialized) {
            throw "ERROR: GameController can only be initialized once!";
        }
        this.initAPIs();
        this.initControllers();
    }}

GameController.init();

let f = new Fight(['Goblin']);
let fI = f.createFightInstance(1);
FightScreenController.startFight(fI);