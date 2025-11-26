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
	const template = `
<div style="max-width: 900px; margin: 0 auto; padding: 2.5rem; font-family: system-ui, -apple-system, sans-serif;">
  <h1 style="font-size: 2.75rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem; line-height: 1.2;">
    FCLS Rich Text Editor 📝
  </h1>
  
  <p style="color: #64748b; font-size: 1.15rem; margin-bottom: 0.5rem; font-weight: 500;">
    A production-ready, collaborative rich text editor • Built with Meta's Lexical Framework
  </p>
  
  <p style="color: #3b82f6; font-size: 0.95rem; margin-bottom: 2rem; font-weight: 600;">
    🚧 Evolving into a complete document workspace like Zoho Writer
  </p>

  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; border-radius: 12px; margin-bottom: 2rem; color: white; box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);">
    <h2 style="font-size: 1.6rem; font-weight: 600; margin: 0 0 1.25rem 0; color: white;">
      🎯 Project Vision
    </h2>
    <p style="margin: 0 0 1rem 0; font-size: 1rem; line-height: 1.8;">
      This isn't just another text editor – it's the foundation for a <strong>full-fledged collaborative document workspace</strong> inspired by Zoho Writer and Google Docs. Currently in active development, this project demonstrates my ability to architect complex, real-time applications from the ground up.
    </p>
    <p style="margin: 0; font-size: 1rem; line-height: 1.8;">
      Built with <strong>extensibility and scalability</strong> in mind, every feature is designed to support future enhancements like real-time collaboration, document versioning, and cloud synchronization.
    </p>
  </div>

  <h2 style="font-size: 1.85rem; font-weight: 600; color: #0f172a; margin-bottom: 1.25rem; border-bottom: 3px solid #3b82f6; padding-bottom: 0.5rem;">
    🛠️ Technical Architecture & Implementation
  </h2>

  <div style="background-color: #f8fafc; border: 2px solid #e2e8f0; padding: 1.75rem; border-radius: 10px; margin-bottom: 2rem;">
    <div style="margin-bottom: 1.5rem;">
      <h3 style="color: #1e293b; font-size: 1.15rem; font-weight: 600; margin-bottom: 0.75rem;">
        ⚡ Core Technologies
      </h3>
      <ul style="margin: 0; padding-left: 1.25rem; color: #334155; line-height: 2;">
        <li><strong>Next.js 14</strong> with App Router, TypeScript, and React Server Components for optimal performance</li>
        <li><strong>Lexical Framework</strong> - Meta's extensible text editor with custom node system</li>
        <li><strong>Tailwind CSS</strong> with custom design system and component architecture</li>
        <li><strong>Dynamic Imports</strong> for code-splitting and lazy loading (reduces initial bundle by ~40%)</li>
      </ul>
    </div>
    
    <div style="margin-bottom: 1.5rem;">
      <h3 style="color: #1e293b; font-size: 1.15rem; font-weight: 600; margin-bottom: 0.75rem;">
        🎨 Advanced Custom Implementations
      </h3>
      <ul style="margin: 0; padding-left: 1.25rem; color: #334155; line-height: 2;">
        <li><strong>Custom Node System:</strong> Built 6+ custom nodes (FieldCode, PageBreak, Banner, Layout, Image) with full serialization support</li>
        <li><strong>Plugin Architecture:</strong> Modular plugin system for table actions, image handling, and content transformation</li>
        <li><strong>HTML Serialization Engine:</strong> Custom parser to convert between HTML and Lexical's EditorState</li>
        <li><strong>State Management:</strong> Optimized with React hooks and Lexical's command system for 60fps editing</li>
      </ul>
    </div>
    
    <div>
      <h3 style="color: #1e293b; font-size: 1.15rem; font-weight: 600; margin-bottom: 0.75rem;">
        🔧 Technical Challenges Solved
      </h3>
      <ul style="margin: 0; padding-left: 1.25rem; color: #334155; line-height: 2;">
        <li>Implemented SSR compatibility with dynamic imports to handle client-only editor components</li>
        <li>Built custom table resizer with pixel-perfect column width management</li>
        <li>Created floating toolbar system with position tracking and viewport detection</li>
        <li>Optimized re-render cycles using memo and useMemo for complex editor state updates</li>
      </ul>
    </div>
  </div>

  <h2 style="font-size: 1.85rem; font-weight: 600; color: #0f172a; margin-bottom: 1.25rem; border-bottom: 3px solid #8b5cf6; padding-bottom: 0.5rem;">
    🚀 Roadmap: Building the Future
  </h2>

  <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; padding: 1.75rem; border-radius: 10px; margin-bottom: 2rem;">
    <p style="color: #78350f; font-size: 1rem; margin-bottom: 1.25rem; line-height: 1.7; font-weight: 500;">
      <strong>🎯 Currently transforming this into a complete Zoho Writer alternative</strong> with enterprise-grade features:
    </p>
    
    <div style="display: grid; gap: 1rem;">
      <div style="background-color: white; padding: 1rem 1.25rem; border-radius: 8px; border-left: 4px solid #10b981;">
        <strong style="color: #065f46; font-size: 1rem;">✅ Phase 1: Core Editor (Current)</strong>
        <p style="margin: 0.5rem 0 0 0; color: #374151; font-size: 0.9rem;">Rich formatting, tables, images, custom nodes, and plugin system</p>
      </div>
      
      <div style="background-color: white; padding: 1rem 1.25rem; border-radius: 8px; border-left: 4px solid #3b82f6;">
        <strong style="color: #1e40af; font-size: 1rem;">🔄 Phase 2: Real-Time Collaboration (In Progress)</strong>
        <p style="margin: 0.5rem 0 0 0; color: #374151; font-size: 0.9rem;">WebSocket integration, CRDT for conflict resolution, cursor tracking, and live presence indicators</p>
      </div>
      
      <div style="background-color: white; padding: 1rem 1.25rem; border-radius: 8px; border-left: 4px solid #8b5cf6;">
        <strong style="color: #5b21b6; font-size: 1rem;">📅 Phase 3: Document Management (Planned)</strong>
        <p style="margin: 0.5rem 0 0 0; color: #374151; font-size: 0.9rem;">Cloud storage, version history, document sharing, permissions management, and team workspaces</p>
      </div>
      
      <div style="background-color: white; padding: 1rem 1.25rem; border-radius: 8px; border-left: 4px solid #f59e0b;">
        <strong style="color: #92400e; font-size: 1rem;">🤖 Phase 4: AI Integration (Future)</strong>
        <p style="margin: 0.5rem 0 0 0; color: #374151; font-size: 0.9rem;">AI-powered writing assistance, smart suggestions, auto-formatting, and content generation</p>
      </div>
    </div>
  </div>

  <h2 style="font-size: 1.85rem; font-weight: 600; color: #0f172a; margin-bottom: 1.25rem; border-bottom: 3px solid #10b981; padding-bottom: 0.5rem;">
    ✨ Current Features & Capabilities
  </h2>

  <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0; display: grid; gap: 0.75rem;">
    <li style="background-color: white; padding: 1.25rem 1.5rem; border-radius: 10px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
      <span style="font-size: 1.75rem; margin-right: 1rem;">✏️</span>
      <strong style="color: #1e293b; font-size: 1.05rem;">Rich Text Formatting</strong>
      <p style="margin: 0.5rem 0 0 2.75rem; color: #64748b; font-size: 0.9rem;">Complete formatting suite: Bold, italic, underline, strikethrough, code blocks, headings (H1-H6), quotes, and text alignment</p>
    </li>
    
    <li style="background-color: white; padding: 1.25rem 1.5rem; border-radius: 10px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
      <span style="font-size: 1.75rem; margin-right: 1rem;">📋</span>
      <strong style="color: #1e293b; font-size: 1.05rem;">Advanced Table Editor</strong>
      <p style="margin: 0.5rem 0 0 2.75rem; color: #64748b; font-size: 0.9rem;">Drag-to-resize columns, cell merging, add/delete rows & columns, table formatting, and hover actions menu</p>
    </li>
    
    <li style="background-color: white; padding: 1.25rem 1.5rem; border-radius: 10px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
      <span style="font-size: 1.75rem; margin-right: 1rem;">🖼️</span>
      <strong style="color: #1e293b; font-size: 1.05rem;">Media Management</strong>
      <p style="margin: 0.5rem 0 0 2.75rem; color: #64748b; font-size: 0.9rem;">Drag-and-drop image insertion, resize handles, alignment controls, and custom image nodes</p>
    </li>
    
    <li style="background-color: white; padding: 1.25rem 1.5rem; border-radius: 10px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
      <span style="font-size: 1.75rem; margin-right: 1rem;">📑</span>
      <strong style="color: #1e293b; font-size: 1.05rem;">Custom Content Blocks</strong>
      <p style="margin: 0.5rem 0 0 2.75rem; color: #64748b; font-size: 0.9rem;">Page breaks, banners, field codes, and multi-column layouts with custom node architecture</p>
    </li>
    
    <li style="background-color: white; padding: 1.25rem 1.5rem; border-radius: 10px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
      <span style="font-size: 1.75rem; margin-right: 1rem;">⌨️</span>
      <strong style="color: #1e293b; font-size: 1.05rem;">Keyboard Shortcuts & History</strong>
      <p style="margin: 0.5rem 0 0 2.75rem; color: #64748b; font-size: 0.9rem;">Full undo/redo support with Ctrl+Z/Y, keyboard navigation, and command palette integration</p>
    </li>
  </ul>

  <h2 style="font-size: 1.85rem; font-weight: 600; color: #0f172a; margin-bottom: 1.25rem; border-bottom: 3px solid #f59e0b; padding-bottom: 0.5rem;">
    👨‍💻 About the Developer
  </h2>

  <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 2rem; border-radius: 12px; margin-bottom: 2rem; border: 2px solid #d1d5db;">
    <p style="color: #1f2937; margin-bottom: 1rem; font-size: 1.05rem; line-height: 1.8;">
      Hi! I'm a <strong style="color: #0f172a;">Full-Stack Developer</strong> based in Hyderabad with a passion for building scalable, user-centric applications. I specialize in <strong>React, Next.js, TypeScript</strong>, and modern JavaScript ecosystems.
    </p>
    
    <p style="color: #1f2937; margin-bottom: 1rem; font-size: 1.05rem; line-height: 1.8;">
      This project showcases my ability to <strong style="color: #0f172a;">architect complex systems from scratch</strong>, contribute to open-source frameworks (actively contributing to Lexical by Meta), and build production-ready applications with clean, maintainable code.
    </p>
    
    <div style="background-color: white; padding: 1.5rem; border-radius: 8px; margin-top: 1.5rem; border-left: 4px solid #3b82f6;">
      <h3 style="color: #1e293b; font-size: 1.15rem; font-weight: 600; margin: 0 0 1rem 0;">
        💼 What This Project Demonstrates:
      </h3>
      <ul style="padding-left: 1.5rem; margin: 0; color: #475569; line-height: 2;">
        <li><strong>System Design:</strong> Architecting extensible, plugin-based systems</li>
        <li><strong>Performance Optimization:</strong> Code-splitting, lazy loading, and render optimization</li>
        <li><strong>TypeScript Mastery:</strong> Type-safe development with complex generic types</li>
        <li><strong>Open Source:</strong> Contributing to Meta's Lexical framework and community</li>
        <li><strong>Product Thinking:</strong> Building with scalability and user experience in mind</li>
        <li><strong>Modern Tooling:</strong> Next.js, React hooks, custom plugins, and state management</li>
      </ul>
    </div>
  </div>

  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 2rem; border-radius: 12px; margin-top: 2.5rem; box-shadow: 0 10px 40px rgba(16, 185, 129, 0.4);">
    <h2 style="font-size: 1.6rem; font-weight: 600; margin: 0 0 1.25rem 0; color: white;">
      📞 Let's Connect!
    </h2>
    <p style="margin: 0 0 1rem 0; color: #d1fae5; font-size: 1.05rem; line-height: 1.8;">
      Interested in collaborating, discussing this project, or exploring opportunities? I'm always open to connecting with fellow developers, recruiters, and tech enthusiasts!
    </p>
    <p style="margin: 0; font-size: 1.15rem;">
      <strong style="color: white;">📱 Phone:</strong> <a href="tel:+918504920637" style="color: #d1fae5; text-decoration: none; font-weight: 700; border-bottom: 2px solid #d1fae5; padding-bottom: 2px;">+91 8504920637</a>
    </p>
  </div>

  <div style="background-color: #fef3c7; border: 2px solid #f59e0b; padding: 1.5rem; border-radius: 10px; margin-top: 2rem;">
    <p style="margin: 0; color: #78350f; font-size: 1rem; line-height: 1.7;">
      💡 <strong>Try it out!</strong> The editor above is fully functional. Create tables, format text, add images, experiment with layouts – everything you see is built from scratch and ready for production use. More exciting features are being added every week!
    </p>
  </div>
</div>
`

	const [editorValue, setEditorValue] = useState<string>(template)

	const handleOnChange = (value: string) => {
		setEditorValue(value)
	}

	return (
		<RichTextEditor
			key={template}
			placeHolder="Enter Something"
			name="FCLS Editor"
			value={editorValue}
			onChange={handleOnChange}
			initialHtml={template}
		/>
	)
}
