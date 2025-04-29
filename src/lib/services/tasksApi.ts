import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Определение типов для работы с задачами
export interface Task {
	id: string
	title: string
	description: string
	completed: boolean
	createdAt: string
	userId: string
}

export interface CreateTaskRequest {
	title: string
	description: string
	userId: string
}

export interface UpdateTaskRequest {
	title?: string
	description?: string
	completed?: boolean
}

// Создание API для работы с задачами
export const tasksApi = createApi({
	reducerPath: 'tasksApi',
	baseQuery: fetchBaseQuery({
		baseUrl: '/api',
	}),
	tagTypes: ['Task'],
	endpoints: builder => ({
		// Получение всех задач пользователя
		getTasks: builder.query<Task[], string>({
			query: userId => `/tasks?userId=${userId}`,
			providesTags: result =>
				result
					? [
							...result.map(({ id }) => ({ type: 'Task' as const, id })),
							{ type: 'Task', id: 'LIST' },
					  ]
					: [{ type: 'Task', id: 'LIST' }],
		}),

		// Получение одной задачи по id
		getTask: builder.query<Task, string>({
			query: taskId => `/tasks/${taskId}`,
			providesTags: (result, error, id) => [{ type: 'Task', id }],
		}),

		// Создание новой задачи
		createTask: builder.mutation<Task, CreateTaskRequest>({
			query: task => ({
				url: '/tasks',
				method: 'POST',
				body: task,
			}),
			invalidatesTags: [{ type: 'Task', id: 'LIST' }],
		}),

		// Обновление задачи
		updateTask: builder.mutation<Task, { id: string; task: UpdateTaskRequest }>(
			{
				query: ({ id, task }) => ({
					url: `/tasks/${id}`,
					method: 'PATCH',
					body: task,
				}),
				invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }],
			}
		),

		// Удаление задачи
		deleteTask: builder.mutation<void, string>({
			query: id => ({
				url: `/tasks/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, id) => [{ type: 'Task', id }],
		}),
	}),
})

// Экспорт хуков для использования в компонентах
export const {
	useGetTasksQuery,
	useGetTaskQuery,
	useCreateTaskMutation,
	useUpdateTaskMutation,
	useDeleteTaskMutation,
} = tasksApi
