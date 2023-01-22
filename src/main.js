var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MathUtil;
(function (MathUtil) {
    function getRandomIntBelow(max) {
        return Math.floor(Math.random() * max);
    }
    MathUtil.getRandomIntBelow = getRandomIntBelow;
})(MathUtil || (MathUtil = {}));
var ManaTypes;
(function (ManaTypes) {
    ManaTypes[ManaTypes["neutral"] = 0] = "neutral";
    ManaTypes[ManaTypes["fire"] = 1] = "fire";
    ManaTypes[ManaTypes["earth"] = 2] = "earth";
    ManaTypes[ManaTypes["water"] = 3] = "water";
    ManaTypes[ManaTypes["wind"] = 4] = "wind";
})(ManaTypes || (ManaTypes = {}));
var Card = /** @class */ (function () {
    function Card(suit, value, mana) {
        if (mana === void 0) { mana = ManaTypes.neutral; }
        this._suit = suit;
        this._manaType = mana;
        this._value = value;
    }
    Card.load = function (s) {
        var i = 0;
        var sep = getComputedStyle(document.body).getPropertyValue("--DEF-save-level0-sep");
        var s_a = s.split(sep);
        var suit = s_a[i];
        i++;
        var value = s_a[i];
        i++;
        var manaType = ManaTypes[s_a[i]];
        i++;
        return new Card(suit, value, manaType);
    };
    Object.defineProperty(Card.prototype, "suit", {
        get: function () {
            return this._suit;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "manaType", {
        get: function () {
            return this._manaType;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "copy", {
        get: function () {
            return new Card(this._suit, this._value, this._manaType);
        },
        enumerable: false,
        configurable: true
    });
    Card.prototype.toString = function () {
        return this._value + this._suit;
    };
    Card.prototype.save = function () {
        var sep = getComputedStyle(document.body).getPropertyValue("--DEF-save-level0-sep");
        return this._suit + sep + this._value + sep + this._manaType;
    };
    Card.prototype.load = function (s) {
        var i = 0;
        var sep = getComputedStyle(document.body).getPropertyValue("--DEF-save-level0-sep");
        var s_a = s.split(sep);
        this._suit = s_a[i];
        i++;
        this._value = s_a[i];
        i++;
        this._manaType = ManaTypes[s_a[i]];
        i++;
    };
    return Card;
}());
var Deck = /** @class */ (function () {
    function Deck() {
        this._cards = [];
    }
    Object.defineProperty(Deck.prototype, "cards", {
        get: function () {
            return this._cards;
        },
        enumerable: false,
        configurable: true
    });
    Deck.prototype.reset = function () {
        this._cards = [];
    };
    Deck.prototype.afterDeckRepopulation = function () {
        this._nextCard = MathUtil.getRandomIntBelow(this._cards.length);
    };
    Deck.prototype.setNextCard = function () {
        /* Set up next card for the drawing with removing the prev. drawn and setting new _nextCard */
        this._cards[this._nextCard] = this._cards[this._cards.length - 1];
        this._cards.pop();
        this._nextCard = MathUtil.getRandomIntBelow(this._cards.length);
    };
    Deck.prototype.pushAll = function (cList) {
        var _this = this;
        cList.forEach(function (element) {
            _this._cards.push(element.copy);
        });
    };
    Deck.prototype.setContent = function (oDeck) {
        var _this = this;
        this.reset();
        oDeck.cards.forEach(function (element) {
            _this._cards.push(element.copy);
        });
        this.afterDeckRepopulation();
    };
    Deck.prototype.setContentSuitsValuesMana = function (suits, values, manaType) {
        var _this = this;
        if (manaType === void 0) { manaType = ManaTypes.neutral; }
        this.reset();
        suits.forEach(function (s) {
            values.forEach(function (v) {
                _this._cards.push(new Card(s, v, manaType));
            });
        });
        this.afterDeckRepopulation();
    };
    Deck.prototype.peek = function () {
        return this._cards[this._nextCard];
    };
    Deck.prototype.draw = function () {
        //Get and remove a card randomly from the deck
        var next = this.cards[this._nextCard];
        this.setNextCard();
        return next;
    };
    Deck.prototype.toString = function () {
        return this.cards.map(function (c) { return c.toString(); }).reduce(function (a, s) { return a += s + "|"; }, "").slice(0, -1);
    };
    Object.defineProperty(Deck.prototype, "copy", {
        get: function () {
            var d = new Deck();
            d.pushAll(this._cards.map(function (c) { return c.copy; }).reduce(function (a, c) { a.push(c); return a; }, new Array()));
            return d;
        },
        enumerable: false,
        configurable: true
    });
    Deck.suits = ['♣', '♦', '♥', '♠'];
    Deck.values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'J', 'Q', 'K'];
    return Deck;
}());
var Hand = /** @class */ (function () {
    function Hand(cards) {
        if (cards === void 0) { cards = []; }
        this._cards = cards;
    }
    Object.defineProperty(Hand.prototype, "cards", {
        get: function () {
            //get current cards
            return this._cards;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Hand.prototype, "value", {
        get: function () {
            //return the numeric value of the hand
            var value;
            value = this._cards.map(function (c) { return c.value == 'A' ? 11 : (c.value == 'J' || c.value == 'Q' || c.value == 'K' ? 10 : Number(c.value)); }).reduce(function (a, n) { return a + n; }, 0);
            var nr_aces = this._cards.map(function (c) { return c.value == 'A' ? 1 : 0; }).reduce(function (a, n) { return a + n; }, 0);
            while (value > 21 && nr_aces > 0) {
                nr_aces -= 1;
                value -= 10;
            }
            return value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Hand.prototype, "length", {
        get: function () {
            return this._cards.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Hand.prototype, "busted", {
        get: function () {
            return this.value > 21;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Hand.prototype, "final", {
        get: function () {
            return this.value >= 21;
        },
        enumerable: false,
        configurable: true
    });
    Hand.prototype.addCard = function (card) {
        //add a new card to the hand; card not copied
        this._cards.push(card);
    };
    Hand.prototype.popCard = function () {
        this._cards.pop();
    };
    return Hand;
}());
/*                                      GUI                                                 */
var CardGUI = /** @class */ (function () {
    function CardGUI(div, card) {
        if (card === void 0) { card = null; }
        this._card = card;
        this._div = div;
    }
    Object.defineProperty(CardGUI.prototype, "card", {
        get: function () {
            return this._card;
        },
        set: function (card) {
            this._card = card;
            this.update();
        },
        enumerable: false,
        configurable: true
    });
    CardGUI.prototype.update = function () {
        if (this.card == null) {
            this._div.style.display = 'none';
        }
        else {
            this._div.style.display = 'block';
            this._div.innerHTML = this.card.value + "<br>" + this.card.suit;
        }
    };
    CardGUI.prototype.reset = function () {
        this._div.textContent = "";
        this._div.hidden = true;
        this._card = null;
    };
    CardGUI.prototype.setAsTemp = function () {
        this._div.style.opacity = "0.5";
    };
    CardGUI.prototype.setAsPerm = function () {
        this._div.style.opacity = "1";
    };
    CardGUI.prototype.setLeft = function (left) {
        //set the left property of style of the div to allow for stylizing the card display format
        this._div.style.left = left.toString() + "px";
    };
    CardGUI._divClass = ".card";
    return CardGUI;
}());
var HandGUI = /** @class */ (function () {
    function HandGUI(super_path) {
        var _this = this;
        this._cardGUIs = [];
        var path = super_path + ">" + HandGUI._divClass;
        this._div = document.querySelector(path);
        document.querySelectorAll(path + ">" + CardGUI._divClass).forEach(function (e) { return _this._cardGUIs.push(new CardGUI(e)); });
        this._hand = new Hand();
        this.stylizeDeck();
    }
    Object.defineProperty(HandGUI.prototype, "value", {
        get: function () {
            return this._hand.value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HandGUI.prototype, "busted", {
        get: function () {
            return this._hand.busted;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HandGUI.prototype, "final", {
        get: function () {
            return this.busted || this._hand.final;
        },
        enumerable: false,
        configurable: true
    });
    HandGUI.prototype.update = function () {
        this._cardGUIs.forEach(function (e) { return e.update(); });
    };
    HandGUI.prototype.addCard = function (card) {
        this._cardGUIs[this._hand.length].card = card;
    };
    HandGUI.prototype.addTempCard = function (card) {
        //visual and deck changes
        this._cardGUIs[this._hand.length].card = card;
        this._cardGUIs[this._hand.length].setAsTemp();
        this._hand.addCard(card);
    };
    HandGUI.prototype.finalizeTempCard = function () {
        //visual changes only
        this._cardGUIs[this._hand.length - 1].setAsPerm();
    };
    HandGUI.prototype.removeTempCard = function () {
        this._cardGUIs[this._hand.length - 1].card = null;
        this._hand.popCard();
    };
    HandGUI.prototype.stylizeDeck = function () {
        this._cardGUIs.forEach(function (e, i) {
            e.setLeft(i * 20.96);
        });
    };
    HandGUI._divClass = ".card_holder";
    return HandGUI;
}());
var ActionGUI = /** @class */ (function () {
    function ActionGUI(nr) {
        this._entered = false;
        this._handGUI = new HandGUI(ActionGUI._divClass + "._" + nr);
        this._div = document.querySelector(ActionGUI._divClass + "._" + nr);
        this.setUpEventListeners();
        this.update();
    }
    Object.defineProperty(ActionGUI.prototype, "busted", {
        get: function () {
            return this._handGUI.busted;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ActionGUI.prototype, "final", {
        get: function () {
            return this.busted || this._handGUI.final;
        },
        enumerable: false,
        configurable: true
    });
    ActionGUI.prototype.setUpEventListeners = function () {
        var c_obj = this;
        c_obj._div.addEventListener('mouseenter', function (e) { return c_obj.onMouseEnter(e, c_obj); });
        c_obj._div.addEventListener('mouseleave', function (e) { return c_obj.onMouseLeave(e, c_obj); });
        c_obj._div.addEventListener('mouseup', function (e) { return c_obj.onMouseUp(e, c_obj); });
    };
    ActionGUI.prototype.onMouseEnter = function (e, c_obj) {
        if (FightScreenGUI.dragObjectType == DragCardGUI._dragObjType && !c_obj._handGUI.busted) {
            c_obj._handGUI.addTempCard(Card.load(FightScreenGUI.dragObjectData));
            c_obj.update();
            c_obj._entered = true;
            FightScreenGUI.enterDragDestinationArea();
        }
    };
    ActionGUI.prototype.onMouseLeave = function (e, c_obj) {
        if (FightScreenGUI.dragObjectType == DragCardGUI._dragObjType && c_obj._entered) {
            c_obj._handGUI.removeTempCard();
            c_obj.update();
            c_obj._entered = false;
            FightScreenGUI.exitDragDestinationArea();
        }
    };
    ActionGUI.prototype.onMouseUp = function (e, c_obj) {
        if (FightScreenGUI.dragObjectType == DragCardGUI._dragObjType) {
            c_obj._handGUI.finalizeTempCard();
            ActionHolderGUI.setFinalAll();
            c_obj._entered = false;
            FightScreenGUI.endDrag();
            DeckGUI.resetDragCard();
        }
    };
    ActionGUI.prototype.update = function () {
        this._handGUI.update();
        var value = this._handGUI.value;
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
    };
    ActionGUI.prototype.show = function () {
        this._div.style.display = "flex";
    };
    ActionGUI.prototype.hide = function () {
        this._div.style.display = "none";
    };
    ActionGUI.prototype.addCard = function (card) {
        this._handGUI.addCard(card);
    };
    ActionGUI._divClass = ".action_card_space";
    return ActionGUI;
}());
var Player = /** @class */ (function () {
    function Player() {
        this._nrActions = 2;
        this._nrDecks = 1;
    }
    Object.defineProperty(Player.prototype, "nrActions", {
        get: function () {
            return this._nrActions;
        },
        set: function (nr) {
            this._nrActions = nr;
        },
        enumerable: false,
        configurable: true
    });
    return Player;
}());
//who implement this need to have the static field
var DraggableGUI = /** @class */ (function () {
    function DraggableGUI() {
    }
    DraggableGUI.prototype.moveWithMouse = function (e) { };
    Object.defineProperty(DraggableGUI.prototype, "left", {
        get: function () { return ""; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DraggableGUI.prototype, "top", {
        get: function () { return ""; },
        enumerable: false,
        configurable: true
    });
    return DraggableGUI;
}());
var DragCardGUI = /** @class */ (function (_super) {
    __extends(DragCardGUI, _super);
    function DragCardGUI(div, card) {
        if (card === void 0) { card = null; }
        var _this = _super.call(this) || this;
        _this._card = card;
        _this._div = div;
        return _this;
    }
    Object.defineProperty(DragCardGUI.prototype, "card", {
        get: function () {
            return this._card;
        },
        set: function (card) {
            this._card = card;
            this.initialUpdate();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DragCardGUI.prototype, "left", {
        get: function () {
            return this._div.style.left;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DragCardGUI.prototype, "top", {
        get: function () {
            return this._div.style.top;
        },
        enumerable: false,
        configurable: true
    });
    DragCardGUI.prototype.initialUpdate = function () {
        if (this.card == null) {
            this._div.style.display = 'none';
        }
        else {
            this._div.style.display = 'block';
            this._div.innerHTML = this.card.value + "<br>" + this.card.suit;
        }
    };
    DragCardGUI.prototype.setPosition = function (x, y, adjust_y) {
        if (adjust_y === void 0) { adjust_y = true; }
        var width = Number(getComputedStyle(this._div).getPropertyValue("--FSAPB-card-width").slice(0, -2));
        var height = Number(getComputedStyle(this._div).getPropertyValue("--FSAPB-card-height").slice(0, -2));
        this._div.style.left = (x).toString() + "px";
        if (adjust_y) {
            this._div.style.top = (y - height / 2).toString() + "px";
        }
        else {
            this._div.style.top = (y).toString() + "px";
        }
    };
    DragCardGUI.prototype.setOpacity = function (op) {
        this._div.style.opacity = op.toString();
    };
    DragCardGUI.prototype.reset = function () {
        this._div.textContent = "";
        this.card = null;
    };
    DragCardGUI.prototype.moveWithMouse = function (e) {
        this._div.style.left = (e.pageX - FightScreenGUI.dragOffsetX).toString() + "px";
        this._div.style.top = (e.pageY - FightScreenGUI.dragOffsetY).toString() + "px";
    };
    DragCardGUI._divID = "#FSActionPlanBarDragCard";
    DragCardGUI._dragObjType = 'card';
    return DragCardGUI;
}(DraggableGUI));
var DeckGUI = /** @class */ (function () {
    function DeckGUI(div) {
        this._div = div;
        this._deck = new Deck();
        this.setUpEventListeners();
    }
    DeckGUI.resetDragCard = function () {
        DeckGUI._dragCardGUI.reset();
    };
    DeckGUI.prototype.setContentSuitsValuesMana = function (suits, values, manaType) {
        if (manaType === void 0) { manaType = ManaTypes.neutral; }
        this._deck.setContentSuitsValuesMana(suits, values, manaType);
    };
    DeckGUI.prototype.setUpEventListeners = function () {
        var c_obj = this;
        this._div.addEventListener("mousedown", function (e) { return c_obj.onMouseDown(e, c_obj); });
    };
    DeckGUI.prototype.onMouseDown = function (e, c_obj) {
        if (!FightScreenActionPlanBarGUI._finalAll) {
            var c = c_obj._deck.draw();
            DeckGUI._dragCardGUI.card = c;
            var left = c_obj._div.getBoundingClientRect().left - 12;
            var top_1 = c_obj._div.getBoundingClientRect().top + 4;
            DeckGUI._dragCardGUI.setPosition(left, top_1);
            FightScreenGUI.startDrag(DragCardGUI._dragObjType, DeckGUI._dragCardGUI, DeckGUI._dragCardGUI.card.save(), e);
        }
    };
    DeckGUI.prototype.show = function () {
        this._div.style.display = 'grid';
    };
    DeckGUI.prototype.hide = function () {
        this._div.style.display = 'none';
    };
    DeckGUI._divClass = ".deck";
    DeckGUI._dragCardGUI = new DragCardGUI(document.getElementById('FSActionPlanBarDragCard'));
    return DeckGUI;
}());
var DeckHolderGUI = /** @class */ (function () {
    function DeckHolderGUI() {
        var _this = this;
        this._currentDeckGUIs = 1;
        this._deckGUIs = [];
        //set up deck GUI's
        document.querySelectorAll('#FightScreenActionPlanBar' + '>' + DeckHolderGUI._divClass + '>' + DeckGUI._divClass).forEach(function (e) { _this._deckGUIs.push(new DeckGUI(e)); });
        this._deckGUIs[0].setContentSuitsValuesMana(Deck.suits, Deck.values);
        this.update();
    }
    DeckHolderGUI.prototype.update = function () {
        var _this = this;
        this._deckGUIs.forEach(function (e, i) { i < _this._currentDeckGUIs ? e.show() : e.hide(); });
    };
    DeckHolderGUI._divClass = ".deck_holder";
    return DeckHolderGUI;
}());
var ActionHolderGUI = /** @class */ (function () {
    function ActionHolderGUI(superDivID) {
        //set up deck GUI's
        document.querySelectorAll(superDivID + '>' + ActionGUI._divClass).forEach(function (e, i) { ActionHolderGUI._actionGUIs.push(new ActionGUI(i.toString())); });
        this.update();
    }
    ActionHolderGUI.setFinalAll = function () {
        var foundNotFinal = false;
        ActionHolderGUI._actionGUIs.forEach(function (e, i) {
            if (!e.final && i < ActionHolderGUI._currentActionGUIs) {
                FightScreenActionPlanBarGUI._finalAll = false;
                foundNotFinal = true;
                return;
            }
        });
        if (!foundNotFinal) {
            FightScreenActionPlanBarGUI._finalAll = true;
        }
    };
    ActionHolderGUI.prototype.update = function () {
        ActionHolderGUI._actionGUIs.forEach(function (e, i) { i < ActionHolderGUI._currentActionGUIs ? e.show() : e.hide(); });
    };
    ActionHolderGUI._currentActionGUIs = 2;
    ActionHolderGUI._actionGUIs = [];
    return ActionHolderGUI;
}());
var FightScreenActionPlanBarGUI = /** @class */ (function () {
    function FightScreenActionPlanBarGUI() {
        this._currentActionGUIs = 0;
        this._deckHolderGUI = new DeckHolderGUI();
        this._actionHolderGUI = new ActionHolderGUI(FightScreenActionPlanBarGUI._divID);
    }
    FightScreenActionPlanBarGUI._divID = '#FightScreenActionPlanBar';
    FightScreenActionPlanBarGUI._finalAll = false;
    return FightScreenActionPlanBarGUI;
}());
var FightScreenGUI = /** @class */ (function () {
    function FightScreenGUI() {
        this._div = document.getElementById(FightScreenGUI._divID);
        this.setUpEventListeners();
    }
    Object.defineProperty(FightScreenGUI, "dragging", {
        get: function () {
            return this._dragging;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FightScreenGUI, "dragObjectType", {
        get: function () {
            return this._dragObjType;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FightScreenGUI, "dragObjectData", {
        get: function () {
            return this._dragging ? window.sessionStorage.getItem(this._dragObjType) : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FightScreenGUI, "insideDragDestinationArea", {
        get: function () {
            return this._insideDragDestArea;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FightScreenGUI, "dragOffsetX", {
        get: function () {
            return this._dragging ? this._dragOffsetX : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FightScreenGUI, "dragOffsetY", {
        get: function () {
            return this._dragging ? this._dragOffsetY : null;
        },
        enumerable: false,
        configurable: true
    });
    FightScreenGUI.startDrag = function (dragObjectType, dragObject, dragObjectData, e, releasableDrag) {
        if (releasableDrag === void 0) { releasableDrag = false; }
        if (this._dragging == false) {
            this._dragging = true;
            this._releasableDrag = releasableDrag;
            this._insideDragDestArea = false;
            this._dragObjType = dragObjectType;
            this._dragObj = dragObject;
            window.sessionStorage.setItem(dragObjectType, dragObjectData);
            var leftObj = Number(dragObject.left.slice(0, -2));
            var topObj = Number(dragObject.top.slice(0, -2));
            this._dragOffsetX = e.pageX - leftObj;
            this._dragOffsetY = e.pageY - topObj;
        }
    };
    FightScreenGUI.enterDragDestinationArea = function () {
        if (this.dragging) {
            this._insideDragDestArea = true;
        }
    };
    FightScreenGUI.exitDragDestinationArea = function () {
        if (this.dragging) {
            this._insideDragDestArea = false;
        }
    };
    FightScreenGUI.endDrag = function () {
        if (this.dragging) {
            window.sessionStorage.removeItem(this._dragObjType);
            this._dragging = false;
            this._releasableDrag = null;
            this._insideDragDestArea = null;
            this._dragObjType = null;
            this._dragObj = null;
        }
    };
    FightScreenGUI.prototype.setUpEventListeners = function () {
        var c_obj = this;
        this._div.addEventListener('mousemove', function (e) { return c_obj.onMouseMove(e, c_obj); });
    };
    FightScreenGUI.prototype.onMouseMove = function (e, c_obj) {
        if (FightScreenGUI.dragging) {
            FightScreenGUI._dragObj.moveWithMouse(e);
        }
    };
    FightScreenGUI._divID = "FightScreen";
    FightScreenGUI._dragging = false;
    FightScreenGUI._releasableDrag = null;
    FightScreenGUI._insideDragDestArea = null;
    FightScreenGUI._dragObjType = null;
    FightScreenGUI._dragObj = null;
    return FightScreenGUI;
}());
var fSAPBGUI = new FightScreenActionPlanBarGUI();
var FSGUI = new FightScreenGUI();
//# sourceMappingURL=main.js.map