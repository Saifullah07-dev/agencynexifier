const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="bg-teal-dark text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-teal-light rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">RN</span>
              </div>
              <span className="font-bold text-xl text-white">
                Relief<span className="text-teal-light">Now</span> Chiropractic
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Hyderabad's elite chiropractic clinic. Open late until 11 PM for busy professionals.
              Expert care for back pain, neck pain, headaches & posture correction.
            </p>
            <div className="flex gap-3">
              <span className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-teal-light/20 transition cursor-pointer">
                <span className="text-sm">📱</span>
              </span>
              <span className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-teal-light/20 transition cursor-pointer">
                <span className="text-sm">💬</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-5">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Services', href: '#services' },
                { label: 'Testimonials', href: '#testimonials' },
                { label: 'Why Us', href: '#why-us' },
                { label: 'Book Now', href: '#book' },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-teal-light transition flex items-center gap-2">
                    <span className="w-1 h-1 bg-teal-light rounded-full"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-5">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="mt-0.5">📍</span>
                <span>HITEC City, Hyderabad, Telangana 500081</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5">🕐</span>
                <div>
                  <p>Mon–Sun: 8 AM – 11 PM</p>
                  <p className="text-teal-light text-xs">Late-night hours available</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5">💬</span>
                <div>
                  <p>WhatsApp: +91 XXXXXXXXXX</p>
                  <p className="text-teal-light text-xs">Reply in &lt; 5 minutes</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {currentYear} ReliefNow Chiropractic. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-teal-light transition">Privacy Policy</a>
            <a href="#" className="hover:text-teal-light transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}