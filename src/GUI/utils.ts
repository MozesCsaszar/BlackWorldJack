namespace JQueryUtils {
  interface CreateParams {
    htmlID?: string;
    htmlClass?: string;
    parent?: JQuery<HTMLElement>;
    innerHTMLContent?: string;
  }
  /**
   *
   * @param params A way to specify optional parameters; accepts: {htmlID?: string, htmlClass?: string, parent?: JQuery<HTMLElement>, innerHTMLContent?: string}
   * @returns
   */
  export function createDiv(params: CreateParams): JQuery<HTMLElement> {
    return createElement("div", params);
  }
  function createElement(htmlType: string, params): JQuery<HTMLElement> {
    let { htmlID, htmlClass, parent, innerHTMLContent } = params;

    let elementStr = `<${htmlType} ${
      htmlID != undefined ? `id="${htmlID}"` : ""
    } ${htmlClass != undefined ? `class="${htmlClass}"` : ""}`;
    if (innerHTMLContent != undefined) {
      elementStr += `>${innerHTMLContent}</${htmlType}>`;
    } else {
      elementStr += " />";
    }
    console.log(elementStr, parent, parent != undefined);
    return parent != undefined ? $(elementStr).appendTo(parent) : $(elementStr);
  }
}
