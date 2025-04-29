'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
	const router = useRouter()

	// Перенаправляем пользователя на страницу с задачами
	useEffect(() => {
		router.replace('/tasks')
	}, [router])

	// Показываем загрузку пока идет перенаправление
	return (
		<main className='bg-[var(--tg-theme-bg-color)] min-h-screen flex items-center justify-center'>
			<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--tg-theme-button-color)]'></div>
		</main>
	)
}
