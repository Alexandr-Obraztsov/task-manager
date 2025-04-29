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

	return (
		<TelegramContext.Provider value={telegramData}>
			{children}
		</TelegramContext.Provider>
	)
}
