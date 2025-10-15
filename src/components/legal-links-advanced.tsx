"use client"

import { useState } from 'react'
import Link from 'next/link'

interface LegalLinksAdvancedProps {
  className?: string
  showTooltip?: boolean
  position?: 'bottom' | 'top'
}

export default function LegalLinksAdvanced({ 
  className = "", 
  showTooltip = true,
  position = 'bottom'
}: LegalLinksAdvancedProps) {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  const links = [
    {
      href: "/privacy-policy",
      text: "Privacy Policy",
      description: "Learn how we protect and handle your data"
    },
    {
      href: "/terms-of-use",
      text: "Terms of Use",
      description: "Understand the terms and conditions for using our service"
    }
  ]

  return (
    <div className={`relative inline-flex items-center justify-center space-x-6 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
      {links.map((link, index) => (
        <div key={link.href} className="relative">
          <Link
            href={link.href}
            className="text-xs text-gray-600 hover:text-blue-600 hover:underline transition-all duration-200 font-medium flex items-center space-x-1 group"
            onMouseEnter={() => setHoveredLink(link.href)}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <span>{link.text}</span>
            <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
          
          {showTooltip && hoveredLink === link.href && (
            <div className={`absolute left-1/2 transform -translate-x-1/2 z-10 ${
              position === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'
            }`}>
              <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                {link.description}
                <div className={`absolute left-1/2 transform -translate-x-1/2 ${
                  position === 'bottom' ? 'top-0 -mt-1' : 'bottom-0 -mb-1'
                }`}>
                  <div className="border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          )}
          
          {index < links.length - 1 && (
            <div className="absolute right-[-12px] top-1/2 transform -translate-y-1/2 w-px h-3 bg-gray-300"></div>
          )}
        </div>
      ))}
    </div>
  )
}