import { $createParagraphNode, ElementNode } from "lexical";

export class CustomBannerNode extends ElementNode {
  __backgroundColor;

  constructor(backgroundColor, key) {
    super(key);
    this.__backgroundColor = backgroundColor || "#e0f2fe";
  }

  static getType() {
    return "custom-banner";
  }

  static clone(node) {
    return new CustomBannerNode(node.__backgroundColor, node.__key);
  }

  static importJSON(serializedNode) {
    const node = $createCustomBannerNode(serializedNode.backgroundColor);
    node.setFormat(serializedNode.format);
    node.setIndent(serializedNode.indent);
    node.setDirection(serializedNode.direction);
    return node;
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      backgroundColor: this.__backgroundColor,
      type: "custom-banner",
      version: 1,
    };
  }

  createDOM() {
    const dom = document.createElement("div");
    dom.classList.add("banner");
    dom.style.backgroundColor = this.__backgroundColor;
    dom.style.padding = "12px";
    dom.style.borderRadius = "4px";
    dom.style.marginBottom = "8px";
    dom.style.border = "1px solid #cbd5e1";
    return dom;
  }

  updateDOM(prevNode, dom) {
    if (prevNode.__backgroundColor !== this.__backgroundColor) {
      dom.style.backgroundColor = this.__backgroundColor;
    }
    return false;
  }

  static importDOM() {
    return {
      div: (domNode) => {
        if (domNode.classList.contains("banner")) {
          return {
            conversion: (element) => {
              const color = element.style.backgroundColor || "#e0f2fe";
              return { node: $createCustomBannerNode(color) };
            },
            priority: 1,
          };
        }
        return null;
      },
    };
  }

  // This tells Lexical this node acts like a shadow root
  // Children are isolated from parent formatting operations
  isShadowRoot() {
    return true;
  }

  collapseAtStart() {
    const children = this.getChildren();
    if (
      children.length === 0 ||
      (children.length === 1 && children[0].getTextContentSize() === 0)
    ) {
      this.remove();
      return true;
    }
    return false;
  }

  insertNewAfter(selection) {
    const children = this.getChildren();
    const childrenLength = children.length;

    if (childrenLength === 0) {
      return null;
    }

    const newElement = $createParagraphNode();
    const direction = this.getDirection();
    newElement.setDirection(direction);

    const anchorNode = selection.anchor.getNode();
    const lastChild = this.getLastChild();

    let targetNode = anchorNode;
    while (targetNode && targetNode.getParent() !== this) {
      targetNode = targetNode.getParent();
    }

    if (targetNode === lastChild) {
      this.insertAfter(newElement);
      return newElement;
    }

    if (targetNode) {
      targetNode.insertAfter(newElement);
    } else {
      this.append(newElement);
    }

    return newElement;
  }

  getBackgroundColor() {
    const self = this.getLatest();
    return self.__backgroundColor;
  }

  setBackgroundColor(color) {
    const self = this.getWritable();
    self.__backgroundColor = color;
    return self;
  }
}

export function $createCustomBannerNode(color) {
  return new CustomBannerNode(color || "#e0f2fe");
}

export function $isCustomBannerNode(node) {
  return node instanceof CustomBannerNode;
}
