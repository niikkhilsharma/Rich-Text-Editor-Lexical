import { useState, useEffect, useCallback } from 'react'
import { HEADINGS, LOW_PRIORITY, RICH_TEXT_OPTIONS, RichTextAction } from '../Constants/index'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
	FORMAT_ELEMENT_COMMAND,
	FORMAT_TEXT_COMMAND,
	REDO_COMMAND,
	UNDO_COMMAND,
	CAN_REDO_COMMAND,
	CAN_UNDO_COMMAND,
	SELECTION_CHANGE_COMMAND,
	$isRangeSelection,
	$getSelection,
	$isTextNode,
	$createParagraphNode,
	$isParagraphNode,
	ParagraphNode,
} from 'lexical'
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils'
import { $createHeadingNode, $isHeadingNode, HeadingNode } from '@lexical/rich-text'
import { $getSelectionStyleValueForProperty, $patchStyleText, $setBlocksType } from '@lexical/selection'
import { useKeyBindings } from '../hooks/useKeyBindings'
import ColorPlugin from '@/plugins/ColorPlugin/ColorPlugin'
import ListPlugin from '@/plugins/ListPlugin/ListPlugin'
import ToolbarHeading from './ToolbarHeading'
import { $isListNode, ListNode } from '@lexical/list'
import { $isCodeNode, getDefaultCodeLanguage } from '@lexical/code'
import { InsertTableDialog } from '@/plugins/TablePlugin/TablePlugin'
import PageBreakPlugin from '@/plugins/PageBreakPlugin/PageBreakPlugin'
import FieldCodePlugin from '@/plugins/FieldCodePlugin/FieldCodePlugin'
import BannerPlugin from '@/plugins/BannerPlugin'
import useModal from '../hooks/useModal'
import { cn, getHeadingSizeByTagName } from '@/lib/utils'
import { LayoutPlugin } from '@/plugins/LayoutPlugin/LayoutPlugin'
import InsertLayoutDialog from '@/plugins/LayoutPlugin/InsertLayoutDialog'
import BannerFormattingPlugin from '@/plugins/CustomBannerPlugin'
import { Dash, LayoutSplit, PlusLg, Table } from 'react-bootstrap-icons'

// const InsertImageDialog = dynamic(() => import('../plugins/ImagePlugin/index'), {
// 	loading: () => <>Loading Image Plugin...</>,
// 	ssr: false,
// })

