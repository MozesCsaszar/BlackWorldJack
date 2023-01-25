//Whenever you want to create a class, use a template from here
var ClassTemplates;
(function (ClassTemplates) {
    var UniqueGUI = /** @class */ (function () {
        function UniqueGUI() {
            if (UniqueGUI._nrInstances > 0) {
                throw "UniqueGUI already has an instance running!";
            }
            UniqueGUI._nrInstances += 1;
            this._div = document.getElementById(UniqueGUI._divID);
        }
        Object.defineProperty(UniqueGUI, "fullPath", {
            get: function () {
                var parentPath;
                return parentPath + ">#" + this._divID;
            },
            enumerable: false,
            configurable: true
        });
        UniqueGUI._divID = "";
        UniqueGUI._nrInstances = 0;
        return UniqueGUI;
    }());
    var ClassedUniqueGUI = /** @class */ (function () {
        function ClassedUniqueGUI() {
        }
        Object.defineProperty(ClassedUniqueGUI, "fullPath", {
            get: function () {
                var parentPath;
                return parentPath + ">" + this._divClass;
            },
            enumerable: false,
            configurable: true
        });
        ClassedUniqueGUI._divClass = ".";
        return ClassedUniqueGUI;
    }());
    var NonUniqueGUI = /** @class */ (function () {
        function NonUniqueGUI() {
        }
        Object.defineProperty(NonUniqueGUI, "classFullPath", {
            get: function () {
                var parentPath;
                return parentPath + ">" + this._divClass;
            },
            enumerable: false,
            configurable: true
        });
        NonUniqueGUI._divClass = ".";
        return NonUniqueGUI;
    }());
    var HidableGUI = /** @class */ (function () {
        function HidableGUI() {
            if (HidableGUI._divDisplay == null) {
                HidableGUI._divDisplay = this._div.style.display;
            }
        }
        HidableGUI.prototype.show = function () {
            this._div.style.display = HidableGUI._divDisplay;
        };
        HidableGUI.prototype.hide = function () {
            this._div.style.display = 'none';
        };
        HidableGUI._divDisplay = null;
        return HidableGUI;
    }());
    var InteractiveGUI = /** @class */ (function () {
        function InteractiveGUI() {
            this.setUpEventListeners();
        }
        InteractiveGUI.prototype.setUpEventListeners = function () {
            var _this = this;
            var c_obj = this;
            c_obj._div.addEventListener('mousedown', function (e) { return _this.onMouseDown(e, c_obj); });
        };
        InteractiveGUI.prototype.onMouseDown = function (e, c_obj) {
        };
        return InteractiveGUI;
    }());
})(ClassTemplates || (ClassTemplates = {}));
//# sourceMappingURL=templates.js.map