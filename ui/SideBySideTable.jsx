/* eslint-disable react/prop-types */
"use client";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalNestedComposer } from "@lexical/react/LexicalNestedComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import {
  TableNode,
  TableCellNode,
  TableRowNode,
  INSERT_TABLE_COMMAND,
} from "@lexical/table";
import { useEffect } from "react";

function TableInitializer({ rows, cols }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows, columns: cols });
  }, [editor, rows, cols]);

  return null;
}

export default function SideBySideTables({
  leftRows,
  leftCols,
  rightRows,
  rightCols,
  nodeKey,
}) {
  const [isSelected] = useLexicalNodeSelection(nodeKey);

  const nestedEditorTheme = {
    // Add your table theme here
    table: "border-collapse border border-black",
    tableCell: "border border-black p-2",
    tableCellHeader: "border border-black p-2 font-bold bg-gray-100",
  };

  return (
    <div
      style={{ display: "flex", gap: "20px" }}
      className={isSelected ? "ring-2 ring-blue-500" : ""}
    >
      {/* Left Table */}
      <LexicalNestedComposer
        initialEditor={null}
        initialNodes={[TableNode, TableCellNode, TableRowNode]}
        initialTheme={nestedEditorTheme}
      >
        <TablePlugin />
        <TableInitializer rows={leftRows} cols={leftCols} />
        <ContentEditable className="outline-none" />
      </LexicalNestedComposer>

      {/* Right Table */}
      <LexicalNestedComposer
        initialEditor={null}
        initialNodes={[TableNode, TableCellNode, TableRowNode]}
        initialTheme={nestedEditorTheme}
      >
        <TablePlugin />
        <TableInitializer rows={rightRows} cols={rightCols} />
        <ContentEditable className="outline-none" />
      </LexicalNestedComposer>
    </div>
  );
}
