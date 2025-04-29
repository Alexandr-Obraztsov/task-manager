// Общие типы для проекта

// Тип для пользователя Telegram
export interface TelegramUser {
	userId: string
	username: string | null
	firstName: string | null
	lastName: string | null
}

// Тип для темы Telegram
export interface TelegramTheme {
	colorScheme: 'light' | 'dark'
}
