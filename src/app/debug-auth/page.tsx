"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'

export default function DebugAuthPage() {
  const { user, logout } = useAuth()
  const [cookies, setCookies] = useState<string[]>([])
  const [localStorageItems, setLocalStorageItems] = useState<string[]>([])

  const refreshDebugInfo = () => {
    if (typeof window !== 'undefined') {
      // Get all cookies
      const cookieList = document.cookie.split(';').map(cookie => cookie.trim())
      setCookies(cookieList)

      // Get all localStorage items
      const storageItems = Object.keys(localStorage)
      setLocalStorageItems(storageItems)
    }
  }

  useEffect(() => {
    refreshDebugInfo()
  }, [])

  const handleLogout = async () => {
    await logout()
    setTimeout(refreshDebugInfo, 1000) // Refresh after logout
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Authentication Debug</h1>
          <p className="text-gray-600 mt-2">Debug authentication status and cookies</p>
        </div>

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Current authenticated user data</CardDescription>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-2">
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Department:</strong> {user.department}</p>
                <p><strong>Status:</strong> {user.status}</p>
                <p><strong>Company:</strong> {user.company}</p>
              </div>
            ) : (
              <p className="text-red-600">No user authenticated</p>
            )}
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card>
          <CardHeader>
            <CardTitle>Cookies</CardTitle>
            <CardDescription>All current cookies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button onClick={refreshDebugInfo} variant="outline" className="mb-4">
                Refresh Cookie Info
              </Button>
              {cookies.length > 0 ? (
                <div className="space-y-1">
                  {cookies.map((cookie, index) => (
                    <div key={index} className="p-2 bg-gray-100 rounded text-sm font-mono">
                      {cookie}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No cookies found</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Local Storage */}
        <Card>
          <CardHeader>
            <CardTitle>Local Storage</CardTitle>
            <CardDescription>All localStorage items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {localStorageItems.length > 0 ? (
                <div className="space-y-1">
                  {localStorageItems.map((item, index) => (
                    <div key={index} className="p-2 bg-gray-100 rounded text-sm">
                      <strong>{item}:</strong> {localStorage.getItem(item)}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No localStorage items found</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Test authentication functionality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={handleLogout} 
                variant="destructive"
                disabled={!user}
              >
                Logout
              </Button>
              <Button 
                onClick={refreshDebugInfo} 
                variant="outline"
              >
                Refresh Debug Info
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}