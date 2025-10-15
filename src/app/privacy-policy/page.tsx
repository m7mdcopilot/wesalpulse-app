"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Shield, Lock, Eye, Database, Globe } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-12 px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-orange-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute top-16 left-1 w-3 h-3 bg-[#f9b11f] rounded-full animate-ping z-5" style={{ top: '48px', left: '0.27rem' }}></div>
              <img src="/images/brand/WesalPulse.png" alt="WesalPulse" className="h-16 w-auto" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <Link
            href="/login"
            className="inline-flex items-center text-[#00234b] hover:text-[#f9b11f] hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Login
          </Link>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg backdrop-blur-sm bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Shield className="h-5 w-5 text-[#00234B]" />
                <span>Information We Collect</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                At WesalPulse, we collect information to provide and improve our services. This includes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Personal identification information (Name, email address, phone number)</li>
                <li>Authentication credentials (username, password, authentication tokens)</li>
                <li>Usage data and analytics (pages visited, time spent, features used)</li>
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg backdrop-blur-sm bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Lock className="h-5 w-5 text-[#00234B]" />
                <span>How We Use Your Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We use the collected information for various purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>To provide and maintain our service</li>
                <li>To authenticate users and secure access</li>
                <li>To send notifications and updates</li>
                <li>To monitor and analyze usage patterns</li>
                <li>To detect, prevent, and address technical issues</li>
                <li>To comply with legal obligations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg backdrop-blur-sm bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Eye className="h-5 w-5 text-[#00234B]" />
                <span>Data Sharing and Disclosure</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We may share your information with third parties in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>With Genesys Cloud services for authentication and data integration</li>
                <li>With service providers who perform services on our behalf</li>
                <li>For legal compliance, protection, and safety</li>
                <li>With your explicit consent</li>
                <li>In connection with a business transfer or merger</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg backdrop-blur-sm bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Database className="h-5 w-5 text-[#00234B]" />
                <span>Data Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We implement appropriate security measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Secure authentication mechanisms</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authorization protocols</li>
                <li>Employee training on data protection</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg backdrop-blur-sm bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Globe className="h-5 w-5 text-[#00234B]" />
                <span>Your Rights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Right to access your personal information</li>
                <li>Right to correct inaccurate information</li>
                <li>Right to delete your personal information</li>
                <li>Right to restrict or object to processing</li>
                <li>Right to data portability</li>
                <li>Right to withdraw consent</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg backdrop-blur-sm bg-white/90">
            <CardContent className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact Us</h3>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">
                  <strong>Email:</strong> privacy@wesalpulse.com<br />
                  <strong>Phone:</strong> +1 (555) 123-4567<br />
                  <strong>Address:</strong> 123 Business Ave, Suite 100, City, State 12345
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
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