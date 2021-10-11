import React from 'react'

export default function Container ({ children }: { children: React.ReactElement }) {
  return (
    <div className="flex justify-center select-none overflow-hidden">
      <div className="container">
        {children}
      </div>
    </div>
  )
}
