"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import Link from 'next/link'

// Use dynamic export to prevent static generation issues
export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isGenesysDialogOpen, setIsGenesysDialogOpen] = useState(false)
  const [genesysRegion, setGenesysRegion] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isGenesysLoginLoading, setIsGenesysLoginLoading] = useState(false)
  const [isValidatingOrg, setIsValidatingOrg] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Redirect to dashboard
        router.push('/')
      } else {
        setError(data.message || 'Invalid email or password')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenesysLogin = () => {
    setIsGenesysDialogOpen(true)
  }

  const handleGenesysDialogLogin = async () => {
    if (!genesysRegion || !organizationName) {
      setError('Please fill in all required fields')
      return
    }

    setIsValidatingOrg(true)
    setError('')
    
    try {
      // Map region to correct Genesys domain
      const regionDomains: Record<string, string> = {
        'eu-west-1': 'apps.mypurecloud.ie',
        'eu-central-1': 'apps.mypurecloud.de',
        'me-south-1': 'mec1.pure.cloud'
      }
      
      const domain = regionDomains[genesysRegion] || 'apps.mypurecloud.com'
      const validationUrl = `https://${domain}/v1/organizations/${organizationName}`
      
      const response = await fetch(validationUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Note: This is a client-side request and may be blocked by CORS
        // In a real implementation, this should be done through a backend API
      })
      
      if (response.ok) {
        // Organization is valid, proceed with login
        setIsValidatingOrg(false)
        setIsGenesysLoginLoading(true)
        
        // Simulate API call for Genesys login
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // For demo purposes, accept any valid region and organization name
        if (genesysRegion && organizationName) {
          // Redirect to dashboard
          router.push('/dashboard')
        } else {
          setError('Invalid Genesys credentials')
        }
      } else {
        // Organization is not valid
        setError('Invalid organization name or region. Please check your details.')
        setIsValidatingOrg(false)
      }
    } catch (err) {
      // Handle network errors or CORS issues
      setError('Unable to validate organization. Please check your network connection or contact support.')
      setIsValidatingOrg(false)
    } finally {
      setIsGenesysLoginLoading(false)
      if (!isValidatingOrg) {
        setIsGenesysDialogOpen(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-orange-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-100 rounded-full opacity-10 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute top-16 left-1 w-3 h-3 bg-[#f9b11f] rounded-full animate-ping z-5" style={{ top: '48px', left: '0.27rem' }}></div>
              <img src="/images/brand/WesalPulse.png" alt="WesalPulse" className="h-16 w-auto" />
            </div>
          </div>
          <p className="text-gray-600">Sign in to your WesalPulse account</p>
        </div>

        <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/90">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-gray-900">Sign In</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">{error}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-[#00234b] hover:text-[#f9b11f] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-[#00234B] hover:bg-[#001a3a] text-white font-medium transition-all duration-200 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </CardContent>
          </form>

          <div className="px-6">
            <Separator className="my-4" />
          </div>

          <CardFooter className="space-y-4">
            <Dialog open={isGenesysDialogOpen} onOpenChange={setIsGenesysDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 border-gray-300 hover:border-gray-400 hover:bg-gray-50 font-medium transition-all duration-200 cursor-pointer"
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-3">
                    <img src="/images/brand/genesys-logo.svg" alt="Genesys" className="w-5 h-5" />
                    <span>Login with Genesys</span>
                  </div>
                </Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader >
                  <DialogTitle>
                    <div className="flex items-center justify-center space-x-2 mt-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                      <img src="/images/brand/genesys-logo.svg" alt="Genesys" className="w-5 h-5 mr-1" />
                      <span className="text-lg text-center font-medium">Login with Genesys Account</span>
                    </div>
                  </DialogTitle>
                  <DialogDescription>
                    <div className="mt-2">
                      Enter your Genesys Cloud environment details.
                    </div>
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="genesys-region" className="text-left">
                      Genesys Cloud Environment:
                    </Label>
                    <div>
                      <Select value={genesysRegion} onValueChange={setGenesysRegion}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eu-west-1">apps.mypurecloud.ie (Ireland)</SelectItem>
                          <SelectItem value="eu-central-1">apps.mypurecloud.de (Frankfurt)</SelectItem>
                          <SelectItem value="me-south-1">mec1.pure.cloud (UAE)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="organization-name" className="text-left">
                      Organization Name:
                    </Label>
                    <div>
                      <Input
                        id="organization-name"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        placeholder="Enter organization name"
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="remember-me" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    onClick={handleGenesysDialogLogin}
                    disabled={isGenesysLoginLoading || isValidatingOrg || !genesysRegion || !organizationName}
                    className="w-full cursor-pointer"
                  >
                    {isValidatingOrg ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Validating organization...</span>
                      </div>
                    ) : isGenesysLoginLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Logging in...</span>
                      </div>
                    ) : (
                      <span>Login</span>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 space-y-4">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <Link
                href="/privacy-policy"
                className="text-xs text-[#00234b] hover:text-[#f9b11f] hover:underline transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <span className="text-xs text-gray-400">•</span>
              <Link
                href="/terms-of-use"
                className="text-xs text-[#00234b] hover:text-[#f9b11f] hover:underline transition-colors duration-200"
              >
                Terms of Use
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <span>Powered by</span>
            <img src="/images/brand/wesal-cx.svg" alt="WesalCX" className="h-4 w-auto" />
            <Link href="https://www.wesalcx.com" target="_blank" rel="noopener noreferrer" className="text-[#00234b] hover:text-[#f9b11f] hover:underline transition-colors duration-200">
              WesalCX
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}