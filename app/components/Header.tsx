'use client'

import Link from 'next/link'
import { useTheme } from '../hooks/useTheme'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import { ImageIcon, HamburgerMenuIcon, LockClosedIcon, SunIcon, MoonIcon, TagIcon, Link2Icon } from './ui/icons'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../lib/queryKeys'
import type { ImageListResponse } from '../types'
import { api } from '../utils/request'

interface HeaderProps {
  onApiKeyClick: () => void
  onTagManageClick?: () => void
  onRandomApiClick?: () => void
  title?: string
  isKeyVerified?: boolean
}

export default function Header({ onApiKeyClick, onTagManageClick, onRandomApiClick, title, isKeyVerified = false }: HeaderProps) {
  const { isDarkMode, toggleTheme } = useTheme()
  const pathname = usePathname()
  const queryClient = useQueryClient()

  const getTitle = () => {
    if (title) return title
    if (pathname === '/manage') return '图片管理'
    return 'CattoPic'
  }

  return (
    <div className="relative z-40 flex items-center justify-between mb-10">
      <div className="flex items-center">
        <Link href="/" className="mr-4">
          <div className="bg-gradient-primary w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-300">
            <ImageIcon className="h-8 w-8 text-white" />
          </div>
        </Link>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-primary pb-1">
          {getTitle()}
        </h1>
      </div>

      <div className="flex items-center space-x-2">
        {!pathname?.startsWith('/manage') && (
          <Link
            href="/manage"
            className="btn-icon"
            onClick={() => {
              // Warm up Manage page list without clearing existing cache (avoid loading spinner).
              void queryClient.prefetchInfiniteQuery({
                queryKey: queryKeys.images.list({ tag: '', orientation: '', format: 'all', limit: 60 }),
                initialPageParam: 1,
                queryFn: async ({ pageParam = 1 }) => {
                  const params: Record<string, string> = {
                    page: String(pageParam),
                    limit: '60',
                  }
                  const response = await api.get<ImageListResponse>('/api/images', params)
                  return response
                },
                getNextPageParam: (lastPage: ImageListResponse) => {
                  if (lastPage.page < lastPage.totalPages) return lastPage.page + 1
                  return undefined
                },
              })
            }}
          >
            <HamburgerMenuIcon className="h-6 w-6" />
          </Link>
        )}

        {pathname?.startsWith('/manage') && onTagManageClick && (
          <button onClick={onTagManageClick} className="btn-icon">
            <TagIcon className="h-6 w-6" />
          </button>
        )}

        {pathname?.startsWith('/manage') && onRandomApiClick && (
          <button onClick={onRandomApiClick} className="btn-icon" title="随机图API生成器">
            <Link2Icon className="h-6 w-6" />
          </button>
        )}

        <button onClick={onApiKeyClick} className="btn-icon relative">
          <LockClosedIcon className="h-6 w-6" />

          {isKeyVerified && (
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                boxShadow: ["0 0 0 0 rgba(34, 197, 94, 0.4)", "0 0 0 8px rgba(34, 197, 94, 0)", "0 0 0 0 rgba(34, 197, 94, 0)"],
              }}
              transition={{
                scale: { duration: 0.3, ease: "easeOut" },
                opacity: { duration: 0.3, ease: "easeOut" },
                boxShadow: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.2 }}
                className="w-2 h-2 bg-white rounded-full"
              />
            </motion.div>
          )}
        </button>

        <button onClick={toggleTheme} className="btn-icon">
          {isDarkMode ? (
            <SunIcon className="h-6 w-6 text-amber-500" />
          ) : (
            <MoonIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </div>
    </div>
  )
} 
