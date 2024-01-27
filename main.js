/*                                      Util Namespaces */
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
var ElementalAttributes = /** @class */ (function () {
    function ElementalAttributes(physical, fire, water, earth, wind) {
        if (physical === void 0) { physical = 0; }
        if (fire === void 0) { fire = 0; }
        if (water === void 0) { water = 0; }
        if (earth === void 0) { earth = 0; }
        if (wind === void 0) { wind = 0; }
        this.physical = physical;
        this.fire = fire;
        this.water = water;
        this.earth = earth;
        this.wind = wind;
    }
    ElementalAttributes.prototype.copy = function () {
        return new ElementalAttributes(this.physical, this.fire, this.water, this.earth, this.water);
    };
    return ElementalAttributes;
}());
var EntityStats = /** @class */ (function () {
    function EntityStats(health, defense, attack, resistance) {
        this._health = health;
        this._defense = defense;
        this._attack = attack;
        this._resistance = resistance;
    }
    EntityStats.prototype.copy = function () {
        return new EntityStats(this._health, this._defense.copy(), this._attack.copy(), this._resistance.copy());
    };
    return EntityStats;
}());
var Enemy;
(function (Enemy_1) {
    var Modifier;
    (function (Modifier) {
    })(Modifier || (Modifier = {}));
    var Scaling = /** @class */ (function () {
        function Scaling() {
        }
        Scaling.prototype.copy = function () {
            return new Scaling();
        };
        return Scaling;
    }());
    var EnemyBody = /** @class */ (function () {
        function EnemyBody(attributes, modifiers) {
            var _this = this;
            this._modifiers = [];
            this._attributes = attributes.copy();
            modifiers.forEach(function (e) { return _this._modifiers.push(e); });
        }
        Object.defineProperty(EnemyBody.prototype, "attributes", {
            get: function () {
                return this._attributes;
            },
            enumerable: false,
            configurable: true
        });
        EnemyBody.prototype.copy = function () {
            return new EnemyBody(this._attributes, this._modifiers);
        };
        return EnemyBody;
    }());
    var EnemyInfo = /** @class */ (function () {
        function EnemyInfo(name, desc) {
            this.name = name;
            this.desc = desc;
        }
        return EnemyInfo;
    }());
    var EnemyWithLevel = /** @class */ (function () {
        function EnemyWithLevel(body, level) {
            this._body = body.copy();
            this._level = level;
        }
        Object.defineProperty(EnemyWithLevel.prototype, "pos", {
            get: function () {
                return this._pos;
            },
            set: function (position) {
                this._pos = position;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EnemyWithLevel.prototype, "baseStats", {
            get: function () {
                return this._body.attributes;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EnemyWithLevel.prototype, "level", {
            get: function () {
                return this._level;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EnemyWithLevel.prototype, "name", {
            get: function () {
                return this._info.name;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EnemyWithLevel.prototype, "desc", {
            get: function () {
                return this._info.desc;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EnemyWithLevel.prototype, "symbol", {
            get: function () {
                return this._symbol;
            },
            set: function (sym) {
                this._symbol = sym;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EnemyWithLevel.prototype, "enemyInfo", {
            set: function (info) {
                this._info = info;
            },
            enumerable: false,
            configurable: true
        });
        EnemyWithLevel.prototype.copy = function () {
            var e = new EnemyWithLevel(this._body.copy(), this._level);
            e.enemyInfo = this._info;
            return e;
        };
        return EnemyWithLevel;
    }());
    Enemy_1.EnemyWithLevel = EnemyWithLevel;
    var Enemy = /** @class */ (function () {
        function Enemy(name, desc, levels, scaling) {
            if (scaling === void 0) { scaling = undefined; }
            var _this = this;
            this._levels = new Map();
            this._name = name;
            this._desc = desc;
            levels.forEach(function (e, k) { e.enemyInfo = _this.getInfo(); _this._levels.set(k, e.copy()); });
            this._scaling = scaling == undefined ? undefined : scaling.copy();
        }
        Enemy.copy = function (enemy) {
            return enemy.copy();
        };
        Enemy.prototype.copy = function () {
            var e = new Enemy(this._name, this._desc, this._levels, this._scaling == undefined ? undefined : this._scaling.copy());
            return e;
        };
        Enemy.prototype.getEnemyWithLevel = function (level) {
            if (level >= 1) {
                if (this._levels.get(level) != undefined) {
                    return this._levels.get(level).copy();
                }
                else {
                    /*Cases:
                        I:      There is an enemy with lower level and scaling     -> Scale enemy from lower level
                        II:     There is an enemy with higher level and no scaling -> Get enemy from higher level
                        III:    There is no enemy with higher level and no scaling -> Throw error
                    */
                    var tempLevels = [];
                    for (var _i = 0, _a = this._levels.keys(); _i < _a.length; _i++) {
                        var level_1 = _a[_i];
                        tempLevels.push(level_1);
                    }
                    tempLevels = tempLevels.sort();
                    if (this._scaling != undefined) {
                        console.log("SCALED");
                        return this._levels.get(0).copy();
                    }
                    else {
                        var higher_1 = undefined;
                        tempLevels.forEach(function (e) {
                            if (e > level) {
                                if (higher_1 == undefined) {
                                    higher_1 = e;
                                }
                            }
                        });
                        if (higher_1 == undefined) {
                            throw "ERROR: No higher level enemy to initialize this one!";
                        }
                        else {
                            return this._levels.get(higher_1).copy();
                        }
                    }
                }
            }
            else {
                throw "ERROR: Cannot copy Enemy with level < 1";
            }
        };
        Enemy.prototype.getInfo = function () {
            return new EnemyInfo(this._name, this._desc);
        };
        return Enemy;
    }());
    Enemy_1.Enemy = Enemy;
    Enemy_1.enemies = {
        'Goblin': new Enemy('Goblin', 'Stinky and foul looking, these creatures are not the bestest fighters.', new Map([
            [1, new EnemyWithLevel(new EnemyBody(new EntityStats(10, new ElementalAttributes(), new ElementalAttributes(3), new ElementalAttributes()), []), 1)]
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
var Card = /** @class */ (function () {
    function Card(suit, value, mana) {
        if (mana === void 0) { mana = CardManaTypes.neutral; }
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
        var manaType = CardManaTypes[s_a[i]];
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
    Object.defineProperty(Card.prototype, "HTMLString", {
        get: function () {
            return this._value + "<br>" + this._suit;
        },
        enumerable: false,
        configurable: true
    });
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
        this._manaType = CardManaTypes[s_a[i]];
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
        if (manaType === void 0) { manaType = CardManaTypes.neutral; }
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
    Hand.prototype.get = function (i) {
        if (i >= this._cards.length) {
            return null;
        }
        return this._cards[i];
    };
    Hand.prototype.addCard = function (card) {
        //add a new card to the hand; card not copied
        if (card != null) {
            this._cards.push(card);
        }
    };
    Hand.prototype.popCard = function () {
        this._cards.pop();
    };
    Hand.prototype.reset = function () {
        this._cards = [];
    };
    return Hand;
}());
var PassableTile = /** @class */ (function () {
    function PassableTile(backgroundColor) {
        this._backgroundColor = backgroundColor;
    }
    Object.defineProperty(PassableTile.prototype, "type", {
        get: function () {
            return 'PassableTile';
        },
        enumerable: false,
        configurable: true
    });
    PassableTile.prototype.repr = function (contentRepr) {
        if (contentRepr === void 0) { contentRepr = ''; }
        return "<div style=\"background-color: " + this._backgroundColor + "; width: 100%; height: 100%\">" + contentRepr + "</div>";
    };
    PassableTile.prototype.copy = function () {
        return new PassableTile(this._backgroundColor);
    };
    return PassableTile;
}());
var EnemyTile = /** @class */ (function () {
    function EnemyTile(backgroundTile) {
        if (backgroundTile === void 0) { backgroundTile = undefined; }
        this._backgroundTile = backgroundTile;
    }
    Object.defineProperty(EnemyTile.prototype, "type", {
        get: function () {
            return 'EnemyTile';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EnemyTile.prototype, "backgroundTile", {
        get: function () {
            return this._backgroundTile;
        },
        enumerable: false,
        configurable: true
    });
    EnemyTile.prototype.setBackgroundTile = function (tile) {
        if (this._backgroundTile == undefined) {
            this._backgroundTile = tile;
        }
        else {
            throw "ERROR: Cannot set background tile of EnemyTile when it is not unknown!";
        }
    };
    EnemyTile.prototype.repr = function (contentRepr) {
        if (contentRepr === void 0) { contentRepr = ''; }
        return this._backgroundTile.repr(contentRepr);
    };
    EnemyTile.prototype.copy = function () {
        return new EnemyTile(this.backgroundTile);
    };
    return EnemyTile;
}());
var TileWithPosition = /** @class */ (function () {
    function TileWithPosition(row, col, tile) {
        this._row = row;
        this._col = col;
        this._tile = tile;
    }
    Object.defineProperty(TileWithPosition.prototype, "row", {
        get: function () {
            return this._row;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileWithPosition.prototype, "col", {
        get: function () {
            return this._col;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileWithPosition.prototype, "tile", {
        get: function () {
            return this._tile;
        },
        enumerable: false,
        configurable: true
    });
    TileWithPosition.prototype.copy = function () {
        return new TileWithPosition(this._row, this._col, this._tile.copy());
    };
    return TileWithPosition;
}());
var FightBoardTemplate = /** @class */ (function () {
    function FightBoardTemplate(defTile, tiles) {
        if (tiles === void 0) { tiles = []; }
        var _this = this;
        this._tiles = [];
        this._defTile = defTile;
        tiles.forEach(function (e) { _this._tiles.push(e.copy()); });
    }
    Object.defineProperty(FightBoardTemplate.prototype, "tiles", {
        get: function () {
            return this._tiles;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FightBoardTemplate.prototype, "defaultTile", {
        get: function () {
            return this._defTile;
        },
        enumerable: false,
        configurable: true
    });
    FightBoardTemplate.prototype.copy = function () {
        return new FightBoardTemplate(this._defTile, this._tiles);
    };
    return FightBoardTemplate;
}());
var FightBoard = /** @class */ (function () {
    function FightBoard(width, height) {
        this._baseLayer = [];
        this._enemyLayer = [];
        this._enemySpawnTiles = [];
        for (var i = 0; i < height; i++) {
            this._baseLayer[i] = [];
            this._enemyLayer[i] = [];
        }
        this._width = width;
        this._height = height;
    }
    Object.defineProperty(FightBoard.prototype, "playerPos", {
        get: function () {
            return this._playerPos;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FightBoard.prototype, "baseLayer", {
        get: function () {
            return this._baseLayer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FightBoard.prototype, "enemyLayer", {
        get: function () {
            return this._enemyLayer;
        },
        enumerable: false,
        configurable: true
    });
    FightBoard.prototype.setUpFromTemplate = function (template) {
        var _this = this;
        var templated = [];
        this._enemySpawnTiles = [];
        for (var i = 0; i < this._height; i++) {
            templated.push([]);
            for (var j = 0; j < this._width; j++) {
                templated[i].push(false);
            }
        }
        template.tiles.forEach(function (e) {
            _this._baseLayer[e.row][e.col] = e.tile.copy();
            templated[e.row][e.col] = true;
            if (e.tile.type == 'EnemyTile') {
                _this._enemySpawnTiles.push([e.row, e.col]);
                var t = e.tile;
                if (t.backgroundTile == undefined) {
                    t.setBackgroundTile(template.defaultTile.copy());
                }
                _this._baseLayer[e.row][e.col] = t;
            }
        });
        for (var i = 0; i < this._height; i++) {
            for (var j = 0; j < this._width; j++) {
                if (!templated[i][j]) {
                    this._baseLayer[i][j] = template.defaultTile.copy();
                }
            }
        }
    };
    FightBoard.prototype.setUpEnemies = function (enemies) {
        var _this = this;
        enemies.forEach(function (e) {
            var r = MathUtil.getRandomIntBelow(_this._enemySpawnTiles.length);
            var place = _this._enemySpawnTiles[r];
            _this._enemyLayer[place[0]][place[1]] = e;
            e.pos = place;
            _this._enemySpawnTiles[r] = _this._enemySpawnTiles[_this._enemySpawnTiles.length - 1];
            _this._enemySpawnTiles.pop();
        });
    };
    FightBoard.prototype.setUpPlayer = function (playerPos) {
        this._playerPos = playerPos;
    };
    return FightBoard;
}());
var Player = /** @class */ (function () {
    // set nrActions(nr: number) {
    //     this._nrActions = nr;
    // }
    function Player(baseStats, nrActions, nrDecks) {
        this._nrActions = 2;
        this._nrDecks = 1;
        this._baseStats = baseStats;
        this._nrActions = nrActions;
        this._nrDecks = nrDecks;
    }
    Object.defineProperty(Player.prototype, "pos", {
        get: function () {
            return this._pos;
        },
        set: function (position) {
            this._pos = position;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "nrActions", {
        get: function () {
            return this._nrActions;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "nrDecks", {
        get: function () {
            return this._nrDecks;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "baseStats", {
        get: function () {
            return this._baseStats;
        },
        enumerable: false,
        configurable: true
    });
    return Player;
}());
var Action = /** @class */ (function () {
    function Action(name) {
        this._name = name;
    }
    Object.defineProperty(Action.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Action.prototype.save = function () {
        return this._name;
    };
    Action.prototype.load = function (save) {
        var i = 0;
        var s_list = save.split("\\e\\");
        this._name = s_list[i];
        i++;
    };
    return Action;
}());
var MoveAction = /** @class */ (function (_super) {
    __extends(MoveAction, _super);
    function MoveAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MoveAction.load = function (save) {
        var a = new MoveAction('');
        a.load(save);
        return a;
    };
    return MoveAction;
}(Action));
var FightInstance = /** @class */ (function () {
    function FightInstance() {
        this._enemies = [];
    }
    Object.defineProperty(FightInstance.prototype, "enemies", {
        get: function () {
            return this._enemies;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FightInstance.prototype, "fightBoard", {
        get: function () {
            return this._fightBoard;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FightInstance.prototype, "player", {
        get: function () {
            return this._player;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FightInstance.prototype, "playerPos", {
        get: function () {
            return this._playerPos;
        },
        enumerable: false,
        configurable: true
    });
    FightInstance.prototype.setUpFightBoard = function (width, height, boardTemplate) {
        this._fightBoard = new FightBoard(width, height);
        this._fightBoard.setUpFromTemplate(boardTemplate);
        this._fightBoard.setUpEnemies(this._enemies);
        this._fightBoard.setUpPlayer(this.playerPos);
    };
    FightInstance.prototype.addEnemy = function (e) {
        e.symbol = String(this._enemies.length + 1);
        this._enemies.push(e);
    };
    FightInstance.prototype.addPlayer = function (player, playerPos) {
        this._player = player;
        player.pos = playerPos;
        this._playerPos = playerPos;
    };
    return FightInstance;
}());
var Fight = /** @class */ (function () {
    function Fight(enemyNames, boardTemplate) {
        var _this = this;
        this._enemies = [];
        enemyNames.forEach(function (e) { return _this._enemies.push(e); });
        this._boardTemplate = boardTemplate;
    }
    Fight.prototype.createFightInstance = function (level, player, playerPos) {
        var fightInstance = new FightInstance();
        //Set up Entities: Enemies and Player
        this._enemies.forEach(function (e) { return fightInstance.addEnemy(GameController.getEnemyByName(e).getEnemyWithLevel(level)); });
        fightInstance.addPlayer(player, playerPos);
        //Set up the Board
        fightInstance.setUpFightBoard(8, 7, this._boardTemplate);
        return fightInstance;
    };
    return Fight;
}());
/*                                      GUI                                                 */
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
var ActionPlanBarGUIs;
(function (ActionPlanBarGUIs) {
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
            this._tempHand = new Hand();
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
        Object.defineProperty(HandGUI.prototype, "tempValue", {
            get: function () {
                return this._tempHand.value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HandGUI.prototype, "tempBusted", {
            get: function () {
                return this._tempHand.busted;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HandGUI.prototype, "tempFinal", {
            get: function () {
                return this._tempHand.final;
            },
            enumerable: false,
            configurable: true
        });
        HandGUI.prototype.update = function () {
            var _this = this;
            this._cardGUIs.forEach(function (e, i) { return e.card = _this._tempHand.get(i); });
        };
        HandGUI.prototype.addTempCard = function (card) {
            //visual changes only; change temp hand only
            this._cardGUIs[this._tempHand.length].card = card;
            this._cardGUIs[this._tempHand.length].setAsTemp();
            this._tempHand.addCard(card);
        };
        HandGUI.prototype.finalizeTempCard = function () {
            //visual and actual deck changes changes only
            this._cardGUIs[this._tempHand.length - 1].setAsPerm();
            this._hand.addCard(this._cardGUIs[this._tempHand.length - 1].card);
        };
        HandGUI.prototype.removeTempCard = function () {
            this._cardGUIs[this._tempHand.length - 1].card = null;
            this._tempHand.popCard();
        };
        HandGUI.prototype.stylizeDeck = function () {
            this._cardGUIs.forEach(function (e, i) {
                e.setLeft(i * 20.96);
            });
        };
        HandGUI.prototype.resetFightRound = function () {
            this._hand.reset();
            this._tempHand.reset();
            this.update();
        };
        HandGUI._divClass = ".card_holder";
        return HandGUI;
    }());
    var ActionGUI = /** @class */ (function () {
        function ActionGUI(path) {
            this._action = null;
            this._tempAction = null;
            this._div = document.querySelector(path + ">" + ActionGUI._divClass);
            this._action = null;
        }
        Object.defineProperty(ActionGUI.prototype, "action", {
            get: function () {
                return this._action;
            },
            set: function (action) {
                this._action = action;
                this.update();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ActionGUI.prototype, "tempAction", {
            set: function (action) {
                this._tempAction = action;
                this.update(true);
            },
            enumerable: false,
            configurable: true
        });
        ActionGUI.prototype.removeTemp = function () {
            this._tempAction = null;
            this.update();
        };
        ActionGUI.prototype.finalizeTemp = function () {
            this.action = this._tempAction;
        };
        ActionGUI.prototype.update = function (basedOnTemp) {
            if (basedOnTemp === void 0) { basedOnTemp = false; }
            var a = basedOnTemp ? this._tempAction : this._action;
            if (a == null) {
                this._div.innerHTML = "";
            }
            else {
                this._div.innerHTML = a.name;
            }
        };
        ActionGUI.prototype.reset = function () {
            this._action = null;
            this._tempAction = null;
        };
        ActionGUI._divClass = ".action";
        return ActionGUI;
    }());
    var ActionSpaceGUI = /** @class */ (function () {
        function ActionSpaceGUI(nr) {
            this._entered = false;
            this._handGUI = new HandGUI(ActionSpaceGUI._divClass + "._" + nr);
            this._actionGUI = new ActionGUI(ActionSpaceGUI._divClass + "._" + nr);
            this._div = document.querySelector(ActionSpaceGUI._divClass + "._" + nr);
            this.setUpEventListeners();
            this.update();
        }
        Object.defineProperty(ActionSpaceGUI.prototype, "busted", {
            get: function () {
                return this._handGUI.busted;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ActionSpaceGUI.prototype, "final", {
            get: function () {
                return this.busted || this._handGUI.final;
            },
            enumerable: false,
            configurable: true
        });
        ActionSpaceGUI.prototype.setUpEventListeners = function () {
            var c_obj = this;
            c_obj._div.addEventListener('mouseenter', function (e) { return c_obj.onMouseEnter(e, c_obj); });
            c_obj._div.addEventListener('mouseleave', function (e) { return c_obj.onMouseLeave(e, c_obj); });
            c_obj._div.addEventListener('mouseup', function (e) { return c_obj.onMouseUp(e, c_obj); });
        };
        ActionSpaceGUI.prototype.onMouseEnter = function (e, c_obj) {
            if (DragAPI.dragObjectType == DeckGUI._dragObjType && !c_obj._handGUI.busted) {
                c_obj._handGUI.addTempCard(Card.load(DragAPI.dragObjectData));
                c_obj.update();
                DragAPI.enterDragDestinationArea();
            }
            else if (DragAPI.dragObjectType == ActionBarGUIs.ActionListElementGUI._dragObjType) {
                c_obj._actionGUI.tempAction = Action.load(DragAPI.dragObjectData);
                DragAPI.enterDragDestinationArea();
            }
        };
        ActionSpaceGUI.prototype.onMouseLeave = function (e, c_obj) {
            if (DragAPI.dragObjectType == DeckGUI._dragObjType && DragAPI.insideDragDestinationArea) {
                c_obj._handGUI.removeTempCard();
                c_obj.update();
                DragAPI.exitDragDestinationArea();
            }
            else if (DragAPI.dragObjectType == ActionBarGUIs.ActionListElementGUI._dragObjType && DragAPI.insideDragDestinationArea) {
                c_obj._actionGUI.removeTemp();
                DragAPI.exitDragDestinationArea();
            }
        };
        ActionSpaceGUI.prototype.onMouseUp = function (e, c_obj) {
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
        };
        ActionSpaceGUI.prototype.update = function () {
            this._handGUI.update();
            this._actionGUI.update();
            var value = this._handGUI.tempValue;
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
        ActionSpaceGUI.prototype.show = function () {
            this._div.style.display = "flex";
        };
        ActionSpaceGUI.prototype.hide = function () {
            this._div.style.display = "none";
        };
        ActionSpaceGUI.prototype.resetFightRound = function () {
            this._handGUI.resetFightRound();
            this._actionGUI.reset();
            this.update();
        };
        ActionSpaceGUI._divClass = ".action_card_space";
        return ActionSpaceGUI;
    }());
    var DeckGUI = /** @class */ (function () {
        function DeckGUI(div) {
            this._div = div;
            this._deck = new Deck();
            this.setUpEventListeners();
        }
        DeckGUI.prototype.setContentSuitsValuesMana = function (suits, values, manaType) {
            if (manaType === void 0) { manaType = CardManaTypes.neutral; }
            this._deck.setContentSuitsValuesMana(suits, values, manaType);
        };
        DeckGUI.prototype.setUpEventListeners = function () {
            var c_obj = this;
            this._div.addEventListener("mousedown", function (e) { return c_obj.onMouseDown(e, c_obj); });
        };
        DeckGUI.prototype.onMouseDown = function (e, c_obj) {
            if (DragAPI.canStartDrag()) {
                if (!ActionPlanBarGUI._finalAll) {
                    var left = c_obj._div.getBoundingClientRect().left - 6;
                    var top_1 = c_obj._div.getBoundingClientRect().top - 52;
                    var c = c_obj._deck.draw();
                    this.setUpDragObject(left, top_1, c);
                    DragAPI.startDrag(DeckGUI._dragObjType, c.save(), e);
                }
            }
        };
        DeckGUI.prototype.setUpDragObject = function (left, top, card) {
            var styleSheet = getComputedStyle(this._div);
            var styleNeeded = new Map();
            DeckGUI._dragProperties.forEach(function (e) { styleNeeded.set(DragAPI.dragPropertyToCSS(e), styleSheet[e]); });
            styleNeeded.set('left', left + "px");
            styleNeeded.set('top', top + "px");
            styleNeeded.set('display', 'block');
            DragAPI.setUpDragObject(styleNeeded, this.createDragObjectInnerHTML(card));
        };
        DeckGUI.prototype.createDragObjectInnerHTML = function (card) {
            return card.HTMLString;
        };
        DeckGUI.prototype.show = function () {
            this._div.style.display = 'grid';
        };
        DeckGUI.prototype.hide = function () {
            this._div.style.display = 'none';
        };
        DeckGUI.prototype.resetFightRound = function () {
            this.setContentSuitsValuesMana(Deck.suits, Deck.values);
        };
        DeckGUI._divClass = ".deck";
        DeckGUI._dragObjType = 'card';
        DeckGUI._dragProperties = ['width', 'height', 'border', 'backgroundColor'];
        return DeckGUI;
    }());
    var DeckHolderGUI = /** @class */ (function () {
        function DeckHolderGUI() {
            var _this = this;
            this._deckGUIs = [];
            //set up deck GUI's
            document.querySelectorAll('#FightScreenActionPlanBar' + '>' + DeckHolderGUI._divClass + '>' + DeckGUI._divClass).forEach(function (e) { _this._deckGUIs.push(new DeckGUI(e)); });
            this._deckGUIs[0].setContentSuitsValuesMana(Deck.suits, Deck.values);
            this.update();
        }
        DeckHolderGUI.prototype.setUpFight = function (player) {
            DeckHolderGUI._currentDeckGUIs = player.nrDecks;
            this.update();
        };
        DeckHolderGUI.prototype.update = function () {
            this._deckGUIs.forEach(function (e, i) { i < DeckHolderGUI._currentDeckGUIs ? e.show() : e.hide(); });
        };
        DeckHolderGUI.prototype.resetFightRound = function () {
            this._deckGUIs.forEach(function (e, i) { i < DeckHolderGUI._currentDeckGUIs ? e.resetFightRound() : null; });
        };
        DeckHolderGUI._divClass = ".deck_holder";
        DeckHolderGUI._currentDeckGUIs = 1;
        return DeckHolderGUI;
    }());
    var ActionHolderGUI = /** @class */ (function () {
        function ActionHolderGUI(superDivID) {
            //set up deck GUI's
            document.querySelectorAll(superDivID + '>' + ActionSpaceGUI._divClass).forEach(function (e, i) { ActionHolderGUI._actionGUIs.push(new ActionSpaceGUI(i.toString())); });
            this.update();
        }
        ActionHolderGUI.setFinalAll = function () {
            var foundNotFinal = false;
            ActionHolderGUI._actionGUIs.forEach(function (e, i) {
                if (!e.final && i < ActionHolderGUI._currentActionGUIs) {
                    ActionPlanBarGUI._finalAll = false;
                    foundNotFinal = true;
                    return;
                }
            });
            if (!foundNotFinal) {
                ActionPlanBarGUI._finalAll = true;
            }
        };
        ActionHolderGUI.prototype.setUpFight = function (player) {
            ActionHolderGUI._currentActionGUIs = player.nrActions;
            this.update();
        };
        ActionHolderGUI.prototype.update = function () {
            ActionHolderGUI._actionGUIs.forEach(function (e, i) { i >= ActionHolderGUI._currentActionGUIs ? e.hide() : e.show(); });
        };
        ActionHolderGUI.prototype.resetFightRound = function () {
            ActionHolderGUI._actionGUIs.forEach(function (e, i) {
                if (i < ActionHolderGUI._currentActionGUIs) {
                    e.resetFightRound();
                }
                ;
            });
            ActionHolderGUI.setFinalAll();
        };
        ActionHolderGUI._currentActionGUIs = 7;
        //private static _actionGUIConfig:number[][] = [[], [2], [1, 3], [1, 2, 3], [0, 1, 3, 4], [0, 1, 2, 3, 4], [0, 1, 3, 4, 5, 6], [0, 1, 2, 3, 4, 5, 6]]
        ActionHolderGUI._actionGUIs = [];
        return ActionHolderGUI;
    }());
    var ActionPlanBarGUI = /** @class */ (function () {
        function ActionPlanBarGUI() {
            this._deckHolderGUI = new DeckHolderGUI();
            this._actionHolderGUI = new ActionHolderGUI(ActionPlanBarGUI._divID);
        }
        ActionPlanBarGUI.prototype.setUpFight = function (fightInstance) {
            this._actionHolderGUI.setUpFight(fightInstance.player);
            this._deckHolderGUI.setUpFight(fightInstance.player);
        };
        ActionPlanBarGUI.prototype.resetFightRound = function () {
            this._deckHolderGUI.resetFightRound();
            this._actionHolderGUI.resetFightRound();
        };
        ActionPlanBarGUI._divID = '#FightScreenActionPlanBar';
        ActionPlanBarGUI._finalAll = false;
        return ActionPlanBarGUI;
    }());
    ActionPlanBarGUIs.ActionPlanBarGUI = ActionPlanBarGUI;
})(ActionPlanBarGUIs || (ActionPlanBarGUIs = {}));
var ActionBarGUIs;
(function (ActionBarGUIs) {
    var AreaGridCellGUI = /** @class */ (function () {
        function AreaGridCellGUI(div, row, col) {
            this._div = div;
            this._row = row;
            this._col = col;
            this.setUpEventListeners();
        }
        Object.defineProperty(AreaGridCellGUI, "classFullPath", {
            get: function () {
                return AreaGridRowGUI.classFullPath + ">" + this._divClass;
            },
            enumerable: false,
            configurable: true
        });
        AreaGridCellGUI.prototype.setUpEventListeners = function () {
            var c_obj = this;
            this._div.addEventListener('mouseenter', function (e) { return c_obj.onMouseEnter(e, c_obj); });
            this._div.addEventListener('mouseleave', function (e) { return c_obj.onMouseLeave(e, c_obj); });
        };
        AreaGridCellGUI.prototype.onMouseEnter = function (e, c_obj) {
            if (!DragAPI.dragging) {
                c_obj._div.style.borderColor = 'rgb(0,0,255)';
            }
        };
        AreaGridCellGUI.prototype.onMouseLeave = function (e, c_obj) {
            if (!DragAPI.dragging) {
                c_obj._div.style.borderColor = 'green';
            }
        };
        AreaGridCellGUI.prototype.setUpFightCell = function (board) {
            var innerRepr = '';
            if (board.enemyLayer[this._row][this._col] != undefined) {
                innerRepr = "<div>" + board.enemyLayer[this._row][this._col].symbol + "</div>";
            }
            else if (board.playerPos[0] == this._row && board.playerPos[1] == this._col) {
                innerRepr = "<div>" + "P" + "</div>";
            }
            this._div.innerHTML = board.baseLayer[this._row][this._col].repr(innerRepr);
        };
        AreaGridCellGUI._divClass = ".cell";
        return AreaGridCellGUI;
    }());
    var AreaGridRowGUI = /** @class */ (function () {
        function AreaGridRowGUI(div, nr, offsetInd) {
            var _this = this;
            this._cellGUIs = [];
            this._div = div;
            this._div.style.left = (offsetInd * AreaGridRowGUI._rowOffset).toString() + "px";
            document.querySelectorAll(AreaGridRowGUI.classFullPath + "._" + nr + ">" + AreaGridCellGUI._divClass).forEach(function (e, i) { return _this._cellGUIs.push(new AreaGridCellGUI(e, nr, i)); });
        }
        Object.defineProperty(AreaGridRowGUI, "classFullPath", {
            get: function () {
                return ActionBarAreaGridGUI.fullPath + ">" + this._divClass;
            },
            enumerable: false,
            configurable: true
        });
        AreaGridRowGUI.prototype.setUpFightCell = function (col, board) {
            this._cellGUIs[col].setUpFightCell(board);
        };
        AreaGridRowGUI._divClass = ".row";
        AreaGridRowGUI._rowOffset = 28;
        return AreaGridRowGUI;
    }());
    var ActionBarAreaGridGUI = /** @class */ (function () {
        function ActionBarAreaGridGUI() {
            var _this = this;
            this._rowGUIs = [];
            if (ActionBarAreaGridGUI._nrInstances > 0) {
                throw "ActionBarAreaGridGUI already has an instance running!";
            }
            ActionBarAreaGridGUI._nrInstances += 1;
            this._div = document.getElementById(ActionBarAreaGridGUI._divID);
            document.querySelectorAll(AreaGridRowGUI.classFullPath).forEach(function (e, i, l) { _this._rowGUIs.push(new AreaGridRowGUI(e, i, l.length - i - 1)); });
        }
        Object.defineProperty(ActionBarAreaGridGUI, "fullPath", {
            get: function () {
                return ActionBarGUI.fullPath + ">#" + this._divID;
            },
            enumerable: false,
            configurable: true
        });
        ActionBarAreaGridGUI.prototype.setUpFightBoard = function (fightInstance) {
            var _this = this;
            fightInstance.fightBoard.baseLayer.forEach(function (e, row) { return e.forEach(function (tile, col) { return _this._rowGUIs[row].setUpFightCell(col, fightInstance.fightBoard); }); });
        };
        ActionBarAreaGridGUI._divID = "FSActionBarAreaGrid";
        ActionBarAreaGridGUI._nrInstances = 0;
        return ActionBarAreaGridGUI;
    }());
    var ActionListElementGUI = /** @class */ (function () {
        function ActionListElementGUI(div) {
            this._div = div;
            this.setUpEventListeners();
        }
        Object.defineProperty(ActionListElementGUI.prototype, "action", {
            get: function () {
                return this._action;
            },
            set: function (a) {
                this._action = a;
                this.display();
            },
            enumerable: false,
            configurable: true
        });
        ActionListElementGUI.prototype.setUpEventListeners = function () {
            var c_obj = this;
            this._div.addEventListener('mousedown', function (e) { return c_obj.onMouseDown(e, c_obj); });
        };
        ActionListElementGUI.prototype.display = function () {
            this._div.innerHTML = this.repr();
        };
        ActionListElementGUI.prototype.repr = function () {
            return this._action != null ? this._action.name : "";
        };
        ActionListElementGUI.prototype.setHeight = function (height) {
            this._div.style.height = (height - 2 * Number(getComputedStyle(this._div).borderWidth.slice(0, -2))) + "px";
        };
        ActionListElementGUI.prototype.onMouseDown = function (e, c_obj) {
            if (!DragAPI.dragging && c_obj.action != null) {
                var left = c_obj._div.getBoundingClientRect().left - 8;
                var top_2 = c_obj._div.getBoundingClientRect().top - 52;
                c_obj.setUpDragObject(left, top_2);
                DragAPI.startDrag(ActionListElementGUI._dragObjType, c_obj.action.save(), e, true);
            }
        };
        ActionListElementGUI.prototype.setUpDragObject = function (left, top) {
            var styleSheet = getComputedStyle(this._div);
            var styleNeeded = new Map();
            ActionListElementGUI._dragProperties.forEach(function (e) { styleNeeded.set(DragAPI.dragPropertyToCSS(e), styleSheet[e]); });
            styleNeeded.set('left', left + "px");
            styleNeeded.set('top', top + "px");
            DragAPI.setUpDragObject(styleNeeded, this.createDragObjectInnerHTML());
        };
        ActionListElementGUI.prototype.createDragObjectInnerHTML = function () {
            return this._action.name;
        };
        ActionListElementGUI._elementClass = ".action_list_element";
        ActionListElementGUI._dragObjType = "action";
        ActionListElementGUI._dragProperties = ['width', 'height', 'border', 'backgroundColor', 'display'];
        return ActionListElementGUI;
    }());
    ActionBarGUIs.ActionListElementGUI = ActionListElementGUI;
    var ActionListGUI = /** @class */ (function () {
        function ActionListGUI(div, elementsPerPage) {
            this._listElements = [];
            this._elements = [];
            this._div = div;
            this.elementsPerPage = elementsPerPage;
            this._currentPage = 0;
        }
        Object.defineProperty(ActionListGUI.prototype, "elementsPerPage", {
            get: function () {
                return this._listElements.length;
            },
            set: function (nr) {
                if (nr != this._listElements.length) {
                    while (this._listElements.length < nr) {
                        var newDiv = document.createElement('div');
                        newDiv.classList.add(ActionListElementGUI._elementClass.slice(1));
                        this._div.appendChild(newDiv);
                        this._listElements.push(new ActionListElementGUI(newDiv));
                    }
                    while (this._listElements.length > nr) {
                        this._listElements.pop();
                    }
                    var height_1 = this._div.clientHeight / this._listElements.length;
                    this._listElements.forEach(function (e) { return (e.setHeight(height_1)); });
                    this.update();
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ActionListGUI.prototype, "currentPage", {
            get: function () {
                return this._currentPage;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ActionListGUI.prototype, "nrPages", {
            get: function () {
                return Math.ceil(this._elements.length / this.elementsPerPage);
            },
            enumerable: false,
            configurable: true
        });
        ActionListGUI.prototype.nextPage = function () {
            if (this.currentPage < this.nrPages) {
                this._currentPage++;
            }
        };
        ActionListGUI.prototype.getElementOnCurrentPage = function (i) {
            var ind = this._currentPage * this._listElements.length + i;
            if (i > this.elementsPerPage || ind >= this._elements.length) {
                throw "ListGUI ERROR: Element requested not in list!";
            }
            return this._elements[ind];
        };
        ActionListGUI.prototype.addToEnd = function (elem) {
            this._elements.push(elem);
        };
        ActionListGUI.prototype.update = function () {
            var _this = this;
            var offsetInd = this._currentPage * this.elementsPerPage;
            this._listElements.forEach(function (e, i) {
                i + offsetInd < _this._elements.length ? e.action = _this._elements[i + offsetInd] : e.action = null;
            });
        };
        return ActionListGUI;
    }());
    var ActionBarGUI = /** @class */ (function () {
        function ActionBarGUI() {
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
        Object.defineProperty(ActionBarGUI, "fullPath", {
            get: function () {
                return FightScreenGUI.fullPath + ">#" + this._divID;
            },
            enumerable: false,
            configurable: true
        });
        ActionBarGUI.prototype.update = function () {
            this._spellActionList.update();
            this._otherActionList.update();
        };
        ActionBarGUI.prototype.setUpFightBoard = function (fightInstance) {
            this._areaGridGUI.setUpFightBoard(fightInstance);
        };
        ActionBarGUI._divID = "FightScreenActionBar";
        ActionBarGUI._nrElementsPerList = 10;
        ActionBarGUI._spellListID = "FSActionBarSpellActions";
        ActionBarGUI._otherListID = "FSActionBarOtherActions";
        ActionBarGUI._nrInstances = 0;
        return ActionBarGUI;
    }());
    ActionBarGUIs.ActionBarGUI = ActionBarGUI;
})(ActionBarGUIs || (ActionBarGUIs = {}));
var InfoBarGUIs;
(function (InfoBarGUIs) {
    var InfoBarStatusBarsGUI = /** @class */ (function () {
        function InfoBarStatusBarsGUI() {
            if (InfoBarStatusBarsGUI._nrInstances > 0) {
                throw "InfoBarStatusBarsGUI already has an instance running!";
            }
            InfoBarStatusBarsGUI._nrInstances += 1;
            this._div = document.getElementById(InfoBarStatusBarsGUI._divID);
        }
        InfoBarStatusBarsGUI.prototype.resetFightRound = function () {
        };
        InfoBarStatusBarsGUI._divID = "FSInfoBarStatusBars";
        InfoBarStatusBarsGUI._nrInstances = 0;
        return InfoBarStatusBarsGUI;
    }());
    var EnemyGridGUI = /** @class */ (function () {
        function EnemyGridGUI(div) {
            this._div = div;
            if (EnemyGridGUI._divDisplay == null) {
                EnemyGridGUI._divDisplay = this._div.style.display;
            }
            this._symbol = this._div.childNodes[1].childNodes[1];
            this._name = this._div.childNodes[1].childNodes[3];
            this._desc = this._div.childNodes[3];
            this._mods = this._div.childNodes[5];
        }
        EnemyGridGUI.prototype.setEnemy = function (enemy) {
            this._enemy = enemy;
            if (enemy == undefined) {
                this.hide();
            }
            else {
                this.show();
            }
        };
        EnemyGridGUI.prototype.show = function () {
            this.updateGUI();
            this._div.style.display = EnemyGridGUI._divDisplay;
        };
        EnemyGridGUI.prototype.hide = function () {
            this.updateGUI();
            this._div.style.display = 'none';
        };
        EnemyGridGUI.prototype.updateGUI = function () {
            if (this._enemy == undefined) {
                this._symbol.innerHTML = "";
                this._name.innerHTML = "";
                this._desc.innerHTML = "";
                this._mods.innerHTML = "";
            }
            else {
                this._symbol.innerHTML = this._enemy.symbol;
                this._name.innerHTML = this._enemy.name;
                this._desc.innerHTML = this._enemy.desc;
                this._mods.innerHTML = "";
            }
        };
        EnemyGridGUI._divClass = ".enemy_cell";
        EnemyGridGUI._divDisplay = null;
        return EnemyGridGUI;
    }());
    var TimerGridStopPlanningGUI = /** @class */ (function () {
        function TimerGridStopPlanningGUI(div) {
            this._div = div;
            this.setUpEventListeners();
        }
        Object.defineProperty(TimerGridStopPlanningGUI, "classFullPath", {
            get: function () {
                return EnemyGridTimerGridGUI.fullPath + ">" + this._divClass;
            },
            enumerable: false,
            configurable: true
        });
        TimerGridStopPlanningGUI.prototype.setUpEventListeners = function () {
            var _this = this;
            var c_obj = this;
            c_obj._div.addEventListener('mousedown', function (e) { return _this.onMouseDown(e, c_obj); });
        };
        TimerGridStopPlanningGUI.prototype.onMouseDown = function (e, c_obj) {
            FightScreenGUI.resetFightRound();
        };
        TimerGridStopPlanningGUI._divClass = ".end_planning";
        return TimerGridStopPlanningGUI;
    }());
    var TimerGridTimerGUI = /** @class */ (function () {
        function TimerGridTimerGUI() {
            this._timerIntervalID = null;
            this._div = document.querySelector(TimerGridTimerGUI.fullPath);
        }
        Object.defineProperty(TimerGridTimerGUI, "fullPath", {
            get: function () {
                return EnemyGridTimerGridGUI.fullPath + ">" + this._divClass;
            },
            enumerable: false,
            configurable: true
        });
        TimerGridTimerGUI.prototype.setTime = function (sep) {
            if (sep === void 0) { sep = ":"; }
            var time = this._timer;
            var msec = (time % 1000).toString();
            msec = StringUtil.padRightUntilLength(msec, 3, '0');
            time = Math.floor(time / 1000);
            var sec = (time % 60).toString();
            sec = StringUtil.padRightUntilLength(sec, 2, '0');
            time = Math.floor(time / 60);
            var min = (time % 60).toString();
            min = StringUtil.padRightUntilLength(min, 2, '0');
            this._div.innerHTML = min + sep + sec + sep + msec;
        };
        TimerGridTimerGUI.prototype.resetTimer = function (time) {
            this._timer = time;
        };
        TimerGridTimerGUI.prototype.stopTimer = function () {
            if (this._timerIntervalID != null) {
                clearInterval(this._timerIntervalID);
                this._timerIntervalID = null;
            }
        };
        TimerGridTimerGUI.prototype.startTimer = function () {
            var _this = this;
            if (this._timerIntervalID == null) {
                this._timerIntervalID = setInterval(function () { _this._timer -= 33; _this.setTime(); }, 33);
            }
        };
        TimerGridTimerGUI._divClass = ".timer";
        return TimerGridTimerGUI;
    }());
    var EnemyGridTimerGridGUI = /** @class */ (function () {
        function EnemyGridTimerGridGUI() {
            var _this = this;
            this._stopPlanningGUIs = [];
            this._maxTime = 30 * 1000;
            this._div = document.querySelector(EnemyGridTimerGridGUI.fullPath);
            document.querySelectorAll(TimerGridStopPlanningGUI.classFullPath).forEach(function (e) { return _this._stopPlanningGUIs.push(new TimerGridStopPlanningGUI(e)); });
            this._timerGUI = new TimerGridTimerGUI();
            this.setUp();
        }
        Object.defineProperty(EnemyGridTimerGridGUI, "fullPath", {
            get: function () {
                return InfoBarEnemyGridGUI.fullPath + ">" + this._divClass;
            },
            enumerable: false,
            configurable: true
        });
        EnemyGridTimerGridGUI.prototype.setUp = function () {
            this.reset();
            this._timerGUI.startTimer();
            this.update();
        };
        EnemyGridTimerGridGUI.prototype.reset = function () {
            this._timerGUI.resetTimer(this._maxTime);
        };
        EnemyGridTimerGridGUI.prototype.resetFightRound = function () {
            this._maxTime -= 500;
            this._timerGUI.resetTimer(this._maxTime);
        };
        EnemyGridTimerGridGUI.prototype.update = function () {
        };
        EnemyGridTimerGridGUI._divClass = ".plan_countdown";
        return EnemyGridTimerGridGUI;
    }());
    var InfoBarEnemyGridGUI = /** @class */ (function () {
        function InfoBarEnemyGridGUI() {
            var _this = this;
            this._enemyGrindGUIs = [];
            if (InfoBarEnemyGridGUI._nrInstances > 0) {
                throw "InfoBarEnemyGridGUI already has an instance running!";
            }
            InfoBarEnemyGridGUI._nrInstances += 1;
            this._div = document.getElementById(InfoBarEnemyGridGUI._divID);
            document.querySelectorAll(InfoBarEnemyGridGUI.fullPath + ">" + EnemyGridGUI._divClass).forEach(function (e, i) { return _this._enemyGrindGUIs.push(new EnemyGridGUI(e)); });
            this._timerGridGUI = new EnemyGridTimerGridGUI();
            this.update();
        }
        Object.defineProperty(InfoBarEnemyGridGUI, "fullPath", {
            get: function () {
                return InfoBarGUI.fullPath + ">#" + InfoBarEnemyGridGUI._divID;
            },
            enumerable: false,
            configurable: true
        });
        InfoBarEnemyGridGUI.prototype.update = function () {
            this._enemyGrindGUIs.forEach(function (e, i) { i < InfoBarEnemyGridGUI._nrEnemyGridGUIs ? e.show() : e.hide(); });
        };
        InfoBarEnemyGridGUI.prototype.setUpFight = function (fightInstance) {
            var _this = this;
            fightInstance.enemies.forEach(function (e, i) { return _this._enemyGrindGUIs[i].setEnemy(e); });
        };
        InfoBarEnemyGridGUI.prototype.resetTimer = function () {
            this._timerGridGUI.reset();
        };
        InfoBarEnemyGridGUI.prototype.resetFightRound = function () {
            this._timerGridGUI.resetFightRound();
        };
        InfoBarEnemyGridGUI._divID = "FSInfoBarEnemyGrid";
        InfoBarEnemyGridGUI._nrInstances = 0;
        InfoBarEnemyGridGUI._nrEnemyGridGUIs = 1;
        return InfoBarEnemyGridGUI;
    }());
    var InfoBarPlayerInfoGUI = /** @class */ (function () {
        function InfoBarPlayerInfoGUI() {
            if (InfoBarPlayerInfoGUI._nrInstances > 0) {
                throw "InfoBarPlayerInfoGUI already has an instance running!";
            }
            InfoBarPlayerInfoGUI._nrInstances += 1;
            this._div = document.getElementById(InfoBarPlayerInfoGUI._divID);
        }
        InfoBarPlayerInfoGUI.prototype.resetFightRound = function () {
        };
        InfoBarPlayerInfoGUI._divID = "FSInfOBarPlayerInfo";
        InfoBarPlayerInfoGUI._nrInstances = 0;
        return InfoBarPlayerInfoGUI;
    }());
    var InfoBarGUI = /** @class */ (function () {
        function InfoBarGUI() {
            if (InfoBarGUI._nrInstances > 0) {
                throw "InfoBarGUI already has an instance running!";
            }
            InfoBarGUI._nrInstances += 1;
            this._div = document.getElementById(InfoBarGUI._divID);
            this._statusBarsGUI = new InfoBarStatusBarsGUI();
            this._enemyGridGUI = new InfoBarEnemyGridGUI();
            this._playerInfoGUI = new InfoBarPlayerInfoGUI();
        }
        Object.defineProperty(InfoBarGUI, "fullPath", {
            get: function () {
                return FightScreenGUI.fullPath + ">#" + InfoBarGUI._divID;
            },
            enumerable: false,
            configurable: true
        });
        InfoBarGUI.prototype.resetFightRound = function () {
            this._statusBarsGUI.resetFightRound();
            this._enemyGridGUI.resetFightRound();
            this._playerInfoGUI.resetFightRound();
        };
        InfoBarGUI.prototype.setUpEnemiesGUI = function (fightInstance) {
            this._enemyGridGUI.setUpFight(fightInstance);
        };
        InfoBarGUI._divID = "FightScreenInfoBar";
        InfoBarGUI._nrInstances = 0;
        return InfoBarGUI;
    }());
    InfoBarGUIs.InfoBarGUI = InfoBarGUI;
})(InfoBarGUIs || (InfoBarGUIs = {}));
var DragObejctGUI = /** @class */ (function () {
    function DragObejctGUI() {
        this._div = document.getElementById(DragObejctGUI._divID);
    }
    Object.defineProperty(DragObejctGUI.prototype, "left", {
        get: function () {
            return this._div.style.left;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DragObejctGUI.prototype, "top", {
        get: function () {
            return this._div.style.top;
        },
        enumerable: false,
        configurable: true
    });
    DragObejctGUI.prototype.setPosition = function (x, y, adjust_y) {
        if (adjust_y === void 0) { adjust_y = true; }
        var width = Number(getComputedStyle(this._div).getPropertyValue("width").slice(0, -2));
        var height = Number(getComputedStyle(this._div).getPropertyValue('height').slice(0, -2));
        this._div.style.left = (x).toString() + "px";
        if (adjust_y) {
            this._div.style.top = (y - height).toString() + "px";
        }
        else {
            this._div.style.top = (y).toString() + "px";
        }
    };
    DragObejctGUI.prototype.setInnerHTML = function (innerHTML) {
        this._div.innerHTML = innerHTML;
    };
    DragObejctGUI.prototype.setOpacity = function (op) {
        this._div.style.opacity = op.toString();
    };
    DragObejctGUI.prototype.setStyle = function (style) {
        var _this = this;
        this._style = style;
        style.forEach(function (v, k) { _this._div.style[k] = v; });
    };
    DragObejctGUI.prototype.reset = function () {
        var _this = this;
        //clear class list
        this._div.classList.forEach(function (k) { return _this._div.classList.remove(k); });
        //clear style
        this._style.forEach(function (v, k) { return _this._div.style[k] = ""; });
        //clear innerHTML
        this._div.innerHTML = "";
        //hide
        this._div.style.display = "none";
    };
    DragObejctGUI.prototype.moveWithMouse = function (e) {
        this._div.style.left = (e.pageX - DragAPI.dragOffsetX).toString() + "px";
        this._div.style.top = (e.pageY - DragAPI.dragOffsetY).toString() + "px";
    };
    DragObejctGUI._divID = "FightScreenDragObject";
    return DragObejctGUI;
}());
var DragAPI = /** @class */ (function () {
    function DragAPI() {
    }
    DragAPI.dragPropertyToCSS = function (property) {
        var ret = "";
        for (var i = 0; i < property.length; i++) {
            if (property[i].toLowerCase() == property[i]) {
                ret += property[i];
            }
            else {
                ret += "-" + property[i].toLowerCase();
            }
        }
        return ret;
    };
    DragAPI.canDropHere = function (dragObjType) {
        if (this._dragging) {
            if (this._releasableDrag) {
                if (this._insideDragDestArea) {
                    if (this._dragObjType != dragObjType) {
                        return false;
                    }
                    return true;
                }
                else {
                    return true;
                }
            }
            else {
                return this._insideDragDestArea && this._dragObjType == dragObjType;
            }
        }
        return false;
    };
    DragAPI.canStartDrag = function () {
        if (!this._dragging) {
            return true;
        }
        return false;
    };
    DragAPI.canMouseDownHere = function () {
        if (this._dragging && !this._insideDragDestArea) {
            return false;
        }
        return true;
    };
    Object.defineProperty(DragAPI, "dragging", {
        get: function () {
            return this._dragging;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DragAPI, "dragObjectType", {
        get: function () {
            return this._dragObjType;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DragAPI, "dragObjectData", {
        get: function () {
            return this._dragging ? window.sessionStorage.getItem(this._dragObjType) : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DragAPI, "insideDragDestinationArea", {
        get: function () {
            return this._insideDragDestArea;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DragAPI, "dragOffsetX", {
        get: function () {
            return this._dragging ? this._dragOffsetX : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DragAPI, "dragOffsetY", {
        get: function () {
            return this._dragging ? this._dragOffsetY : null;
        },
        enumerable: false,
        configurable: true
    });
    DragAPI.setUpDragObject = function (style, innerHTML) {
        if (!this._dragging) {
            this._dragObj.setStyle(style);
            this._dragObj.setInnerHTML(innerHTML);
        }
    };
    DragAPI.startDrag = function (dragObjectType, dragObjectData, e, releasableDrag) {
        if (releasableDrag === void 0) { releasableDrag = false; }
        if (this._dragging == false) {
            this._dragging = true;
            this._releasableDrag = releasableDrag;
            this._insideDragDestArea = false;
            this._dragObjType = dragObjectType;
            window.sessionStorage.setItem(dragObjectType, dragObjectData);
            var leftObj = Number(this._dragObj.left.slice(0, -2));
            var topObj = Number(this._dragObj.top.slice(0, -2));
            this._dragOffsetX = e.pageX - leftObj;
            this._dragOffsetY = e.pageY - topObj;
        }
    };
    DragAPI.enterDragDestinationArea = function () {
        if (this.dragging) {
            this._insideDragDestArea = true;
        }
    };
    DragAPI.exitDragDestinationArea = function () {
        if (this.dragging) {
            this._insideDragDestArea = false;
        }
    };
    DragAPI.endDrag = function () {
        if (this.dragging) {
            window.sessionStorage.removeItem(this._dragObjType);
            this._dragging = false;
            this._releasableDrag = null;
            this._insideDragDestArea = null;
            this._dragObjType = null;
            this._dragObj.reset();
        }
    };
    DragAPI.moveWithMouse = function (e) {
        this._dragObj.moveWithMouse(e);
    };
    DragAPI.setUpEventListeners = function () {
        DragAPI._body.addEventListener('mousemove', function (e) { return DragAPI.onMouseMove(e); });
        DragAPI._body.addEventListener('mouseup', function (e) { return DragAPI.onMouseUp(e); });
    };
    DragAPI.onMouseMove = function (e) {
        if (this.dragging) {
            DragAPI._dragObj.moveWithMouse(e);
        }
    };
    DragAPI.onMouseUp = function (e) {
        if (this._releasableDrag && !this._insideDragDestArea) {
            this.endDrag();
        }
    };
    DragAPI._body = document.body;
    DragAPI._dragging = false;
    DragAPI._releasableDrag = null;
    DragAPI._insideDragDestArea = null;
    DragAPI._dragObjType = null;
    DragAPI._dragObj = new DragObejctGUI();
    return DragAPI;
}());
var FightScreenGUI = /** @class */ (function () {
    function FightScreenGUI() {
        FightScreenGUI._self = this;
        this._div = document.getElementById(FightScreenGUI._divID);
        this._infoBarGUI = new InfoBarGUIs.InfoBarGUI();
        this._actionBarGUI = new ActionBarGUIs.ActionBarGUI();
        this._actionPlanBarGUI = new ActionPlanBarGUIs.ActionPlanBarGUI();
        this.setUpEventListeners();
    }
    Object.defineProperty(FightScreenGUI, "fullPath", {
        get: function () {
            return "#" + FightScreenGUI._divID;
        },
        enumerable: false,
        configurable: true
    });
    FightScreenGUI.resetFightRound = function () {
        this._self.resetFightRound();
    };
    FightScreenGUI.prototype.setUpEventListeners = function () {
        var c_obj = this;
        this._div.addEventListener('mousemove', function (e) { return c_obj.onMouseMove(e, c_obj); });
    };
    FightScreenGUI.prototype.setUpFight = function (fightInstance) {
        this._infoBarGUI.setUpEnemiesGUI(fightInstance);
        this._actionBarGUI.setUpFightBoard(fightInstance);
        this._actionPlanBarGUI.setUpFight(fightInstance);
    };
    FightScreenGUI.prototype.onMouseMove = function (e, c_obj) {
        if (DragAPI.dragging) {
            DragAPI.moveWithMouse(e);
        }
    };
    FightScreenGUI.prototype.resetFightRound = function () {
        this._infoBarGUI.resetFightRound();
        this._actionPlanBarGUI.resetFightRound();
    };
    FightScreenGUI._divID = "FightScreen";
    return FightScreenGUI;
}());
/*                                      Controllers                                                 */
var FightScreenController = /** @class */ (function () {
    function FightScreenController() {
    }
    FightScreenController.init = function () {
        if (this._initialized) {
            throw "ERROR: FightScreenController can only be initialized once!";
        }
        this._initialized = true;
        this._fightScreenGUI = new FightScreenGUI();
    };
    FightScreenController.setUpFight = function (fightInstance) {
        this._fightInstance = fightInstance;
        this._fightScreenGUI.setUpFight(this._fightInstance);
    };
    FightScreenController._initialized = false;
    FightScreenController._fightInstance = undefined;
    return FightScreenController;
}());
var GameController = /** @class */ (function () {
    function GameController() {
    }
    GameController.getEnemyByName = function (name) {
        return Enemy.enemies[name];
    };
    Object.defineProperty(GameController, "player", {
        get: function () {
            return this._player;
        },
        enumerable: false,
        configurable: true
    });
    GameController.initAPIs = function () {
        DragAPI.setUpEventListeners();
    };
    GameController.initControllers = function () {
        FightScreenController.init();
    };
    GameController.init = function () {
        if (this._initialized) {
            throw "ERROR: GameController can only be initialized once!";
        }
        this.initAPIs();
        this.initControllers();
        this._player = new Player(new EntityStats(10, new ElementalAttributes(), new ElementalAttributes(3), new ElementalAttributes()), 2, 1);
    };
    GameController._initialized = false;
    return GameController;
}());
/*                                      Initialization and other stuff                                                 */
GameController.init();
var f = new Fight(['Goblin', 'Goblin', 'Goblin'], new FightBoardTemplate(new PassableTile("#002000"), [new TileWithPosition(1, 1, new EnemyTile()), new TileWithPosition(1, 2, new EnemyTile()), new TileWithPosition(1, 3, new EnemyTile())]));
var fI = f.createFightInstance(1, GameController.player, [5, 5]);
FightScreenController.setUpFight(fI);
