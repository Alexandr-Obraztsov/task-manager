import { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode
	variant?: 'default' | 'outlined' | 'elevated'
	padding?: 'none' | 'sm' | 'md' | 'lg'
	rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

export const Card = ({
	children,
	className = '',
	variant = 'default',
	padding = 'md',
	rounded = 'md',
	...props
}: CardProps) => {
	const baseStyles = 'text-[var(--tg-theme-text-color)]'

	const variantStyles = {
		default:
			'bg-[var(--tg-theme-secondary-bg-color)] border border-[var(--tg-theme-button-color)] border-opacity-10',
		outlined:
			'bg-transparent border border-[var(--tg-theme-hint-color)] border-opacity-30',
		elevated:
			'bg-[var(--tg-theme-secondary-bg-color)] shadow-md border border-[var(--tg-theme-button-color)] border-opacity-15',
	}

	const paddingStyles = {
		none: 'p-0',
		sm: 'p-2',
		md: 'p-4',
		lg: 'p-6',
	}

	const roundedStyles = {
		none: 'rounded-none',
		sm: 'rounded',
		md: 'rounded-lg',
		lg: 'rounded-xl',
		full: 'rounded-full',
	}

	return (
		<div
			className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${roundedStyles[rounded]} ${className}`}
			{...props}
		>
			{children}
		</div>
	)
}
