'use client'

import { useUpdateTaskMutation } from '@/entities/task/api/tasksApi'

export function useEditTask() {
	const [updateTask, { isLoading }] = useUpdateTaskMutation()

	const editTask = async (id: string, title: string, description: string) => {
		try {
			await updateTask({
				id,
				task: { title, description },
			})
			return true
		} catch (error) {
			console.error('Ошибка при обновлении задачи:', error)
			return false
		}
	}

	return {
		editTask,
		isLoading,
	}
}
