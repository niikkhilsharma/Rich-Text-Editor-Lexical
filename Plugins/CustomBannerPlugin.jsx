import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_HIGH,
  FORMAT_TEXT_COMMAND,
} from "lexical";
import { $isCustomBannerNode } from "../Nodes/BannerNode/BannerNode";

export default function BannerFormattingPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Register a custom command handler for block type changes
    return editor.registerCommand(
      FORMAT_TEXT_COMMAND,
      (_payload) => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection)) {
          return false;
        }

        const anchorNode = selection.anchor.getNode();
        let element =
          anchorNode.getKey() === "root"
            ? anchorNode
            : anchorNode.getTopLevelElementOrThrow();

        // Check if the element's parent is a banner
        const parent = element.getParent();

        if (parent && $isCustomBannerNode(parent)) {
          // We're inside a banner - prevent default behavior
          // The formatting will be handled by the default plugins
          // but won't replace the banner
          return false;
        }

        return false;
      },
      COMMAND_PRIORITY_HIGH
    );
  }, [editor]);

  return null;
}
