import { cn } from '@/lib/utils'
import { type VariantProps, cva } from 'class-variance-authority'
import type * as React from 'react'

const buttonGroupVariants = cva('flex items-center', {
  variants: {
    orientation: {
      horizontal: 'flex-row *:rounded-none *:first:rounded-s-md *:last:rounded-e-md',
      vertical: 'flex-col *:rounded-none *:first:rounded-t-md *:last:rounded-b-md',
    },
    rounded: {
      default: '*:rounded-none',
      large: '*:rounded-none *:first:rounded-l-lg *:last:rounded-r-lg',
      full: '*:rounded-none *:first:rounded-l-full *:last:rounded-r-full',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    rounded: 'default',
  },
})

export const ButtonGroup = ({
  className,
  orientation,
  rounded,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof buttonGroupVariants>) => {
  return <div className={cn(buttonGroupVariants({ orientation, rounded, className }))} {...props} />
}