import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const headingVariants = cva('font-medium', {
	variants: {
		variant: {
			default: 'text-blue-800 font-semibold text-xs',
			secondary: 'text-blue-500 font-semibold uppercase text-xs',
		},
	},
	defaultVariants: { variant: 'default' },
})

const ToolbarHeading = ({ variant, children, className }) => {
	return <p className={cn(headingVariants({ variant }), className)}>{children}</p>
}

export default ToolbarHeading
