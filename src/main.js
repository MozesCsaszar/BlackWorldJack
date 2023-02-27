/*                                      Util Namespaces */
var MathUtil;
(function (MathUtil) {
    function getRandomIntBelow(max) {
        return Math.floor(Math.random() * max);
    }
    MathUtil.getRandomIntBelow = getRandomIntBelow;
})(MathUtil || (MathUtil = {}));
var StringUtil;
(function (StringUtil) {
    function padRightUntilLength(str, length, char) {
        while (str.length < length) {
            str = char + str;
        }
        return str;
    }
    StringUtil.padRightUntilLength = padRightUntilLength;
})(StringUtil || (StringUtil = {}));
/*                                      Storage namespaces */
class ElementalAttributes {
    constructor(physical = 0, fire = 0, water = 0, earth = 0, wind = 0) {
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
var Enemy;
(function (Enemy_1) {
    let Modifier;
    (function (Modifier) {
    })(Modifier || (Modifier = {}));
    class Scaling {
        copy() {
            return new Scaling();
        }
    }
    class EnemyStats {
        constructor(health, defense, attack, resistance) {
            this._health = health;
            this._defense = defense;
            this._attack = attack;
            this._resistance = resistance;
        }
        copy() {
            return new EnemyStats(this._health, this._defense.copy(), this._attack.copy(), this._resistance.copy());
        }
    }
    class EnemyBody {
        constructor(attributes, modifiers) {
            this._modifiers = [];
            this._attributes = attributes.copy();
            modifiers.forEach(e => this._modifiers.push(e));
        }
        copy() {
            return new EnemyBody(this._attributes, this._modifiers);
        }
    }
    class EnemyInfo {
        constructor(name, desc) {
            this.name = name;
            this.desc = desc;
        }
    }
    class EnemyWithLevel {
        constructor(body, level) {
            this._body = body.copy();
            this._level = level;
        }
        get level() {
            return this._level;
        }
        get name() {
            return this._info.name;
        }
        get desc() {
            return this._info.desc;
        }
        copy() {
            let e = new EnemyWithLevel(this._body.copy(), this._level);
            return e;
        }
        setEnemyInfo(info) {
            this._info = info;
        }
    }
    Enemy_1.EnemyWithLevel = EnemyWithLevel;
    class Enemy {
        static copy(enemy) {
            return enemy.copy();
        }
        constructor(name, desc, levels, scaling = undefined) {
            this._levels = new Map();
            this._name = name;
            this._desc = desc;
            levels.forEach((e, k) => { e.setEnemyInfo(this.getInfo()); this._levels.set(k, e.copy()); });
            this._scaling = scaling == undefined ? undefined : scaling.copy();
        }
        copy() {
            let e = new Enemy(this._name, this._desc, this._levels, this._scaling == undefined ? undefined : this._scaling.copy());
            return e;
        }
        getEnemyWithLevel(level) {
            if (level >= 1) {
                if (this._levels.get(level) != undefined) {
                    return this._levels.get(level).copy();
                }
                /*Cases:
                    I:      There is an enemy with lower level and scaling     -> Scale enemy from lower level
                    II:     There is an enemy with higher level and no scaling -> Get enemy from higher level
                    III:    There is no enemy with higher level and no scaling -> Throw error
                */
                let tempLevels = [];
                for (const level of this._levels.keys()) {
                    tempLevels.push(level);
                }
                tempLevels = tempLevels.sort();
                if (this._scaling != undefined) {
                    console.log("SCALED");
                    return this._levels.get(0).copy();
                }
                else {
                    let higher = undefined;
                    tempLevels.forEach(e => {
                        if (e > level) {
                            if (higher == undefined) {
                                higher = e;
                            }
                        }
                    });
                    if (higher == undefined) {
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
        getInfo() {
            return new EnemyInfo(this._name, this._desc);
        }
    }
    Enemy_1.Enemy = Enemy;
    Enemy_1.enemies = {
        'Goblin': new Enemy('Goblin', 'Stinky and foul looking, these creatures are not the bestest fighters.', new Map([
            [1, new EnemyWithLevel(new EnemyBody(new EnemyStats(10, new ElementalAttributes(), new ElementalAttributes(3), new ElementalAttributes()), []), 1)]
        ])),
    };
})(Enemy || (Enemy = {}));
/*                                      Underlying Classes */
var CardManaTypes;
(function (CardManaTypes) {
    CardManaTypes[CardManaTypes["neutral"] = 0] = "neutral";
    CardManaTypes[CardManaTypes["fire"] = 1] = "fire";
    CardManaTypes[CardManaTypes["earth"] = 2] = "earth";
    CardManaTypes[CardManaTypes["water"] = 3] = "water";
    CardManaTypes[CardManaTypes["wind"] = 4] = "wind";
})(CardManaTypes || (CardManaTypes = {}));
class Card {
    static load(s) {
        let i = 0;
        let sep = getComputedStyle(document.body).getPropertyValue("--DEF-save-level0-sep");
        let s_a = s.split(sep);
        let suit = s_a[i];
        i++;
        let value = s_a[i];
        i++;
        let manaType = CardManaTypes[s_a[i]];
        i++;
        return new Card(suit, value, manaType);
    }
    constructor(suit, value, mana = CardManaTypes.neutral) {
        this._suit = suit;
        this._manaType = mana;
        this._value = value;
    }
    get suit() {
        return this._suit;
    }
    get value() {
        return this._value;
    }
    get manaType() {
        return this._manaType;
    }
    get copy() {
        return new Card(this._suit, this._value, this._manaType);
    }
    get HTMLString() {
        return this._value + "<br>" + this._suit;
    }
    save() {
        let sep = getComputedStyle(document.body).getPropertyValue("--DEF-save-level0-sep");
        return this._suit + sep + this._value + sep + this._manaType;
    }
    load(s) {
        let i = 0;
        let sep = getComputedStyle(document.body).getPropertyValue("--DEF-save-level0-sep");
        let s_a = s.split(sep);
        this._suit = s_a[i];
        i++;
        this._value = s_a[i];
        i++;
        this._manaType = CardManaTypes[s_a[i]];
        i++;
    }
}
class Deck {
    constructor() {
        this._cards = [];
    }
    get cards() {
        return this._cards;
    }
    reset() {
        this._cards = [];
    }
    afterDeckRepopulation() {
        this._nextCard = MathUtil.getRandomIntBelow(this._cards.length);
    }
    setNextCard() {
        /* Set up next card for the drawing with removing the prev. drawn and setting new _nextCard */
        this._cards[this._nextCard] = this._cards[this._cards.length - 1];
        this._cards.pop();
        this._nextCard = MathUtil.getRandomIntBelow(this._cards.length);
    }
    pushAll(cList) {
        cList.forEach(element => {
            this._cards.push(element.copy);
        });
    }
    setContent(oDeck) {
        this.reset();
        oDeck.cards.forEach(element => {
            this._cards.push(element.copy);
        });
        this.afterDeckRepopulation();
    }
    setContentSuitsValuesMana(suits, values, manaType = CardManaTypes.neutral) {
        this.reset();
        suits.forEach(s => {
            values.forEach(v => {
                this._cards.push(new Card(s, v, manaType));
            });
        });
        this.afterDeckRepopulation();
    }
    peek() {
        return this._cards[this._nextCard];
    }
    draw() {
        //Get and remove a card randomly from the deck
        let next = this.cards[this._nextCard];
        this.setNextCard();
        return next;
    }
    toString() {
        return this.cards.map(c => c.toString()).reduce((a, s) => a += s + "|", "").slice(0, -1);
    }
    get copy() {
        let d = new Deck();
        d.pushAll(this._cards.map(c => c.copy).reduce((a, c) => { a.push(c); return a; }, new Array()));
        return d;
    }
}
Deck.suits = ['♣', '♦', '♥', '♠'];
Deck.values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'J', 'Q', 'K'];
class Hand {
    constructor(cards = []) {
        this._cards = cards;
    }
    get cards() {
        //get current cards
        return this._cards;
    }
    get value() {
        //return the numeric value of the hand
        let value;
        value = this._cards.map(c => c.value == 'A' ? 11 : (c.value == 'J' || c.value == 'Q' || c.value == 'K' ? 10 : Number(c.value))).reduce((a, n) => a + n, 0);
        let nr_aces = this._cards.map(c => c.value == 'A' ? 1 : 0).reduce((a, n) => a + n, 0);
        while (value > 21 && nr_aces > 0) {
            nr_aces -= 1;
            value -= 10;
        }
        return value;
    }
    get length() {
        return this._cards.length;
    }
    get busted() {
        return this.value > 21;
    }
    get final() {
        return this.value >= 21;
    }
    get(i) {
        if (i >= this._cards.length) {
            return null;
        }
        return this._cards[i];
    }
    addCard(card) {
        //add a new card to the hand; card not copied
        if (card != null) {
            this._cards.push(card);
        }
    }
    popCard() {
        this._cards.pop();
    }
    reset() {
        this._cards = [];
    }
}
class Player {
    constructor() {
        this._nrActions = 2;
        this._nrDecks = 1;
    }
    get nrActions() {
        return this._nrActions;
    }
    set nrActions(nr) {
        this._nrActions = nr;
    }
}
class Action {
    static load(save) {
        let a = new Action('');
        a.load(save);
        return a;
    }
    constructor(name) {
        this._name = name;
    }
    get name() {
        return this._name;
    }
    save() {
        return this._name;
    }
    load(save) {
        let i = 0;
        let s_list = save.split("\\e\\");
        this._name = s_list[i];
        i++;
    }
}
class FightInstance {
    constructor() {
        this._enemies = [];
    }
    get enemies() {
        return this._enemies;
    }
    addEnemy(e) {
        this._enemies.push(e);
    }
}
class Fight {
    constructor(enemyNames) {
        this._enemies = [];
        enemyNames.forEach(e => this._enemies.push(e));
    }
    createFightInstance(level) {
        let fightInstance = new FightInstance();
        this._enemies.forEach(e => fightInstance.addEnemy(GameController.getEnemyByName(e).getEnemyWithLevel(level)));
        return fightInstance;
    }
}
/*                                      GUI                                                 */
class DraggableGUI {
    moveWithMouse(e) { }
    get left() { return ""; }
    get top() { return ""; }
}
var ActionPlanBarGUIs;
(function (ActionPlanBarGUIs) {
    class CardGUI {
        constructor(div, card = null) {
            this._card = card;
            this._div = div;
        }
        get card() {
            return this._card;
        }
        set card(card) {
            this._card = card;
            this.update();
        }
        update() {
            if (this.card == null) {
                this._div.style.display = 'none';
            }
            else {
                this._div.style.display = 'block';
                this._div.innerHTML = this.card.value + "<br>" + this.card.suit;
            }
        }
        reset() {
            this._div.textContent = "";
            this._div.hidden = true;
            this._card = null;
        }
        setAsTemp() {
            this._div.style.opacity = "0.5";
        }
        setAsPerm() {
            this._div.style.opacity = "1";
        }
        setLeft(left) {
            //set the left property of style of the div to allow for stylizing the card display format
            this._div.style.left = left.toString() + "px";
        }
    }
    CardGUI._divClass = ".card";
    class HandGUI {
        constructor(super_path) {
            this._cardGUIs = [];
            let path = super_path + ">" + HandGUI._divClass;
            this._div = document.querySelector(path);
            document.querySelectorAll(path + ">" + CardGUI._divClass).forEach(e => this._cardGUIs.push(new CardGUI(e)));
            this._hand = new Hand();
            this._tempHand = new Hand();
            this.stylizeDeck();
        }
        get value() {
            return this._hand.value;
        }
        get busted() {
            return this._hand.busted;
        }
        get final() {
            return this.busted || this._hand.final;
        }
        get tempValue() {
            return this._tempHand.value;
        }
        get tempBusted() {
            return this._tempHand.busted;
        }
        get tempFinal() {
            return this._tempHand.final;
        }
        update() {
            this._cardGUIs.forEach((e, i) => e.card = this._tempHand.get(i));
        }
        addTempCard(card) {
            //visual changes only; change temp hand only
            this._cardGUIs[this._tempHand.length].card = card;
            this._cardGUIs[this._tempHand.length].setAsTemp();
            this._tempHand.addCard(card);
        }
        finalizeTempCard() {
            //visual and actual deck changes changes only
            this._cardGUIs[this._tempHand.length - 1].setAsPerm();
            this._hand.addCard(this._cardGUIs[this._tempHand.length - 1].card);
        }
        removeTempCard() {
            this._cardGUIs[this._tempHand.length - 1].card = null;
            this._tempHand.popCard();
        }
        stylizeDeck() {
            this._cardGUIs.forEach((e, i) => {
                e.setLeft(i * 20.96);
            });
        }
        resetFightRound() {
            this._hand.reset();
            this._tempHand.reset();
            this.update();
        }
    }
    HandGUI._divClass = ".card_holder";
    class ActionGUI {
        get action() {
            return this._action;
        }
        set action(action) {
            this._action = action;
            this.update();
        }
        set tempAction(action) {
            this._tempAction = action;
            this.update(true);
        }
        removeTemp() {
            this._tempAction = null;
            this.update();
        }
        finalizeTemp() {
            this.action = this._tempAction;
        }
        constructor(path) {
            this._action = null;
            this._tempAction = null;
            this._div = document.querySelector(path + ">" + ActionGUI._divClass);
            this._action = null;
        }
        update(basedOnTemp = false) {
            let a = basedOnTemp ? this._tempAction : this._action;
            if (a == null) {
                this._div.innerHTML = "";
            }
            else {
                this._div.innerHTML = a.name;
            }
        }
    }
    ActionGUI._divClass = ".action";
    class ActionSpaceGUI {
        constructor(nr) {
            this._entered = false;
            this._handGUI = new HandGUI(ActionSpaceGUI._divClass + "._" + nr);
            this._actionGUI = new ActionGUI(ActionSpaceGUI._divClass + "._" + nr);
            this._div = document.querySelector(ActionSpaceGUI._divClass + "._" + nr);
            this.setUpEventListeners();
            this.update();
        }
        get busted() {
            return this._handGUI.busted;
        }
        get final() {
            return this.busted || this._handGUI.final;
        }
        setUpEventListeners() {
            let c_obj = this;
            c_obj._div.addEventListener('mouseenter', (e) => c_obj.onMouseEnter(e, c_obj));
            c_obj._div.addEventListener('mouseleave', (e) => c_obj.onMouseLeave(e, c_obj));
            c_obj._div.addEventListener('mouseup', (e) => c_obj.onMouseUp(e, c_obj));
        }
        onMouseEnter(e, c_obj) {
            if (DragAPI.dragObjectType == DeckGUI._dragObjType && !c_obj._handGUI.busted) {
                c_obj._handGUI.addTempCard(Card.load(DragAPI.dragObjectData));
                c_obj.update();
                DragAPI.enterDragDestinationArea();
            }
            else if (DragAPI.dragObjectType == ActionBarGUIs.ActionListElementGUI._dragObjType) {
                c_obj._actionGUI.tempAction = Action.load(DragAPI.dragObjectData);
                DragAPI.enterDragDestinationArea();
            }
        }
        onMouseLeave(e, c_obj) {
            if (DragAPI.dragObjectType == DeckGUI._dragObjType && DragAPI.insideDragDestinationArea) {
                c_obj._handGUI.removeTempCard();
                c_obj.update();
                DragAPI.exitDragDestinationArea();
            }
            else if (DragAPI.dragObjectType == ActionBarGUIs.ActionListElementGUI._dragObjType && DragAPI.insideDragDestinationArea) {
                c_obj._actionGUI.removeTemp();
                DragAPI.exitDragDestinationArea();
            }
        }
        onMouseUp(e, c_obj) {
            if (DragAPI.canDropHere(DeckGUI._dragObjType) && !this._handGUI.busted) {
                c_obj._handGUI.finalizeTempCard();
                ActionHolderGUI.setFinalAll();
                c_obj._entered = false;
                DragAPI.endDrag();
            }
            else if (DragAPI.canDropHere(ActionBarGUIs.ActionListElementGUI._dragObjType)) {
                c_obj._actionGUI.finalizeTemp();
                DragAPI.endDrag();
            }
        }
        update() {
            this._handGUI.update();
            this._actionGUI.update();
            let value = this._handGUI.tempValue;
            if (value < 14) {
                this._div.style.border = 'dashed red 5px';
            }
            else if (value < 21) {
                this._div.style.border = 'dashed green 5px';
            }
            else if (value == 21) {
                this._div.style.border = 'solid green 5px';
            }
            else {
                this._div.style.border = 'solid red 5px';
            }
        }
        show() {
            this._div.style.display = "flex";
        }
        hide() {
            this._div.style.display = "none";
        }
        resetFightRound() {
            this._handGUI.resetFightRound();
            this.update();
        }
    }
    ActionSpaceGUI._divClass = ".action_card_space";
    class DeckGUI {
        constructor(div) {
            this._div = div;
            this._deck = new Deck();
            this.setUpEventListeners();
        }
        setContentSuitsValuesMana(suits, values, manaType = CardManaTypes.neutral) {
            this._deck.setContentSuitsValuesMana(suits, values, manaType);
        }
        setUpEventListeners() {
            let c_obj = this;
            this._div.addEventListener("mousedown", (e) => c_obj.onMouseDown(e, c_obj));
        }
        onMouseDown(e, c_obj) {
            if (DragAPI.canStartDrag()) {
                if (!ActionPlanBarGUI._finalAll) {
                    let left = c_obj._div.getBoundingClientRect().left - 6;
                    let top = c_obj._div.getBoundingClientRect().top - 52;
                    let c = c_obj._deck.draw();
                    this.setUpDragObject(left, top, c);
                    DragAPI.startDrag(DeckGUI._dragObjType, c.save(), e);
                }
            }
        }
        setUpDragObject(left, top, card) {
            let styleSheet = getComputedStyle(this._div);
            let styleNeeded = new Map();
            DeckGUI._dragProperties.forEach((e) => { styleNeeded.set(DragAPI.dragPropertyToCSS(e), styleSheet[e]); });
            styleNeeded.set('left', left + "px");
            styleNeeded.set('top', top + "px");
            styleNeeded.set('display', 'block');
            DragAPI.setUpDragObject(styleNeeded, this.createDragObjectInnerHTML(card));
        }
        createDragObjectInnerHTML(card) {
            return card.HTMLString;
        }
        show() {
            this._div.style.display = 'grid';
        }
        hide() {
            this._div.style.display = 'none';
        }
        resetFightRound() {
            this.setContentSuitsValuesMana(Deck.suits, Deck.values);
        }
    }
    DeckGUI._divClass = ".deck";
    DeckGUI._dragObjType = 'card';
    DeckGUI._dragProperties = ['width', 'height', 'border', 'backgroundColor'];
    class DeckHolderGUI {
        constructor() {
            this._currentDeckGUIs = 1;
            this._deckGUIs = [];
            //set up deck GUI's
            document.querySelectorAll('#FightScreenActionPlanBar' + '>' + DeckHolderGUI._divClass + '>' + DeckGUI._divClass).forEach((e) => { this._deckGUIs.push(new DeckGUI(e)); });
            this._deckGUIs[0].setContentSuitsValuesMana(Deck.suits, Deck.values);
            this.update();
        }
        update() {
            this._deckGUIs.forEach((e, i) => { i < this._currentDeckGUIs ? e.show() : e.hide(); });
        }
        resetFightRound() {
            this._deckGUIs.forEach((e, i) => { i < this._currentDeckGUIs ? e.resetFightRound() : null; });
        }
    }
    DeckHolderGUI._divClass = ".deck_holder";
    class ActionHolderGUI {
        constructor(superDivID) {
            //set up deck GUI's
            document.querySelectorAll(superDivID + '>' + ActionSpaceGUI._divClass).forEach((e, i) => { ActionHolderGUI._actionGUIs.push(new ActionSpaceGUI(i.toString())); });
            this.update();
        }
        static setFinalAll() {
            let foundNotFinal = false;
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
        update() {
            ActionHolderGUI._actionGUIs.forEach((e, i) => { i < ActionHolderGUI._currentActionGUIs ? e.show() : e.hide(); });
        }
        resetFightRound() {
            ActionHolderGUI._actionGUIs.forEach((e, i) => {
                if (i < ActionHolderGUI._currentActionGUIs) {
                    e.resetFightRound();
                }
                ;
            });
            ActionHolderGUI.setFinalAll();
        }
    }
    ActionHolderGUI._currentActionGUIs = 7;
    ActionHolderGUI._actionGUIs = [];
    class ActionPlanBarGUI {
        constructor() {
            this._deckHolderGUI = new DeckHolderGUI();
            this._actionHolderGUI = new ActionHolderGUI(ActionPlanBarGUI._divID);
        }
        resetFightRound() {
            this._deckHolderGUI.resetFightRound();
            this._actionHolderGUI.resetFightRound();
        }
    }
    ActionPlanBarGUI._divID = '#FightScreenActionPlanBar';
    ActionPlanBarGUI._finalAll = false;
    ActionPlanBarGUIs.ActionPlanBarGUI = ActionPlanBarGUI;
})(ActionPlanBarGUIs || (ActionPlanBarGUIs = {}));
var ActionBarGUIs;
(function (ActionBarGUIs) {
    class AreaGridCellGUI {
        static get classFullPath() {
            return AreaGridRowGUI.classFullPath + ">" + this._divClass;
        }
        constructor(div) {
            this._div = div;
            this.setUpEventListeners();
        }
        setUpEventListeners() {
            let c_obj = this;
            this._div.addEventListener('mouseenter', (e) => c_obj.onMouseEnter(e, c_obj));
            this._div.addEventListener('mouseleave', (e) => c_obj.onMouseLeave(e, c_obj));
        }
        onMouseEnter(e, c_obj) {
            if (!DragAPI.dragging) {
                c_obj._div.style.backgroundColor = 'rgb(0,0,255)';
            }
        }
        onMouseLeave(e, c_obj) {
            if (!DragAPI.dragging) {
                c_obj._div.style.backgroundColor = 'rgb(0,0,0)';
            }
        }
    }
    AreaGridCellGUI._divClass = ".cell";
    class AreaGridRowGUI {
        static get classFullPath() {
            return ActionBarAreaGridGUI.fullPath + ">" + this._divClass;
        }
        constructor(div, nr, offsetInd) {
            this._cellGUIs = [];
            this._div = div;
            this._div.style.left = (offsetInd * AreaGridRowGUI._rowOffset).toString() + "px";
            document.querySelectorAll(AreaGridRowGUI.classFullPath + "._" + nr + ">" + AreaGridCellGUI._divClass).forEach((e) => this._cellGUIs.push(new AreaGridCellGUI(e)));
        }
    }
    AreaGridRowGUI._divClass = ".row";
    AreaGridRowGUI._rowOffset = 28;
    class ActionBarAreaGridGUI {
        static get fullPath() {
            return ActionBarGUI.fullPath + ">#" + this._divID;
        }
        constructor() {
            this._rowGUIs = [];
            if (ActionBarAreaGridGUI._nrInstances > 0) {
                throw "ActionBarAreaGridGUI already has an instance running!";
            }
            ActionBarAreaGridGUI._nrInstances += 1;
            this._div = document.getElementById(ActionBarAreaGridGUI._divID);
            document.querySelectorAll(AreaGridRowGUI.classFullPath).forEach((e, i, l) => { this._rowGUIs.push(new AreaGridRowGUI(e, i, l.length - i - 1)); });
        }
    }
    ActionBarAreaGridGUI._divID = "FSActionBarAreaGrid";
    ActionBarAreaGridGUI._nrInstances = 0;
    class ActionListElementGUI {
        get action() {
            return this._action;
        }
        set action(a) {
            this._action = a;
            this.display();
        }
        constructor(div) {
            this._div = div;
            this.setUpEventListeners();
        }
        setUpEventListeners() {
            let c_obj = this;
            this._div.addEventListener('mousedown', (e) => c_obj.onMouseDown(e, c_obj));
        }
        display() {
            this._div.innerHTML = this.repr();
        }
        repr() {
            return this._action != null ? this._action.name : "";
        }
        setHeight(height) {
            this._div.style.height = (height - 2 * Number(getComputedStyle(this._div).borderWidth.slice(0, -2))) + "px";
        }
        onMouseDown(e, c_obj) {
            if (!DragAPI.dragging && c_obj.action != null) {
                let left = c_obj._div.getBoundingClientRect().left - 8;
                let top = c_obj._div.getBoundingClientRect().top - 52;
                c_obj.setUpDragObject(left, top);
                DragAPI.startDrag(ActionListElementGUI._dragObjType, c_obj.action.save(), e);
            }
        }
        setUpDragObject(left, top) {
            let styleSheet = getComputedStyle(this._div);
            let styleNeeded = new Map();
            ActionListElementGUI._dragProperties.forEach((e) => { styleNeeded.set(DragAPI.dragPropertyToCSS(e), styleSheet[e]); });
            styleNeeded.set('left', left + "px");
            styleNeeded.set('top', top + "px");
            DragAPI.setUpDragObject(styleNeeded, this.createDragObjectInnerHTML());
        }
        createDragObjectInnerHTML() {
            return this._action.name;
        }
    }
    ActionListElementGUI._elementClass = ".action_list_element";
    ActionListElementGUI._dragObjType = "action";
    ActionListElementGUI._dragProperties = ['width', 'height', 'border', 'backgroundColor', 'display'];
    ActionBarGUIs.ActionListElementGUI = ActionListElementGUI;
    class ActionListGUI {
        constructor(div, elementsPerPage) {
            this._listElements = [];
            this._elements = [];
            this._div = div;
            this.elementsPerPage = elementsPerPage;
            this._currentPage = 0;
        }
        set elementsPerPage(nr) {
            if (nr != this._listElements.length) {
                while (this._listElements.length < nr) {
                    let newDiv = document.createElement('div');
                    newDiv.classList.add(ActionListElementGUI._elementClass.slice(1));
                    this._div.appendChild(newDiv);
                    this._listElements.push(new ActionListElementGUI(newDiv));
                }
                while (this._listElements.length > nr) {
                    this._listElements.pop();
                }
                let height = this._div.clientHeight / this._listElements.length;
                this._listElements.forEach((e) => (e.setHeight(height)));
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
        nextPage() {
            if (this.currentPage < this.nrPages) {
                this._currentPage++;
            }
        }
        getElementOnCurrentPage(i) {
            let ind = this._currentPage * this._listElements.length + i;
            if (i > this.elementsPerPage || ind >= this._elements.length) {
                throw "ListGUI ERROR: Element requested not in list!";
            }
            return this._elements[ind];
        }
        addToEnd(elem) {
            this._elements.push(elem);
        }
        update() {
            let offsetInd = this._currentPage * this.elementsPerPage;
            this._listElements.forEach((e, i) => {
                i + offsetInd < this._elements.length ? e.action = this._elements[i + offsetInd] : e.action = null;
            });
        }
    }
    class ActionBarGUI {
        static get fullPath() {
            return FightScreenGUI.fullPath + ">#" + this._divID;
        }
        constructor() {
            if (ActionBarGUI._nrInstances > 0) {
                throw "InfoBarGUI already has an instance running!";
            }
            ActionBarGUI._nrInstances += 1;
            this._div = document.getElementById(ActionBarGUI._divID);
            this._spellActionList = new ActionListGUI(document.getElementById(ActionBarGUI._spellListID), ActionBarGUI._nrElementsPerList);
            this._areaGridGUI = new ActionBarAreaGridGUI();
            this._otherActionList = new ActionListGUI(document.getElementById(ActionBarGUI._otherListID), ActionBarGUI._nrElementsPerList);
            this._otherActionList.addToEnd(new Action('A'));
            this._otherActionList.addToEnd(new Action('B'));
            this._otherActionList.addToEnd(new Action('C'));
            this.update();
        }
        update() {
            this._spellActionList.update();
            this._otherActionList.update();
        }
    }
    ActionBarGUI._divID = "FightScreenActionBar";
    ActionBarGUI._nrElementsPerList = 10;
    ActionBarGUI._spellListID = "FSActionBarSpellActions";
    ActionBarGUI._otherListID = "FSActionBarOtherActions";
    ActionBarGUI._nrInstances = 0;
    ActionBarGUIs.ActionBarGUI = ActionBarGUI;
})(ActionBarGUIs || (ActionBarGUIs = {}));
var InfoBarGUIs;
(function (InfoBarGUIs) {
    class InfoBarStatusBarsGUI {
        constructor() {
            if (InfoBarStatusBarsGUI._nrInstances > 0) {
                throw "InfoBarStatusBarsGUI already has an instance running!";
            }
            InfoBarStatusBarsGUI._nrInstances += 1;
            this._div = document.getElementById(InfoBarStatusBarsGUI._divID);
        }
        resetFightRound() {
        }
    }
    InfoBarStatusBarsGUI._divID = "FSInfoBarStatusBars";
    InfoBarStatusBarsGUI._nrInstances = 0;
    class EnemyGridGUI {
        constructor(div, symbol) {
            this._div = div;
            if (EnemyGridGUI._divDisplay == null) {
                EnemyGridGUI._divDisplay = this._div.style.display;
            }
            this._number = this._div.childNodes[1].childNodes[1];
            this._number.innerHTML = symbol;
            this._name = this._div.childNodes[1].childNodes[3];
            this._desc = this._div.childNodes[3];
            this._mods = this._div.childNodes[5];
            this._symbol = symbol;
        }
        setEnemy(enemy) {
            this._enemy = enemy;
            if (enemy == undefined) {
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
            if (this._enemy == undefined) {
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
    EnemyGridGUI._divClass = ".enemy_cell";
    EnemyGridGUI._divDisplay = null;
    class TimerGridStopPlanningGUI {
        static get classFullPath() {
            return EnemyGridTimerGridGUI.fullPath + ">" + this._divClass;
        }
        constructor(div) {
            this._div = div;
            this.setUpEventListeners();
        }
        setUpEventListeners() {
            let c_obj = this;
            c_obj._div.addEventListener('mousedown', (e) => this.onMouseDown(e, c_obj));
        }
        onMouseDown(e, c_obj) {
            FightScreenGUI.resetFightRound();
        }
    }
    TimerGridStopPlanningGUI._divClass = ".end_planning";
    class TimerGridTimerGUI {
        static get fullPath() {
            return EnemyGridTimerGridGUI.fullPath + ">" + this._divClass;
        }
        constructor() {
            this._timerIntervalID = null;
            this._div = document.querySelector(TimerGridTimerGUI.fullPath);
        }
        setTime(sep = ":") {
            let time = this._timer;
            let msec = (time % 1000).toString();
            msec = StringUtil.padRightUntilLength(msec, 3, '0');
            time = Math.floor(time / 1000);
            let sec = (time % 60).toString();
            sec = StringUtil.padRightUntilLength(sec, 2, '0');
            time = Math.floor(time / 60);
            let min = (time % 60).toString();
            min = StringUtil.padRightUntilLength(min, 2, '0');
            this._div.innerHTML = min + sep + sec + sep + msec;
        }
        resetTimer(time) {
            this._timer = time;
        }
        stopTimer() {
            if (this._timerIntervalID != null) {
                clearInterval(this._timerIntervalID);
                this._timerIntervalID = null;
            }
        }
        startTimer() {
            if (this._timerIntervalID == null) {
                this._timerIntervalID = setInterval(() => { this._timer -= 33; this.setTime(); }, 33);
            }
        }
    }
    TimerGridTimerGUI._divClass = ".timer";
    class EnemyGridTimerGridGUI {
        static get fullPath() {
            return InfoBarEnemyGridGUI.fullPath + ">" + this._divClass;
        }
        constructor() {
            this._stopPlanningGUIs = [];
            this._maxTime = 30 * 1000;
            this._div = document.querySelector(EnemyGridTimerGridGUI.fullPath);
            document.querySelectorAll(TimerGridStopPlanningGUI.classFullPath).forEach((e) => this._stopPlanningGUIs.push(new TimerGridStopPlanningGUI(e)));
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
    EnemyGridTimerGridGUI._divClass = ".plan_countdown";
    class InfoBarEnemyGridGUI {
        static get fullPath() {
            return InfoBarGUI.fullPath + ">#" + InfoBarEnemyGridGUI._divID;
        }
        constructor() {
            this._enemyGrindGUIs = [];
            if (InfoBarEnemyGridGUI._nrInstances > 0) {
                throw "InfoBarEnemyGridGUI already has an instance running!";
            }
            InfoBarEnemyGridGUI._nrInstances += 1;
            this._div = document.getElementById(InfoBarEnemyGridGUI._divID);
            document.querySelectorAll(InfoBarEnemyGridGUI.fullPath + ">" + EnemyGridGUI._divClass).forEach((e, i) => this._enemyGrindGUIs.push(new EnemyGridGUI(e, String(i + 1))));
            this._timerGridGUI = new EnemyGridTimerGridGUI();
            this.update();
        }
        update() {
            this._enemyGrindGUIs.forEach((e, i) => { i < InfoBarEnemyGridGUI._nrEnemyGridGUIs ? e.show() : e.hide(); });
        }
        resetTimer() {
            this._timerGridGUI.reset();
        }
        resetFightRound() {
            this._timerGridGUI.resetFightRound();
        }
    }
    InfoBarEnemyGridGUI._divID = "FSInfoBarEnemyGrid";
    InfoBarEnemyGridGUI._nrInstances = 0;
    InfoBarEnemyGridGUI._nrEnemyGridGUIs = 1;
    class InfoBarPlayerInfoGUI {
        constructor() {
            if (InfoBarPlayerInfoGUI._nrInstances > 0) {
                throw "InfoBarPlayerInfoGUI already has an instance running!";
            }
            InfoBarPlayerInfoGUI._nrInstances += 1;
            this._div = document.getElementById(InfoBarPlayerInfoGUI._divID);
        }
        resetFightRound() {
        }
    }
    InfoBarPlayerInfoGUI._divID = "FSInfOBarPlayerInfo";
    InfoBarPlayerInfoGUI._nrInstances = 0;
    class InfoBarGUI {
        static get fullPath() {
            return FightScreenGUI.fullPath + ">#" + InfoBarGUI._divID;
        }
        constructor() {
            if (InfoBarGUI._nrInstances > 0) {
                throw "InfoBarGUI already has an instance running!";
            }
            InfoBarGUI._nrInstances += 1;
            this._div = document.getElementById(InfoBarGUI._divID);
            this._statusBarsGUI = new InfoBarStatusBarsGUI();
            this._enemyGridGUI = new InfoBarEnemyGridGUI();
            this._playerInfoGUI = new InfoBarPlayerInfoGUI();
        }
        resetFightRound() {
            this._statusBarsGUI.resetFightRound();
            this._enemyGridGUI.resetFightRound();
            this._playerInfoGUI.resetFightRound();
        }
        setUpEnemiesGUI(fightInstance) {
        }
    }
    InfoBarGUI._divID = "FightScreenInfoBar";
    InfoBarGUI._nrInstances = 0;
    InfoBarGUIs.InfoBarGUI = InfoBarGUI;
})(InfoBarGUIs || (InfoBarGUIs = {}));
class DragObejctGUI {
    get left() {
        return this._div.style.left;
    }
    get top() {
        return this._div.style.top;
    }
    constructor() {
        this._div = document.getElementById(DragObejctGUI._divID);
    }
    setPosition(x, y, adjust_y = true) {
        let width = Number(getComputedStyle(this._div).getPropertyValue("width").slice(0, -2));
        let height = Number(getComputedStyle(this._div).getPropertyValue('height').slice(0, -2));
        this._div.style.left = (x).toString() + "px";
        if (adjust_y) {
            this._div.style.top = (y - height).toString() + "px";
        }
        else {
            this._div.style.top = (y).toString() + "px";
        }
    }
    setInnerHTML(innerHTML) {
        this._div.innerHTML = innerHTML;
    }
    setOpacity(op) {
        this._div.style.opacity = op.toString();
    }
    setStyle(style) {
        this._style = style;
        style.forEach((v, k) => { this._div.style[k] = v; });
    }
    reset() {
        //clear class list
        this._div.classList.forEach((k) => this._div.classList.remove(k));
        //clear style
        this._style.forEach((v, k) => this._div.style[k] = "");
        //clear innerHTML
        this._div.innerHTML = "";
        //hide
        this._div.style.display = "none";
    }
    moveWithMouse(e) {
        this._div.style.left = (e.pageX - DragAPI.dragOffsetX).toString() + "px";
        this._div.style.top = (e.pageY - DragAPI.dragOffsetY).toString() + "px";
    }
}
DragObejctGUI._divID = "FightScreenDragObject";
class DragAPI {
    static dragPropertyToCSS(property) {
        let ret = "";
        for (let i = 0; i < property.length; i++) {
            if (property[i].toLowerCase() == property[i]) {
                ret += property[i];
            }
            else {
                ret += "-" + property[i].toLowerCase();
            }
        }
        return ret;
    }
    static canDropHere(dragObjType) {
        if (this._dragging) {
            if (this._releasableDrag) {
                return true;
            }
            else {
                return this._insideDragDestArea && this._dragObjType == dragObjType;
            }
        }
        return false;
    }
    static canStartDrag() {
        if (!this._dragging) {
            return true;
        }
        return false;
    }
    static canMouseDownHere() {
        if (this._dragging && !this._insideDragDestArea) {
            return false;
        }
        return true;
    }
    static get dragging() {
        return this._dragging;
    }
    static get dragObjectType() {
        return this._dragObjType;
    }
    static get dragObjectData() {
        return this._dragging ? window.sessionStorage.getItem(this._dragObjType) : null;
    }
    static get insideDragDestinationArea() {
        return this._insideDragDestArea;
    }
    static get dragOffsetX() {
        return this._dragging ? this._dragOffsetX : null;
    }
    static get dragOffsetY() {
        return this._dragging ? this._dragOffsetY : null;
    }
    static setUpDragObject(style, innerHTML) {
        if (!this._dragging) {
            this._dragObj.setStyle(style);
            this._dragObj.setInnerHTML(innerHTML);
        }
    }
    static startDrag(dragObjectType, dragObjectData, e, releasableDrag = false) {
        if (this._dragging == false) {
            this._dragging = true;
            this._releasableDrag = releasableDrag;
            this._insideDragDestArea = false;
            this._dragObjType = dragObjectType;
            window.sessionStorage.setItem(dragObjectType, dragObjectData);
            let leftObj = Number(this._dragObj.left.slice(0, -2));
            let topObj = Number(this._dragObj.top.slice(0, -2));
            this._dragOffsetX = e.pageX - leftObj;
            this._dragOffsetY = e.pageY - topObj;
        }
    }
    static enterDragDestinationArea() {
        if (this.dragging) {
            this._insideDragDestArea = true;
        }
    }
    static exitDragDestinationArea() {
        if (this.dragging) {
            this._insideDragDestArea = false;
        }
    }
    static endDrag() {
        if (this.dragging) {
            window.sessionStorage.removeItem(this._dragObjType);
            this._dragging = false;
            this._releasableDrag = null;
            this._insideDragDestArea = null;
            this._dragObjType = null;
            this._dragObj.reset();
        }
    }
    static moveWithMouse(e) {
        this._dragObj.moveWithMouse(e);
    }
    static setUpEventListeners() {
        DragAPI._body.addEventListener('mousemove', (e) => DragAPI.onMouseMove(e));
    }
    static onMouseMove(e) {
        if (this.dragging) {
            DragAPI._dragObj.moveWithMouse(e);
        }
    }
}
DragAPI._body = document.body;
DragAPI._dragging = false;
DragAPI._releasableDrag = null;
DragAPI._insideDragDestArea = null;
DragAPI._dragObjType = null;
DragAPI._dragObj = new DragObejctGUI();
class FightScreenGUI {
    static get fullPath() {
        return "#" + FightScreenGUI._divID;
    }
    static resetFightRound() {
        this._self.resetFightRound();
    }
    constructor() {
        FightScreenGUI._self = this;
        this._div = document.getElementById(FightScreenGUI._divID);
        this._infoBarGUI = new InfoBarGUIs.InfoBarGUI();
        this._actionBarGUI = new ActionBarGUIs.ActionBarGUI();
        this._actoinPlanBarGUI = new ActionPlanBarGUIs.ActionPlanBarGUI();
        this.setUpEventListeners();
    }
    setUpEventListeners() {
        let c_obj = this;
        this._div.addEventListener('mousemove', (e) => c_obj.onMouseMove(e, c_obj));
    }
    setUpFight(fightInstance) {
    }
    onMouseMove(e, c_obj) {
        if (DragAPI.dragging) {
            DragAPI.moveWithMouse(e);
        }
    }
    resetFightRound() {
        this._infoBarGUI.resetFightRound();
        this._actoinPlanBarGUI.resetFightRound();
    }
}
FightScreenGUI._divID = "FightScreen";
class FightScreenController {
    static init() {
        if (this._initialized) {
            throw "ERROR: FightScreenController can only be initialized once!";
        }
        this._initialized = true;
        this._fightScreenGUI = new FightScreenGUI();
    }
    static startFight(fightInstance) {
        this._fightInstance = fightInstance;
        this._fightScreenGUI.setUpFight(this._fightInstance);
    }
}
FightScreenController._initialized = false;
FightScreenController._fightInstance = undefined;
class GameController {
    static getEnemyByName(name) {
        return Enemy.enemies[name];
    }
    static initAPIs() {
        DragAPI.setUpEventListeners();
    }
    static initControllers() {
        FightScreenController.init();
    }
    static init() {
        if (this._initialized) {
            throw "ERROR: GameController can only be initialized once!";
        }
        this.initAPIs();
        this.initControllers();
    }
}
GameController._initialized = false;
GameController._enemies = new Map();
GameController.init();
let f = new Fight(['Goblin']);
let fI = f.createFightInstance(1);
FightScreenController.startFight(fI);
//# sourceMappingURL=main.js.map