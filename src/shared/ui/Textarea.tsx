import { TextareaHTMLAttributes, forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string
	helperText?: string
	error?: boolean
	maxCharacters?: number
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	(
		{
			label,
			className = '',
			helperText,
			error = false,
			maxCharacters,
			...props
		},
		ref
	) => {
		const currentLength = props.value?.toString().length || 0

		const baseStyles = `
			w-full 
			py-2.5 
			px-4 
			bg-[var(--tg-theme-bg-color)] 
			border 
			rounded-lg 
			transition-colors 
			text-[var(--tg-theme-text-color)] 
			placeholder:text-[var(--tg-theme-hint-color)] 
			focus:outline-none 
			focus:ring-2 
			resize-vertical
			min-h-[100px]
		`

		const stateStyles = error
			? 'border-red-500 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-40'
			: 'border-[var(--tg-theme-hint-color)] border-opacity-30 focus:border-[var(--tg-theme-button-color)] focus:ring-[var(--tg-theme-button-color)] focus:ring-opacity-40'

		return (
			<div className={`mb-4 ${className}`}>
				{label && (
					<div className='flex justify-between mb-1.5'>
						<label className='block text-sm font-medium text-[var(--tg-theme-text-color)]'>
							{label}
						</label>
						{maxCharacters && (
							<span
								className={`text-xs ${
									currentLength > maxCharacters
										? 'text-red-500'
										: 'text-[var(--tg-theme-hint-color)]'
								}`}
							>
								{currentLength}/{maxCharacters}
							</span>
						)}
					</div>
				)}
				<textarea
					ref={ref}
					className={`${baseStyles} ${stateStyles}`}
					{...props}
				/>
				{helperText && (
					<p
						className={`mt-1 text-xs ${
							error ? 'text-red-500' : 'text-[var(--tg-theme-hint-color)]'
						}`}
					>
						{helperText}
					</p>
				)}
			</div>
		)
	}
)
