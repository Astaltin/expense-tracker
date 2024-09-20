import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        'secondary-chart-1':
          '!text-white border-transparent bg-[hsl(var(--chart-1))] text-secondary-foreground hover:bg-[hsl(var(--chart-1))]/80',
        'secondary-chart-2':
          '!text-white border-transparent bg-[hsl(var(--chart-2))] text-secondary-foreground hover:bg-[hsl(var(--chart-2))]/80',
        'secondary-chart-3':
          '!text-white border-transparent bg-[hsl(var(--chart-3))] text-secondary-foreground hover:bg-[hsl(var(--chart-3)]/80',
        'secondary-chart-4':
          '!text-white border-transparent bg-[hsl(var(--chart-4))] text-secondary-foreground hover:bg-[hsl(var(--chart-4))]/80',
        'secondary-chart-5':
          '!text-white border-transparent bg-[hsl(var(--chart-5))] text-secondary-foreground hover:bg-[hsl(var(--chart-5))]/80',
        destructive:
          '!text-white border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'text-foreground'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
