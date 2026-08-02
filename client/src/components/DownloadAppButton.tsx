import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePWAInstall } from '@/hooks/usePWAInstall'
import { cn } from '@/lib/utils'

interface DownloadAppButtonProps {
  variant?: 'solid' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg' | 'icon'
  className?: string
  label?: string
  iconOnly?: boolean
}

export default function DownloadAppButton({
  variant = 'solid',
  size = 'sm',
  className,
  label = 'Download App',
  iconOnly = false,
}: DownloadAppButtonProps) {
  const { canInstall, isInstalled, install } = usePWAInstall()

  if (!canInstall || isInstalled) return null

  const styles =
    variant === 'outline'
      ? 'border-2 border-primary-600 text-primary-700 hover:bg-primary-600 hover:text-white rounded-lg font-medium transition-all'
      : variant === 'ghost'
        ? 'text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg font-medium transition-all'
        : 'rounded-lg font-medium transition-all bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-700/25 text-white'

  if (iconOnly) {
    return (
      <Button
        size="icon"
        variant="ghost"
        title={label}
        aria-label={label}
        onClick={() => install()}
        className={cn(
          'h-9 w-9 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors',
          className
        )}
      >
        <Download className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Button
      size={size}
      className={cn(styles, className)}
      onClick={() => install()}
    >
      <Download className="h-4 w-4 mr-1.5" />
      {label}
    </Button>
  )
}

