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
import '@/styles/index.css'
import '@/styles/PlaygroundEditorTheme.css'
import CustomOnChangePlugin from '@/Plugins/CustomOnChangePlugin'
import { FieldCodeNode } from '@/Nodes/FieldCodeNode/FieldCodeNode'
import { BookmarkFill, EyeFill } from 'react-bootstrap-icons'
import { PageBreakNode } from '@/Nodes/PageBreakNode/PageBreakNode'
import { CustomBannerNode } from '@/Nodes/BannerNode/BannerNode'
import { LayoutContainerNode } from '@/Nodes/LayoutContainerNode/LayoutContainerNode'
import { LayoutItemNode } from '@/Nodes/LayoutItemNode/LayoutItemNode'
import dynamic from 'next/dynamic.js'
import { ImageNode } from '@/Nodes/ImageNode'
import { useRouter, useSearchParams } from 'next/navigation'

const ImagesPlugin = dynamic(() => import('@/plugins/ImagePlugin/index.jsx'), {
	loading: () => <>Loading Image Plugin...</>,
	ssr: false,
})

const TableHoverActionsPlugin = dynamic(() => import('@/plugins/TableHoverActionsPlugin/index.jsx'), {
	loading: () => <>Loading TableHoverActions Plugin...</>,
	ssr: false,
})

const TableCellResizerPlugin = dynamic(() => import('@/plugins/TableCellResizer/index.jsx'), {
	loading: () => <>Loading TableHoverActions Plugin...</>,
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

const RichTextEditor = React.memo(function Editor({
	name = 'FCLS Editor',
	onChange,
	placeHolder = 'Please Enter Something',
	value,
}) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const initialConfig = useMemo(
		() => ({
			namespace: name,
			theme,
			onError: error => {
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

	const [floatingAnchorElem, setFloatingAnchorElem] = useState(null)

	const onRef = _floatingAnchorElem => {
		if (_floatingAnchorElem !== null) {
			setFloatingAnchorElem(_floatingAnchorElem)
		}
	}

	const handleCreateTemplate = async () => {
		try {
			const name = searchParams.get('name')
			const code = searchParams.get('code')
			const description = searchParams.get('description')
			const type = searchParams.get('type')
			console.log(type, 'This is the type')

			const response = await fetch('http://localhost:3001/api/editor', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name, code, description, type, content: value }),
			})
			console.log(response.data)
			if (response.ok) {
				alert('Template Saved Successfully')
			}
		} catch (error) {
			console.log(error)
			alert('Something went wrong! Please try again later.')
		}
	}

	const handleEditTemplate = async () => {
		try {
			const templateId = searchParams.get('id')

			const response = await fetch(`http://localhost:3001/api/editor?id=${templateId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					content: value,
				}),
			})
			console.log(response.data)
			// if (response.ok) {
			//   alert("Template Updated Successfully");
			// }
		} catch (error) {
			console.log(error)
			alert('Something went wrong! Please try again later.')
		}
	}

	return (
		<div style={{ height: '100%' }}>
			<div className="bg-white w-full relative flex h-full overflow-hidden">
				<LexicalComposer initialConfig={initialConfig}>
					<ToolbarPlugin />
					<div className="w-full bg-white overflow-y-scroll">
						<div className="bg-white sticky top-0 z-50 pt-4">
							<div className="text-xs bg-[#f9d6d6] rounded-md px-3 flex justify-between items-center h-12 mx-4 mb-4 z-50">
								<div className="text-nowrap">Template Editor</div>

								<div className="flex justify-between items-center gap-3">
									<div
										className="flex justify-center items-center gap-2 hover:cursor-pointer"
										onClick={() => router.push('/configurations/communication-configuration/template-types')}>
										<p className="text-nowrap text-blue-700 tracking-tight font-medium">CLOSE PREVIEW</p>
										<EyeFill className="text-blue-700" />
									</div>
									<button
										className="bg-[#486ac7ff] text-white rounded-md p-1.5 flex gap-2 items-center"
										onClick={() => {
											if (searchParams.get('method') === 'create') {
												handleCreateTemplate()
											} else {
												handleEditTemplate()
											}
											router.push('/configurations/communication-configuration/template-types')
										}}>
										<BookmarkFill className="mr-1" />
										<span className="text-nowrap">{searchParams.get('method') === 'create' ? 'SAVE' : 'EDIT'} TEMPLATE</span>
									</button>
								</div>
							</div>
						</div>
						<div className="editor-shell">
							<div className="w-full h-[75vh] overflow-scroll relative px-5 flex justify-center editor-container">
								<RichTextPlugin
									placeholder={<div className="absolute text-gray-400 left-1/2 -translate-x-1/2 top-2">{placeHolder}</div>}
									contentEditable={
										<div className="editor-scroller">
											<div className="editor" ref={onRef}>
												<ContentEditable className="w-full h-full border border-black relative overflow-y-scroll" />
											</div>
										</div>
									}
									ErrorBoundary={LexicalErrorBoundary}
								/>
							</div>
						</div>
					</div>

					<CustomOnChangePlugin value={value} onChange={onChange} />
					<AutoFocusPlugin />
					<ImagesPlugin />
					<HistoryPlugin />
					<ListPlugin />
					<CheckListPlugin />
					<LexicalTablePlugin />
					{floatingAnchorElem && <TableActionMenuPlugin anchorElem={floatingAnchorElem} cellMerge={true} />}
					<TableHoverActionsPlugin />
					<TableCellResizerPlugin />
				</LexicalComposer>
			</div>
		</div>
	)
})

export default RichTextEditor
