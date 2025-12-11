'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ClipboardCopyIcon, CheckIcon } from '../ui/icons';

interface LinkOutputProps {
  url: string;
}

type OutputFormat = 'url' | 'html' | 'markdown';

const formatOptions: { value: OutputFormat; label: string }[] = [
  { value: 'url', label: 'URL' },
  { value: 'html', label: 'HTML' },
  { value: 'markdown', label: 'Markdown' },
];

export default function LinkOutput({ url }: LinkOutputProps) {
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('url');
  const [copied, setCopied] = useState(false);

  const formattedOutput = useMemo(() => {
    switch (outputFormat) {
      case 'html':
        return `<img src="${url}" alt="Random Image" loading="lazy" />`;
      case 'markdown':
        return `![Random Image](${url})`;
      default:
        return url;
    }
  }, [url, outputFormat]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">生成的链接</h3>
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5 gap-0.5">
          {formatOptions.map((option) => {
            const isSelected = outputFormat === option.value;
            return (
              <motion.button
                key={option.value}
                onClick={() => setOutputFormat(option.value)}
                className={`
                  relative px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200
                  ${isSelected
                    ? 'text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }
                `}
                whileTap={{ scale: 0.95 }}
              >
                {isSelected && (
                  <motion.div
                    layoutId="output-format-bg"
                    className="absolute inset-0 bg-indigo-500 rounded-md"
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  />
                )}
                <span className="relative z-10">{option.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="relative group">
        <div className="bg-slate-900 dark:bg-slate-950 rounded-xl p-4 font-mono text-sm text-slate-300 overflow-x-auto">
          <code className="break-all">{formattedOutput}</code>
        </div>

        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            absolute top-3 right-3 p-2 rounded-lg transition-all duration-200
            ${copied
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white'
            }
          `}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                <CheckIcon className="w-4 h-4" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ClipboardCopyIcon className="w-4 h-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        点击右上角按钮复制链接到剪贴板
      </p>
    </div>
  );
}
