import React from 'react'

export default function Container ({ children }: { children: React.ReactElement }) {
  return (
    <div className="flex justify-center">
      <div className="container">
        {children}
      </div>
    </div>
  )
}
