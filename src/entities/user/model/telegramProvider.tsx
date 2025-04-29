'use client'

import { createContext, useContext, ReactNode, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { TelegramUser, TelegramTheme } from '@/shared/config/types'

// Динамический импорт для клиентской части
const TmaSDK = dynamic(
	() => import('./TmaSdkClient').then(mod => mod.TmaSdkClient),
	{ ssr: false }
)

interface TelegramContextType extends TelegramUser, TelegramTheme {
	isReady: boolean
	theme: any | null
}

const TelegramContext = createContext<TelegramContextType>({
	userId: '',
	username: null,
	firstName: null,
	lastName: null,
	isReady: false,
	theme: null,
	colorScheme: 'light',
})

// Клиентская обертка для Telegram Provider
export function TelegramProvider({ children }: { children: ReactNode }) {
	return (
		<Suspense fallback={<LoadingFallback />}>
			<TmaSDK>{children}</TmaSDK>
		</Suspense>
	)
}

// Компонент загрузки
function LoadingFallback() {
	return (
		<div className='flex items-center justify-center min-h-screen'>
			<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--tg-theme-button-color)]'></div>
		</div>
	)
}

export const useTelegram = () => useContext(TelegramContext)

// Экспортируем контекст для использования в клиентском компоненте
export { TelegramContext }
