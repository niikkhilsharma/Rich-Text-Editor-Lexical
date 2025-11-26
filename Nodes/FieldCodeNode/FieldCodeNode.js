import { TextNode } from "lexical";

export class FieldCodeNode extends TextNode {
  static getType() {
    return "field-code";
  }

  static clone(node) {
    return new FieldCodeNode(node.__text, node.__key);
  }

  static importJSON(serializedNode) {
    const { text } = serializedNode;
    return new FieldCodeNode(text);
  }

  constructor(text = "{{}}", key) {
    super(text, key);
  }

  createDOM(config) {
    const element = super.createDOM(config);
    element.classList.add("field-code", "leading-7");
    element.style.backgroundColor = "#f0f0f0";
    element.style.padding = "2px 4px";
    element.style.borderRadius = "3px";

    return element;
  }

  updateDOM(prevNode, dom, config) {
    return super.updateDOM(prevNode, dom, config);
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      type: "field-code",
    };
  }
}

export function $createFieldCodeNode(text = "{{}}") {
  return new FieldCodeNode(text);
}

export function $isFieldCodeNode(node) {
  return node instanceof FieldCodeNode;
}
