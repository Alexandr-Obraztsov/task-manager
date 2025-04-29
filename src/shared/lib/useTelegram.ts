import { TelegramContext } from '@/entities/user/model'
import { useContext } from 'react'

export const useTelegram = () => useContext(TelegramContext)
