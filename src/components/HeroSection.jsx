import { useState, useEffect } from 'react'

const headlines = [
  { text: 'Back Pain?', highlight: 'Get Relief Today' },
  { text: 'Neck Stiffness?', highlight: 'We Can Help' },
  { text: 'Tension Headaches?', highlight: 'Find Relief Now' },
]

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % headlines.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const current = headlines[currentIndex]

  return (
    <section className="relative bg-teal-dark overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-[0.07]">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-teal-light rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-teal-light rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28 lg:py-36">
        <div className="max-w-4xl mx-auto text-center">
          {/* Differentiator Badge */}
          <div className="inline-flex items-center bg-gradient-to-r from-teal-mid/60 to-teal-light/30 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-teal-light/20">
            <span className="w-2 h-2 bg-teal-light rounded-full animate-pulse mr-2"></span>
            <span className="text-teal-light text-xs md:text-sm font-semibold tracking-wide">
              ⏰ Open Today Until 11 PM — Same-Day Appointments Available
            </span>
          </div>

          {/* Animated Headline */}
          <div className="transition-all duration-500 min-h-[8rem] md:min-h-[10rem]">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-2">
              {current.text}
            </h1>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-teal-light mt-2 transition-all duration-500">
              {current.highlight}
            </div>
          </div>

          <p className="text-base md:text-lg text-gray-300 mt-6 mb-8 max-w-2xl mx-auto leading-relaxed">
            Hyderabad's premium chiropractic clinic. Open late for busy professionals.
            Expert care for back pain, neck stiffness, headaches — get same-day relief.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => {
                const widget = document.getElementById('chat-widget-trigger')
                if (widget) widget.click()
              }}
              className="w-full sm:w-auto bg-teal-light hover:bg-teal-mid text-white px-10 py-4 rounded-xl font-bold text-base md:text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Book Free Consultation
            </button>
            <a
              href="#services"
              className="w-full sm:w-auto border-2 border-white/20 hover:border-white/40 text-white px-10 py-4 rounded-xl font-semibold text-base md:text-lg transition-all hover:bg-white/5"
            >
              Our Services
            </a>
          </div>

          {/* Social Proof Bar */}
          <div className="mt-12 pt-10 border-t border-white/10">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${star <= 4 ? 'text-gold' : 'text-gold/50'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-white font-bold text-lg">4.6</span>
                <span className="text-gray-400 text-sm">★ (200+ Reviews)</span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="w-1.5 h-1.5 bg-teal-light rounded-full"></span>
                <span>&lt; 5 min AI Response</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="w-1.5 h-1.5 bg-teal-light rounded-full"></span>
                <span>Open Until 11 PM Daily</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}