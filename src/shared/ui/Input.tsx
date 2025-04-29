import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string
	helperText?: string
	error?: boolean
	leftIcon?: React.ReactNode
	rightIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			label,
			className = '',
			helperText,
			error = false,
			leftIcon,
			rightIcon,
			...props
		},
		ref
	) => {
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
		`

		const stateStyles = error
			? 'border-red-500 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-40'
			: 'border-[var(--tg-theme-hint-color)] border-opacity-30 focus:border-[var(--tg-theme-button-color)] focus:ring-[var(--tg-theme-button-color)] focus:ring-opacity-40'

		return (
			<div className={`mb-4 ${className}`}>
				{label && (
					<label className='block text-sm font-medium text-[var(--tg-theme-text-color)] mb-1.5'>
						{label}
					</label>
				)}
				<div className='relative'>
					{leftIcon && (
						<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
							{leftIcon}
						</div>
					)}
					<input
						ref={ref}
						className={`
							${baseStyles} 
							${stateStyles}
							${leftIcon ? 'pl-10' : ''}
							${rightIcon ? 'pr-10' : ''}
						`}
						{...props}
					/>
					{rightIcon && (
						<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
							{rightIcon}
						</div>
					)}
				</div>
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
