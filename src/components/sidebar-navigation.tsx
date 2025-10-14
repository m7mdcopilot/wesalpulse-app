"use client"
import { useState, useMemo, useCallback, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard, 
  BarChart3, 
  Settings,
  Home,
  Database,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Users,
  Activity,
  Bell,
  CircleUserRound,
  SquareUserRound,
  LogOut,
  Sheet,
  BarChartColumn,
  TrendingUp,
  Sparkles,
  Star,
  Shield,
  Zap,
  Heart,
  Moon,
  Sun
} from 'lucide-react'

interface SidebarNavigationProps {
  className?: string
}

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  href?: string
  badge?: string
  children?: NavItem[]
  isExpanded?: boolean
}

interface UserSubmenuItem {
  id: string
  label: string
  icon: React.ReactNode
  href?: string
  onClick?: () => Promise<void> | void
  className?: string
}

interface SettingsSubmenuItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
}

// Constants for better maintainability
const SIDEBAR_WIDTHS = {
  collapsed: 'w-20',
  expanded: 'w-80'
} as const

const ANIMATION_DURATION = 300
const HOVER_SCALE = 1.02
const ACTIVE_SCALE = 0.98

const USER_SUBMENU_ITEMS: UserSubmenuItem[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: <SquareUserRound className="h-4 w-4" />,
    href: '/profile'
  },
  {
    id: 'logout',
    label: 'Logout',
    icon: <LogOut className="h-4 w-4" />,
    className: 'hover:bg-red-100'
  }
]

const SETTINGS_SUBMENU_ITEMS: SettingsSubmenuItem[] = [
  {
    id: 'general',
    label: 'General',
    icon: <Settings className="h-4 w-4" />,
    href: '/settings/general'
  },
  {
    id: 'users',
    label: 'Users',
    icon: <Users className="h-4 w-4" />,
    href: '/settings/users'
  }
]

