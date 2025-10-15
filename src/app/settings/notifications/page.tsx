"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { SidebarNavigation } from '@/components/sidebar-navigation'
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Monitor,
  Plus,
  X,
  Save,
  Settings,
  CheckCircle
} from 'lucide-react'

interface NotificationSettings {
  emailAlerts: {
    systemUpdates: {
      enabled: boolean
      recipients: string[]
    }
    securityAlerts: {
      enabled: boolean
      recipients: string[]
    }
    billingNotifications: {
      enabled: boolean
      recipients: string[]
    }
    weeklyReports: {
      enabled: boolean
      recipients: string[]
    }
    agentPerformance: {
      enabled: boolean
      recipients: string[]
    }
    queueThresholds: {
      enabled: boolean
      recipients: string[]
    }
    customerFeedback: {
      enabled: boolean
      recipients: string[]
    }
  }
  smsAlerts: {
    criticalAlerts: {
      enabled: boolean
      recipients: string[]
    }
    securityBreaches: {
      enabled: boolean
      recipients: string[]
    }
    systemDowntime: {
      enabled: boolean
      recipients: string[]
    }
    emergencyIncidents: {
      enabled: boolean
      recipients: string[]
    }
  }
  inAppNotifications: {
    newMessages: boolean
    taskAssignments: boolean
    systemAnnouncements: boolean
    mentions: boolean
  }
}

