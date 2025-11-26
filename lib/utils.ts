import { $createCodeNode } from '@lexical/code'
import { INSERT_CHECK_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list'
import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode'
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, $isQuoteNode, HeadingTagType } from '@lexical/rich-text'
import { $patchStyleText, $setBlocksType } from '@lexical/selection'
import { $isTableSelection } from '@lexical/table'
import { $getNearestBlockElementAncestorOrThrow } from '@lexical/utils'
import { clsx, type ClassValue } from 'clsx'
import { $createParagraphNode, $getSelection, $isRangeSelection, $isTextNode, LexicalEditor, TextNode } from 'lexical'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

// Note: Ensure this path is correct in your project
import { HEADINGS } from '../Constants'

// -----------------------------------------------------------------------------
// Constants & Types
// -----------------------------------------------------------------------------

export const MIN_ALLOWED_FONT_SIZE = 8
export const MAX_ALLOWED_FONT_SIZE = 72
export const DEFAULT_FONT_SIZE = 15

export const UpdateFontSizeType = {
	increment: 1,
	decrement: 2,
} as const

export type BlockType =
	| 'bullet'
	| 'check'
	| 'code'
	| 'h1'
	| 'h2'
	| 'h3'
	| 'h4'
	| 'h5'
	| 'h6'
	| 'number'
	| 'paragraph'
	| 'quote'

export const rootTypeToRootName = {
	root: 'Root',
	table: 'Table',
}

export const blockTypeToBlockName: Record<BlockType, string> = {
	bullet: 'Bulleted List',
	check: 'Check List',
	code: 'Code Block',
	h1: 'Heading 1',
	h2: 'Heading 2',
	h3: 'Heading 3',
	h4: 'Heading 4',
	h5: 'Heading 5',
	h6: 'Heading 6',
	number: 'Numbered List',
	paragraph: 'Normal',
	quote: 'Quote',
}

interface ToolbarState {
	bgColor: string
	blockType: BlockType
	canRedo: boolean
	canUndo: boolean
	codeLanguage: string
	codeTheme: string
	elementFormat: string
	fontColor: string
	fontFamily: string
	fontSize: string
	fontSizeInputValue: string
	isBold: boolean
	isCode: boolean
	isHighlight: boolean
	isImageCaption: boolean
	isItalic: boolean
	isLink: boolean
	isRTL: boolean
	isStrikethrough: boolean
	isSubscript: boolean
	isSuperscript: boolean
	isUnderline: boolean
	isLowercase: boolean
	isUppercase: boolean
	isCapitalize: boolean
	rootType: keyof typeof rootTypeToRootName
}

const INITIAL_TOOLBAR_STATE: ToolbarState = {
	bgColor: '#fff',
	blockType: 'paragraph',
	canRedo: false,
	canUndo: false,
	codeLanguage: '',
	codeTheme: '',
	elementFormat: 'left',
	fontColor: '#000',
	fontFamily: 'Arial',
	fontSize: `${DEFAULT_FONT_SIZE}px`,
	fontSizeInputValue: `${DEFAULT_FONT_SIZE}`,
	isBold: false,
	isCode: false,
	isHighlight: false,
	isImageCaption: false,
	isItalic: false,
	isLink: false,
	isRTL: false,
	isStrikethrough: false,
	isSubscript: false,
	isSuperscript: false,
	isUnderline: false,
	isLowercase: false,
	isUppercase: false,
	isCapitalize: false,
	rootType: 'root',
}

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

/**
 * Calculates the new font size based on the update type.
 */
