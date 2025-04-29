'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Task } from '@/entities/task/model/types'
import TaskItem from '@/entities/task/ui/TaskItem'
import CreateTaskModal from '@/entities/task/ui/CreateTaskModal'

interface TaskListProps {
	userId?: string
}

export default function TaskList({ userId }: TaskListProps = {}) {
	const [tasks, setTasks] = useState<Task[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Состояние для модального окна создания задачи
	const [isModalOpen, setIsModalOpen] = useState(false)

	// Состояния для обработки операций
	const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)
	const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null)

	// Состояние для отображения выполненных задач
	const [showCompleted, setShowCompleted] = useState(false)

	// Функция загрузки задач
	const fetchTasks = useCallback(async () => {
		try {
			setLoading(true)
			setError(null)

			const url = userId ? `/api/tasks?userId=${userId}` : '/api/tasks'
			const response = await fetch(url)
			if (!response.ok) {
				throw new Error('Не удалось загрузить задачи')
			}

			const data = await response.json()
			setTasks(data)
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: 'Произошла ошибка при загрузке задач'
			)
		} finally {
			setLoading(false)
		}
	}, [userId])

	// Загрузка задач при монтировании компонента
	useEffect(() => {
		fetchTasks()
	}, [fetchTasks])

	// Обработчик обновления после создания задачи
	const handleTaskCreated = () => {
		fetchTasks()
	}

	// Обработчик изменения статуса задачи
	const handleToggleComplete = async (id: string, completed: boolean) => {
		try {
			setUpdatingTaskId(id)

			const response = await fetch(`/api/tasks/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ completed }),
			})

			if (!response.ok) {
				throw new Error('Не удалось обновить статус задачи')
			}

			setTasks(prev =>
				prev.map(task => (task.id === id ? { ...task, completed } : task))
			)
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: 'Ошибка при обновлении статуса задачи'
			)
		} finally {
			setUpdatingTaskId(null)
		}
	}

	// Обработчик обновления задачи
	const handleUpdateTask = async (
		id: string,
		title: string,
		description: string
	) => {
		try {
			setUpdatingTaskId(id)

			const response = await fetch(`/api/tasks/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ title, description }),
			})

			if (!response.ok) {
				throw new Error('Не удалось обновить задачу')
			}

			setTasks(prev =>
				prev.map(task =>
					task.id === id ? { ...task, title, description } : task
				)
			)
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Ошибка при обновлении задачи'
			)
		} finally {
			setUpdatingTaskId(null)
		}
	}

	// Обработчик удаления задачи
	const handleDeleteTask = async (id: string) => {
		try {
			setDeletingTaskId(id)

			const response = await fetch(`/api/tasks/${id}`, {
				method: 'DELETE',
			})

			if (!response.ok) {
				throw new Error('Не удалось удалить задачу')
			}

			setTasks(prev => prev.filter(task => task.id !== id))
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Ошибка при удалении задачи'
			)
		} finally {
			setDeletingTaskId(null)
		}
	}

	// Разделяем задачи на активные и выполненные
	const { activeTasks, completedTasks } = useMemo(() => {
		const active = tasks.filter(task => !task.completed)
		const completed = tasks.filter(task => task.completed)

		return {
			activeTasks: active,
			completedTasks: completed,
		}
	}, [tasks])

	return (
		<div className='container mx-auto px-4 py-8 max-w-2xl'>
			{/* Сообщение об ошибке */}
			{error && (
				<div className='mb-6 p-4 bg-red-100 text-red-700 rounded-md'>
					{error}
				</div>
			)}

			{/* Список активных задач */}
			<div className='mb-8'>
				<h2 className='text-xl font-medium mb-4 text-[var(--tg-theme-text-color)]'>
					Активные задачи ({activeTasks.length})
				</h2>

				{loading ? (
					<div className='flex justify-center py-8'>
						<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--tg-theme-button-color)]'></div>
					</div>
				) : activeTasks.length > 0 ? (
					activeTasks.map(task => (
						<TaskItem
							key={task.id}
							task={task}
							onToggleComplete={handleToggleComplete}
							onUpdate={handleUpdateTask}
							onDelete={handleDeleteTask}
							isUpdating={updatingTaskId === task.id}
							isDeleting={deletingTaskId === task.id}
						/>
					))
				) : (
					<div className='text-center py-8 px-4 border border-dashed border-[var(--tg-theme-hint-color)] border-opacity-30 rounded-lg bg-[var(--tg-theme-secondary-bg-color)] bg-opacity-30'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-16 w-16 mx-auto mb-3 text-[var(--tg-theme-hint-color)] opacity-60'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={1.5}
								d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
							/>
						</svg>
						<p className='text-[var(--tg-theme-hint-color)] mb-1'>
							У вас нет активных задач
						</p>
						<p className='text-xs text-[var(--tg-theme-hint-color)] opacity-70'>
							Нажмите на кнопку "+" чтобы добавить новую задачу
						</p>
					</div>
				)}
			</div>

			{/* Список выполненных задач */}
			{completedTasks.length > 0 && (
				<div>
					<button
						className='w-full flex items-center justify-between py-2 px-1 border-b border-[var(--tg-theme-hint-color)] border-opacity-20 mb-4'
						onClick={() => setShowCompleted(!showCompleted)}
					>
						<h2 className='text-xl font-medium text-[var(--tg-theme-text-color)]'>
							Выполненные задачи ({completedTasks.length})
						</h2>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className={`h-5 w-5 text-[var(--tg-theme-hint-color)] transition-transform duration-300 ${
								showCompleted ? 'rotate-180' : ''
							}`}
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M19 9l-7 7-7-7'
							/>
						</svg>
					</button>

					{showCompleted && (
						<div className='space-y-3'>
							{completedTasks.map(task => (
								<TaskItem
									key={task.id}
									task={task}
									onToggleComplete={handleToggleComplete}
									onUpdate={handleUpdateTask}
									onDelete={handleDeleteTask}
									isUpdating={updatingTaskId === task.id}
									isDeleting={deletingTaskId === task.id}
								/>
							))}
						</div>
					)}
				</div>
			)}

			{/* Плавающая кнопка добавления новой задачи */}
			<button
				onClick={() => setIsModalOpen(true)}
				className='fixed right-5 bottom-5 w-14 h-14 rounded-full bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] flex items-center justify-center shadow-md floating-button z-10'
				aria-label='Добавить задачу'
			>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-8 w-8'
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M12 4v16m8-8H4'
					/>
				</svg>
			</button>

			{/* Модальное окно создания задачи */}
			<CreateTaskModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSuccess={handleTaskCreated}
				userId={userId}
			/>
		</div>
	)
}
