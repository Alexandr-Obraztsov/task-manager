'use client'

import { useState } from 'react'
import { useGetTasksQuery } from '@/entities/task/api/tasksApi'
import TaskItem from '@/entities/task/ui/TaskItem'
import { TaskForm } from '@/widgets/task-form'
import { useToggleTask } from '@/features/toggle-task'
import { useEditTask } from '@/features/edit-task'
import { useDeleteTask } from '@/features/delete-task'
import { useTelegram } from '@/entities/user/model'

interface TaskListProps {
	userId: string
}

export function TaskList({ userId }: TaskListProps) {
	const [isAddingTask, setIsAddingTask] = useState(false)
	const { firstName } = useTelegram()

	const { data: tasks, isLoading, error } = useGetTasksQuery(userId)
	const { toggleTaskComplete, isLoading: isTogglingComplete } = useToggleTask()
	const { editTask, isLoading: isEditing } = useEditTask()
	const { removeTask, isLoading: isDeleting } = useDeleteTask()

	// Компоненты UI
	const AddTaskButton = () => (
		<button
			onClick={() => setIsAddingTask(true)}
			className='fixed bottom-6 right-6 w-14 h-14 bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity'
			aria-label='Добавить задачу'
		>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				fill='none'
				viewBox='0 0 24 24'
				strokeWidth={2}
				stroke='currentColor'
				className='w-7 h-7'
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					d='M12 4.5v15m7.5-7.5h-15'
				/>
			</svg>
		</button>
	)

	// Форма добавления новой задачи
	if (isAddingTask) {
		return <TaskForm userId={userId} onBack={() => setIsAddingTask(false)} />
	}

	// Отображение списка задач
	return (
		<div className='p-4 bg-[var(--tg-theme-bg-color)] min-h-screen'>
			<header className='mb-6'>
				<h1 className='text-2xl font-bold text-[var(--tg-theme-text-color)]'>
					{firstName ? `Задачи ${firstName}` : 'Мои задачи'}
				</h1>
				<div className='text-sm text-[var(--tg-theme-hint-color)] mt-1'>
					{tasks?.length || 0} задач
				</div>
			</header>

			{isLoading ? (
				<div className='flex justify-center py-8'>
					<div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[var(--tg-theme-button-color)]'></div>
				</div>
			) : error ? (
				<div className='p-4 bg-red-50 text-red-500 rounded-lg border border-red-200'>
					<p className='font-medium'>Произошла ошибка при загрузке задач</p>
					<p className='text-sm mt-1'>
						Пожалуйста, попробуйте обновить страницу
					</p>
				</div>
			) : tasks && tasks.length > 0 ? (
				<div className='space-y-3'>
					{tasks.map(task => (
						<TaskItem
							key={task.id}
							task={task}
							onToggleComplete={toggleTaskComplete}
							onUpdate={editTask}
							onDelete={removeTask}
							isUpdating={isTogglingComplete || isEditing}
							isDeleting={isDeleting}
						/>
					))}
				</div>
			) : (
				<div className='tg-card flex flex-col items-center text-center py-8'>
					<div className='mb-4 p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded-full'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='w-10 h-10 text-[var(--tg-theme-hint-color)]'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
							/>
						</svg>
					</div>
					<p className='text-lg font-medium text-[var(--tg-theme-text-color)]'>
						У вас пока нет задач
					</p>
					<p className='text-sm text-[var(--tg-theme-hint-color)] mt-2 mb-4'>
						Самое время начать планировать свои дела
					</p>
					<button
						onClick={() => setIsAddingTask(true)}
						className='tg-button w-auto px-6 py-3'
					>
						Создать первую задачу
					</button>
				</div>
			)}

			{tasks && tasks.length > 0 && <AddTaskButton />}
		</div>
	)
}
