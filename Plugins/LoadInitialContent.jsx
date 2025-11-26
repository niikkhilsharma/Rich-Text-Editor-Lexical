import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $generateNodesFromDOM } from '@lexical/html'
import { $getRoot, $insertNodes } from 'lexical'
import { useEffect, useRef } from 'react'

export default function LoadInitialContentPlugin({ initialHtml }) {
	const [editor] = useLexicalComposerContext()
	const isFirstRender = useRef(true)

	useEffect(() => {
		if (!initialHtml || !isFirstRender.current) return

		editor.update(() => {
			// Clear existing content and set initial content only once
			$getRoot().clear()

			// Parse HTML string to DOM
			const parser = new DOMParser()
			const dom = parser.parseFromString(initialHtml, 'text/html')

			// Generate Lexical nodes from DOM
			const nodes = $generateNodesFromDOM(editor, dom)

			// Insert nodes into the editor
			$insertNodes(nodes)
		})

		isFirstRender.current = false
	}, [editor, initialHtml])

	return null
}
