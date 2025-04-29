// Типы для работы с задачами

// Тип для задачи
export interface Task {
	id: string
	title: string
	description: string
	completed: boolean
	createdAt: string
	userId: string
}

// Тип для создания задачи
export interface CreateTaskRequest {
	title: string
	description: string
	userId: string
}

// Тип для обновления задачи
export interface UpdateTaskRequest {
	title?: string
	description?: string
	completed?: boolean
}
