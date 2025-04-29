'use client'

import { useUpdateTaskMutation } from '@/entities/task/api/tasksApi'

export function useToggleTask() {
	const [updateTask, { isLoading }] = useUpdateTaskMutation()

	const toggleTaskComplete = async (id: string, completed: boolean) => {
		try {
			await updateTask({
				id,
				task: { completed },
			})
			return true
		} catch (error) {
			console.error('Ошибка при изменении статуса задачи:', error)
			return false
		}
	}

	return {
		toggleTaskComplete,
		isLoading,
	}
}
