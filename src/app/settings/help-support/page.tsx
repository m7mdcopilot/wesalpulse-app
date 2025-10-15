'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Bell, Check, Mail } from 'lucide-react'
import { DashboardLayoutSimple } from '@/components/dashboard-layout-simple'

export default function SettingsHelpSupport() {
  return (
    <DashboardLayoutSimple>
      <div className="space-y-6">
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold mb-4">Help & Support</h1>
          <p className="text-muted-foreground">Here you'll find guidance, best practices, and answers to common questions. Our goal is to help you resolve issues quickly and stay up to date with the latest improvements</p>
        </div>

        {/* Contact for Support */}
        <Card className="bg-card text-card-foreground rounded-xl border shadow-sm py-2">
          <CardHeader>
            <CardTitle className="text-lg">Need Further Assistance?</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-muted-foreground mb-4">Our support team is ready to help you with any questions or issues.</p>
            
            {/* Contact Options */}
            <div className="space-y-3">
              {/* Email Support */}
              <Card className="bg-muted/30 border-muted py-2">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Email Support</p>
                      <p className="text-sm text-muted-foreground">support@wesalcx.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        
        {/* Recommendation */}
        <Card className="bg-card text-card-foreground rounded-xl border shadow-sm py-2">
          <CardHeader>
            <CardTitle className="text-lg">Recommendation</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Card className="bg-blue-50 border-blue-200 py-2">
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    <strong>Investigate why most calls are being abandoned despite minimal waiting times</strong> — possible causes include agent availability, system routing, or caller impatience.
                  </p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Latest Updates */}
        <Card className="bg-card text-card-foreground rounded-xl border shadow-sm py-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Latest Updates
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Card className="bg-muted/30 border-muted py-2">
              <CardContent className="p-3">
                <div className="space-y-4">
                  {/* Update Section 1 */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">Dashboard Development Updates</p>
                      <span className="text-sm text-muted-foreground">Aug 21, 2025</span>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-3 w-3 text-green-600" />
                        <span>Added welcome landing page with org greeting</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-3 w-3 text-green-600" />
                        <span>Integrated total interactions today & active agents KPIs</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-3 w-3 text-green-600" />
                        <span>New footer section with latest updates list</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-3 w-3 text-green-600" />
                        <span>Improved lightweight design (no heavy charts)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-3 w-3 text-green-600" />
                        <span>Quick actions for calls, tickets, and customer directory</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="text-yellow-600">⏳</span>
                        <span>Upcoming: user role–based dashboard personalization</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="text-yellow-600">⏳</span>
                        <span>Upcoming: dark mode support</span>
                      </div>
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="border-t border-muted-foreground/20"></div>

                  {/* Update Section 2 */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">System Infrastructure Updates</p>
                      <span className="text-sm text-muted-foreground">May 10, 2025</span>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-3 w-3 text-green-600" />
                        <span>Core database architecture implementation</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-3 w-3 text-green-600" />
                        <span>User authentication system setup</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-3 w-3 text-green-600" />
                        <span>Initial UI framework integration</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-3 w-3 text-green-600" />
                        <span>Basic navigation structure</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-3 w-3 text-green-600" />
                        <span>Security protocols and encryption</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </DashboardLayoutSimple>
  )
}