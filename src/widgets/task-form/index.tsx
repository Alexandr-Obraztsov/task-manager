'use client'

import { useCreateTask } from '@/features/create-task'
import { Button, Card, Input, Textarea } from '@/shared/ui'

interface TaskFormProps {
	userId: string
	onBack: () => void
}

export function TaskForm({ userId, onBack }: TaskFormProps) {
	const { title, setTitle, description, setDescription, addTask, isLoading } =
		useCreateTask()

	const handleCreateTask = async () => {
		const success = await addTask(userId)
		if (success) {
			onBack()
		}
	}

	return (
		<div className='p-4 bg-[var(--tg-theme-bg-color)] min-h-screen'>
			<button
				onClick={onBack}
				className='mb-5 flex items-center transition-colors text-[var(--tg-theme-link-color)] hover:opacity-80'
				aria-label='Вернуться назад'
			>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
					strokeWidth={2}
					stroke='currentColor'
					className='w-5 h-5 mr-2'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18'
					/>
				</svg>
				<span>Назад</span>
			</button>

			<div className='flex items-center mb-6'>
				<h1 className='text-2xl font-bold text-[var(--tg-theme-text-color)]'>
					Новая задача
				</h1>
			</div>

			<Card className='animate-fadeIn'>
				<Input
					label='Заголовок'
					value={title}
					onChange={e => setTitle(e.target.value)}
					placeholder='Введите название задачи'
					error={!title.trim() && title !== ''}
					helperText={
						!title.trim() && title !== ''
							? 'Заголовок не может быть пустым'
							: ''
					}
					leftIcon={
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-5 w-5 text-[var(--tg-theme-hint-color)]'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={1.5}
								d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
							/>
						</svg>
					}
				/>

				<Textarea
					label='Описание'
					value={description}
					onChange={e => setDescription(e.target.value)}
					placeholder='Введите подробное описание задачи (необязательно)'
					rows={5}
					maxCharacters={500}
				/>

				<div className='mt-4'>
					<Button
						onClick={handleCreateTask}
						disabled={!title.trim() || isLoading}
						isLoading={isLoading}
						size='lg'
					>
						Создать задачу
					</Button>
				</div>
			</Card>
		</div>
	)
}
