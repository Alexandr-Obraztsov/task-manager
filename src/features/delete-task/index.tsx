'use client'

import { useDeleteTaskMutation } from '@/entities/task/api/tasksApi'

export function useDeleteTask() {
	const [deleteTask, { isLoading }] = useDeleteTaskMutation()

	const removeTask = async (id: string) => {
		try {
			await deleteTask(id)
			return true
		} catch (error) {
			console.error('Ошибка при удалении задачи:', error)
			return false
		}
	}

	return {
		removeTask,
		isLoading,
	}
}
