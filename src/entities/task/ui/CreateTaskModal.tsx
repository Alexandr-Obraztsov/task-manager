'use client'

import { useState } from 'react'
import { Button, Card, Input, Textarea } from '@/shared/ui'

interface CreateTaskModalProps {
	isOpen: boolean
	onClose: () => void
	onSuccess: () => void
	userId?: string
}

export default function CreateTaskModal({
	isOpen,
	onClose,
	onSuccess,
	userId,
}: CreateTaskModalProps) {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Сбросить форму
	const resetForm = () => {
		setTitle('')
		setDescription('')
		setError(null)
	}

	// Закрыть модальное окно
	const handleClose = () => {
		resetForm()
		onClose()
	}

	// Создать задачу
	const handleSubmit = async () => {
		if (!title.trim()) return

		try {
			setIsSubmitting(true)
			setError(null)

			const response = await fetch('/api/tasks', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title: title.trim(),
					description,
					userId: userId || 'anonymous',
				}),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.error || 'Не удалось создать задачу')
			}

			// Успешно создана
			resetForm()
			onSuccess()
			onClose()
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Произошла ошибка')
		} finally {
			setIsSubmitting(false)
		}
	}

	if (!isOpen) return null

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'>
			<div className='w-full max-w-md animate-scaleIn'>
				<Card className='shadow-lg rounded-xl border-none'>
					<div className='flex justify-between items-center mb-6'>
						<h2 className='text-xl font-semibold text-[var(--tg-theme-text-color)]'>
							Новая задача
						</h2>
						<button
							onClick={handleClose}
							className='text-[var(--tg-theme-hint-color)] hover:text-[var(--tg-theme-text-color)] transition-colors'
							aria-label='Закрыть'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-6 w-6'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M6 18L18 6M6 6l12 12'
								/>
							</svg>
						</button>
					</div>

					{error && (
						<div className='mb-5 p-3 bg-red-100 text-red-700 rounded-md text-sm'>
							{error}
						</div>
					)}

					<Input
						label='Заголовок'
						value={title}
						onChange={e => setTitle(e.target.value)}
						placeholder='Введите заголовок задачи'
						error={title !== '' && !title.trim()}
						helperText={
							title !== '' && !title.trim()
								? 'Заголовок не может быть пустым'
								: ''
						}
						autoFocus
					/>

					<Textarea
						label='Описание (необязательно)'
						value={description}
						onChange={e => setDescription(e.target.value)}
						placeholder='Введите описание задачи'
						rows={4}
						className='mt-4'
					/>

					<div className='flex gap-3 mt-6'>
						<Button
							variant='secondary'
							onClick={handleClose}
							disabled={isSubmitting}
							className='flex-1'
						>
							Отмена
						</Button>
						<Button
							variant='primary'
							onClick={handleSubmit}
							disabled={!title.trim() || isSubmitting}
							isLoading={isSubmitting}
							className='flex-1'
						>
							Создать
						</Button>
					</div>
				</Card>
			</div>
		</div>
	)
}
