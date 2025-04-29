'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Task } from '@/entities/task/model/types'
import { Button, Card, Badge } from '@/shared/ui'
import Link from 'next/link'

export default function TaskDetailPage({ params }: { params: { id: string } }) {
	const router = useRouter()
	const [task, setTask] = useState<Task | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		// Функция для загрузки данных о задаче
		const fetchTask = async () => {
			try {
				setLoading(true)
				setError(null)

				const { id } = await params
				const response = await fetch(`/api/tasks/${id}`)

				if (!response.ok) {
					if (response.status === 404) {
						throw new Error('Задача не найдена')
					}
					throw new Error('Не удалось загрузить данные о задаче')
				}

				const data = await response.json()
				setTask(data)
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Произошла ошибка')
			} finally {
				setLoading(false)
			}
		}

		fetchTask()
	}, [params.id])

	// Функция форматирования даты
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	return (
		<div className='container mx-auto px-4 py-8 max-w-2xl'>
			<Button
				variant='secondary'
				onClick={() => router.back()}
				fullWidth={false}
				className='mb-6'
			>
				← Назад
			</Button>

			{loading ? (
				<div className='flex justify-center py-10'>
					<div className='animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--tg-theme-button-color)]'></div>
				</div>
			) : error ? (
				<Card className='p-6'>
					<div className='text-center text-red-500'>{error}</div>
					<Button
						variant='primary'
						onClick={() => router.push('/tasks')}
						className='mt-4'
					>
						Вернуться к списку задач
					</Button>
				</Card>
			) : task ? (
				<Card className='shadow-md'>
					<div className='flex items-center justify-between mb-4'>
						<h1 className='text-xl font-bold text-[var(--tg-theme-text-color)]'>
							{task.title}
						</h1>
						{task.completed && (
							<Badge variant='success' rounded>
								Выполнено
							</Badge>
						)}
					</div>

					<div className='mb-6'>
						<p className='text-sm text-[var(--tg-theme-hint-color)] mb-2'>
							Создано: {formatDate(task.createdAt)}
						</p>
						{task.updatedAt && task.updatedAt !== task.createdAt && (
							<p className='text-sm text-[var(--tg-theme-hint-color)]'>
								Обновлено: {formatDate(task.updatedAt)}
							</p>
						)}
					</div>

					<div className='mt-4'>
						<h2 className='text-lg font-medium mb-2'>Описание:</h2>
						{task.description ? (
							<p className='text-[var(--tg-theme-text-color)] whitespace-pre-line'>
								{task.description}
							</p>
						) : (
							<p className='text-[var(--tg-theme-hint-color)] italic'>
								Описание отсутствует
							</p>
						)}
					</div>

					<div className='flex gap-3 mt-8'>
						<Link href={`/tasks/${task.id}/edit`} className='flex-1'>
							<Button
								variant='secondary'
								disabled={task.completed}
								className='w-full'
							>
								Редактировать
							</Button>
						</Link>
						<Link href='/tasks' className='flex-1'>
							<Button variant='primary' className='w-full'>
								К списку задач
							</Button>
						</Link>
					</div>
				</Card>
			) : null}
		</div>
	)
}
