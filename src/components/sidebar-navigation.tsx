"use client"
import { useState, useMemo, useCallback } from 'react'
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
  Users,
  Activity,
  Bell,
  CircleUserRound,
  SquareUserRound,
  LogOut,
  Sheet,
  BarChartColumn,
  TrendingUp
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
  collapsed: 'w-16',
  expanded: 'w-72'
} as const

const ANIMATION_DURATION = 200

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
  const pathname = usePathname()
  const { user, logout } = useAuth()

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
    setIsCollapsed(prev => !prev)
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
          icon: <LayoutDashboard className="h-4 w-4" />,
          href: '/views/dashboards/call-center',
        },
      ],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <TrendingUp className="h-5 w-5" />,
      children: [
        {
          id: 'queues',
          label: 'Queue Performance',
          icon: <Activity className="h-4 w-4" />,
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
      icon: <Sheet className="h-5 w-5" />,
      children: [
        {
          id: 'queue-performance',
          label: 'Queue Performance',
          icon: <Activity className="h-4 w-4" />,
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
              "w-full justify-start transition-all duration-200 ease-in-out group",
              "rounded-lg border border-transparent",
              isCollapsed ? "px-2" : "px-4",
              "relative overflow-hidden"
            )}
            onClick={() => toggleSubmenu(item.id)}
          >
            <div className="flex items-center justify-center w-5 h-5 text-primary">
              {item.icon}
            </div>
            {!isCollapsed && (
              <>
                <span className="ml-3 font-medium text-foreground group-hover:text-primary transition-colors">
                  {item.label}
                </span>
                <ChevronDown 
                  className={cn(
                    "ml-auto h-4 w-4 transition-transform duration-200 text-muted-foreground group-hover:text-primary",
                    isExpanded ? "rotate-180" : ""
                  )} 
                />
              </>
            )}
          </Button>
          {isExpanded && (
            <div className="ml-2 space-y-1">
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
          "w-full justify-start transition-all duration-200 ease-in-out",
          "rounded-lg border border-transparent",
          isActive && "bg-[#00234B] text-white border-none hover:bg-[#00234B] hover:text-white",
          isCollapsed ? "px-2" : level === 0 ? "px-4" : "px-6",
          "relative overflow-hidden"
        )}
        asChild
      >
        <a href={item.href} className="flex items-center">
          <div className={`flex items-center justify-center w-5 h-5 ${isActive ? 'text-white' : 'text-primary'}`}>
            {item.icon}
          </div>
          {!isCollapsed && (
            <>
              <span className={`ml-3 font-medium transition-colors ${isActive ? 'text-white' : 'text-foreground'}`}>
                {item.label}
              </span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto text-xs bg-primary/10 text-primary border-primary/20">
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
            "w-full justify-start transition-all duration-200 ease-in-out group cursor-pointer",
            item.className,
            "rounded-lg border border-transparent",
            isCollapsed ? "px-2" : "px-6",
            "relative overflow-hidden"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-3 text-red-600 group-hover:text-red-700" />
          {!isCollapsed && <span className="font-medium text-red-600 group-hover:text-red-700 transition-colors">Logout</span>}
        </Button>
      )
    }

    return (
      <Button
        key={item.id}
        variant="ghost"
        className={cn(
          "w-full justify-start transition-all duration-200 ease-in-out group",
          "rounded-lg border border-transparent",
          isCollapsed ? "px-2" : "px-6",
          "relative overflow-hidden"
        )}
        asChild
      >
        <a href={item.href} className="flex items-center">
          {item.icon}
          {!isCollapsed && <span className="ml-3 font-medium text-foreground group-hover:text-primary transition-colors">{item.label}</span>}
        </a>
      </Button>
    )
  }, [isCollapsed, handleLogout])

  const renderSettingsSubmenuItem = useCallback((item: SettingsSubmenuItem) => (
    <Button
      key={item.id}
      variant="ghost"
      className={cn(
        "w-full justify-start transition-all duration-200 ease-in-out group",
        "rounded-lg border border-transparent",
        isCollapsed ? "px-2" : "px-6",
        "relative overflow-hidden"
      )}
      asChild
    >
      <a href={item.href} className="flex items-center">
        {item.icon}
        {!isCollapsed && <span className="ml-3 font-medium text-foreground group-hover:text-primary transition-colors">{item.label}</span>}
      </a>
    </Button>
  ), [isCollapsed])

  const sidebarClasses = useMemo(() => cn(
    "relative flex flex-col h-screen bg-gradient-to-b from-background via-background to-muted/20",
    "border-r border-border/50 backdrop-blur-sm",
    "shadow-lg shadow-black/5",
    isCollapsed ? SIDEBAR_WIDTHS.collapsed : SIDEBAR_WIDTHS.expanded,
    className
  ), [isCollapsed, className])

  return (
    <div 
      className={sidebarClasses}
    >
      {/* Logo Section - Only show when expanded */}
      {!isCollapsed && (
        <div className="flex items-center justify-between p-4 border-b border-border/30 bg-gradient-to-r from-primary/5 to-transparent flex-shrink-0">
          <div className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center relative">
                <div className="absolute top-16 left-1 w-3 h-3 bg-[#f9b11f] rounded-full animate-ping z-5" style={{ top: '35px', left: '2px' }}></div>
                <img src="/images/brand/WesalPulse.png" alt="WesalPulse" className="h-12 w-auto" />
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground" style={{ marginLeft: '50px', marginTop: '-10px' }}>
                <span>By</span>
                <img src="/images/brand/wesal-cx.svg" alt="WesalCX" className="h-5 w-auto" />
                <span>WesalCX</span>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0 ml-2">
            <button
              data-slot="button"
              className={cn(
                "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full cursor-pointer",
                "text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
                "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
                "outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                "dark:hover:bg-accent/50 size-8 h-6 w-6",
                "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70",
                "shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              )}
              title="Collapse Sidebar"
              onClick={toggleSidebar}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Collapsed Toggle Button - Only show when collapsed */}
      {isCollapsed && (
        <div className="flex items-center justify-center p-3 border-b border-border/30 bg-gradient-to-r from-primary/5 to-transparent flex-shrink-0">
          <button
            data-slot="button"
            className={cn(
              "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full cursor-pointer",
              "text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
              "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
              "outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              "dark:hover:bg-accent/50 size-8 h-6 w-6",
              "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70",
              "shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
            )}
            title="Expand Sidebar"
            onClick={toggleSidebar}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {navItems.map((item) => renderNavItem(item))}
      </nav>

      {/* Footer - Fixed at Bottom */}
      <div className="flex-shrink-0 p-3 border-t border-border/30 bg-gradient-to-t from-muted/10 to-transparent space-y-2">
        {/* A- Login User */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start transition-all duration-200 ease-in-out group",
              "rounded-lg border border-transparent",
              isCollapsed ? "px-2" : "px-4",
              "relative overflow-hidden"
            )}
            onClick={() => toggleSubmenu('user')}
          >
            <div className="flex items-center justify-center w-5 h-5 text-primary">
              <CircleUserRound className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <>
                <div className="ml-3 text-left">
                  <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                    {user ? `${user.firstName} ${user.lastName}` : 'User'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user ? user.email : 'user@example.com'}
                  </div>
                </div>
                <ChevronDown 
                  className={cn(
                    "ml-auto h-4 w-4 transition-transform duration-200 text-muted-foreground group-hover:text-primary",
                    expandedItems.includes('user') ? "rotate-180" : ""
                  )} 
                />
              </>
            )}
          </Button>
          {expandedItems.includes('user') && (
            <div className="ml-2 space-y-1">
              {USER_SUBMENU_ITEMS.map(renderUserSubmenuItem)}
            </div>
          )}
        </div>

        {/* B- Settings */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start transition-all duration-200 ease-in-out group",
              "rounded-lg border border-transparent",
              isCollapsed ? "px-2" : "px-4",
              "relative overflow-hidden"
            )}
            onClick={() => toggleSubmenu('settings')}
          >
            <div className="flex items-center justify-center w-5 h-5 text-primary">
              <Settings className="h-4 w-4" />
            </div>
            {!isCollapsed && (
              <>
                <span className="ml-3 font-medium text-foreground group-hover:text-primary transition-colors">Settings</span>
                <ChevronDown 
                  className={cn(
                    "ml-auto h-4 w-4 transition-transform duration-200 text-muted-foreground group-hover:text-primary",
                    expandedItems.includes('settings') ? "rotate-180" : ""
                  )} 
                />
              </>
            )}
          </Button>
          {expandedItems.includes('settings') && (
            <div className="ml-2 space-y-1">
              {SETTINGS_SUBMENU_ITEMS.map(renderSettingsSubmenuItem)}
            </div>
          )}
        </div>

        {/* C- Notifications */}
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start transition-all duration-200 ease-in-out group cursor-pointer",
            "rounded-lg border border-transparent",
            isCollapsed ? "px-2" : "px-4",
            "relative overflow-hidden"
          )}
          asChild
        >
          <a href="/notifications" className="flex items-center">
            <Bell className="h-4 w-4 text-primary" />
            {!isCollapsed && (
              <div className="ml-3 flex items-center gap-2">
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">Notifications</span>
                <Badge variant="destructive" className="text-xs rounded-full w-5 h-5 flex items-center justify-center p-0 bg-destructive text-white border-destructive/20 shadow-sm">
                  3
                </Badge>
              </div>
            )}
          </a>
        </Button>

        {/* D- Help & Support */}
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start transition-all duration-200 ease-in-out group cursor-pointer",
            "rounded-lg border border-transparent",
            isCollapsed ? "px-2" : "px-4",
            "relative overflow-hidden"
          )}
          asChild
        >
          <a href="/settings/help-support" className="flex items-center">
            <HelpCircle className="h-4 w-4 text-primary" />
            {!isCollapsed && (
              <>
                <span className="ml-3 font-medium text-foreground group-hover:text-primary transition-colors">Help & Support</span>
                <Badge variant="secondary" className="ml-auto text-[10px] bg-primary/10 text-primary border-primary/20 px-1.5 py-0.5">
                  +12 new updates
                </Badge>
              </>
            )}
          </a>
        </Button>
      </div>
    </div>
  )
}
