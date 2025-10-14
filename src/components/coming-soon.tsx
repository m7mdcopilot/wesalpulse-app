'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock } from 'lucide-react'
import { DashboardLayoutSimple } from '@/components/dashboard-layout-simple'

export default function ComingSoon() {
  return (
    <DashboardLayoutSimple>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Coming Soon</CardTitle>
            <CardDescription className="text-muted-foreground">
              This feature is currently under development and will be available soon.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-t my-4" />
            
            <div className="text-center text-sm text-muted-foreground">
              We're working hard to bring you this exciting new feature!
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayoutSimple>
  )
}