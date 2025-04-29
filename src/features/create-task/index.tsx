'use client'

import { useState } from 'react'
import { useCreateTaskMutation } from '@/entities/task/api/tasksApi'

export function useCreateTask() {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [createTask, { isLoading }] = useCreateTaskMutation()

	const addTask = async (userId: string) => {
		if (!title.trim()) return false

		try {
			await createTask({
				title,
				description,
				userId,
			})

			// Сброс формы после создания
			setTitle('')
			setDescription('')
			return true
		} catch (error) {
			console.error('Ошибка при создании задачи:', error)
			return false
		}
	}

	return {
		title,
		setTitle,
		description,
		setDescription,
		addTask,
		isLoading,
	}
}
