'use client'

import { usePathname } from 'next/navigation'
import { Info } from 'lucide-react'
import { navItems } from '@/components/nav-config'
import { Sidebar } from '@/components/sidebar'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const current =
    navItems.find((item) =>
      item.href === '/' ? pathname === '/' : pathname.startsWith(item.href),
    ) ?? navItems[0]

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">{current.title}</h1>
            <p className="text-sm text-muted-foreground">{current.subtitle}</p>
          </div>
          <div className="hidden items-center gap-2 rounded-md border border-status-amber/30 bg-status-amber-bg px-3 py-1.5 text-xs font-medium text-status-amber md:flex">
            <Info className="size-3.5" />
            Prototype uses synthetic administrative data — not real government data.
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
