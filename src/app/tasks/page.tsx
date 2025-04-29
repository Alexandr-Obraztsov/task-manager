'use client'

import { Provider } from 'react-redux'
import { store } from '@/shared/lib/store'
import { TaskList } from '@/widgets/task-list'
import { TelegramProvider, useTelegram } from '@/entities/user/model'

// Компонент для получения данных пользователя и отображения задач
const TaskApp = () => {
	const { userId, isReady } = useTelegram()

	if (!isReady) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--tg-theme-button-color)]'></div>
			</div>
		)
	}

	return userId ? <TaskList userId={userId} /> : null
}

export default function TasksPage() {
	return (
		<Provider store={store}>
			<TelegramProvider>
				<TaskApp />
			</TelegramProvider>
		</Provider>
	)
}
