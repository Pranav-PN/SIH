'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'
import { navItems } from '@/components/nav-config'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <ShieldCheck className="size-5" />
        </div>
        <div>
          <p className="text-lg font-semibold leading-tight text-white">CivicSage</p>
          <p className="text-xs leading-tight text-slate-400">
            Evidence-Driven Public Administration
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map((item) => {
          const active =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-sidebar-accent text-white'
                  : 'text-slate-300 hover:bg-sidebar-accent/60 hover:text-white',
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-sidebar-primary" />
              )}
              <Icon className="size-[18px] shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Prototype badge */}
      <div className="px-5 py-5">
        <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/50 px-3 py-2.5">
          <p className="flex items-center gap-2 text-xs font-medium text-amber-300">
            <span className="size-2 rounded-full bg-amber-400" />
            Prototype — Synthetic Data
          </p>
        </div>
      </div>
    </aside>
  )
}
