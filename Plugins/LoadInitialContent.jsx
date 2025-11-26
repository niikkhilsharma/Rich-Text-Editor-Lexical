import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $generateNodesFromDOM } from '@lexical/html'
import { $getRoot, $insertNodes } from 'lexical'
import { useEffect } from 'react'

export default function LoadInitialContentPlugin({ initialHtml }) {
	const [editor] = useLexicalComposerContext()

	useEffect(() => {
		if (!initialHtml) return

		editor.update(() => {
			// Only set initial content if editor is empty
			const root = $getRoot()
			if (root.getFirstChild() !== null) return

			// Parse HTML string to DOM
			const parser = new DOMParser()
			const dom = parser.parseFromString(initialHtml, 'text/html')

			// Generate Lexical nodes from DOM
			const nodes = $generateNodesFromDOM(editor, dom)

			// Insert nodes into the editor
			$insertNodes(nodes)
		})
	}, [editor, initialHtml])

	return null
}
