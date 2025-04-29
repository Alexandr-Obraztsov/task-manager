import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'danger' | 'success'
	children: ReactNode
	isLoading?: boolean
	size?: 'sm' | 'md' | 'lg'
	fullWidth?: boolean
	icon?: ReactNode
}

export const Button = ({
	variant = 'primary',
	children,
	isLoading,
	className = '',
	size = 'md',
	fullWidth = true,
	icon,
	...props
}: ButtonProps) => {
	const baseStyles = `
		${fullWidth ? 'w-full' : 'w-auto'} 
		inline-flex items-center justify-center 
		font-medium 
		transition-all duration-200 
		rounded-lg 
		disabled:opacity-50 
		focus:outline-none focus:ring-2 focus:ring-offset-2
	`

	const sizeStyles = {
		sm: 'text-xs px-3 py-2',
		md: 'text-sm px-4 py-2.5',
		lg: 'text-base px-5 py-3',
	}

	const variantStyles = {
		primary: `
			bg-[var(--tg-theme-button-color)] 
			text-[var(--tg-theme-button-text-color)] 
			hover:opacity-90 
			focus:ring-[var(--tg-theme-button-color)] focus:ring-opacity-50
		`,
		secondary: `
			bg-[var(--tg-theme-secondary-bg-color)] 
			text-[var(--tg-theme-link-color)] 
			border border-[var(--tg-theme-button-color)] 
			hover:bg-opacity-80 
			focus:ring-[var(--tg-theme-link-color)] focus:ring-opacity-40
		`,
		danger: `
			bg-red-600 
			text-white 
			hover:bg-red-700 
			focus:ring-red-500 focus:ring-opacity-50
		`,
		success: `
			bg-green-600 
			text-white 
			hover:bg-green-700 
			focus:ring-green-500 focus:ring-opacity-50
		`,
	}

	return (
		<button
			className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
			disabled={isLoading || props.disabled}
			{...props}
		>
			{isLoading ? (
				<>
					<svg
						className='animate-spin -ml-1 mr-2 h-4 w-4 text-current'
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
					>
						<circle
							className='opacity-25'
							cx='12'
							cy='12'
							r='10'
							stroke='currentColor'
							strokeWidth='4'
						></circle>
						<path
							className='opacity-75'
							fill='currentColor'
							d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
						></path>
					</svg>
					<span>Загрузка...</span>
				</>
			) : (
				<>
					{icon && <span className='mr-2'>{icon}</span>}
					{children}
				</>
			)}
		</button>
	)
}
