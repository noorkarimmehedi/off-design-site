"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"

interface AnimatedButtonProps {
  href: string
  children: React.ReactNode
  className?: string
  target?: string
  rel?: string
}

export default function AnimatedButton({ 
  href, 
  children, 
  className,
  target = "_blank",
  rel = "noopener noreferrer"
}: AnimatedButtonProps) {
  return (
    <Link href={href} target={target} rel={rel} className="inline-block">
      <button 
        aria-label="Book a Call"
        className={cn(
          "animated-button",
          "px-6 py-4 text-sm font-mono uppercase relative border-0 leading-tight cursor-pointer",
          "bg-neutral-100 text-neutral-600 transition-all duration-300 ease-out",
          "hover:bg-neutral-200 hover:text-neutral-900",
          "focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-neutral-400 focus-visible:outline-offset-2",
          className
        )}
      >
        <span className="corners">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
          </span>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
          </span>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
          </span>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
          </span>
        </span>
        <span className="relative z-10">{children}</span>
      </button>
    </Link>
  )
}
