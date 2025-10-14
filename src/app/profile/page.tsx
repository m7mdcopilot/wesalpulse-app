"use client"

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { User, Lock, Mail, Phone, Building, Calendar, CheckCircle, AlertCircle, Eye, EyeOff, Shield, Users, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

function ProfileContent() {
  const searchParams = useSearchParams()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'security') {
      setActiveTab('security')
    } else {
      setActiveTab('profile')
    }
  }, [searchParams])
  // Use actual user data from AuthContext or fallback to mock data
  const [userData, setUserData] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : 'John Doe',
    email: user ? user.email : 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    department: user ? user.department : 'Customer Service',
    joinDate: '2023-01-15',
    role: user ? user.role : 'Agent',
    allowedDivisions: ['Sales', 'Support', 'Billing']
  })

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match')
      return
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long')
      return
    }

    if (currentPassword === newPassword) {
      setPasswordError('New password must be different from current password')
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate password change success
      setPasswordSuccess('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      setPasswordError('Failed to change password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-orange-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-100 rounded-full opacity-10 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 flex">
        {/* Sidenav */}
        <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200 min-h-screen p-6">
          <div className="space-y-6">
            {/* Logo */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute top-16 left-1 w-3 h-3 bg-[#f9b11f] rounded-full animate-ping z-5" style={{ top: '35px', left: '0.15rem' }}></div>
                  <img src="/images/brand/WesalPulse.png" alt="WesalPulse" className="h-12 w-auto" />
                </div>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              <Link 
                href="/" 
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="text-sm">Dashboard</span>
              </Link>
              
              <div className="space-y-1">
                <Link 
                  href="/profile?tab=profile" 
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 cursor-pointer ${activeTab === 'profile' ? 'bg-[#00234B] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm">Profile Information</span>
                </Link>
                <Link 
                  href="/profile?tab=security" 
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 cursor-pointer ${activeTab === 'security' ? 'bg-[#00234B] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <Lock className="h-4 w-4" />
                  <span className="text-sm">Security</span>
                </Link>
              </div>
            </nav>

            {/* User Info */}
            <div className="absolute bottom-6 left-6 right-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full p-3 h-auto bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 justify-start cursor-pointer"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 bg-[#00234B] rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium text-gray-900 truncate">{userData.name}</p>
                        <p className="text-xs text-gray-500 truncate">{userData.role}</p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem 
                    onClick={async () => {
                      try {
                        await logout()
                      } catch (error) {
                        console.error('Logout error:', error)
                      }
                    }}
                    className="cursor-pointer text-red-600 hover:text-red-600 hover:bg-red-100 focus:text-red-600 focus:bg-red-100"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600 mt-2">Manage your account information and security settings</p>
            </div>

            <Tabs value={activeTab} className="w-full">
              {/* Profile Information Tab */}
              <TabsContent value="profile">
                <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/90">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>
                      View your personal details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{userData.name}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Email Address</Label>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{userData.email}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{userData.phone}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Department</Label>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{userData.department}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Role</Label>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{userData.role}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Join Date</Label>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{new Date(userData.joinDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/90">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Change Password
                    </CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      {passwordError && (
                        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-red-600">{passwordError}</span>
                        </div>
                      )}

                      {passwordSuccess && (
                        <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600">{passwordSuccess}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password" className="text-sm font-medium text-gray-700">
                            Current Password
                          </Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                            <Input
                              id="current-password"
                              type={showCurrentPassword ? "text" : "password"}
                              placeholder="Current"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className="pl-10 pr-10 h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="new-password" className="text-sm font-medium text-gray-700">
                            New Password
                          </Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                            <Input
                              id="new-password"
                              type={showNewPassword ? "text" : "password"}
                              placeholder="New"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="pl-10 pr-10 h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                            Confirm New
                          </Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                            <Input
                              id="confirm-password"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="pl-10 pr-10 h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-start">
                        <Button
                          type="submit"
                          className="h-9 px-4 bg-[#00234B] hover:bg-[#001a3a] text-white font-medium transition-all duration-200 cursor-pointer text-sm"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              <span>Updating...</span>
                            </div>
                          ) : (
                            <span>Change Password</span>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00234B] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading profile...</p>
      </div>
    </div>}>
      <ProfileContent />
    </Suspense>
  )
}