export const calculateNextFontSize = (currentFontSize: number, updateType: number | null): number => {
	if (!updateType) {
		return currentFontSize
	}

	let updatedFontSize = currentFontSize
	switch (updateType) {
		case UpdateFontSizeType.decrement:
			switch (true) {
				case currentFontSize > MAX_ALLOWED_FONT_SIZE:
					updatedFontSize = MAX_ALLOWED_FONT_SIZE
					break
				case currentFontSize >= 48:
					updatedFontSize -= 12
					break
				case currentFontSize >= 24:
					updatedFontSize -= 4
					break
				case currentFontSize >= 14:
					updatedFontSize -= 2
					break
				case currentFontSize >= 9:
					updatedFontSize -= 1
					break
				default:
					updatedFontSize = MIN_ALLOWED_FONT_SIZE
					break
			}
			break

		case UpdateFontSizeType.increment:
			switch (true) {
				case currentFontSize < MIN_ALLOWED_FONT_SIZE:
					updatedFontSize = MIN_ALLOWED_FONT_SIZE
					break
				case currentFontSize < 12:
					updatedFontSize += 1
					break
				case currentFontSize < 20:
					updatedFontSize += 2
					break
				case currentFontSize < 36:
					updatedFontSize += 4
					break
				case currentFontSize <= 60:
					updatedFontSize += 12
					break
				default:
					updatedFontSize = MAX_ALLOWED_FONT_SIZE
					break
			}
			break

		default:
			break
	}
	return updatedFontSize
}

/**
 * Patches the selection with the updated font size.
 */
export const updateFontSizeInSelection = (editor: LexicalEditor, newFontSize: string | null, updateType: number | null) => {
	const getNextFontSize = (prevFontSize: string | null | undefined) => {
		if (!prevFontSize) {
			prevFontSize = `${DEFAULT_FONT_SIZE}px`
		}
		prevFontSize = prevFontSize.slice(0, -2) // Remove 'px'
		const nextFontSize = calculateNextFontSize(Number(prevFontSize), updateType)
		return `${nextFontSize}px`
	}

	editor.update(() => {
		if (editor.isEditable()) {
			const selection = $getSelection()
			if (selection !== null) {
				$patchStyleText(selection, {
					'font-size': newFontSize ?? (getNextFontSize as any), // Type cast as Lexical's patch usually expects string, but functional updates depend on implementation
				})
			}
		}
	})
}

export const updateFontSize = (editor: LexicalEditor, updateType: number, inputValue: string) => {
	if (inputValue !== '') {
		const nextFontSize = calculateNextFontSize(Number(inputValue), updateType)
		updateFontSizeInSelection(editor, String(nextFontSize) + 'px', null)
	} else {
		updateFontSizeInSelection(editor, null, updateType)
	}
}

export const getHeadingSizeByTagName = (tagName: HeadingTagType): string | undefined => {
	return HEADINGS.find(heading => heading.tagName === tagName)?.size
}

// -----------------------------------------------------------------------------
// Formatting Functions
// -----------------------------------------------------------------------------

export const formatParagraph = (editor: LexicalEditor) => {
	editor.update(() => {
		const selection = $getSelection()
		if ($isRangeSelection(selection)) {
			$setBlocksType(selection, () => $createParagraphNode())
		}
	})
}

export const formatHeading = (editor: LexicalEditor, blockType: string, headingSize: HeadingTagType) => {
	if (blockType !== headingSize) {
		editor.update(() => {
			const selection = $getSelection()
			$setBlocksType(selection, () => $createHeadingNode(headingSize))
		})
	}
}

export const formatBulletList = (editor: LexicalEditor, blockType: string) => {
	if (blockType !== 'bullet') {
		editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
	} else {
		formatParagraph(editor)
	}
}

export const formatCheckList = (editor: LexicalEditor, blockType: string) => {
	if (blockType !== 'check') {
		editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
	} else {
		formatParagraph(editor)
	}
}

export const formatNumberedList = (editor: LexicalEditor, blockType: string) => {
	if (blockType !== 'number') {
		editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
	} else {
		formatParagraph(editor)
	}
}

export const formatQuote = (editor: LexicalEditor, blockType: string) => {
	if (blockType !== 'quote') {
		editor.update(() => {
			const selection = $getSelection()
			$setBlocksType(selection, () => $createQuoteNode())
		})
	}
}

export const formatCode = (editor: LexicalEditor, blockType: string) => {
	if (blockType !== 'code') {
		editor.update(() => {
			let selection = $getSelection()
			if (!selection) {
				return
			}
			if (!$isRangeSelection(selection) || selection.isCollapsed()) {
				$setBlocksType(selection, () => $createCodeNode())
			} else {
				const textContent = selection.getTextContent()
				const codeNode = $createCodeNode()
				selection.insertNodes([codeNode])
				selection = $getSelection()
				if ($isRangeSelection(selection)) {
					selection.insertRawText(textContent)
				}
			}
		})
	}
}

