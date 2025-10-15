"use client"

import Link from 'next/link'

interface LegalLinksProps {
  className?: string
  variant?: 'card' | 'footer' | 'standalone'
}

export default function LegalLinks({ className = "", variant = 'standalone' }: LegalLinksProps) {
  const baseClasses = "text-xs text-gray-600 hover:text-blue-600 hover:underline transition-all duration-200 font-medium flex items-center space-x-1 group"
  
  const containerClasses = {
    card: "flex items-center justify-center space-x-4",
    footer: "inline-flex items-center justify-center space-x-6 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm",
    standalone: "flex items-center justify-center space-x-6 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm"
  }

  const dividerClasses = {
    card: "text-gray-300",
    footer: "w-px h-3 bg-gray-300",
    standalone: "w-px h-3 bg-gray-300"
  }

  const dividerContent = {
    card: "•",
    footer: <div className={dividerClasses[variant]}></div>,
    standalone: <div className={dividerClasses[variant]}></div>
  }

  return (
    <div className={`${containerClasses[variant]} ${className}`}>
      <Link
        href="/privacy-policy"
        className={baseClasses}
      >
        <span>Privacy Policy</span>
        <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </Link>
      <div className="flex items-center">
        {dividerContent[variant]}
      </div>
      <Link
        href="/terms-of-use"
        className={baseClasses}
      >
        <span>Terms of Use</span>
        <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </Link>
    </div>
  )
}