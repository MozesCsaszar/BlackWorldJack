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
        console.log(this._nextCard, this._cards);
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
            return this._cards;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Hand.prototype, "value", {
        get: function () {
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
    Hand.prototype.addCard = function (card) {
        this._cards.push(card);
    };
    return Hand;
}());
var h1 = new Hand(new Array(new Card('', 'A'), new Card('', 'A')));
console.log(h1.value);
var h2 = new Hand(new Array(new Card('', 'A'), new Card('', 'K')));
console.log(h2.value);
var h3 = new Hand(new Array(new Card('', 'A'), new Card('', '9'), new Card('', 'A')));
console.log(h3.value);
//# sourceMappingURL=main.js.map