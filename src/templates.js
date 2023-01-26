//Whenever you want to create a class, use a template from here
var ClassTemplates;
(function (ClassTemplates) {
    class UniqueGUI {
        static get fullPath() {
            let parentPath;
            return parentPath + ">#" + this._divID;
        }
        constructor() {
            if (UniqueGUI._nrInstances > 0) {
                throw "UniqueGUI already has an instance running!";
            }
            UniqueGUI._nrInstances += 1;
            this._div = document.getElementById(UniqueGUI._divID);
        }
    }
    UniqueGUI._divID = "";
    UniqueGUI._nrInstances = 0;
    class ClassedUniqueGUI {
        static get fullPath() {
            let parentPath;
            return parentPath + ">" + this._divClass;
        }
    }
    ClassedUniqueGUI._divClass = ".";
    class NonUniqueGUI {
        static get classFullPath() {
            let parentPath;
            return parentPath + ">" + this._divClass;
        }
    }
    NonUniqueGUI._divClass = ".";
    class HidableGUI {
        constructor() {
            if (HidableGUI._divDisplay == null) {
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
    HidableGUI._divDisplay = null;
    class InteractiveGUI {
        constructor() {
            this.setUpEventListeners();
        }
        setUpEventListeners() {
            let c_obj = this;
            c_obj._div.addEventListener('mousedown', (e) => this.onMouseDown(e, c_obj));
        }
        onMouseDown(e, c_obj) {
        }
    }
    ;
    class ListElementGUI {
        constructor(div) {
            this._div = div;
        }
        get element() {
            return this._element;
        }
        set element(elem) {
            this._element = elem;
            this._div.innerHTML = this.repr();
        }
        repr() {
            return "";
        }
    }
    class ListGUI {
        constructor(div, elementsPerPage) {
            this._listElements = [];
            this._elements = [];
            this._div = div;
            this.elementsPerPage = elementsPerPage;
        }
        set elementsPerPage(nr) {
            if (nr != this._listElements.length) {
                while (this._listElements.length < nr) {
                    let newDiv = document.createElement('div');
                    this._div.appendChild(newDiv);
                    this._listElements.push(new ListElementGUI(newDiv));
                }
                while (this._listElements.length > nr) {
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
        }
    }
})(ClassTemplates || (ClassTemplates = {}));
//# sourceMappingURL=templates.js.map