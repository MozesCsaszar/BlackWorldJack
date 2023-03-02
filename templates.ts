//Whenever you want to create a class, use a template from here
namespace ClassTemplates {
    class UniqueGUI {
        static readonly _divID: string = "";
        private static _nrInstances: number = 0;

        static get fullPath(): string {
            let parentPath: string;
            return parentPath + ">#" + this._divID;
        }

        private _div: HTMLElement;
        constructor() {
            if(UniqueGUI._nrInstances > 0) {
                throw "UniqueGUI already has an instance running!";
            }
            UniqueGUI._nrInstances += 1;
            this._div = document.getElementById(UniqueGUI._divID);
        }
    }
    class ClassedUniqueGUI {
        static readonly _divClass: string = ".";
        static get fullPath(): string {
            let parentPath: string;
            return parentPath + ">" + this._divClass;
        }
    }
    class NonUniqueGUI {
        static readonly _divClass: string = ".";
        static get classFullPath(): string {
            let parentPath: string;
            return parentPath + ">" + this._divClass;
        }
    }
    class HidableGUI {
        private static _divDisplay: string = null;
        
        private _div: HTMLElement;
        constructor() {
            if(HidableGUI._divDisplay == null) {
                HidableGUI._divDisplay = this._div.style.display;
            }
        }
        show() {
            this._div.style.display = HidableGUI._divDisplay;
        }
        hide() {
            this._div.style.display = 'none';
        }
    }
    class InteractiveGUI {
        private _div: HTMLElement;
        constructor() {
            this.setUpEventListeners();
        }
        private setUpEventListeners() {
            let c_obj: InteractiveGUI = this;
            c_obj._div.addEventListener('mousedown', (e: MouseEvent) => this.onMouseDown(e, c_obj));
        }
        onMouseDown(e: MouseEvent, c_obj: InteractiveGUI) {

        }
    }
    interface ListGUIStoredType{};
    class ListElementGUI {
        private _element: ListGUIStoredType;
        private _div: HTMLElement;
        constructor(div: HTMLElement) {
            this._div = div;
        }
        get element(): ListGUIStoredType {
            return this._element;
        }
        set element(elem: ListGUIStoredType) {
            this._element = elem;
            this._div.innerHTML = this.repr();
        }
        repr(): string {
            return "";
        }
    }

    class ListGUI {
        private _listElements: ListElementGUI[] = [];
        private _elements: ListGUIStoredType[] = [];
        private _currentPage: number;
        private _div: HTMLElement;


        constructor(div: HTMLElement, elementsPerPage: number) {
            this._div = div;
            this.elementsPerPage = elementsPerPage;
        }
        set elementsPerPage(nr: number) {
            if(nr != this._listElements.length) {
                while(this._listElements.length < nr) {
                    let newDiv: HTMLElement = document.createElement('div') as HTMLElement;
                    this._div.appendChild(newDiv);
                    this._listElements.push(new ListElementGUI(newDiv));
                }
                while(this._listElements.length > nr) {
                    this._listElements.pop();
                }
                this.update;
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
        getElementOnCurrentPage(i: number): ListGUIStoredType {
            let ind: number = this._currentPage * this._listElements.length + i;
            if(i > this.elementsPerPage || ind >= this._elements.length) {
                throw "ListGUI ERROR: Element requested not in list!";
            }
            return this._elements[ind];
        }
        addToEnd(elem: ListGUIStoredType) {
            this._elements.push(elem);
        }
        update() {

        }
    }
}