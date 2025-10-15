"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { SidebarNavigation } from '@/components/sidebar-navigation'
import { 
  Shield, 
  Key, 
  Bell, 
  CreditCard, 
  Lock, 
  Smartphone, 
  Mail, 
  Monitor,
  Copy,
  Trash2,
  RefreshCw,
  Plus,
  CheckCircle,
  XCircle,
  Calendar,
  Download,
  Eye,
  EyeOff,
  Settings,
  Cloud,
  Activity,
  Users,
  BarChart3,
  X,
  AtSign,
  UserPlus
} from 'lucide-react'

interface Device {
  id: string
  name: string
  type: string
  lastActive: string
  currentSession: boolean
}

interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: string
  lastUsed: string
  status: 'active' | 'revoked'
}

interface License {
  key: string
  status: 'active' | 'expired' | 'trial'
  type: string
  expiresAt: string
  activatedAt: string
  features: string[]
}

export default function SettingsGeneral() {
  // Security states
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [singleSessionEnabled, setSingleSessionEnabled] = useState(true)

  // API Keys states
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production API Key',
      key: 'ak_live_1234567890abcdef',
      createdAt: '2023-01-15',
      lastUsed: '2024-01-10',
      status: 'active'
    },
    {
      id: '2',
      name: 'Development API Key',
      key: 'ak_test_0987654321fedcba',
      createdAt: '2023-06-20',
      lastUsed: '2024-01-05',
      status: 'active'
    }
  ])
  const [newKeyName, setNewKeyName] = useState('')
  const [generatedKey, setGeneratedKey] = useState('')

  // Notifications states
  const [emailAlerts, setEmailAlerts] = useState({
    systemUpdates: {
      enabled: true,
      recipients: ['security-team@wesalpulse.com', 'it-admin@wesalpulse.com']
    },
    billingNotifications: {
      enabled: true,
      recipients: ['finance@wesalpulse.com', 'admin@wesalpulse.com']
    },
    weeklyReports: {
      enabled: false,
      recipients: ['management@wesalpulse.com']
    }
  })
  const [smsAlerts, setSmsAlerts] = useState({
    criticalAlerts: {
      enabled: true,
      recipients: ['+1234567890', '+0987654321']
    },
    securityBreaches: {
      enabled: true,
      recipients: ['+1234567890', '+1111111111']
    },
    systemDowntime: {
      enabled: false,
      recipients: ['+1234567890']
    },
    emergencyIncidents: {
      enabled: true,
      recipients: ['+1234567890', '+0987654321', '+1111111111']
    }
  })
  const [inAppNotifications, setInAppNotifications] = useState({
    newMessages: true,
    taskAssignments: true,
    systemAnnouncements: true,
    mentions: true
  })
  const [taggedEmails, setTaggedEmails] = useState<string[]>(['admin@wesalpulse.com', 'manager@wesalpulse.com'])
  const [taggedPhones, setTaggedPhones] = useState<string[]>(['+1234567890'])
  const [emailInput, setEmailInput] = useState('')
  const [phoneInput, setPhoneInput] = useState('')

  // Individual alert type input states
  const [alertEmailInputs, setAlertEmailInputs] = useState({
    systemUpdates: '',
    billingNotifications: '',
    weeklyReports: ''
  })
  const [alertPhoneInputs, setAlertPhoneInputs] = useState({
    criticalAlerts: '',
    securityBreaches: '',
    systemDowntime: '',
    emergencyIncidents: ''
  })

  // Subscription states
  const [license, setLicense] = useState<License>({
    key: 'WESAL-PRO-2024-12345',
    status: 'active',
    type: 'Professional',
    expiresAt: '2024-12-31',
    activatedAt: '2023-01-15',
    features: ['Unlimited Users', 'Advanced Analytics', 'Priority Support', 'API Access', 'Custom Integrations']
  })

  // Integration states
  const [genesysIntegration, setGenesysIntegration] = useState({
    enabled: false,
    environment: 'mypurecloud.com',
    clientId: 'your-client-id-here',
    clientSecret: 'your-client-secret-here'
  })

  const [apiUsageSettings, setApiUsageSettings] = useState({
    currentCallStatus: {
      enabled: true,
      interval: '5m'
    },
    callCenterPerformance: {
      enabled: true,
      interval: '5m'
    },
    queuePerformance: {
      enabled: true,
      interval: '1h'
    }
  })

  // Dialog states
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false)
  const [licenseDialogOpen, setLicenseDialogOpen] = useState(false)
  const [newLicenseKey, setNewLicenseKey] = useState('')

  // Mock devices data
  const [devices] = useState<Device[]>([
    {
      id: '1',
      name: 'Chrome on Windows',
      type: 'Desktop',
      lastActive: '2024-01-15 10:30:00',
      currentSession: true
    }
  ])

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    // Simulate password change
    toast.success('Password changed successfully')
    setPasswordDialogOpen(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleGenerateApiKey = () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a name for the API key')
      return
    }

    // Simulate API key generation
    const newKey = `ak_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    setGeneratedKey(newKey)
    
    // Add to API keys list
    const newApiKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: newKey,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      status: 'active'
    }
    
    setApiKeys(prev => [...prev, newApiKey])
    setNewKeyName('')
    toast.success('API key generated successfully')
  }

  const handleRevokeApiKey = (keyId: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === keyId ? { ...key, status: 'revoked' as const } : key
    ))
    toast.success('API key revoked successfully')
  }

  const handleCopyApiKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast.success('API key copied to clipboard')
  }

  const handleActivateLicense = () => {
    if (!newLicenseKey.trim()) {
      toast.error('Please enter a license key')
      return
    }

    // Simulate license activation
    setLicense(prev => ({
      ...prev,
      key: newLicenseKey,
      status: 'active' as const,
      activatedAt: new Date().toISOString().split('T')[0]
    }))
    
    setNewLicenseKey('')
    setLicenseDialogOpen(false)
    toast.success('License activated successfully')
  }

  const handleNotificationChange = (type: 'email' | 'sms' | 'inApp', field: string, value: boolean) => {
    if (type === 'email') {
      setEmailAlerts(prev => ({ 
        ...prev, 
        [field]: { 
          ...prev[field as keyof typeof prev], 
          enabled: value 
        } 
      }))
    } else if (type === 'sms') {
      setSmsAlerts(prev => ({ 
        ...prev, 
        [field]: { 
          ...prev[field as keyof typeof prev], 
          enabled: value 
        } 
      }))
    } else {
      setInAppNotifications(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleAddEmailToAlert = (alertType: string, email: string) => {
    if (email.trim() && !emailAlerts[alertType as keyof typeof emailAlerts].recipients.includes(email.trim())) {
      setEmailAlerts(prev => ({ 
        ...prev, 
        [alertType]: { 
          ...prev[alertType as keyof typeof prev], 
          recipients: [...prev[alertType as keyof typeof prev].recipients, email.trim()] 
        } 
      }))
      toast.success(`Email added to ${alertType.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
    }
  }

  const handleRemoveEmailFromAlert = (alertType: string, email: string) => {
    setEmailAlerts(prev => ({ 
      ...prev, 
      [alertType]: { 
        ...prev[alertType as keyof typeof prev], 
        recipients: prev[alertType as keyof typeof prev].recipients.filter((e: string) => e !== email) 
      } 
    }))
    toast.success(`Email removed from ${alertType.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
  }

  const handleAddPhoneToAlert = (alertType: string, phone: string) => {
    if (phone.trim() && !smsAlerts[alertType as keyof typeof smsAlerts].recipients.includes(phone.trim())) {
      setSmsAlerts(prev => ({ 
        ...prev, 
        [alertType]: { 
          ...prev[alertType as keyof typeof prev], 
          recipients: [...prev[alertType as keyof typeof prev].recipients, phone.trim()] 
        } 
      }))
      toast.success(`Phone added to ${alertType.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
    }
  }

  const handleRemovePhoneFromAlert = (alertType: string, phone: string) => {
    setSmsAlerts(prev => ({ 
      ...prev, 
      [alertType]: { 
        ...prev[alertType as keyof typeof prev], 
        recipients: prev[alertType as keyof typeof prev].recipients.filter((p: string) => p !== phone) 
      } 
    }))
    toast.success(`Phone removed from ${alertType.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
  }

  const handleAddEmail = () => {
    if (emailInput.trim() && !taggedEmails.includes(emailInput.trim())) {
      setTaggedEmails(prev => [...prev, emailInput.trim()])
      setEmailInput('')
      toast.success('Email added successfully')
    } else if (taggedEmails.includes(emailInput.trim())) {
      toast.error('Email already exists')
    }
  }

  const handleRemoveEmail = (email: string) => {
    setTaggedEmails(prev => prev.filter(e => e !== email))
    toast.success('Email removed successfully')
  }

  const handleAddPhone = () => {
    if (phoneInput.trim() && !taggedPhones.includes(phoneInput.trim())) {
      setTaggedPhones(prev => [...prev, phoneInput.trim()])
      setPhoneInput('')
      toast.success('Phone number added successfully')
    } else if (taggedPhones.includes(phoneInput.trim())) {
      toast.error('Phone number already exists')
    }
  }

  const handleRemovePhone = (phone: string) => {
    setTaggedPhones(prev => prev.filter(p => p !== phone))
    toast.success('Phone number removed successfully')
  }

  const handleEmailKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddEmail()
    }
  }

  const handlePhoneKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddPhone()
    }
  }

  // Individual alert type handlers
  const handleAlertEmailInputChange = (alertType: string, value: string) => {
    setAlertEmailInputs(prev => ({ ...prev, [alertType]: value }))
  }

  const handleAlertPhoneInputChange = (alertType: string, value: string) => {
    setAlertPhoneInputs(prev => ({ ...prev, [alertType]: value }))
  }

  const handleAddAlertEmail = (alertType: string) => {
    const email = alertEmailInputs[alertType as keyof typeof alertEmailInputs].trim()
    if (email && !emailAlerts[alertType as keyof typeof emailAlerts].recipients.includes(email)) {
      setEmailAlerts(prev => ({
        ...prev,
        [alertType]: {
          ...prev[alertType as keyof typeof emailAlerts],
          recipients: [...prev[alertType as keyof typeof emailAlerts].recipients, email]
        }
      }))
      setAlertEmailInputs(prev => ({ ...prev, [alertType]: '' }))
      toast.success(`Email added to ${alertType.replace(/([A-Z])/g, ' $1').toLowerCase()} successfully`)
    } else if (emailAlerts[alertType as keyof typeof emailAlerts].recipients.includes(email)) {
      toast.error('Email already exists for this alert type')
    }
  }

  const handleRemoveAlertEmail = (alertType: string, email: string) => {
    setEmailAlerts(prev => ({
      ...prev,
      [alertType]: {
        ...prev[alertType as keyof typeof emailAlerts],
        recipients: prev[alertType as keyof typeof emailAlerts].recipients.filter((e: string) => e !== email)
      }
    }))
    toast.success(`Email removed from ${alertType.replace(/([A-Z])/g, ' $1').toLowerCase()} successfully`)
  }

  const handleAddAlertPhone = (alertType: string) => {
    const phone = alertPhoneInputs[alertType as keyof typeof alertPhoneInputs].trim()
    if (phone && !smsAlerts[alertType as keyof typeof smsAlerts].recipients.includes(phone)) {
      setSmsAlerts(prev => ({
        ...prev,
        [alertType]: {
          ...prev[alertType as keyof typeof smsAlerts],
          recipients: [...prev[alertType as keyof typeof smsAlerts].recipients, phone]
        }
      }))
      setAlertPhoneInputs(prev => ({ ...prev, [alertType]: '' }))
      toast.success(`Phone number added to ${alertType.replace(/([A-Z])/g, ' $1').toLowerCase()} successfully`)
    } else if (smsAlerts[alertType as keyof typeof smsAlerts].recipients.includes(phone)) {
      toast.error('Phone number already exists for this alert type')
    }
  }

  const handleRemoveAlertPhone = (alertType: string, phone: string) => {
    setSmsAlerts(prev => ({
      ...prev,
      [alertType]: {
        ...prev[alertType as keyof typeof smsAlerts],
        recipients: prev[alertType as keyof typeof smsAlerts].recipients.filter((p: string) => p !== phone)
      }
    }))
    toast.success(`Phone number removed from ${alertType.replace(/([A-Z])/g, ' $1').toLowerCase()} successfully`)
  }

  const handleAlertEmailKeyPress = (alertType: string, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddAlertEmail(alertType)
    }
  }

  const handleAlertPhoneKeyPress = (alertType: string, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddAlertPhone(alertType)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'expired': return 'bg-red-100 text-red-800 border-red-200'
      case 'trial': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'revoked': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <SidebarNavigation />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">General Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account security, API access, notifications, and subscription</p>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="security" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="api-keys" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                API Keys
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="integration" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Integration
              </TabsTrigger>
              <TabsTrigger value="subscription" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Subscription
              </TabsTrigger>
            </TabsList>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <div className="grid gap-6">
                {/* Password Change */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Change Password
                    </CardTitle>
                    <CardDescription>
                      Update your account password to maintain security
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Last changed</p>
                          <p className="text-sm text-gray-500">3 months ago</p>
                        </div>
                        <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                          <DialogTrigger asChild>
                            <Button className="cursor-pointer">Change Password</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Change Password</DialogTitle>
                              <DialogDescription>
                                Enter your current password and choose a new one
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input
                                  id="currentPassword"
                                  type="password"
                                  value={currentPassword}
                                  onChange={(e) => setCurrentPassword(e.target.value)}
                                  placeholder="Enter current password"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <div className="relative">
                                  <Input
                                    id="newPassword"
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input
                                  id="confirmPassword"
                                  type="password"
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  placeholder="Confirm new password"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setPasswordDialogOpen(false)} className="cursor-pointer">
                                Cancel
                              </Button>
                              <Button onClick={handleChangePassword} className="cursor-pointer">
                                Update Password
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
 
                {/* Login Devices */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5" />
                      Manage Login Devices
                    </CardTitle>
                    <CardDescription>
                      Control active sessions and device access
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">Single Session Mode</p>
                          <p className="text-sm text-gray-500">
                            Limit to 1 active session per user
                          </p>
                        </div>
                        <Switch
                          checked={singleSessionEnabled}
                          onCheckedChange={setSingleSessionEnabled}
                          className="cursor-pointer"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-medium">Active Sessions</h4>
                        {devices.map(device => (
                          <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-100 rounded-lg">
                                <Monitor className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium">{device.name}</p>
                                <p className="text-sm text-gray-500">{device.type} • Last active: {device.lastActive}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {device.currentSession && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  Current Session
                                </Badge>
                              )}
                              <Button variant="outline" size="sm" className="cursor-pointer">
                                Sign Out
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* API Keys Tab */}
            <TabsContent value="api-keys" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API Keys Management
                  </CardTitle>
                  <CardDescription>
                    Generate and manage API keys for programmatic access
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Generate New API Key */}
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                    <div>
                      <h4 className="font-medium">Generate New API Key</h4>
                      <p className="text-sm text-gray-500">Create a new API key for your applications</p>
                    </div>
                    <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="cursor-pointer bg-primary hover:bg-primary/90">
                          <Plus className="h-4 w-4 mr-2" />
                          Generate Key
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Generate New API Key</DialogTitle>
                          <DialogDescription>
                            Create a new API key for programmatic access to your account
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="keyName">Key Name</Label>
                            <Input
                              id="keyName"
                              value={newKeyName}
                              onChange={(e) => setNewKeyName(e.target.value)}
                              placeholder="Enter a name for this API key"
                            />
                          </div>
                          {generatedKey && (
                            <div className="space-y-2">
                              <Label>Generated API Key</Label>
                              <div className="flex gap-2">
                                <Input value={generatedKey} readOnly className="font-mono text-sm" />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCopyApiKey(generatedKey)}
                                  className="cursor-pointer"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                                ⚠️ Save this key securely. It won't be shown again.
                              </p>
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setApiKeyDialogOpen(false)} className="cursor-pointer">
                            Cancel
                          </Button>
                          <Button onClick={handleGenerateApiKey} className="cursor-pointer">
                            Generate Key
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Existing API Keys */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Existing API Keys</h4>
                    <div className="space-y-3">
                      {apiKeys.map(apiKey => (
                        <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium">{apiKey.name}</h5>
                              <Badge className={getStatusBadgeColor(apiKey.status)}>
                                {apiKey.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>Created: {apiKey.createdAt}</span>
                              <span>Last used: {apiKey.lastUsed}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopyApiKey(apiKey.key)}
                              className="cursor-pointer"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            {apiKey.status === 'active' && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 cursor-pointer">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to revoke the API key "{apiKey.name}"? 
                                      This action cannot be undone and will immediately invalidate the key.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleRevokeApiKey(apiKey.id)}
                                      className="bg-red-600 hover:bg-red-700 cursor-pointer"
                                    >
                                      Revoke Key
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <div className="grid gap-6">
                {/* Email Alerts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Email Alerts
                    </CardTitle>
                    <CardDescription>
                      Configure email notifications for different events
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Enhanced Email Recipients */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <Label className="text-base font-semibold">Email Notification Recipients</Label>
                      </div>
                      
                      {/* Email Input with Add Button */}
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Input
                            id="emailInput"
                            type="email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            onKeyPress={handleEmailKeyPress}
                            placeholder="Enter email address..."
                            className="w-full"
                          />
                        </div>
                        <Button 
                          onClick={handleAddEmail}
                          size="sm"
                          className="cursor-pointer bg-primary hover:bg-primary/90"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Email Badges Display */}
                      {taggedEmails.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {taggedEmails.map((email, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                              <AtSign className="h-3 w-3" />
                              {email}
                              <button
                                onClick={() => handleRemoveEmail(email)}
                                className="ml-1 hover:text-red-600 transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-sm text-gray-500">
                        These recipients will receive notifications for all enabled email alerts below
                      </p>
                    </div>
                    
                    {/* Enhanced Email Alert Types with Individual Recipients */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Bell className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Email Alert Types with Individual Recipients</span>
                      </div>
                      
                      {Object.entries(emailAlerts).map(([key, value]) => {
                        const alertConfig = {
                          systemUpdates: {
                            icon: <RefreshCw className="h-4 w-4" />,
                            title: "System Updates",
                            description: "Get notified about system maintenance, updates, and changes"
                          },
                          billingNotifications: {
                            icon: <CreditCard className="h-4 w-4" />,
                            title: "Billing Notifications",
                            description: "Invoices, payment confirmations, and billing alerts"
                          },
                          weeklyReports: {
                            icon: <BarChart3 className="h-4 w-4" />,
                            title: "Weekly Reports",
                            description: "Comprehensive weekly performance and activity reports"
                          }
                        }
                        
                        const config = alertConfig[key as keyof typeof alertConfig]
                        
                        return (
                          <div key={key} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors space-y-3">
                            {/* Alert Header with Toggle */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="text-blue-600">
                                  {config.icon}
                                </div>
                                <div>
                                  <p className="font-medium">{config.title}</p>
                                  <p className="text-sm text-gray-500">{config.description}</p>
                                </div>
                              </div>
                              <Switch
                                checked={value.enabled}
                                onCheckedChange={(checked) => handleNotificationChange('email', key, checked)}
                                className="cursor-pointer"
                              />
                            </div>
                            
                            {/* Individual Email Recipients for this Alert Type */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3 text-blue-500" />
                                <span className="text-sm font-medium">Specific Recipients</span>
                              </div>
                              
                              {/* Email Input for this Alert Type */}
                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <Input
                                    id={`emailInput-${key}`}
                                    type="email"
                                    value={alertEmailInputs[key as keyof typeof alertEmailInputs]}
                                    onChange={(e) => handleAlertEmailInputChange(key, e.target.value)}
                                    onKeyPress={(e) => handleAlertEmailKeyPress(key, e)}
                                    placeholder="Add email address..."
                                    className="w-full h-8 text-sm"
                                  />
                                </div>
                                <Button 
                                  onClick={() => handleAddAlertEmail(key)}
                                  size="sm"
                                  className="cursor-pointer bg-primary hover:bg-primary/90 h-8 px-2"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              
                              {/* Email Badges for this Alert Type */}
                              {value.recipients && value.recipients.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {value.recipients.map((email: string, index: number) => (
                                    <Badge key={index} variant="outline" className="flex items-center gap-1 px-2 py-0 text-xs">
                                      <AtSign className="h-2 w-2" />
                                      {email}
                                      <button
                                        onClick={() => handleRemoveAlertEmail(key, email)}
                                        className="ml-1 hover:text-red-600 transition-colors"
                                      >
                                        <X className="h-2 w-2" />
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              
                              {value.recipients && value.recipients.length === 0 && (
                                <p className="text-xs text-gray-400">No specific recipients set. Will use default recipients.</p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
 
 
              </div>
            </TabsContent>

            {/* Integration Tab */}
            <TabsContent value="integration" className="space-y-6">
              <div className="grid gap-6">
                {/* Genesys Cloud Integration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cloud className="h-5 w-5" />
                      Genesys Cloud Integration
                    </CardTitle>
                    <CardDescription>
                      Configure your Genesys Cloud connection settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Integration Status */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Integration Status</p>
                        <p className="text-sm text-gray-500">
                          {genesysIntegration.enabled ? 'Enabled' : 'Disabled'} - Genesys Cloud integration is currently {genesysIntegration.enabled ? 'active' : 'inactive'}
                        </p>
                      </div>
                      <Switch
                        checked={genesysIntegration.enabled}
                        onCheckedChange={(checked) => setGenesysIntegration(prev => ({ ...prev, enabled: checked }))}
                        className="cursor-pointer"
                      />
                    </div>

                    {/* Environment Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="environment">Genesys Cloud Environment</Label>
                      <Select value={genesysIntegration.environment} onValueChange={(value) => setGenesysIntegration(prev => ({ ...prev, environment: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select environment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mypurecloud.com">mypurecloud.com</SelectItem>
                          <SelectItem value="mypurecloud.ie">mypurecloud.ie</SelectItem>
                          <SelectItem value="mypurecloud.de">mypurecloud.de</SelectItem>
                          <SelectItem value="mypurecloud.jp">mypurecloud.jp</SelectItem>
                          <SelectItem value="mypurecloud.com.au">mypurecloud.com.au</SelectItem>
                          <SelectItem value="mec1.pure.cloud">mec1.pure.cloud</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Client ID */}
                    <div className="space-y-2">
                      <Label htmlFor="clientId">Client ID</Label>
                      <div className="flex gap-2">
                        <Input
                          id="clientId"
                          value={genesysIntegration.clientId}
                          onChange={(e) => setGenesysIntegration(prev => ({ ...prev, clientId: e.target.value }))}
                          placeholder="Enter your Genesys Cloud Client ID"
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(genesysIntegration.clientId)
                            toast.success('Client ID copied to clipboard')
                          }}
                          className="cursor-pointer"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Client Secret */}
                    <div className="space-y-2">
                      <Label htmlFor="clientSecret">Client Secret</Label>
                      <div className="flex gap-2">
                        <Input
                          id="clientSecret"
                          type="password"
                          value={'*'.repeat(genesysIntegration.clientSecret.length - 5) + genesysIntegration.clientSecret.slice(-5)}
                          onChange={(e) => setGenesysIntegration(prev => ({ ...prev, clientSecret: e.target.value }))}
                          placeholder="Enter your Genesys Cloud Client Secret"
                          className="flex-1"
                          readOnly
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        Client secret is hidden for security. Last 5 characters shown for verification.
                      </p>
                    </div>

                    {/* Save and Test Buttons */}
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          toast.success('Testing Genesys Cloud integration...')
                          // Simulate test
                          setTimeout(() => {
                            toast.success('Genesys Cloud integration test successful!')
                          }, 2000)
                        }}
                        className="cursor-pointer"
                      >
                        Test Integration
                      </Button>
                      <Button
                        onClick={() => {
                          toast.success('Genesys Cloud integration settings saved successfully')
                        }}
                        className="cursor-pointer"
                      >
                        Save Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Subscription Tab */}
            <TabsContent value="subscription" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Subscription Management
                  </CardTitle>
                  <CardDescription>
                    Manage your license key and subscription details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current License */}
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Current License</h4>
                      <Badge className={getStatusBadgeColor(license.status)}>
                        {license.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">License Key</p>
                        <p className="font-mono text-sm">{license.key}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">License Type</p>
                        <p className="font-medium">{license.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Activated On</p>
                        <p className="font-medium">{license.activatedAt}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Expires On</p>
                        <p className="font-medium">{license.expiresAt}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">Included Features</p>
                      <div className="flex flex-wrap gap-2">
                        {license.features.map(feature => (
                          <Badge key={feature} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Activate New License */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Activate New License</h4>
                      <p className="text-sm text-gray-500">Enter a new license key to upgrade your subscription</p>
                    </div>
                    <Dialog open={licenseDialogOpen} onOpenChange={setLicenseDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="cursor-pointer bg-primary hover:bg-primary/90">
                          <Plus className="h-4 w-4 mr-2" />
                          Activate License
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Activate New License</DialogTitle>
                          <DialogDescription>
                            Enter your license key to activate a new subscription
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="licenseKey">License Key</Label>
                            <Input
                              id="licenseKey"
                              value={newLicenseKey}
                              onChange={(e) => setNewLicenseKey(e.target.value)}
                              placeholder="Enter your license key"
                              className="font-mono"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setLicenseDialogOpen(false)} className="cursor-pointer">
                            Cancel
                          </Button>
                          <Button onClick={handleActivateLicense} className="cursor-pointer">
                            Activate License
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* License History */}
                  <div className="space-y-4">
                    <h4 className="font-medium">License History</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Professional License Activated</p>
                            <p className="text-sm text-gray-500">Activated on {license.activatedAt}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusBadgeColor(license.status)}>
                            {license.status}
                          </Badge>
                          <Button variant="outline" size="sm" className="cursor-pointer">
                            <Download className="h-4 w-4 mr-2" />
                            Invoice
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}