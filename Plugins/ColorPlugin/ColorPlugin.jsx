import ColorPicker from "../../components/Colorpicker/ColorPicker";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";
import { LOW_PRIORITY } from "../../Constants";
import { useState, useEffect } from "react";

export default function ColorPlugin() {
  const [editor] = useLexicalComposerContext();
  const [colorMap, setColorMap] = useState({
    color: "#000",
    backgroundColor: "#fff",
  });

  const updateColor = ({ property, color }) => {
    editor.update(() => {
      const selection = $getSelection();
      if (selection) {
        $patchStyleText(selection, { [property]: color });
      }
    });
  };

  function updateColorMap() {
    const selection = $getSelection();
    if (selection && $isRangeSelection(selection)) {
      const color = $getSelectionStyleValueForProperty(
        selection,
        "color",
        "#000"
      );
      const backgroundColor = $getSelectionStyleValueForProperty(
        selection,
        "background-color",
        "#fff"
      );
      setColorMap({ color, backgroundColor });
    }
  }

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateColorMap();
        });
      }, LOW_PRIORITY),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateColorMap();
          return false;
        },
        LOW_PRIORITY
      )
    );
  }, [editor]);

  return (
    <div className="flex flex-col gap-4">
      <ColorPicker
        color={colorMap.backgroundColor}
        onChange={(color) => {
          updateColor({ property: "background-color", color });
        }}
        heading={"Fill"}
      />
      <ColorPicker
        color={colorMap.color}
        onChange={(color) => {
          updateColor({ property: "color", color });
        }}
        heading={"Border"}
      />
    </div>
  );
}