export default function SettingsNotifications() {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailAlerts: {
      systemUpdates: {
        enabled: true,
        recipients: ['admin@wesalpulse.com', 'it@wesalpulse.com']
      },
      securityAlerts: {
        enabled: true,
        recipients: ['admin@wesalpulse.com', 'security@wesalpulse.com']
      },
      billingNotifications: {
        enabled: true,
        recipients: ['admin@wesalpulse.com', 'finance@wesalpulse.com']
      },
      weeklyReports: {
        enabled: false,
        recipients: ['admin@wesalpulse.com']
      },
      agentPerformance: {
        enabled: true,
        recipients: ['admin@wesalpulse.com', 'supervisors@wesalpulse.com']
      },
      queueThresholds: {
        enabled: true,
        recipients: ['admin@wesalpulse.com', 'operations@wesalpulse.com']
      },
      customerFeedback: {
        enabled: false,
        recipients: ['admin@wesalpulse.com', 'quality@wesalpulse.com']
      }
    },
    smsAlerts: {
      criticalAlerts: {
        enabled: true,
        recipients: ['+1234567890']
      },
      securityBreaches: {
        enabled: true,
        recipients: ['+1234567890']
      },
      systemDowntime: {
        enabled: false,
        recipients: ['+1234567890']
      },
      emergencyIncidents: {
        enabled: true,
        recipients: ['+1234567890']
      }
    },
    inAppNotifications: {
      newMessages: true,
      taskAssignments: true,
      systemAnnouncements: true,
      mentions: true
    }
  })

  const [emailInputs, setEmailInputs] = useState<Record<string, string>>({})
  const [phoneInputs, setPhoneInputs] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  const handleNotificationToggle = (type: 'email' | 'sms' | 'inApp', category: string, enabled: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [type === 'email' ? 'emailAlerts' : type === 'sms' ? 'smsAlerts' : 'inAppNotifications']: {
        ...prev[type === 'email' ? 'emailAlerts' : type === 'sms' ? 'smsAlerts' : 'inAppNotifications'],
        [category]: type === 'inApp' 
          ? enabled 
          : {
              ...prev[type === 'email' ? 'emailAlerts' : 'smsAlerts'][category as keyof typeof prev.emailAlerts],
              enabled
            }
      }
    }))
  }

  const handleAddEmail = (category: string) => {
    const email = emailInputs[category]?.trim()
    if (email && email.includes('@')) {
      setNotificationSettings(prev => ({
        ...prev,
        emailAlerts: {
          ...prev.emailAlerts,
          [category]: {
            ...prev.emailAlerts[category as keyof typeof prev.emailAlerts],
            recipients: [...prev.emailAlerts[category as keyof typeof prev.emailAlerts].recipients, email]
          }
        }
      }))
      setEmailInputs(prev => ({ ...prev, [category]: '' }))
      toast.success('Email added successfully')
    } else {
      toast.error('Please enter a valid email address')
    }
  }

  const handleRemoveEmail = (category: string, email: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      emailAlerts: {
        ...prev.emailAlerts,
        [category]: {
          ...prev.emailAlerts[category as keyof typeof prev.emailAlerts],
          recipients: prev.emailAlerts[category as keyof typeof prev.emailAlerts].recipients.filter(e => e !== email)
        }
      }
    }))
    toast.success('Email removed successfully')
  }

  const handleAddPhone = (category: string) => {
    const phone = phoneInputs[category]?.trim()
    if (phone && phone.length >= 10) {
      setNotificationSettings(prev => ({
        ...prev,
        smsAlerts: {
          ...prev.smsAlerts,
          [category]: {
            ...prev.smsAlerts[category as keyof typeof prev.smsAlerts],
            recipients: [...prev.smsAlerts[category as keyof typeof prev.smsAlerts].recipients, phone]
          }
        }
      }))
      setPhoneInputs(prev => ({ ...prev, [category]: '' }))
      toast.success('Phone number added successfully')
    } else {
      toast.error('Please enter a valid phone number')
    }
  }

  const handleRemovePhone = (category: string, phone: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      smsAlerts: {
        ...prev.smsAlerts,
        [category]: {
          ...prev.smsAlerts[category as keyof typeof prev.smsAlerts],
          recipients: prev.smsAlerts[category as keyof typeof prev.smsAlerts].recipients.filter(p => p !== phone)
        }
      }
    }))
    toast.success('Phone number removed successfully')
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Notification settings saved successfully')
    } catch (error) {
      toast.error('Failed to save notification settings')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNavigation />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bell className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
                  <p className="text-gray-600">Configure how you receive alerts and notifications</p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="email" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Alerts
                </TabsTrigger>
                <TabsTrigger value="sms" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  SMS Alerts
                </TabsTrigger>
                <TabsTrigger value="inapp" className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  In-App Notifications
                </TabsTrigger>
              </TabsList>

              {/* Email Alerts Tab */}
              <TabsContent value="email">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Email Alert Configuration
                    </CardTitle>
                    <CardDescription>
                      Configure which alerts you want to receive via email and manage recipients
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(notificationSettings.emailAlerts).map(([key, config]) => (
                      <div key={key} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </Label>
                            <p className="text-xs text-gray-500">
                              {key === 'systemUpdates' && 'System maintenance and updates'}
                              {key === 'securityAlerts' && 'Security-related notifications'}
                              {key === 'billingNotifications' && 'Billing and payment alerts'}
                              {key === 'weeklyReports' && 'Weekly performance reports'}
                              {key === 'agentPerformance' && 'Agent performance metrics'}
                              {key === 'queueThresholds' && 'Queue threshold breaches'}
                              {key === 'customerFeedback' && 'Customer satisfaction feedback'}
                            </p>
                          </div>
                          <Switch
                            checked={config.enabled}
                            onCheckedChange={(checked) => handleNotificationToggle('email', key, checked)}
                          />
                        </div>
                        
                        {config.enabled && (
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-600">Recipients:</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {config.recipients.map((email, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                  {email}
                                  <button
                                    onClick={() => handleRemoveEmail(key, email)}
                                    className="ml-1 hover:text-red-600"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add email address..."
                                value={emailInputs[key] || ''}
                                onChange={(e) => setEmailInputs(prev => ({ ...prev, [key]: e.target.value }))}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    handleAddEmail(key)
                                  }
                                }}
                                className="flex-1"
                              />
                              <Button
                                onClick={() => handleAddEmail(key)}
                                size="sm"
                                className="bg-primary hover:bg-primary/90"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        <Separator />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SMS Alerts Tab */}
              <TabsContent value="sms">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      SMS Alert Configuration
                    </CardTitle>
                    <CardDescription>
                      Configure critical alerts to be sent via SMS message
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(notificationSettings.smsAlerts).map(([key, config]) => (
                      <div key={key} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </Label>
                            <p className="text-xs text-gray-500">
                              {key === 'criticalAlerts' && 'Critical system alerts'}
                              {key === 'securityBreaches' && 'Security breach notifications'}
                              {key === 'systemDowntime' && 'System downtime alerts'}
                              {key === 'emergencyIncidents' && 'Emergency incident notifications'}
                            </p>
                          </div>
                          <Switch
                            checked={config.enabled}
                            onCheckedChange={(checked) => handleNotificationToggle('sms', key, checked)}
                          />
                        </div>
                        
                        {config.enabled && (
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-600">Recipients:</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {config.recipients.map((phone, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                  {phone}
                                  <button
                                    onClick={() => handleRemovePhone(key, phone)}
                                    className="ml-1 hover:text-red-600"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add phone number..."
                                value={phoneInputs[key] || ''}
                                onChange={(e) => setPhoneInputs(prev => ({ ...prev, [key]: e.target.value }))}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    handleAddPhone(key)
                                  }
                                }}
                                className="flex-1"
                              />
                              <Button
                                onClick={() => handleAddPhone(key)}
                                size="sm"
                                className="bg-primary hover:bg-primary/90"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        <Separator />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* In-App Notifications Tab */}
              <TabsContent value="inapp">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5" />
                      In-App Notifications
                    </CardTitle>
                    <CardDescription>
                      Configure notifications that appear within the application
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(notificationSettings.inAppNotifications).map(([key, enabled]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </Label>
                          <p className="text-xs text-gray-500">
                            {key === 'newMessages' && 'New message notifications'}
                            {key === 'taskAssignments' && 'Task assignment alerts'}
                            {key === 'systemAnnouncements' && 'System announcements'}
                            {key === 'mentions' && 'When you are mentioned in conversations'}
                          </p>
                        </div>
                        <Switch
                          checked={enabled}
                          onCheckedChange={(checked) => handleNotificationToggle('inApp', key, checked)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Save Settings Button */}
            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="bg-primary hover:bg-primary/90 px-6"
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    <span>Save Settings</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}