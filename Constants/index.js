import {
  BsArrowClockwise,
  BsArrowCounterclockwise,
  BsCode,
  BsHighlighter,
  BsJustify,
  BsJustifyLeft,
  BsJustifyRight,
  BsSubscript,
  BsSuperscript,
  BsTextCenter,
  BsTypeBold,
  BsTypeItalic,
  BsTypeStrikethrough,
  BsTypeUnderline,
} from "react-icons/bs";

export const RichTextAction = {
  Bold: "bold",
  Italics: "italics",
  Underline: "underline",
  Strikethrough: "strikethrough",
  Superscript: "superscript",
  Subscript: "subscript",
  Highlight: "highlight",
  Code: "code",
  LeftAlign: "leftAlign",
  CenterAlign: "centerAlign",
  RightAlign: "rightAlign",
  JustifyAlign: "justifyAlign",
  Divider: "divider",
  Undo: "undo",
  Redo: "redo",
  FontSize: "fontSize",
};

export const RICH_TEXT_OPTIONS = [
  { id: RichTextAction.Bold, icon: <BsTypeBold />, label: "Bold" },
  { id: RichTextAction.Italics, icon: <BsTypeItalic />, label: "Italics" },
  {
    id: RichTextAction.Underline,
    icon: <BsTypeUnderline />,
    label: "Underline",
  },

  {
    id: RichTextAction.Highlight,
    icon: <BsHighlighter />,
    label: "Highlight",
    fontSize: 10,
  },
  {
    id: RichTextAction.Strikethrough,
    icon: <BsTypeStrikethrough />,
    label: "Strikethrough",
  },
  {
    id: RichTextAction.Superscript,
    icon: <BsSuperscript />,
    label: "Superscript",
  },
  {
    id: RichTextAction.Subscript,
    icon: <BsSubscript />,
    label: "Subscript",
  },
  {
    id: RichTextAction.Code,
    icon: <BsCode />,
    label: "Code",
  },

  {
    id: RichTextAction.LeftAlign,
    icon: <BsJustifyLeft />,
    label: "Align Left",
  },
  {
    id: RichTextAction.CenterAlign,
    icon: <BsTextCenter />,
    label: "Align Center",
  },
  {
    id: RichTextAction.RightAlign,
    icon: <BsJustifyRight />,
    label: "Align Right",
  },
  {
    id: RichTextAction.JustifyAlign,
    icon: <BsJustify />,
    label: "Align Justify",
  },

  {
    id: RichTextAction.Undo,
    icon: <BsArrowCounterclockwise />,
    label: "Undo",
  },
  {
    id: RichTextAction.Redo,
    icon: <BsArrowClockwise />,
    label: "Redo",
  },
];

export const LOW_PRIORITY = 1;
export const HEADINGS = [
  { tagName: "h1", size: "52px" },
  { tagName: "h2", size: "44px" },
  { tagName: "h3", size: "36px" },
  { tagName: "h4", size: "30px" },
  { tagName: "h5", size: "22px" },
  { tagName: "h6", size: "16px" },
];
