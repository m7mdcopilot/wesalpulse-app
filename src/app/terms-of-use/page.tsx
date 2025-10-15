"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText, Users, Shield, Globe, Heart } from 'lucide-react'
import Link from 'next/link'

export default function TermsOfUsePage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Use</h1>
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
                <FileText className="h-5 w-5 text-[#00234B]" />
                <span>Acceptance of Terms</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                By accessing and using WesalPulse, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="text-gray-700">
                These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity 
                ("you"), and WesalCX ("we," "us," or "our"), concerning your access to and use of the wesalpulse.com website as well 
                as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected 
                thereto (collectively, the "Site").
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg backdrop-blur-sm bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Users className="h-5 w-5 text-[#00234B]" />
                <span>User Accounts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                When you create an account with us, you must provide us with accurate, complete, and current information at all times. 
                Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
              </p>
              <p className="text-gray-700">
                You are responsible for safeguarding the password that you use to access the Service and for any activities or actions 
                under your password, whether your password is with our Service or a third-party service.
              </p>
              <p className="text-gray-700">
                You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any 
                breach of security or unauthorized use of your account.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg backdrop-blur-sm bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Shield className="h-5 w-5 text-[#00234B]" />
                <span>Intellectual Property Rights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Unless otherwise indicated, the Service is our proprietary property and all source code, databases, functionality, 
                software, website designs, audio, graphics, text, photographs, and videos on the Service (collectively, the "Content") 
                and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us.
              </p>
              <p className="text-gray-700">
                The Content and the Marks are protected by copyright and trademark laws and various other intellectual property rights 
                and unfair competition laws of the United States, foreign jurisdictions, and international conventions.
              </p>
              <p className="text-gray-700">
                You may not copy, modify, distribute, sell, or lease any Content or Marks without our express written permission.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg backdrop-blur-sm bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Globe className="h-5 w-5 text-[#00234B]" />
                <span>User-Generated Content</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, 
                videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, 
                including its legality, reliability, and appropriateness.
              </p>
              <p className="text-gray-700">
                By posting Content on the Service, you grant us the right and license to use, modify, publicly perform, publicly display, 
                reproduce, and distribute such Content on and through the Service.
              </p>
              <p className="text-gray-700">
                You represent and warrant that: (i) you own or have the necessary licenses, rights, consents, and permissions to use and 
                to authorize us to use the Content you provide; and (ii) the posting of your Content does not violate the privacy rights, 
                publicity rights, copyrights, contract rights or any other rights of any person.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg backdrop-blur-sm bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Heart className="h-5 w-5 text-[#00234B]" />
                <span>Prohibited Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                You may not access or use the Service for any purpose other than that for which we make the Service available. 
                The Service may not be used in connection with any commercial endeavors except those that are specifically endorsed 
                or approved by us.
              </p>
              <p className="text-gray-700">
                As a user of the Service, you agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Systematically retrieve data or other content from the Service to create or compile, directly or indirectly, 
                    a collection, compilation, database, or directory without written permission from us.</li>
                <li>Make any unauthorized use of the Service, including collecting usernames and/or email addresses of users 
                    by electronic or other means for the purpose of sending unsolicited email.</li>
                <li>Use the Service to advertise or offer to sell goods and services not authorized by us.</li>
                <li>Engage in any automated use of the system, such as using scripts to send comments or messages, or using any 
                    data mining, robots, or similar data gathering and extraction tools.</li>
                <li>Interfere with, disrupt, or create an undue burden on the Service or the networks or services connected to the Service.</li>
                <li>Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Service to you.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg backdrop-blur-sm bg-white/90">
            <CardContent className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Limitation of Liability</h3>
              <p className="text-gray-700">
                In no event shall WesalCX, our directors, employees, partners, agents, suppliers, or affiliates be liable for any injury, 
                loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, including, 
                without limitation, lost profits, lost revenue, loss of data, replacement costs, or any similar damages.
              </p>
              <p className="text-gray-700">
                Notwithstanding anything to the contrary contained herein, our liability to you for any cause whatsoever and regardless 
                of the form of the action, will at all times be limited to the amount paid, if any, by you to us during the six (6) 
                month period prior to any cause of action arising.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg backdrop-blur-sm bg-white/90">
            <CardContent className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact Us</h3>
              <p className="text-gray-700">
                If you have any questions about these Terms of Use, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">
                  <strong>Email:</strong> legal@wesalpulse.com<br />
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