import React, { useMemo, useState } from 'react'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { HeadingNode } from '@lexical/rich-text'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import ToolbarPlugin from './ToolBarPlugin.jsx'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { ListItemNode, ListNode } from '@lexical/list'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table'
import { TablePlugin as LexicalTablePlugin } from '@lexical/react/LexicalTablePlugin'
import TableActionMenuPlugin from '@/Plugins/TableActionMenuPlugin'
import CustomOnChangePlugin from '@/Plugins/CustomOnChangePlugin'
import { FieldCodeNode } from '@/Nodes/FieldCodeNode/FieldCodeNode'
import { PageBreakNode } from '@/Nodes/PageBreakNode/PageBreakNode'
import { CustomBannerNode } from '@/Nodes/BannerNode/BannerNode'
import { LayoutContainerNode } from '@/Nodes/LayoutContainerNode/LayoutContainerNode'
import { LayoutItemNode } from '@/Nodes/LayoutItemNode/LayoutItemNode'
import { ImageNode } from '@/Nodes/ImageNode'
import dynamic from 'next/dynamic.js'

import '@/styles/PlaygroundEditorTheme.css'
import '@/styles/index.css'

const ImagesPlugin = dynamic(() => import('@/plugins/ImagePlugin/index.jsx'), {
	ssr: false,
})

const TableHoverActionsPlugin = dynamic(() => import('@/plugins/TableHoverActionsPlugin/index.jsx'), {
	ssr: false,
})

const TableCellResizerPlugin = dynamic(() => import('@/plugins/TableCellResizer/index.jsx'), {
	ssr: false,
})

const theme = {
	autocomplete: 'PlaygroundEditorTheme__autocomplete',
	blockCursor: 'PlaygroundEditorTheme__blockCursor',
	characterLimit: 'PlaygroundEditorTheme__characterLimit',
	code: 'PlaygroundEditorTheme__code',
	codeHighlight: {
		atrule: 'PlaygroundEditorTheme__tokenAttr',
		attr: 'PlaygroundEditorTheme__tokenAttr',
		boolean: 'PlaygroundEditorTheme__tokenProperty',
		builtin: 'PlaygroundEditorTheme__tokenSelector',
		cdata: 'PlaygroundEditorTheme__tokenComment',
		char: 'PlaygroundEditorTheme__tokenSelector',
		class: 'PlaygroundEditorTheme__tokenFunction',
		'class-name': 'PlaygroundEditorTheme__tokenFunction',
		comment: 'PlaygroundEditorTheme__tokenComment',
		constant: 'PlaygroundEditorTheme__tokenProperty',
		deleted: 'PlaygroundEditorTheme__tokenDeleted',
		doctype: 'PlaygroundEditorTheme__tokenComment',
		entity: 'PlaygroundEditorTheme__tokenOperator',
		function: 'PlaygroundEditorTheme__tokenFunction',
		important: 'PlaygroundEditorTheme__tokenVariable',
		inserted: 'PlaygroundEditorTheme__tokenInserted',
		keyword: 'PlaygroundEditorTheme__tokenAttr',
		namespace: 'PlaygroundEditorTheme__tokenVariable',
		number: 'PlaygroundEditorTheme__tokenProperty',
		operator: 'PlaygroundEditorTheme__tokenOperator',
		prolog: 'PlaygroundEditorTheme__tokenComment',
		property: 'PlaygroundEditorTheme__tokenProperty',
		punctuation: 'PlaygroundEditorTheme__tokenPunctuation',
		regex: 'PlaygroundEditorTheme__tokenVariable',
		selector: 'PlaygroundEditorTheme__tokenSelector',
		string: 'PlaygroundEditorTheme__tokenSelector',
		symbol: 'PlaygroundEditorTheme__tokenProperty',
		tag: 'PlaygroundEditorTheme__tokenProperty',
		unchanged: 'PlaygroundEditorTheme__tokenUnchanged',
		url: 'PlaygroundEditorTheme__tokenOperator',
		variable: 'PlaygroundEditorTheme__tokenVariable',
	},
	embedBlock: {
		base: 'PlaygroundEditorTheme__embedBlock',
		focus: 'PlaygroundEditorTheme__embedBlockFocus',
	},
	hashtag: 'PlaygroundEditorTheme__hashtag',
	heading: {
		h1: 'PlaygroundEditorTheme__h1',
		h2: 'PlaygroundEditorTheme__h2',
		h3: 'PlaygroundEditorTheme__h3',
		h4: 'PlaygroundEditorTheme__h4',
		h5: 'PlaygroundEditorTheme__h5',
		h6: 'PlaygroundEditorTheme__h6',
	},
	hr: 'PlaygroundEditorTheme__hr',
	hrSelected: 'PlaygroundEditorTheme__hrSelected',
	image: 'editor-image',
	indent: 'PlaygroundEditorTheme__indent',
	layoutContainer: 'PlaygroundEditorTheme__layoutContainer',
	layoutItem: 'PlaygroundEditorTheme__layoutItem',
	link: 'PlaygroundEditorTheme__link',
	list: {
		checklist: 'PlaygroundEditorTheme__checklist',
		listitem: 'PlaygroundEditorTheme__listItem',
		listitemChecked: 'PlaygroundEditorTheme__listItemChecked',
		listitemUnchecked: 'PlaygroundEditorTheme__listItemUnchecked',
		nested: {
			listitem: 'PlaygroundEditorTheme__nestedListItem',
		},
		olDepth: [
			'PlaygroundEditorTheme__ol1',
			'PlaygroundEditorTheme__ol2',
			'PlaygroundEditorTheme__ol3',
			'PlaygroundEditorTheme__ol4',
			'PlaygroundEditorTheme__ol5',
		],
		ul: 'PlaygroundEditorTheme__ul',
	},
	mark: 'PlaygroundEditorTheme__mark',
	markOverlap: 'PlaygroundEditorTheme__markOverlap',
	paragraph: 'PlaygroundEditorTheme__paragraph',
	quote: 'PlaygroundEditorTheme__quote',
	specialText: 'PlaygroundEditorTheme__specialText',
	tab: 'PlaygroundEditorTheme__tabNode',
	table: 'PlaygroundEditorTheme__table',
	tableAddColumns: 'PlaygroundEditorTheme__tableAddColumns',
	tableAddRows: 'PlaygroundEditorTheme__tableAddRows',
	tableAlignment: {
		center: 'PlaygroundEditorTheme__tableAlignmentCenter',
		right: 'PlaygroundEditorTheme__tableAlignmentRight',
	},
	tableCell: 'PlaygroundEditorTheme__tableCell',
	tableCellActionButton: 'PlaygroundEditorTheme__tableCellActionButton',
	tableCellActionButtonContainer: 'PlaygroundEditorTheme__tableCellActionButtonContainer',
	tableCellHeader: 'PlaygroundEditorTheme__tableCellHeader',
	tableCellResizer: 'PlaygroundEditorTheme__tableCellResizer',
	tableCellSelected: 'PlaygroundEditorTheme__tableCellSelected',
	tableFrozenColumn: 'PlaygroundEditorTheme__tableFrozenColumn',
	tableFrozenRow: 'PlaygroundEditorTheme__tableFrozenRow',
	tableRowStriping: 'PlaygroundEditorTheme__tableRowStriping',
	tableScrollableWrapper: 'PlaygroundEditorTheme__tableScrollableWrapper',
	tableSelected: 'PlaygroundEditorTheme__tableSelected',
	tableSelection: 'PlaygroundEditorTheme__tableSelection',
	text: {
		bold: 'PlaygroundEditorTheme__textBold',
		capitalize: 'PlaygroundEditorTheme__textCapitalize',
		code: 'PlaygroundEditorTheme__textCode',
		highlight: 'PlaygroundEditorTheme__textHighlight',
		italic: 'PlaygroundEditorTheme__textItalic',
		lowercase: 'PlaygroundEditorTheme__textLowercase',
		strikethrough: 'PlaygroundEditorTheme__textStrikethrough',
		subscript: 'PlaygroundEditorTheme__textSubscript',
		superscript: 'PlaygroundEditorTheme__textSuperscript',
		underline: 'PlaygroundEditorTheme__textUnderline',
		underlineStrikethrough: 'PlaygroundEditorTheme__textUnderlineStrikethrough',
		uppercase: 'PlaygroundEditorTheme__textUppercase',
	},
}

