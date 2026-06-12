import React from 'react'

function Header() {
  return (
    <header className="bg-teal-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-teal-light rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">RN</span>
            </div>
            <span className="font-bold text-lg md:text-xl tracking-tight">
              Relief<span className="text-teal-light">Now</span>
              <span className="hidden sm:inline text-sm font-normal text-gray-300 ml-2">Chiropractic</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#services" className="text-gray-200 hover:text-white transition text-sm font-medium">Services</a>
            <a href="#why-us" className="text-gray-200 hover:text-white transition text-sm font-medium">Why Us</a>
            <a href="#testimonials" className="text-gray-200 hover:text-white transition text-sm font-medium">Testimonials</a>
            <a href="#contact" className="bg-teal-light hover:bg-teal-mid text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition">
              Book Now
            </a>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden text-white p-2" aria-label="Open menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header