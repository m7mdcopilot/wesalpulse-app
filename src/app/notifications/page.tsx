'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DashboardLayoutSimple } from '@/components/dashboard-layout-simple'
import { Bell, Check, CheckCheck, Search, Mail, AlertTriangle, Info, X } from 'lucide-react'
import { toast } from 'sonner'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  timestamp: string
  read: boolean
  category: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'System Update',
      message: 'A new system update is available. Please review the changes.',
      type: 'info',
      timestamp: '2025-01-22 10:30',
      read: false,
      category: 'System'
    },
    {
      id: '2',
      title: 'High Call Volume',
      message: 'Call volume has increased by 25% in the last hour.',
      type: 'warning',
      timestamp: '2025-01-22 09:45',
      read: false,
      category: 'Performance'
    },
    {
      id: '3',
      title: 'New Agent Added',
      message: 'John Doe has been successfully added to the team.',
      type: 'success',
      timestamp: '2025-01-22 09:15',
      read: false,
      category: 'Team'
    },
    {
      id: '4',
      title: 'Server Maintenance',
      message: 'Scheduled maintenance will occur tonight at 2:00 AM.',
      type: 'info',
      timestamp: '2025-01-22 08:30',
      read: true,
      category: 'System'
    },
    {
      id: '5',
      title: 'Call Quality Alert',
      message: 'Call quality has dropped below acceptable levels.',
      type: 'error',
      timestamp: '2025-01-22 08:00',
      read: true,
      category: 'Performance'
    },
    {
      id: '6',
      title: 'Weekly Report Ready',
      message: 'Your weekly performance report is now available.',
      type: 'success',
      timestamp: '2025-01-22 07:30',
      read: true,
      category: 'Reports'
    },
    {
      id: '7',
      title: 'Security Update',
      message: 'New security protocols have been implemented.',
      type: 'info',
      timestamp: '2025-01-21 16:45',
      read: true,
      category: 'Security'
    },
    {
      id: '8',
      title: 'Agent Performance',
      message: 'Sarah Johnson has exceeded her monthly targets.',
      type: 'success',
      timestamp: '2025-01-21 15:30',
      read: true,
      category: 'Performance'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>(notifications)

  // Filter notifications based on search term
  useEffect(() => {
    const filtered = notifications.filter(notification =>
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredNotifications(filtered)
    setCurrentPage(1) // Reset to first page when search changes
  }, [searchTerm, notifications])

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredNotifications.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage)

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
    toast.success('Notification marked as read')
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
    toast.success('All notifications marked as read')
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
    toast.success('Notification deleted')
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className="h-4 w-4 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case 'error':
        return <X className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-blue-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'warning':
        return 'bg-orange-50 border-orange-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <DashboardLayoutSimple>
      <div className="space-y-2">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">
                {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                onClick={markAllAsRead}
                className="flex items-center gap-2 cursor-pointer"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all as read
              </Button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <Card className="bg-card text-card-foreground rounded-xl border shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-2">
          {currentItems.length === 0 ? (
            <Card className="bg-card text-card-foreground rounded-xl border shadow-sm">
              <CardContent className="p-4 text-center">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notifications found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'No notifications match your search criteria.' : 'You have no notifications.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            currentItems.map((notification) => (
              <Card 
                key={notification.id} 
                className={`bg-card text-card-foreground rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md ${
                  !notification.read 
                    ? 'bg-[#fbfbfb] border-[#ccc] shadow-md' 
                    : 'border-border/50 hover:border-border/80'
                }`}
              >
                <CardContent className="py-1 px-2">
                  <div className="flex items-start gap-2">
                    <div className={`p-1 rounded-lg ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1 mb-0.5">
                        <div className="min-w-0 flex-1">
                          <h3 className={`font-semibold text-xs ${
                            !notification.read 
                              ? 'text-primary font-bold tracking-tight' 
                              : 'text-foreground'
                          }`}>
                            {notification.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0">
                            {notification.message}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Badge variant="secondary" className="text-xs">
                            {notification.category}
                          </Badge>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 animate-pulse shadow-sm shadow-primary/50"></div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">
                          {notification.timestamp}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-6 px-1.5 text-xs cursor-pointer"
                            >
                              <Check className="h-2.5 w-2.5 mr-0.5" />
                              Mark read
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-6 px-1.5 text-xs cursor-pointer text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-2.5 w-2.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Card className="bg-card text-card-foreground rounded-xl border shadow-sm">
            <CardContent className="p-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredNotifications.length)} of {filteredNotifications.length} notifications
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="cursor-pointer"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 p-0 cursor-pointer ${
                          currentPage === page ? 'bg-primary text-primary-foreground' : ''
                        }`}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="cursor-pointer"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayoutSimple>
  )
}