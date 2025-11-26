import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { COMMAND_PRIORITY_EDITOR, createCommand, $getSelection, $isRangeSelection } from 'lexical'
import { $createFieldCodeNode, FieldCodeNode } from '@/Nodes/FieldCodeNode/FieldCodeNode'
import { useEffect, useState } from 'react'
import { HiCubeTransparent } from 'react-icons/hi'
import { cn } from '@/lib/utils'
import Modal from '@/components/Modal'
import { getParentCategories, getSubcategories } from '@/Constants/data'

export const INSERT_FIELD_CODE_COMMAND = createCommand()

export default function FieldCodePlugin() {
	const [editor] = useLexicalComposerContext()
	const [isOpen, setIsOpen] = useState(false)
	const [selectedCategory, setSelectedCategory] = useState('')
	const [selectedFieldCode, setSelectedFieldCode] = useState('')
	const [value, setValue] = useState('')

	if (!editor.hasNodes([FieldCodeNode])) {
		throw new Error('FieldCodePlugin: FieldCodeNode not registered on editor (initialConfig.nodes)')
	}

	useEffect(() => {
		return editor.registerCommand(
			INSERT_FIELD_CODE_COMMAND,
			payload => {
				const selection = $getSelection()

				if ($isRangeSelection(selection)) {
					const fieldCodeNode = $createFieldCodeNode(payload)
					selection.insertNodes([fieldCodeNode])
				}

				return true
			},
			COMMAND_PRIORITY_EDITOR
		)
	}, [editor])

	// Reset selections when modal opens
	useEffect(() => {
		if (isOpen) {
			setSelectedCategory('')
			setSelectedFieldCode('')
			setValue('')
		}
	}, [isOpen])

	// Update value when field code is selected
	useEffect(() => {
		if (selectedFieldCode) {
			setValue(selectedFieldCode)
		}
	}, [selectedFieldCode])

	function handleFieldCode() {
		if (!value) return

		editor.update(() => {
			const selection = $getSelection()

			if ($isRangeSelection(selection)) {
				const fieldCodeNode = $createFieldCodeNode(`{{${value}}}`)
				selection.insertNodes([fieldCodeNode])
			}
		})

		// Close modal after insertion
		setIsOpen(false)
	}

	// Handle category selection
	const handleCategorySelect = category => {
		setSelectedCategory(category)
		setSelectedFieldCode('') // Reset field code selection when category changes
	}

	// Handle field code selection
	const handleFieldCodeSelect = fieldCode => {
		setSelectedFieldCode(fieldCode)
	}

	return (
		<>
			<button
				className={cn('rounded-md p-2 border hover:opacity-85 hover:bg-slate-200 h-8 w-8 aspect-square')}
				onClick={() => setIsOpen(true)}>
				<HiCubeTransparent />
			</button>

			{isOpen && (
				<Modal
					title="Select Field Code"
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					footer={
						<div className="flex justify-end space-x-3">
							<button
								onClick={() => setIsOpen(false)}
								className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200">
								Cancel
							</button>
							<button
								onClick={handleFieldCode}
								disabled={!selectedFieldCode}
								className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-md transition-colors duration-200">
								Insert Field
							</button>
						</div>
					}>
					<div className="space-y-4">
						{/* Category Selection */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Select Category</label>
							<select
								value={selectedCategory}
								onChange={e => handleCategorySelect(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
								<option value="">Choose a category...</option>
								{getParentCategories().map(category => (
									<option key={category} value={category}>
										{category}
									</option>
								))}
							</select>
						</div>

						{/* Field Code Selection - Only show when category is selected */}
						{selectedCategory && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Select Field Code</label>
								<select
									value={selectedFieldCode}
									onChange={e => handleFieldCodeSelect(e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									autoFocus>
									<option value="">Choose an Field Code...</option>
									{getSubcategories(selectedCategory).map(fieldCode => (
										<option key={fieldCode} value={fieldCode}>
											{fieldCode}
										</option>
									))}
								</select>
							</div>
						)}

						{/* Preview of selected value */}
						{value && (
							<div className="mt-4 p-3 bg-gray-50 rounded-md">
								<p className="text-sm text-gray-600">Selected field:</p>
								<p className="font-medium text-gray-900">{`{{${value}}}`}</p>
							</div>
						)}
					</div>
				</Modal>
			)}
		</>
	)
}
