import { HTMLAttributes, ReactNode } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	children: ReactNode
	variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
	size?: 'sm' | 'md' | 'lg'
	rounded?: boolean
	dot?: boolean
}

export const Badge = ({
	children,
	className = '',
	variant = 'primary',
	size = 'md',
	rounded = false,
	dot = false,
	...props
}: BadgeProps) => {
	const baseStyles = 'inline-flex items-center font-medium'

	const variantStyles = {
		primary:
			'bg-[var(--tg-theme-button-color)] bg-opacity-15 text-[var(--tg-theme-button-color)]',
		secondary:
			'bg-[var(--tg-theme-hint-color)] bg-opacity-15 text-[var(--tg-theme-hint-color)]',
		success:
			'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
		warning:
			'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
		danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
		info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
	}

	const sizeStyles = {
		sm: 'text-xs px-1.5 py-0.5',
		md: 'text-xs px-2 py-1',
		lg: 'text-sm px-2.5 py-1.5',
	}

	const roundedStyles = rounded ? 'rounded-full' : 'rounded'

	return (
		<span
			className={`
        ${baseStyles} 
        ${variantStyles[variant]} 
        ${sizeStyles[size]} 
        ${roundedStyles} 
        ${className}
      `}
			{...props}
		>
			{dot && (
				<span
					className={`
            inline-block w-2 h-2 mr-1.5 rounded-full 
            ${
							variant === 'primary'
								? 'bg-[var(--tg-theme-button-color)]'
								: variant === 'secondary'
								? 'bg-[var(--tg-theme-hint-color)]'
								: variant === 'success'
								? 'bg-green-500'
								: variant === 'warning'
								? 'bg-yellow-500'
								: variant === 'danger'
								? 'bg-red-500'
								: 'bg-blue-500'
						}
          `}
				/>
			)}
			{children}
		</span>
	)
}
