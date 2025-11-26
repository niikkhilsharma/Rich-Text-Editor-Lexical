import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from '@lexical/list'
import { ListOl, ListUl } from 'react-bootstrap-icons'
import { cn } from '@/lib/utils'

export default function ListPlugin({ blockType }) {
	const [editor] = useLexicalComposerContext()

	return (
		<>
			<button
				className={cn(
					`rounded-md p-2 border hover:opacity-85 hover:bg-slate-200 h-8 w-8 aspect-square`,
					blockType === 'ul' && 'bg-blue-800 text-white'
				)}
				onClick={() => {
					if (blockType === 'ul') {
						editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
					} else {
						editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
					}
				}}>
				<ListUl />
			</button>
			<button
				className={cn(
					`rounded-md p-2 border hover:opacity-85 hover:bg-slate-200 h-8 w-8 aspect-square`,
					blockType === 'ol' && 'bg-blue-800 text-white'
				)}
				onClick={() => {
					if (blockType === 'ol') {
						editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
					} else {
						editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
					}
				}}>
				<ListOl />
			</button>
		</>
	)
}
