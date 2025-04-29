import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { sql, initializeDatabase } from '@/lib/db'

// Инициализация базы данных при первом вызове API
initializeDatabase()

// GET /api/tasks - Получение списка задач
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const userId = searchParams.get('userId')

		if (!userId) {
			return NextResponse.json(
				{ error: 'Не указан ID пользователя' },
				{ status: 400 }
			)
		}

		// Получаем задачи пользователя из базы данных, отсортированные по дате создания
		const tasks = await sql`
			SELECT *
			FROM tasks
			WHERE user_id = ${userId}
			ORDER BY created_at DESC
		`

		// Преобразуем поля из snake_case в camelCase для соответствия интерфейсу API
		const formattedTasks = tasks.map(task => ({
			id: task.id,
			title: task.title,
			description: task.description,
			completed: task.completed,
			createdAt: task.created_at,
			updatedAt: task.updated_at,
			userId: task.user_id,
		}))

		return NextResponse.json(formattedTasks)
	} catch (error) {
		console.error('Ошибка при получении задач:', error)
		return NextResponse.json(
			{ error: 'Ошибка сервера при получении задач' },
			{ status: 500 }
		)
	}
}

// POST /api/tasks - Создание новой задачи
export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { title, description, userId } = body

		if (!title || !userId) {
			return NextResponse.json(
				{ error: 'Не указаны обязательные поля' },
				{ status: 400 }
			)
		}

		// Создаем новую задачу
		const taskId = uuidv4()

		// Добавляем задачу в базу данных
		const result = await sql`
			INSERT INTO tasks (id, title, description, user_id, created_at, updated_at)
			VALUES (${taskId}, ${title}, ${
			description || ''
		}, ${userId}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
			RETURNING *
		`

		const newTask = result[0]

		// Преобразуем поля из snake_case в camelCase для соответствия интерфейсу API
		const formattedTask = {
			id: newTask.id,
			title: newTask.title,
			description: newTask.description,
			completed: newTask.completed,
			createdAt: newTask.created_at,
			updatedAt: newTask.updated_at,
			userId: newTask.user_id,
		}

		return NextResponse.json(formattedTask, { status: 201 })
	} catch (error) {
		console.error('Ошибка при создании задачи:', error)
		return NextResponse.json(
			{ error: 'Ошибка сервера при создании задачи' },
			{ status: 500 }
		)
	}
}
