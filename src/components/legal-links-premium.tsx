"use client"

import { useState } from 'react'
import Link from 'next/link'

interface LegalLinksPremiumProps {
  className?: string
  theme?: 'light' | 'dark'
  animation?: 'subtle' | 'bounce' | 'slide'
}

export default function LegalLinksPremium({ 
  className = "", 
  theme = 'light',
  animation = 'subtle'
}: LegalLinksPremiumProps) {
  const [activeLink, setActiveLink] = useState<string | null>(null)

  const themeClasses = {
    light: {
      container: "bg-white/70 backdrop-blur-md border-gray-200 shadow-lg",
      text: "text-gray-600 hover:text-blue-600",
      divider: "bg-gray-300"
    },
    dark: {
      container: "bg-gray-800/70 backdrop-blur-md border-gray-600 shadow-lg",
      text: "text-gray-300 hover:text-blue-400",
      divider: "bg-gray-600"
    }
  }

  const animationClasses = {
    subtle: "transition-all duration-300 ease-in-out",
    bounce: "transition-all duration-300 ease-in-out hover:scale-105",
    slide: "transition-all duration-300 ease-in-out hover:translate-x-1"
  }

  const links = [
    {
      href: "/privacy-policy",
      text: "Privacy Policy",
      icon: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
      )
    },
    {
      href: "/terms-of-use",
      text: "Terms of Use",
      icon: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      )
    }
  ]

  return (
    <div className={`relative inline-flex items-center justify-center space-x-8 px-8 py-4 ${themeClasses[theme].container} rounded-full border ${animationClasses[animation]} ${className}`}>
      {links.map((link, index) => (
        <div key={link.href} className="relative">
          <Link
            href={link.href}
            className={`text-xs ${themeClasses[theme].text} font-medium flex items-center space-x-2 group ${animationClasses[animation]}`}
            onMouseEnter={() => setActiveLink(link.href)}
            onMouseLeave={() => setActiveLink(null)}
          >
            <span className="opacity-60 group-hover:opacity-100 transition-opacity duration-200">
              {link.icon}
            </span>
            <span>{link.text}</span>
            <svg 
              className={`w-3 h-3 transform transition-all duration-200 ${
                activeLink === link.href ? 'opacity-100 translate-x-1' : 'opacity-0 translate-x-0'
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
          
          {/* Animated underline */}
          <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transform transition-all duration-300 ${
            activeLink === link.href ? 'scale-x-100' : 'scale-x-0'
          }`}></div>
          
          {/* Decorative dot */}
          <div className={`absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-blue-500 transform transition-all duration-300 ${
            activeLink === link.href ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}></div>
          
          {index < links.length - 1 && (
            <div className={`absolute right-[-16px] top-1/2 transform -translate-y-1/2 w-px h-4 ${themeClasses[theme].divider}`}></div>
          )}
        </div>
      ))}
      
      {/* Background glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  )
}