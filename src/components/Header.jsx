import { useState } from 'react'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-teal-dark text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-teal-light rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-sm">RN</span>
            </div>
            <span className="font-bold text-xl md:text-2xl tracking-tight">
              Relief<span className="text-teal-light">Now</span>
              <span className="hidden md:inline text-sm font-normal text-gray-300 ml-2">Chiropractic</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#services" className="text-gray-200 hover:text-white transition text-sm font-medium">Services</a>
            <a href="#testimonials" className="text-gray-200 hover:text-white transition text-sm font-medium">Reviews</a>
            <a href="#why-us" className="text-gray-200 hover:text-white transition text-sm font-medium">Why Us</a>
            <a
              href="#book"
              className="bg-teal-light hover:bg-teal-mid text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all hover:shadow-lg"
            >
              Book Free Consultation
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 pt-4 space-y-3">
            <a href="#services" className="block text-gray-200 hover:text-white py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Services</a>
            <a href="#testimonials" className="block text-gray-200 hover:text-white py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Reviews</a>
            <a href="#why-us" className="block text-gray-200 hover:text-white py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Why Us</a>
            <a
              href="#book"
              className="block text-center bg-teal-light hover:bg-teal-mid text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition"
              onClick={() => setMobileOpen(false)}
            >
              Book Free Consultation
            </a>
          </div>
        )}
      </div>
    </header>
  )
}