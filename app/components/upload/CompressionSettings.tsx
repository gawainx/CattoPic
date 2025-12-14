'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CaretDownIcon, GearIcon } from '../ui/icons'

interface CompressionSettingsProps {
  quality: number
  maxWidth: number
  preserveAnimation: boolean
  outputFormat: 'webp' | 'avif' | 'both'
  onQualityChange: (quality: number) => void
  onMaxWidthChange: (maxWidth: number) => void
  onPreserveAnimationChange: (preserve: boolean) => void
  onOutputFormatChange: (format: 'webp' | 'avif' | 'both') => void
}

const QUALITY_PRESETS = [
  { value: 95, label: '最高', description: '95%' },
  { value: 90, label: '高', description: '90%' },
  { value: 80, label: '中', description: '80%' },
  { value: 70, label: '低', description: '70%' },
]

const DIMENSION_PRESETS = [
  { value: 0, label: '原图', description: '不限制' },
  { value: 3840, label: '4K', description: '3840px' },
  { value: 2560, label: '2K', description: '2560px' },
  { value: 1920, label: 'FHD', description: '1920px' },
  { value: 1280, label: 'HD', description: '1280px' },
]

const CompressionSettings = React.memo(function CompressionSettings({
  quality,
  maxWidth,
  preserveAnimation,
  outputFormat,
  onQualityChange,
  onMaxWidthChange,
  onPreserveAnimationChange,
  onOutputFormatChange,
}: CompressionSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev)
  }, [])

  return (
    <div className="w-full">
      {/* Header */}
      <button
        type="button"
        onClick={toggleExpanded}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <GearIcon className="w-4 h-4" />
          <span>压缩设置</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            (输出: {outputFormat.toUpperCase()}, 质量: {quality}%, 最大: {maxWidth > 0 ? `${maxWidth}px` : '原图'})
          </span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <CaretDownIcon className="w-4 h-4 text-slate-400" />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4">
              {/* Output Format */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  输出格式
                </label>
                <div className="flex gap-2">
                  {([
                    { value: 'webp', label: '仅 WebP', desc: '兼容性最好' },
                    { value: 'avif', label: '仅 AVIF', desc: '体积更小' },
                    { value: 'both', label: 'WebP + AVIF', desc: '两者都要' },
                  ] as const).map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onOutputFormatChange(opt.value)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        outputFormat === opt.value
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      <div>{opt.label}</div>
                      <div className="text-xs opacity-70">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  压缩质量
                </label>
                <div className="flex gap-2">
                  {QUALITY_PRESETS.map(preset => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => onQualityChange(preset.value)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        quality === preset.value
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      <div>{preset.label}</div>
                      <div className="text-xs opacity-70">{preset.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Dimension */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  最大尺寸
                </label>
                <div className="flex gap-2">
                  {DIMENSION_PRESETS.map(preset => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => onMaxWidthChange(preset.value)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        maxWidth === preset.value
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      <div>{preset.label}</div>
                      <div className="text-xs opacity-70">{preset.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preserve Animation */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  保留 GIF 动画
                </label>
                <button
                  type="button"
                  onClick={() => onPreserveAnimationChange(!preserveAnimation)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    preserveAnimation
                      ? 'bg-indigo-500'
                      : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <motion.div
                    animate={{ x: preserveAnimation ? 20 : 2 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                  />
                </button>
              </div>

              {/* Info */}
              <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
                <p>JPEG/PNG 等格式将按所选输出生成压缩版本。</p>
                <p className="mt-1">上传本身为 WebP/AVIF/GIF 时不会再二次压缩。</p>
                <p className="mt-1">选择“原图”表示不做尺寸缩放（AVIF 在 Cloudflare 上可能仍受尺寸限制）。</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

export default CompressionSettings
