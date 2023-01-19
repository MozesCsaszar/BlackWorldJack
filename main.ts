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
    private readonly _suit: string;
    private readonly _value: string;
    private readonly _manaType: ManaTypes;
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
        console.log(this._nextCard, this._cards);
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

    addCard(card:Card):void {
        //add a new card to the hand; card not copied
        this._cards.push(card);
    }
}