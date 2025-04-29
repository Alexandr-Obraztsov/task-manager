'use client'

import { useRouter } from 'next/navigation'
import { useInitData } from '@/shared/lib/telegram'
import { Button } from '@/shared/ui'

interface TelegramHeaderProps {
	showBackButton?: boolean
	title: string
	subtitle?: string
	actions?: React.ReactNode
}

export function TelegramHeader({
	showBackButton = false,
	title,
	subtitle,
	actions,
}: TelegramHeaderProps) {
	const { initDataUnsafe } = useInitData()
	const router = useRouter()

	const handleBackClick = () => {
		router.back()
	}

	return (
		<div className='sticky top-0 z-10 bg-[var(--tg-theme-bg-color)] pt-2 pb-2 border-b border-[var(--tg-theme-hint-color)] border-opacity-15'>
			<div className='flex items-center justify-between px-4'>
				<div className='flex items-center'>
					{showBackButton && (
						<Button
							variant='ghost'
							size='icon'
							onClick={handleBackClick}
							className='mr-3 text-[var(--tg-theme-button-color)]'
							aria-label='Назад'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={2}
								stroke='currentColor'
								className='w-5 h-5'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18'
								/>
							</svg>
						</Button>
					)}

					<div>
						<h1 className='text-[var(--tg-theme-text-color)] font-medium text-lg'>
							{title}
						</h1>
						{subtitle && (
							<div className='text-[var(--tg-theme-hint-color)] text-xs mt-0.5'>
								{subtitle}
							</div>
						)}
					</div>
				</div>

				{actions && <div className='flex items-center'>{actions}</div>}
			</div>
		</div>
	)
}
