import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodeToNearestRoot, mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from "lexical";
import { useEffect } from "react";

import {
  $createPageBreakNode,
  PageBreakNode,
} from "../../Nodes/PageBreakNode/PageBreakNode";
import { HiOutlineScissors } from "react-icons/hi";

export const INSERT_PAGE_BREAK = createCommand();

export default function PageBreakPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([PageBreakNode])) {
      throw new Error(
        "PageBreakPlugin: PageBreakNode is not registered on editor"
      );
    }

    return mergeRegister(
      editor.registerCommand(
        INSERT_PAGE_BREAK,
        () => {
          const selection = $getSelection();

          if (!$isRangeSelection(selection)) {
            return false;
          }

          const focusNode = selection.focus.getNode();
          if (focusNode !== null) {
            const pgBreak = $createPageBreakNode();
            $insertNodeToNearestRoot(pgBreak);
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  return (
    <button
      className="flex items-center justify-center w-8 h-8 rounded border hover:bg-gray-100 hover:opacity-85"
      onClick={() => editor.dispatchCommand(INSERT_PAGE_BREAK, undefined)}
      title="Insert Page Break"
      type="button"
    >
      <HiOutlineScissors className="w-4 h-4" />
    </button>
  );
}
