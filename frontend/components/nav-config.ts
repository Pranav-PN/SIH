import {
  LayoutDashboard,
  SearchCheck,
  EyeOff,
  FileSearch,
  Database,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  title: string
  subtitle: string
}

// Route + page-header metadata. Drives the sidebar nav and the dynamic top bar.
export const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    title: 'Dashboard',
    subtitle: 'Overview of administrative KPIs and citizen signal health',
  },
  {
    href: '/reality-check',
    label: 'Reality Check',
    icon: SearchCheck,
    title: 'Reality Check',
    subtitle: 'Cross-reference official KPIs against real-world signals',
  },
  {
    href: '/blind-spots',
    label: 'Blind Spots',
    icon: EyeOff,
    title: 'Blind Spots',
    subtitle: 'Detected gaps between reported metrics and citizen outcomes',
  },
  {
    href: '/investigations',
    label: 'Investigations',
    icon: FileSearch,
    title: 'Investigations',
    subtitle: 'Root-cause analysis and evidence-backed investigation briefs',
  },
  {
    href: '/evidence',
    label: 'Evidence',
    icon: Database,
    title: 'Evidence Chain',
    subtitle: 'Data sources feeding the analysis',
  },
  {
    href: '/impact-tracker',
    label: 'Impact Tracker',
    icon: TrendingUp,
    title: 'Impact Tracker',
    subtitle: 'Outcome verification for administrative interventions',
  },
]