export default function ToolbarPlugin() {
	const [editor] = useLexicalComposerContext()
	const [activeEditor] = useState(editor)
	const [disableMap, setDisableMap] = useState({
		[RichTextAction.Undo]: true,
		[RichTextAction.Redo]: true,
	})
	const [selectionMap, setSelectionMap] = useState({})
	const [activeTab, setActiveTab] = useState('STYLES')

	const [blockType, setBlockType] = useState('paragraph')
	const [, setCodeLanguage] = useState(getDefaultCodeLanguage())
	const [, setSelectedElementKey] = useState('')

	const [modal, showModal] = useModal()

	const updateToolbar = useCallback(() => {
		const selection = $getSelection()
		if (!selection) {
			return
		}

		if ($isRangeSelection(selection)) {
			// Getting font size for the current selection

			const textNodeHasSize =
				$isTextNode(selection.anchor?.getNode()) && parseInt($getSelectionStyleValueForProperty(selection, 'font-size'))
			const isParagraphNode = $isParagraphNode($getNearestNodeOfType(selection.anchor.getNode(), ParagraphNode))
			const isHeadingNode = $isHeadingNode($getNearestNodeOfType(selection.anchor.getNode(), HeadingNode))
			const fontSize = textNodeHasSize
				? textNodeHasSize
				: isParagraphNode
				? 16
				: isHeadingNode
				? parseInt(getHeadingSizeByTagName($getNearestNodeOfType(selection.anchor.getNode(), HeadingNode).getTag()))
				: 16

			const newSelectionMap = {
				[RichTextAction.Bold]: selection.hasFormat('bold'),
				[RichTextAction.Italics]: selection.hasFormat('italic'),
				[RichTextAction.Underline]: selection.hasFormat('underline'),
				[RichTextAction.Strikethrough]: selection.hasFormat('strikethrough'),
				[RichTextAction.Superscript]: selection.hasFormat('superscript'),
				[RichTextAction.Subscript]: selection.hasFormat('subscript'),
				[RichTextAction.Highlight]: selection.hasFormat('highlight'),
				[RichTextAction.Code]: selection.hasFormat('code'),
				[RichTextAction.FontSize]: fontSize,
			}
			setSelectionMap(newSelectionMap)

			// Fix: Changed achorNode to anchorNode
			const anchorNode = selection.anchor.getNode()

			// Add null check for anchorNode
			if (!anchorNode) return

			const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow()
			const elementKey = element.getKey()
			setSelectedElementKey(elementKey)
			const elementDOM = editor.getElementByKey(elementKey)

			if (!elementDOM) return

			if ($isListNode(element)) {
				const parentList = $getNearestNodeOfType(anchorNode, ListNode)
				const type = parentList ? parentList.getTag() : element.getTag()
				setBlockType(type)
			} else {
				const type = $isHeadingNode(element) ? element.getTag() : element.getType()
				setBlockType(type)
				if ($isCodeNode(element)) {
					setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage())
				}
			}
		}
	}, [editor])

	useEffect(() => {
		return mergeRegister(
			editor.registerUpdateListener(({ editorState }) => {
				editorState.read(() => {
					updateToolbar()
				})
			}, LOW_PRIORITY),
			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				_payload => {
					updateToolbar()
					return false
				},
				LOW_PRIORITY
			),
			editor.registerCommand(
				CAN_UNDO_COMMAND,
				payload => {
					setDisableMap(prev => ({
						...prev,
						[RichTextAction.Undo]: !payload,
					}))
					return false
				},
				LOW_PRIORITY // Fixed typo
			),
			editor.registerCommand(
				CAN_REDO_COMMAND,
				payload => {
					setDisableMap(prev => ({
						...prev,
						[RichTextAction.Redo]: !payload,
					}))
					return false
				},
				LOW_PRIORITY // Fixed typo
			)
		)
	}, [editor, updateToolbar]) // Added missing dependencies

	const onAction = useCallback(
		id => {
			switch (id) {
				case RichTextAction.Bold: {
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
					break
				}
				case RichTextAction.Italics: {
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
					break
				}
				case RichTextAction.Underline: {
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
					break
				}
				case RichTextAction.Strikethrough: {
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
					break
				}
				case RichTextAction.Superscript: {
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')
					break
				}
				case RichTextAction.Subscript: {
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')
					break
				}
				case RichTextAction.Highlight: {
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'highlight')
					break
				}
				case RichTextAction.Code: {
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
					break
				}
				case RichTextAction.LeftAlign: {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
					break
				}
				case RichTextAction.RightAlign: {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
					break
				}
				case RichTextAction.CenterAlign: {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
					break
				}
				case RichTextAction.JustifyAlign: {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
					break
				}
				case RichTextAction.Undo: {
					editor.dispatchCommand(UNDO_COMMAND, undefined)
					break
				}
				case RichTextAction.Redo: {
					editor.dispatchCommand(REDO_COMMAND, undefined)
					break
				}
			}
		},
		[editor]
	)

	useKeyBindings({ onAction })

	const updateHeading = headingTagName => {
		editor.update(() => {
			const selection = $getSelection()

			if ($isRangeSelection(selection)) {
				const nodes = selection.getNodes()
				nodes.forEach(node => {
					if ($isTextNode(node)) {
						node.setStyle('')
					}
				})

				$setBlocksType(selection, () => $createHeadingNode(headingTagName))
			}
		})
	}

	const updateFontSize = delta => {
		editor.update(() => {
			const selection = $getSelection()

			if (!$isRangeSelection(selection)) return

			const anchorNode = selection.anchor.getNode()
			const headingNode = $getNearestNodeOfType(anchorNode, HeadingNode)
			const isHeadingNode = $isHeadingNode(headingNode)

			// Get current font size, default to 16px if not set
			console.log(selection)
			const currentFontSize = !isHeadingNode
				? $getSelectionStyleValueForProperty(selection, 'font-size', '16px')
				: getHeadingSizeByTagName(headingNode.getTag().toLowerCase())

			// Parse the font size (remove 'px' and convert to number)
			const currentSize = parseInt(currentFontSize.replace('px', '')) || 16

			// Calculate new font size with min/max bounds
			const newSize = Math.min(Math.max(currentSize + delta, 10), 72)

			if (isHeadingNode) {
				// Convert heading to paragraph first, then apply font size
				$setBlocksType(selection, () => $createParagraphNode())
				$patchStyleText(selection, { 'font-size': newSize + 'px' })
			} else {
				// Apply font size directly
				$patchStyleText(selection, { 'font-size': newSize + 'px' })
			}
		})
	}

	const tabs = ['STYLES', 'PRESETS', 'F-CODES']

	return (
		<div className={'w-1/5 sticky top-0 max-h-screen bg-[#DEEFFB] min-w-36 sm:min-w-60 p-2 pb-4'}>
			<div className="flex justify-between gap-4 py-2 border-b-2 border-gray-400/80 text-xs font-medium mb-2">
				{tabs.map((tab, index) => (
					<button
						key={index}
						className={activeTab === tab ? 'text-blue-800' : 'text-blue-500/60'}
						onClick={() => setActiveTab(tab)}>
						{tab}
					</button>
				))}
			</div>

			{activeTab === 'STYLES' && (
				<>
					<ToolbarHeading className={'my-1'}>Formatting</ToolbarHeading>

					<div className="bg-[#f1f8fd] mt-2 rounded-md">
						<ToolbarHeading variant="secondary" className={'px-3 py-2 border-b-2 border-gray-200'}>
							Text
						</ToolbarHeading>
						<div className="p-2">
							<div className="border flex justify-between items-center rounded-md bg-white">
								<button
									className={cn('rounded-md p-2 border hover:opacity-85 hover:bg-slate-200 h-8 w-8 aspect-square')}
									onClick={() => updateFontSize(-2)}>
									<Dash />
								</button>
								<p className="w-full text-center">{selectionMap[RichTextAction.FontSize]}</p>
								<button
									className={cn('rounded-md p-2 border hover:opacity-85 hover:bg-slate-200 h-8 w-8 aspect-square')}
									onClick={() => updateFontSize(+2)}>
									<PlusLg />
								</button>
							</div>

							<select
								defaultValue={'heading'}
								className="my-2 w-full p-1 rounded-md border"
								onChange={e => updateHeading(e.target.value)}>
								<option disabled value={'heading'}>
									Heading
								</option>
								{HEADINGS.map((heading, indx) => (
									<option key={indx} value={heading.tagName}>
										{heading.tagName.toUpperCase()}
									</option>
								))}
							</select>

							<div className="flex gap-2 flex-wrap">
								{RICH_TEXT_OPTIONS.map(({ id, icon, label, fontSize }) => (
									<button
										aria-label={label}
										className={`rounded-md p-2 border flex justify-center items-center hover:opacity-85 hover:bg-slate-200 h-8 w-8 aspect-square ${
											selectionMap[id] ? 'border-none bg-blue-800 text-white' : ''
										}`}
										key={id}
										disabled={disableMap[id]}
										style={{ fontSize: fontSize }}
										onClick={() => {
											onAction(id)
										}}>
										{icon}
									</button>
								))}
								<ListPlugin blockType={blockType} />
								<button
									className={cn('rounded-md p-2 border hover:opacity-85 hover:bg-slate-200 h-8 w-8 aspect-square')}
									onClick={() => {
										showModal('Insert Table', onClose => <InsertTableDialog activeEditor={activeEditor} onClose={onClose} />)
									}}>
									<Table />
								</button>
								{/* 
								<button
									className={cn('rounded-md p-2 border hover:opacity-85 hover:bg-slate-200 h-8 w-8 aspect-square')}
									onClick={() => {
										showModal('Insert Image', onClose => <InsertImageDialog activeEditor={activeEditor} onClose={onClose} />)
									}}>
									<ImageAlt />
								</button> */}

								{/* Layout container insert */}
								<button
									className={cn('rounded-md p-2 border hover:opacity-85 hover:bg-slate-200 h-8 w-8 text-xs')}
									title="Insert Layout"
									onClick={() => {
										showModal('Insert Layout', onClose => <InsertLayoutDialog activeEditor={activeEditor} onClose={onClose} />)
									}}>
									<LayoutSplit />
								</button>

								{/* Keep plugin mounted to register commands and transforms */}
								<LayoutPlugin />
								<PageBreakPlugin />
								<BannerPlugin />
								<BannerFormattingPlugin />
							</div>
						</div>

						{/* Appearance Tab */}
						<ToolbarHeading variant="secondary" className={'px-3 py-2 border-b-2 border-gray-200'}>
							Appearance
						</ToolbarHeading>
						<div className="p-2">
							<div className="flex gap-2 mt-2">
								<ColorPlugin />
							</div>
						</div>
					</div>
				</>
			)}

			{activeTab === 'F-CODES' && (
				<>
					<ToolbarHeading className={'my-1'}>Field Codes</ToolbarHeading>

					<div className="bg-[#f1f8fd] mt-2 p-2 h-32 rounded-md">
						<FieldCodePlugin />
					</div>
				</>
			)}
			{modal}
		</div>
	)
}