export const clearFormatting = (editor: LexicalEditor) => {
	editor.update(() => {
		const selection = $getSelection()
		if ($isRangeSelection(selection) || $isTableSelection(selection)) {
			const anchor = selection.anchor
			const focus = selection.focus
			const nodes = selection.getNodes()
			const extractedNodes = selection.extract()

			if (anchor.key === focus.key && anchor.offset === focus.offset) {
				return
			}

			nodes.forEach((node, idx) => {
				// We split the first and last node by the selection
				// So that we don't format unselected text inside those nodes
				if ($isTextNode(node)) {
					let textNode: TextNode = node
					if (idx === 0 && anchor.offset !== 0) {
						textNode = textNode.splitText(anchor.offset)[1] || textNode
					}
					if (idx === nodes.length - 1) {
						textNode = textNode.splitText(focus.offset)[0] || textNode
					}

					// Case where selected text only has one format
					const extractedTextNode = extractedNodes[0]
					if (nodes.length === 1 && $isTextNode(extractedTextNode)) {
						textNode = extractedTextNode
					}

					if (textNode.getStyle() !== '') {
						textNode.setStyle('')
					}
					if (textNode.getFormat() !== 0) {
						textNode.setFormat(0)
					}
					const nearestBlockElement = $getNearestBlockElementAncestorOrThrow(textNode)
					if (nearestBlockElement.getFormatType() !== '') {
						nearestBlockElement.setFormat('')
					}
					// Note: TextNode doesn't usually have indent, BlockNode does.
					// Checking compatibility before calling setIndent
					if ('setIndent' in nearestBlockElement) {
						;(nearestBlockElement as any).setIndent(0)
					}
				} else if ($isHeadingNode(node) || $isQuoteNode(node)) {
					node.replace($createParagraphNode(), true)
				} else if ($isDecoratorBlockNode(node)) {
					node.setFormat('')
				}
			})
		}
	})
}

type Theme = Record<string, string>

export const getThemeSelector = (getTheme: () => Theme | null | undefined, name: string): string => {
	const className = getTheme()?.[name]

	if (typeof className !== 'string') {
		throw new Error(`getThemeClass: required theme property "${name}" not defined`)
	}

	return className
		.split(/\s+/g) // Split by whitespace
		.map(cls => `.${cls}`) // Add dot to each class
		.join(',') // Join with comma (creates a list of selectors)
}

// -----------------------------------------------------------------------------
// React Context
// -----------------------------------------------------------------------------

// interface ToolbarContextType {
// 	toolbarState: ToolbarState
// 	updateToolbarState: (key: keyof ToolbarState, value: any) => void
// }

// const Context = createContext<ToolbarContextType | undefined>(undefined)

// export const ToolbarContext = ({ children }: { children: ReactNode }) => {
// 	const [toolbarState, setToolbarState] = useState(INITIAL_TOOLBAR_STATE)
// 	const selectionFontSize = toolbarState.fontSize

// 	const updateToolbarState = useCallback((key: keyof ToolbarState, value: any) => {
// 		setToolbarState(prev => ({
// 			...prev,
// 			[key]: value,
// 		}))
// 	}, [])

// 	useEffect(() => {
// 		updateToolbarState('fontSizeInputValue', selectionFontSize.slice(0, -2))
// 	}, [selectionFontSize, updateToolbarState])

// 	const contextValue = useMemo(() => {
// 		return {
// 			toolbarState,
// 			updateToolbarState,
// 		}
// 	}, [toolbarState, updateToolbarState])

// 	return <Context.Provider value={contextValue}>{children}</Context.Provider>
// }

// export const useToolbarState = () => {
// 	const context = useContext(Context)

// 	if (context === undefined) {
// 		throw new Error('useToolbarState must be used within a ToolbarProvider')
// 	}

// 	return context
// }
