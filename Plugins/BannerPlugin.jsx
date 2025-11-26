import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
} from "lexical";
import { useEffect, useRef, useState } from "react";
import {
  $createCustomBannerNode,
  CustomBannerNode,
} from "../Nodes/BannerNode/BannerNode";
import { FaCcDiscover } from "react-icons/fa";
import { SketchPicker } from "react-color";

export const INSERT_BANNER_COMMAND = createCommand("INSERT_BANNER_COMMAND");

export default function BannerPlugin() {
  const [editor] = useLexicalComposerContext();
  const [bannerColor, setBannerColor] = useState("#e0f2fe");
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  if (!editor.hasNodes([CustomBannerNode])) {
    throw new Error("BannerPlugin: CustomBannerNode not registered on editor");
  }

  useEffect(() => {
    return editor.registerCommand(
      INSERT_BANNER_COMMAND,
      (color) => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const bannerNode = $createCustomBannerNode(color || "#e0f2fe");
          const paragraphNode = $createParagraphNode();
          bannerNode.append(paragraphNode);
          selection.insertNodes([bannerNode]);
          paragraphNode.select();
        }
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  // Update color while dragging (preview only)
  const handleColorChange = (color) => {
    setBannerColor(color);
  };

  // Insert banner when user finishes selecting
  const handleColorChangeComplete = (color) => {
    setBannerColor(color);
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        editor.dispatchCommand(INSERT_BANNER_COMMAND, bannerColor);
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={pickerRef}>
      <button
        className="flex items-center justify-center w-8 h-8 rounded border hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
        title="Insert Banner"
        type="button"
      >
        <FaCcDiscover className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed flex-col w-full flex justify-center items-center z-[999] inset-0 h-screen bg-black bg-opacity-50 backdrop-blur-sm" >

          <div className="bg-white p-4 rounded-md space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold">Choose Banner Color</h2>
              <div className="border size-7 flex justify-center items-center border-black rounded-md aspect-square">
                <button
                  onClick={() => { setBannerColor("#e0f2fe"); setIsOpen(false); }}
                  className="font-bold text-gray-700 hover:text-gray-900"
                  type="button">
                  X
                </button>
              </div>
            </div>

            <SketchPicker
              color={bannerColor}
              onChange={(color) => handleColorChange(color.hex)}
              onChangeComplete={color => handleColorChangeComplete(color.hex)}
              disableAlpha={false}
              presetColors={[
                "#FF6B6B",
                "#4ECDC4",
                "#45B7D1",
                "#96CEB4",
                "#00D2D3",
                "#FF9F43",
                "#10AC84",
                "#EE5A24",
                "#0984e3",
                "#6C5CE7",
                "#A29BFE",
                "#222222",
                "#666666",
                "#999999",
                "#CCCCCC",
                "#FFFFFF",
              ]}
            />

            <div className="flex justify-between items-center gap-4">
              <button
                className="hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded"
                type="button"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="button"
                onClick={() => {
                  editor.dispatchCommand(INSERT_BANNER_COMMAND, bannerColor);
                  setIsOpen(false);
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )
      }
    </div >
  );
}
