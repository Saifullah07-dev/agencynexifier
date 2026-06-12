import React from 'react'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-teal-dark text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-teal-light rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">RN</span>
              </div>
              <span className="font-bold text-lg text-white">
                Relief<span className="text-teal-light">Now</span> Chiropractic
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Hyderabad's elite chiropractic clinic. Open late until 11 PM for busy professionals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#services" className="hover:text-teal-light transition">Services</a></li>
              <li><a href="#why-us" className="hover:text-teal-light transition">Why Us</a></li>
              <li><a href="#testimonials" className="hover:text-teal-light transition">Testimonials</a></li>
              <li><a href="#book" className="hover:text-teal-light transition">Book Now</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>HITEC City, Hyderabad, Telangana</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🕐</span>
                <span>Mon–Sun: 8 AM – 11 PM</span>
              </li>
              <li className="flex items-start gap-2">
                <span>💬</span>
                <span>WhatsApp: +91 XXXXXXXXXX</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; {currentYear} ReliefNow Chiropractic. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer