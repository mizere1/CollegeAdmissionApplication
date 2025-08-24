import React from 'react'

export function ApplicationHeader() {
  return (
    <header className="text-center py-12 bg-gradient-to-br from-green-800 to-blue-900 text-white rounded-lg mb-8">
      <h1 className="text-4xl font-bold mb-4">Admission Application</h1>
      <p className="text-xl max-w-2xl mx-auto px-4">
        Complete your application to Royal African College in a few simple steps
      </p>
    </header>
  )
}