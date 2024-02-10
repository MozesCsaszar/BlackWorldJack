class DraggableGUI {
  static readonly _dragObjType: string;
  moveWithMouse(e: MouseEvent): void {}
  get left(): string {
    return "";
  }
  get top(): string {
    return "";
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
    let width: number = Number(
      getComputedStyle(this._div).getPropertyValue("width").slice(0, -2)
    );
    let height: number = Number(
      getComputedStyle(this._div).getPropertyValue("height").slice(0, -2)
    );
    this._div.style.left = x.toString() + "px";
    if (adjust_y) {
      this._div.style.top = (y - height).toString() + "px";
    } else {
      this._div.style.top = y.toString() + "px";
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
    style.forEach((v, k) => {
      this._div.style[k] = v;
    });
  }
  reset(): void {
    //clear class list
    this._div.classList.forEach((k) => this._div.classList.remove(k));
    //clear style
    this._style.forEach((v, k) => (this._div.style[k] = ""));
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
    for (let i = 0; i < property.length; i++) {
      if (property[i].toLowerCase() == property[i]) {
        ret += property[i];
      } else {
        ret += "-" + property[i].toLowerCase();
      }
    }
    return ret;
  }
  static canDropHere(dragObjType: string): boolean {
    if (this._dragging) {
      if (this._releasableDrag) {
        if (this._insideDragDestArea) {
          if (this._dragObjType != dragObjType) {
            return false;
          }
          return true;
        } else {
          return true;
        }
      } else {
        return this._insideDragDestArea && this._dragObjType == dragObjType;
      }
    }
    return false;
  }
  static canStartDrag(): boolean {
    if (!this._dragging) {
      return true;
    }
    return false;
  }
  static canMouseDownHere(): boolean {
    if (this._dragging && !this._insideDragDestArea) {
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
    return this._dragging
      ? window.sessionStorage.getItem(this._dragObjType)
      : null;
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
    if (!this._dragging) {
      this._dragObj.setStyle(style);
      this._dragObj.setInnerHTML(innerHTML);
    }
  }
  static startDrag(
    dragObjectType: string,
    dragObjectData: string,
    e: MouseEvent | DragEvent,
    releasableDrag: boolean = false
  ): void {
    if (this._dragging == false) {
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
    if (this.dragging) {
      this._insideDragDestArea = true;
    }
  }
  static exitDragDestinationArea(): void {
    if (this.dragging) {
      this._insideDragDestArea = false;
    }
  }
  static endDrag(): void {
    if (this.dragging) {
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
    DragAPI._body.addEventListener("mousemove", (e: MouseEvent) =>
      DragAPI.onMouseMove(e)
    );
    DragAPI._body.addEventListener("mouseup", (e: MouseEvent) =>
      DragAPI.onMouseUp(e)
    );
  }
  private static onMouseMove(e: MouseEvent): void {
    if (this.dragging) {
      DragAPI._dragObj.moveWithMouse(e);
    }
  }
  private static onMouseUp(e: MouseEvent): void {
    if (this._releasableDrag && !this._insideDragDestArea) {
      this.endDrag();
    }
  }
}

class ElementStyle {
  private properties: Map<string, string>;

  constructor(properties = new Map<string, string>()) {
    this.properties = properties;
  }

  addProperty(key: string, value: string) {
    this.properties.set(key, value);
  }
  removeProperty(key: string) {
    this.properties.delete(key);
  }
  copy(): ElementStyle {
    var newStyle = new ElementStyle();
    for (var key of this.properties.keys()) {
      newStyle.addProperty(key, this.properties.get(key));
    }
    return newStyle;
  }

  applyStyle(element: HTMLElement) {
    for (var key of this.properties.keys()) {
      element.style[key] = this.properties.get(key);
    }
  }
  removeOldStyle(element: HTMLElement, oldStyle: ElementStyle) {
    for (var key of oldStyle.properties.keys()) {
      element.style[key] = "";
    }
  }
  applyNewStyle(element: HTMLElement, oldStyle: ElementStyle) {
    this.removeOldStyle(element, oldStyle);
    this.applyStyle(element);
  }
}
