import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// Тип для задачи
interface Task {
	id: string
	title: string
	description: string
	completed: boolean
	created_at: string
	updated_at: string
	user_id: string
}

// Получение задачи по ID
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id: taskId } = await params

		// Получаем задачу из базы данных
		const result = await sql`
			SELECT * FROM tasks WHERE id = ${taskId}
		`

		if (result.length === 0) {
			return NextResponse.json({ error: 'Задача не найдена' }, { status: 404 })
		}

		const task = result[0] as Task

		// Преобразуем поля из snake_case в camelCase для соответствия интерфейсу API
		const formattedTask = {
			id: task.id,
			title: task.title,
			description: task.description,
			completed: task.completed,
			createdAt: task.created_at,
			updatedAt: task.updated_at,
			userId: task.user_id,
		}

		return NextResponse.json(formattedTask)
	} catch (error) {
		console.error('Ошибка при получении задачи:', error)
		return NextResponse.json(
			{ error: 'Ошибка сервера при получении задачи' },
			{ status: 500 }
		)
	}
}

// Обновление задачи
export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id: taskId } = await params
		const body = await request.json()
		const { title, description, completed } = body

		// Проверяем существование задачи
		const checkResult = await sql`
			SELECT * FROM tasks WHERE id = ${taskId}
		`

		if (checkResult.length === 0) {
			return NextResponse.json({ error: 'Задача не найдена' }, { status: 404 })
		}

		// Формируем части SQL запроса для обновления
		let updateQuery

		if (
			title !== undefined &&
			description !== undefined &&
			completed !== undefined
		) {
			updateQuery = sql`
				UPDATE tasks
				SET title = ${title}, description = ${description}, completed = ${completed}, updated_at = CURRENT_TIMESTAMP
				WHERE id = ${taskId}
				RETURNING *
			`
		} else if (title !== undefined && description !== undefined) {
			updateQuery = sql`
				UPDATE tasks
				SET title = ${title}, description = ${description}, updated_at = CURRENT_TIMESTAMP
				WHERE id = ${taskId}
				RETURNING *
			`
		} else if (title !== undefined && completed !== undefined) {
			updateQuery = sql`
				UPDATE tasks
				SET title = ${title}, completed = ${completed}, updated_at = CURRENT_TIMESTAMP
				WHERE id = ${taskId}
				RETURNING *
			`
		} else if (description !== undefined && completed !== undefined) {
			updateQuery = sql`
				UPDATE tasks
				SET description = ${description}, completed = ${completed}, updated_at = CURRENT_TIMESTAMP
				WHERE id = ${taskId}
				RETURNING *
			`
		} else if (title !== undefined) {
			updateQuery = sql`
				UPDATE tasks
				SET title = ${title}, updated_at = CURRENT_TIMESTAMP
				WHERE id = ${taskId}
				RETURNING *
			`
		} else if (description !== undefined) {
			updateQuery = sql`
				UPDATE tasks
				SET description = ${description}, updated_at = CURRENT_TIMESTAMP
				WHERE id = ${taskId}
				RETURNING *
			`
		} else if (completed !== undefined) {
			updateQuery = sql`
				UPDATE tasks
				SET completed = ${completed}, updated_at = CURRENT_TIMESTAMP
				WHERE id = ${taskId}
				RETURNING *
			`
		} else {
			return NextResponse.json(
				{ error: 'Нет данных для обновления' },
				{ status: 400 }
			)
		}

		// Выполняем обновление
		const result = await updateQuery

		if (result.length === 0) {
			return NextResponse.json(
				{ error: 'Не удалось обновить задачу' },
				{ status: 500 }
			)
		}

		const updatedTask = result[0] as Task

		// Преобразуем поля из snake_case в camelCase для соответствия интерфейсу API
		const formattedTask = {
			id: updatedTask.id,
			title: updatedTask.title,
			description: updatedTask.description,
			completed: updatedTask.completed,
			createdAt: updatedTask.created_at,
			updatedAt: updatedTask.updated_at,
			userId: updatedTask.user_id,
		}

		return NextResponse.json(formattedTask)
	} catch (error) {
		console.error('Ошибка при обновлении задачи:', error)
		return NextResponse.json(
			{ error: 'Ошибка сервера при обновлении задачи' },
			{ status: 500 }
		)
	}
}

// Удаление задачи
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id: taskId } = await params

		// Проверяем существование задачи
		const checkResult = await sql`
			SELECT * FROM tasks WHERE id = ${taskId}
		`

		if (checkResult.length === 0) {
			return NextResponse.json({ error: 'Задача не найдена' }, { status: 404 })
		}

		// Удаляем задачу
		await sql`
			DELETE FROM tasks
			WHERE id = ${taskId}
		`

		return new NextResponse(null, { status: 204 })
	} catch (error) {
		console.error('Ошибка при удалении задачи:', error)
		return NextResponse.json(
			{ error: 'Ошибка сервера при удалении задачи' },
			{ status: 500 }
		)
	}
}
