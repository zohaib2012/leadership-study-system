import { cn } from '@/lib/utils'

function Badge({ className, variant = 'default', ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' }) {
  const variants: Record<string, string> = {
    default: 'bg-primary-700 text-white hover:bg-primary-600',
    secondary: 'bg-muted text-muted-foreground hover:bg-accent',
    destructive: 'bg-red-600 text-white hover:bg-red-500',
    outline: 'border border-input text-foreground',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-500 text-white',
  }
  return <div className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors', variants[variant], className)} {...props} />
}

export { Badge }
