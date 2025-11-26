'use client'

import RichTextEditor from '@/components/Editor'
import { useState } from 'react'

export default function Home() {
	const [editorValue, setEditorValue] = useState<string>('')

	const handleOnChange = (value: string) => {
		setEditorValue(value)
	}

	const getTemplate = () => {
		return '<p></p><h1>Welcome to FCLS Rich Text Editor</h1><p>This is a rich text editor built with Lexical and Next.js.</p>'
	}
	return (
		<div>
			<RichTextEditor
				placeHolder="Enter Something"
				name="FCLS Editor"
				value={editorValue}
				onChange={handleOnChange}
				getTemplate={getTemplate}
			/>
		</div>
	)
}
