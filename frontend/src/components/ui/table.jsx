import * as React from 'react'
import { cn } from '../../lib/utils'

function Table({ className, ...props }) {
  return (
    <div className="relative w-full overflow-auto">
      <table
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }) {
  return (
    <thead
      className={cn('[&_tr]:border-b [&_tr]:border-white/[0.08]', className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }) {
  return (
    <tbody
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
}

function TableRow({ className, ...props }) {
  return (
    <tr
      className={cn(
        'border-b border-white/[0.06] transition-colors hover:bg-white/[0.04]',
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }) {
  return (
    <th
      className={cn(
        'h-11 px-4 text-left align-middle text-[11px] font-extrabold uppercase tracking-[2px] text-white/40',
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }) {
  return (
    <td
      className={cn('px-4 py-4 align-middle text-[14px] text-white/80', className)}
      {...props}
    />
  )
}

function TableCaption({ className, ...props }) {
  return (
    <caption
      className={cn('mt-4 text-sm text-white/40', className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
}
