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
        setUpEventListeners() {
            let c_obj: InteractiveGUI = this;
            c_obj._div.addEventListener('mousedown', (e: MouseEvent) => this.onMouseDown(e, c_obj));
        }
        onMouseDown(e: MouseEvent, c_obj: InteractiveGUI) {

        }
    }
}