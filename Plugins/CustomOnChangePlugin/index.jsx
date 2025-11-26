import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot } from "lexical";
import PropTypes from "prop-types";
import { useEffect } from "react";

const CustomOnChangePlugin = ({ value, onChange }) => {
  const [editor] = useLexicalComposerContext();
  console.log(value);
  // Apply incoming HTML value to the editor when it changes and differs
  useEffect(() => {
    if (typeof value !== "string") return;

    let shouldApply = false;
    let currentHtml = "";
    editor.getEditorState().read(() => {
      currentHtml = $generateHtmlFromNodes(editor);
      shouldApply = currentHtml !== value;
    });

    if (!shouldApply) return;

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(value || "", "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();
      root.append(...nodes);
    });
  }, [editor, value]);

  return (
    <OnChangePlugin
      onChange={(editorState) => {
        editorState.read(() => {
          onChange($generateHtmlFromNodes(editor));
        });
      }}
    />
  );
};

CustomOnChangePlugin.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default CustomOnChangePlugin;
