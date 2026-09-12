"use client"

import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from "lucide-react"
import { Toaster as Sonner } from "sonner"

function Toaster({
  ...props
}) {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      dir="auto"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "var(--radius)",
      }}
      toastOptions={{
        classNames: {
          toast: "cn-toast [unicode-bidi:plaintext]",
          title: "[unicode-bidi:plaintext]",
          description: "[unicode-bidi:plaintext]",
        },
      }}
      {...props} />
  );
}

export { Toaster }
