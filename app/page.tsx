'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(() => import('@/components/Editor').then(mod => mod.default), {
	ssr: false,
	loading: () => (
		<div className="flex items-center justify-center h-screen">
			<p className="text-gray-500">Loading editor...</p>
		</div>
	),
})

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
