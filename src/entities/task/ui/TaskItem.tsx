'use client'

import { useState } from 'react'
import { Task } from '@/entities/task/model/types'
import { Button, Card, Badge, Input, Textarea } from '@/shared/ui'

interface TaskItemProps {
	task: Task
	onToggleComplete: (id: string, completed: boolean) => void
	onUpdate: (id: string, title: string, description: string) => void
	onDelete: (id: string) => void
	isUpdating?: boolean
	isDeleting?: boolean
}

export default function TaskItem({
	task,
	onToggleComplete,
	onUpdate,
	onDelete,
	isUpdating = false,
	isDeleting = false,
}: TaskItemProps) {
	const [isEditing, setIsEditing] = useState(false)
	const [title, setTitle] = useState(task.title)
	const [description, setDescription] = useState(task.description)

	// Обработчик изменения статуса задачи
	const handleToggleComplete = () => {
		onToggleComplete(task.id, !task.completed)
	}

	// Обработчик удаления задачи
	const handleDelete = () => {
		onDelete(task.id)
	}

	// Обработчик сохранения изменений
	const handleSave = () => {
		onUpdate(task.id, title, description)
		setIsEditing(false)
	}

	// Функция форматирования даты
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	// Режим редактирования
	if (isEditing) {
		return (
			<Card className='transition-all duration-200 hover:shadow-md'>
				<Input
					label='Заголовок'
					value={title}
					onChange={e => setTitle(e.target.value)}
					placeholder='Введите заголовок задачи'
					error={!title.trim()}
					helperText={!title.trim() ? 'Заголовок не может быть пустым' : ''}
				/>
				<Textarea
					label='Описание'
					value={description}
					onChange={e => setDescription(e.target.value)}
					placeholder='Введите описание задачи (необязательно)'
					rows={3}
				/>
				<div className='flex justify-end space-x-3 mt-4'>
					<Button
						variant='secondary'
						onClick={() => setIsEditing(false)}
						disabled={isUpdating}
						fullWidth={false}
					>
						Отмена
					</Button>
					<Button
						variant='primary'
						onClick={handleSave}
						disabled={!title.trim() || isUpdating}
						isLoading={isUpdating}
						fullWidth={false}
					>
						Сохранить
					</Button>
				</div>
			</Card>
		)
	}

	// Режим просмотра
	return (
		<Card
			className={`transition-all duration-200 ${
				task.completed ? 'opacity-80' : 'hover:shadow-md'
			}`}
			variant={task.completed ? 'outlined' : 'default'}
		>
			<div className='flex items-start justify-between'>
				<div className='flex items-start space-x-3 flex-1'>
					<div className='pt-1'>
						<input
							type='checkbox'
							checked={task.completed}
							onChange={handleToggleComplete}
							className='h-5 w-5 rounded border-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-color)] focus:ring-[var(--tg-theme-button-color)] focus:ring-opacity-30'
						/>
					</div>
					<div className='flex-1 min-w-0'>
						<div className='flex items-center flex-wrap gap-2 mb-1'>
							<h3
								className={`font-medium text-base break-words ${
									task.completed
										? 'line-through text-[var(--tg-theme-hint-color)]'
										: 'text-[var(--tg-theme-text-color)]'
								}`}
							>
								{task.title}
							</h3>
							{task.completed && (
								<Badge variant='success' size='sm' rounded>
									Выполнено
								</Badge>
							)}
						</div>

						{task.description && (
							<p
								className={`text-sm mt-2 break-words ${
									task.completed
										? 'text-[var(--tg-theme-hint-color)]'
										: 'text-[var(--tg-theme-text-color)]'
								}`}
							>
								{task.description}
							</p>
						)}
						<p className='text-xs text-[var(--tg-theme-hint-color)] mt-3 flex items-center'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-3.5 w-3.5 mr-1'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
								/>
							</svg>
							{formatDate(task.createdAt)}
						</p>
					</div>
				</div>
				<div className='flex flex-col space-y-2 ml-4'>
					<Button
						variant='secondary'
						onClick={() => setIsEditing(true)}
						disabled={task.completed}
						size='sm'
						fullWidth={false}
						className='text-sm'
					>
						Изменить
					</Button>
					<Button
						variant='danger'
						onClick={handleDelete}
						disabled={isDeleting}
						isLoading={isDeleting}
						size='sm'
						fullWidth={false}
						className='text-sm'
					>
						Удалить
					</Button>
				</div>
			</div>
		</Card>
	)
}
