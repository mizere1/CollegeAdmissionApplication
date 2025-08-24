import React from 'react'

export function Navigation() {
  return (
    <nav className="bg-green-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <a href="#" className="text-2xl font-bold">
            RAC
          </a>
          <ul className="hidden md:flex space-x-8">
            <li>
              <a href="#" className="hover:text-yellow-400 transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-400 transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="text-yellow-400 font-medium">
                Admissions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-400 transition-colors">
                Academics
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-400 transition-colors">
                Student Portal
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}