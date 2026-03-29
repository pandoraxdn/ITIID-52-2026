import * as React from "react"

export type ToastProps = {
  id?: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
  duration?: number
  variant?: "default" | "destructive"
}

export type ToastActionElement = React.ReactElement<{
  altText: string
  onClick: () => void
}>
