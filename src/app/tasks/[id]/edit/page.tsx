'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Task } from '@/entities/task/model/types'
import { Button, Card, Input, Textarea } from '@/shared/ui'

export default function EditTaskPage({ params }: { params: { id: string } }) {
	const router = useRouter()
	const [task, setTask] = useState<Task | null>(null)
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Загрузка данных о задаче
	useEffect(() => {
		const fetchTask = async () => {
			try {
				setLoading(true)
				setError(null)

				const response = await fetch(`/api/tasks/${params.id}`)

				if (!response.ok) {
					if (response.status === 404) {
						throw new Error('Задача не найдена')
					}
					throw new Error('Не удалось загрузить данные о задаче')
				}

				const data = await response.json()
				setTask(data)
				setTitle(data.title)
				setDescription(data.description || '')
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Произошла ошибка')
			} finally {
				setLoading(false)
			}
		}

		fetchTask()
	}, [params.id])

	// Обработчик сохранения изменений
	const handleSave = async () => {
		if (!title.trim()) return

		try {
			setSaving(true)
			setError(null)

			const response = await fetch(`/api/tasks/${params.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title: title.trim(),
					description,
				}),
			})

			if (!response.ok) {
				throw new Error('Не удалось обновить задачу')
			}

			// Перенаправляем на страницу задачи
			router.push(`/tasks/${params.id}`)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Произошла ошибка')
			setSaving(false)
		}
	}

	// Обработчик отмены редактирования
	const handleCancel = () => {
		router.back()
	}

	return (
		<div className='container mx-auto px-4 py-8 max-w-2xl'>
			<Button
				variant='secondary'
				onClick={handleCancel}
				fullWidth={false}
				className='mb-6'
				disabled={saving}
			>
				← Назад
			</Button>

			<h1 className='text-2xl font-bold mb-6 text-[var(--tg-theme-text-color)]'>
				Редактирование задачи
			</h1>

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
					<Input
						label='Заголовок'
						value={title}
						onChange={e => setTitle(e.target.value)}
						placeholder='Введите заголовок задачи'
						error={!title.trim()}
						helperText={!title.trim() ? 'Заголовок не может быть пустым' : ''}
					/>

					<Textarea
						label='Описание'
						value={description}
						onChange={e => setDescription(e.target.value)}
						placeholder='Введите описание задачи (необязательно)'
						rows={5}
						className='mt-4'
					/>

					<div className='flex gap-3 mt-6'>
						<Button
							variant='secondary'
							onClick={handleCancel}
							disabled={saving}
							className='flex-1'
						>
							Отмена
						</Button>
						<Button
							variant='primary'
							onClick={handleSave}
							disabled={!title.trim() || saving}
							isLoading={saving}
							className='flex-1'
						>
							Сохранить
						</Button>
					</div>
				</Card>
			) : null}
		</div>
	)
}
