import type React from "react"

export default function DealerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="dealer-layout">
      {children}
    </div>
  )
} 