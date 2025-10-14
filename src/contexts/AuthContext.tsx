'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'manager' | 'supervisor' | 'agent'
  department: string
  status: 'active' | 'inactive' | 'suspended'
  company: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.user) {
            setUser(data.user)
          }
        }
      } catch (error) {
        console.error('Auth status check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setUser(data.user)
        return true
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      console.log('AuthContext: Starting logout process');
      
      // Clear client-side storage
      if (typeof window !== 'undefined') {
        // Clear cookies
        document.cookie.split(';').forEach(cookie => {
          const [name] = cookie.trim().split('=');
          if (name && (name.includes('auth') || name.includes('token'))) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          }
        });
        
        // Clear localStorage
        localStorage.removeItem('userToken');
        localStorage.removeItem('authData');
        sessionStorage.clear();
        
        console.log('AuthContext: Cleared client-side storage');
      }
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      console.log('AuthContext: Logout API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('AuthContext: Logout API response:', data);
      } else {
        console.error('AuthContext: Logout API returned non-OK status:', response.status);
      }
    } catch (error) {
      console.error('AuthContext: Logout failed:', error)
    } finally {
      console.log('AuthContext: Clearing user state and redirecting');
      setUser(null)
      
      // Ensure redirect happens after state is cleared
      setTimeout(() => {
        router.push('/login')
      }, 100)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}