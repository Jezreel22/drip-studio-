import React from 'react'

export interface HeartIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

export function HeartIcon({ size = 24, className = '', ...props }: HeartIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 20.5 3.8 12.6a5 5 0 0 1 7.1-7l1.1 1.1 1.1-1.1a5 5 0 0 1 7.1 7Z" />
    </svg>
  )
}