export function SidebarNavigation({ className }: SidebarNavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboards'])
  const [isHovered, setIsHovered] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleSubmenu = useCallback((itemId: string) => {
    setExpandedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId)
      } else {
        return [...prev, itemId]
      }
    })
  }, [])

  const toggleSidebar = useCallback(() => {
    setIsAnimating(true)
    setTimeout(() => {
      setIsCollapsed(prev => !prev)
      setIsAnimating(false)
    }, ANIMATION_DURATION / 2)
  }, [])

  const handleLogout = useCallback(async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Logout failed')
      console.error('Logout error:', error)
    }
  }, [logout])

  const navItems: NavItem[] = useMemo(() => [
    {
      id: 'dashboards',
      label: 'Dashboards',
      icon: <LayoutDashboard className="h-5 w-5" />,
      children: [
        {
          id: 'home',
          label: 'Home',
          icon: <Home className="h-4 w-4" />,
          href: '/',
        },
        {
          id: 'call-center',
          label: 'Call Center',
          icon: <Activity className="h-4 w-4" />,
          href: '/views/dashboards/call-center',
        },
      ],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <TrendingUp className="h-5 w-5" />,
      badge: 'New',
      children: [
        {
          id: 'queues',
          label: 'Queue Performance',
          icon: <BarChartColumn className="h-4 w-4" />,
          href: '/analytics/queues',
        },
        {
          id: 'agents',
          label: 'Agent Performance',
          icon: <Users className="h-4 w-4" />,
          href: '/analytics/agents',
        },
      ],
    },
    {
      id: 'data-view',
      label: 'Data View',
      icon: <Database className="h-5 w-5" />,
      children: [
        {
          id: 'queue-performance',
          label: 'Queue Performance',
          icon: <BarChartColumn className="h-4 w-4" />,
          href: '/views/data-view/queue-performance',
        },
        {
          id: 'agent-performance',
          label: 'Agent Performance',
          icon: <Users className="h-4 w-4" />,
          href: '/views/data-view/agent-performance',
        },
      ],
    },
  ], [])

  const renderNavItem = useCallback((item: NavItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.id)
    const isActive = item.href && pathname === item.href

    if (hasChildren && !isCollapsed) {
      return (
        <div key={item.id} className="space-y-1">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start transition-all duration-300 ease-in-out group relative overflow-hidden",
              "rounded-xl border border-transparent bg-gradient-to-r from-background to-muted/20",
              "hover:from-primary/5 hover:to-primary/10 hover:border-primary/20 hover:shadow-lg",
              "hover:scale-[1.02] active:scale-[0.98]",
              "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/10 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300",
              "hover:before:opacity-100",
              isCollapsed ? "px-3 py-3" : "px-4 py-3",
              "backdrop-blur-sm"
            )}
            onClick={() => toggleSubmenu(item.id)}
          >
            <div className="flex items-center justify-center w-6 h-6 text-primary group-hover:text-primary transition-colors">
              {item.icon}
            </div>
            {!isCollapsed && (
              <>
                <div className="ml-3 flex-1 text-left">
                  <div className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                    {item.label}
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-primary/30 px-2 py-0.5 rounded-full">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </div>
                <ChevronDown 
                  className={cn(
                    "h-4 w-4 transition-transform duration-300 text-muted-foreground group-hover:text-primary",
                    isExpanded ? "rotate-180" : ""
                  )} 
                />
              </>
            )}
          </Button>
          {isExpanded && (
            <div className="ml-3 space-y-1 pl-2 border-l-2 border-primary/20">
              {item.children.map((child) => renderNavItem(child, level + 1))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Button
        key={item.id}
        variant="ghost"
        className={cn(
          "w-full justify-start transition-all duration-300 ease-in-out group relative overflow-hidden",
          "rounded-xl border border-transparent",
          isActive 
            ? "bg-gradient-to-r from-primary to-primary/90 text-white border-primary/30 shadow-lg shadow-primary/20" 
            : "bg-gradient-to-r from-background to-muted/20 hover:from-primary/5 hover:to-primary/10 hover:border-primary/20 hover:shadow-lg",
          "hover:scale-[1.02] active:scale-[0.98]",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300",
          "hover:before:opacity-100",
          isCollapsed ? "px-3 py-3" : level === 0 ? "px-4 py-3" : "px-6 py-2.5",
          "backdrop-blur-sm"
        )}
        asChild
      >
        <a href={item.href} className="flex items-center">
          <div className={`flex items-center justify-center w-6 h-6 transition-colors ${isActive ? 'text-white' : 'text-primary group-hover:text-primary'}`}>
            {item.icon}
          </div>
          {!isCollapsed && (
            <>
              <span className={`ml-3 font-semibold transition-colors ${isActive ? 'text-white' : 'text-foreground group-hover:text-primary'}`}>
                {item.label}
              </span>
              {item.badge && (
                <Badge variant="secondary" className={`ml-auto text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white border-white/30' : 'bg-primary/10 text-primary border-primary/20'}`}>
                  {item.badge}
                </Badge>
              )}
            </>
          )}
        </a>
      </Button>
    )
  }, [expandedItems, isCollapsed, pathname, toggleSubmenu])

  const renderUserSubmenuItem = useCallback((item: UserSubmenuItem) => {
    const isLogout = item.id === 'logout'
    
    if (isLogout) {
      return (
        <Button
          key={item.id}
          variant="ghost"
          className={cn(
            "w-full justify-start transition-all duration-300 ease-in-out group cursor-pointer relative overflow-hidden",
            "rounded-xl border border-transparent bg-gradient-to-r from-background to-muted/20",
            "hover:from-red-50 hover:to-red-100 hover:border-red-200 hover:shadow-lg",
            "hover:scale-[1.02] active:scale-[0.98]",
            isCollapsed ? "px-3 py-2.5" : "px-6 py-2.5",
            "backdrop-blur-sm"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 text-red-600 group-hover:text-red-700 transition-colors" />
          {!isCollapsed && (
            <span className="ml-3 font-semibold text-red-600 group-hover:text-red-700 transition-colors">
              Logout
            </span>
          )}
        </Button>
      )
    }

    return (
      <Button
        key={item.id}
        variant="ghost"
        className={cn(
          "w-full justify-start transition-all duration-300 ease-in-out group relative overflow-hidden",
          "rounded-xl border border-transparent bg-gradient-to-r from-background to-muted/20",
          "hover:from-primary/5 hover:to-primary/10 hover:border-primary/20 hover:shadow-lg",
          "hover:scale-[1.02] active:scale-[0.98]",
          isCollapsed ? "px-3 py-2.5" : "px-6 py-2.5",
          "backdrop-blur-sm"
        )}
        asChild
      >
        <a href={item.href} className="flex items-center">
          <div className="text-primary group-hover:text-primary transition-colors">
            {item.icon}
          </div>
          {!isCollapsed && (
            <span className="ml-3 font-semibold text-foreground group-hover:text-primary transition-colors">
              {item.label}
            </span>
          )}
        </a>
      </Button>
    )
  }, [isCollapsed, handleLogout])

  const renderSettingsSubmenuItem = useCallback((item: SettingsSubmenuItem) => (
    <Button
      key={item.id}
      variant="ghost"
      className={cn(
        "w-full justify-start transition-all duration-300 ease-in-out group relative overflow-hidden",
        "rounded-xl border border-transparent bg-gradient-to-r from-background to-muted/20",
        "hover:from-primary/5 hover:to-primary/10 hover:border-primary/20 hover:shadow-lg",
        "hover:scale-[1.02] active:scale-[0.98]",
        isCollapsed ? "px-3 py-2.5" : "px-6 py-2.5",
        "backdrop-blur-sm"
      )}
      asChild
    >
      <a href={item.href} className="flex items-center">
        <div className="text-primary group-hover:text-primary transition-colors">
          {item.icon}
        </div>
        {!isCollapsed && (
          <span className="ml-3 font-semibold text-foreground group-hover:text-primary transition-colors">
            {item.label}
          </span>
        )}
      </a>
    </Button>
  ), [isCollapsed])

  const sidebarClasses = useMemo(() => cn(
    "relative flex flex-col h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
    "border-r border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl",
    "shadow-2xl shadow-slate-900/5 dark:shadow-black/20",
    "transition-all duration-300 ease-in-out",
    isCollapsed ? SIDEBAR_WIDTHS.collapsed : SIDEBAR_WIDTHS.expanded,
    isAnimating && "pointer-events-none",
    mounted && "opacity-100",
    !mounted && "opacity-0",
    className
  ), [isCollapsed, isAnimating, mounted, className])

  return (
    <div 
      className={sidebarClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo Section - Enhanced */}
      {!isCollapsed && (
        <div className="flex items-center justify-between p-6 border-b border-slate-200/30 dark:border-slate-700/30 bg-gradient-to-r from-primary/8 via-primary/5 to-transparent flex-shrink-0">
          <div className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center relative">
                <div className="absolute -top-1 -left-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-ping opacity-75"></div>
                <div className="absolute -top-1 -left-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
                <img src="/images/brand/WesalPulse.png" alt="WesalPulse" className="h-14 w-auto drop-shadow-lg" />
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400" style={{ marginLeft: '58px', marginTop: '-8px' }}>
                <span className="font-medium">Powered by</span>
                <img src="/images/brand/wesal-cx.svg" alt="WesalCX" className="h-6 w-auto" />
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0 ml-4">
            <button
              className={cn(
                "inline-flex items-center justify-center rounded-xl cursor-pointer",
                "transition-all duration-300 ease-in-out",
                "bg-gradient-to-r from-primary to-primary/80 text-white hover:from-primary/90 hover:to-primary/70",
                "shadow-lg hover:shadow-xl shadow-primary/25 hover:shadow-primary/35",
                "hover:scale-105 active:scale-95",
                "w-8 h-8"
              )}
              title="Collapse Sidebar"
              onClick={toggleSidebar}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Collapsed Toggle Button - Enhanced */}
      {isCollapsed && (
        <div className="flex items-center justify-center p-4 border-b border-slate-200/30 dark:border-slate-700/30 bg-gradient-to-r from-primary/8 via-primary/5 to-transparent flex-shrink-0">
          <button
            className={cn(
              "inline-flex items-center justify-center rounded-xl cursor-pointer",
              "transition-all duration-300 ease-in-out",
              "bg-gradient-to-r from-primary to-primary/80 text-white hover:from-primary/90 hover:to-primary/70",
              "shadow-lg hover:shadow-xl shadow-primary/25 hover:shadow-primary/35",
              "hover:scale-105 active:scale-95",
              "w-8 h-8"
            )}
            title="Expand Sidebar"
            onClick={toggleSidebar}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Navigation Items - Enhanced */}
      <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
        {navItems.map((item) => renderNavItem(item))}
      </nav>

      {/* Footer - Enhanced */}
      <div className="flex-shrink-0 p-4 border-t border-slate-200/30 dark:border-slate-700/30 bg-gradient-to-t from-slate-50/50 to-transparent dark:from-slate-800/50 space-y-3">
        {/* User Section */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start transition-all duration-300 ease-in-out group relative overflow-hidden",
              "rounded-xl border border-slate-200/30 dark:border-slate-700/30 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700",
              "hover:from-primary/5 hover:to-primary/10 hover:border-primary/30 hover:shadow-lg",
              "hover:scale-[1.02] active:scale-[0.98]",
              isCollapsed ? "px-3 py-3" : "px-4 py-3",
              "backdrop-blur-sm"
            )}
            onClick={() => toggleSubmenu('user')}
          >
            <div className="flex items-center justify-center w-6 h-6 text-primary group-hover:text-primary transition-colors">
              <CircleUserRound className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <>
                <div className="ml-3 flex-1 text-left">
                  <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {user ? `${user.firstName} ${user.lastName}` : 'User'}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {user ? user.email : 'user@example.com'}
                  </div>
                </div>
                <ChevronDown 
                  className={cn(
                    "h-4 w-4 transition-transform duration-300 text-muted-foreground group-hover:text-primary",
                    expandedItems.includes('user') ? "rotate-180" : ""
                  )} 
                />
              </>
            )}
          </Button>
          {expandedItems.includes('user') && (
            <div className="ml-3 space-y-2 pl-2 border-l-2 border-primary/20">
              {USER_SUBMENU_ITEMS.map(renderUserSubmenuItem)}
            </div>
          )}
        </div>

        {/* Settings Section */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start transition-all duration-300 ease-in-out group relative overflow-hidden",
              "rounded-xl border border-slate-200/30 dark:border-slate-700/30 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700",
              "hover:from-primary/5 hover:to-primary/10 hover:border-primary/30 hover:shadow-lg",
              "hover:scale-[1.02] active:scale-[0.98]",
              isCollapsed ? "px-3 py-3" : "px-4 py-3",
              "backdrop-blur-sm"
            )}
            onClick={() => toggleSubmenu('settings')}
          >
            <div className="flex items-center justify-center w-6 h-6 text-primary group-hover:text-primary transition-colors">
              <Settings className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <>
                <span className="ml-3 font-semibold text-foreground group-hover:text-primary transition-colors">Settings</span>
                <ChevronDown 
                  className={cn(
                    "h-4 w-4 transition-transform duration-300 text-muted-foreground group-hover:text-primary",
                    expandedItems.includes('settings') ? "rotate-180" : ""
                  )} 
                />
              </>
            )}
          </Button>
          {expandedItems.includes('settings') && (
            <div className="ml-3 space-y-2 pl-2 border-l-2 border-primary/20">
              {SETTINGS_SUBMENU_ITEMS.map(renderSettingsSubmenuItem)}
            </div>
          )}
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start transition-all duration-300 ease-in-out group relative overflow-hidden",
            "rounded-xl border border-slate-200/30 dark:border-slate-700/30 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700",
            "hover:from-primary/5 hover:to-primary/10 hover:border-primary/30 hover:shadow-lg",
            "hover:scale-[1.02] active:scale-[0.98]",
            isCollapsed ? "px-3 py-3" : "px-4 py-3",
            "backdrop-blur-sm"
          )}
          asChild
        >
          <a href="/notifications" className="flex items-center">
            <div className="flex items-center justify-center w-6 h-6 text-primary group-hover:text-primary transition-colors relative">
              <Bell className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            {!isCollapsed && (
              <div className="ml-3 flex items-center gap-2">
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors">Notifications</span>
                <Badge variant="destructive" className="text-xs rounded-full w-6 h-6 flex items-center justify-center p-0 bg-gradient-to-r from-red-500 to-red-600 text-white border-red-700/30 shadow-sm">
                  3
                </Badge>
              </div>
            )}
          </a>
        </Button>

        {/* Help & Support */}
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start transition-all duration-300 ease-in-out group relative overflow-hidden",
            "rounded-xl border border-slate-200/30 dark:border-slate-700/30 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700",
            "hover:from-primary/5 hover:to-primary/10 hover:border-primary/30 hover:shadow-lg",
            "hover:scale-[1.02] active:scale-[0.98]",
            isCollapsed ? "px-3 py-3" : "px-4 py-3",
            "backdrop-blur-sm"
          )}
          asChild
        >
          <a href="/settings/help-support" className="flex items-center">
            <div className="flex items-center justify-center w-6 h-6 text-primary group-hover:text-primary transition-colors">
              <HelpCircle className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="ml-3 flex items-center gap-2">
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors">Help & Support</span>
                <Badge variant="secondary" className="ml-auto text-xs bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 border-amber-300/50 px-2 py-0.5 rounded-full">
                  +12
                </Badge>
              </div>
            )}
          </a>
        </Button>
      </div>
    </div>
  )
}
