'use client'

import { ReactNode, useEffect, useState } from 'react'
import {
	SDKProvider,
	ThemeParams,
	useInitData,
	useMiniApp,
	useThemeParams,
} from '@tma.js/sdk-react'
import { TelegramContext } from './telegramProvider'
import { TelegramUser, TelegramTheme } from '@/shared/config/types'

// Расширяем Window интерфейс
declare global {
	interface Window {
		Telegram?: {
			WebApp?: any
		}
	}
}

// Компонент обертка для SDK на стороне клиента
export function TmaSdkClient({ children }: { children: ReactNode }) {
	return (
		<SDKProvider>
			<TelegramDataProvider>{children}</TelegramDataProvider>
		</SDKProvider>
	)
}

// Интерфейс для контекста Telegram
interface TelegramState extends TelegramUser, TelegramTheme {
	isReady: boolean
	theme: ThemeParams | null
}

// Функция для применения цветов Telegram к CSS переменным
function applyTelegramThemeColors(theme: ThemeParams) {
	const root = document.documentElement

	// Безопасная установка CSS переменной
	const setColorVar = (name: string, value: string | undefined) => {
		if (value) {
			root.style.setProperty(name, value)
		}
	}

	// Установка основных цветов темы Telegram
	setColorVar('--tg-theme-bg-color', theme.bgColor)
	setColorVar('--tg-theme-text-color', theme.textColor)
	setColorVar('--tg-theme-hint-color', theme.hintColor)
	setColorVar('--tg-theme-link-color', theme.linkColor)
	setColorVar('--tg-theme-button-color', theme.buttonColor)
	setColorVar('--tg-theme-button-text-color', theme.buttonTextColor)
	setColorVar('--tg-theme-secondary-bg-color', theme.secondaryBgColor)
}

// Провайдер данных Telegram
function TelegramDataProvider({ children }: { children: ReactNode }) {
	const [telegramData, setTelegramData] = useState<TelegramState>({
		userId: '',
		username: null,
		firstName: null,
		lastName: null,
		isReady: false,
		theme: null,
		colorScheme: 'light',
	})

	const initData = useInitData(false)
	const miniApp = useMiniApp(false)
	const theme: ThemeParams = useThemeParams(false)

	useEffect(() => {
		if (miniApp && initData?.user && theme) {
			const colorScheme = miniApp.isDark ? 'dark' : 'light'
			const { id, username, firstName, lastName } = initData.user

			// Применяем цвета темы Telegram к CSS переменным
			applyTelegramThemeColors(theme)

			if (colorScheme === 'dark') {
				document.body.classList.add('dark-theme')
			} else {
				document.body.classList.remove('dark-theme')
			}

			setTelegramData({
				userId: String(id),
				username: username || null,
				firstName: firstName || null,
				lastName: lastName || null,
				colorScheme: colorScheme as 'light' | 'dark',
				isReady: true,
				theme,
			})
		}
	}, [initData, miniApp, theme])

	// Добавим резервный вариант, если приложение запущено вне Telegram или в режиме разработки
	useEffect(() => {
		// Проверяем, работает ли приложение внутри Telegram
		const isRunningInTelegram =
			Boolean(window.Telegram?.WebApp) || Boolean(theme?.bgColor)

		// Если не в Telegram, используем резервные значения из CSS
		if (!isRunningInTelegram && !telegramData.isReady) {
			console.log(
				'Приложение запущено вне Telegram, используются стандартные цвета темы'
			)
			setTelegramData(prev => ({
				...prev,
				isReady: true,
			}))
		}
	}, [telegramData.isReady])

	return (
		<TelegramContext.Provider value={telegramData}>
			{children}
		</TelegramContext.Provider>
	)
}
