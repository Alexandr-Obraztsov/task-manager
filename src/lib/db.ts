import { neon, neonConfig } from '@neondatabase/serverless'
import { Pool } from 'pg'

// Настройка Neon для работы с Next.js
neonConfig.fetchConnectionCache = true

// Получаем строку подключения из переменных окружения
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
	throw new Error('DATABASE_URL не найден в переменных окружения')
}

// Создаем пул соединений
export const pool = new Pool({ connectionString })

// SQL-клиент для выполнения запросов
export const sql = neon(connectionString)

// Функция для создания таблиц при первом запуске
export async function initializeDatabase() {
	try {
		// Создаем таблицу для задач, если она не существует
		await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id TEXT NOT NULL
      )
    `

		console.log('База данных инициализирована')
	} catch (error) {
		console.error('Ошибка при инициализации базы данных:', error)
	}
}