// Define the props interface
interface RichTextEditorProps {
	name?: string
	onChange: (value: string) => void
	placeHolder?: string
	value: string
	getTemplate?: () => string
}

const RichTextEditor = React.memo<RichTextEditorProps>(function Editor({
	name = 'FCLS Editor',
	onChange,
	placeHolder = 'Please Enter Something',
	value,
}) {
	const initialConfig = useMemo(
		() => ({
			namespace: name,
			theme,
			onError: (error: Error) => {
				console.error(error)
			},
			nodes: [
				HeadingNode,
				CodeHighlightNode,
				CodeNode,
				ListNode,
				ListItemNode,
				TableNode,
				TableCellNode,
				TableRowNode,
				FieldCodeNode,
				PageBreakNode,
				CustomBannerNode,
				LayoutContainerNode,
				LayoutItemNode,
				ImageNode,
			],
		}),
		[name]
	)

	const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null)

	const onRef = (_floatingAnchorElem: HTMLDivElement | null) => {
		if (_floatingAnchorElem !== null) {
			setFloatingAnchorElem(_floatingAnchorElem)
		}
	}

	return (
		<div className="bg-white w-full relative flex h-full overflow-hidden">
			{/* @ts-expect-error //here, the type of initial config is not provided. */}
			<LexicalComposer initialConfig={initialConfig}>
				<ToolbarPlugin />
				<RichTextPlugin
					placeholder={<div className="absolute text-gray-400 left-1/2 -translate-x-1/2 top-2">{placeHolder}</div>}
					contentEditable={
						<div className="h-full w-full resize-y min-h-screen relative flex">
							<div className="w-full" ref={onRef}>
								<ContentEditable className="w-full h-full border border-black relative" />
							</div>
						</div>
					}
					ErrorBoundary={LexicalErrorBoundary}
				/>

				<CustomOnChangePlugin value={value} onChange={onChange} />
				<AutoFocusPlugin />
				<ImagesPlugin captionsEnabled={false} />
				<HistoryPlugin />
				<ListPlugin />
				<CheckListPlugin />
				<LexicalTablePlugin />
				{floatingAnchorElem && <TableActionMenuPlugin anchorElem={floatingAnchorElem} cellMerge={true} />}
				<TableHoverActionsPlugin />
				<TableCellResizerPlugin />
			</LexicalComposer>
		</div>
	)
})

export default RichTextEditor
