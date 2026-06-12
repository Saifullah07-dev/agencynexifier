import React from 'react'

function HeroSection() {
  return (
    <section className="relative bg-teal-dark overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-teal-light rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-mid rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center bg-teal-mid/40 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-teal-light rounded-full animate-pulse mr-2"></span>
            <span className="text-teal-light text-xs md:text-sm font-medium">Open today until 11 PM</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            Instant <span className="text-teal-light">Pain Relief</span>
            <br />
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-gray-200">
              When You Need It Most
            </span>
          </h1>

          <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Hyderabad's elite chiropractic clinic. Open late until 11 PM for busy professionals.
            Back pain, neck pain, headaches — get same-day relief in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#book"
              className="w-full sm:w-auto bg-teal-light hover:bg-teal-mid text-white px-8 py-3.5 rounded-xl font-bold text-base md:text-lg transition-all shadow-lg hover:shadow-xl"
            >
              Book Instant Appointment
            </a>
            <a
              href="#services"
              className="w-full sm:w-auto border-2 border-white/20 hover:border-white/40 text-white px-8 py-3.5 rounded-xl font-semibold text-base md:text-lg transition-all"
            >
              Our Services
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/10">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">&lt; 5 min</div>
              <div className="text-xs md:text-sm text-gray-400 mt-1">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">11 PM</div>
              <div className="text-xs md:text-sm text-gray-400 mt-1">Late Hours</div>
            </div>
            <div className="text-center col-span-2 md:col-span-1">
              <div className="text-2xl md:text-3xl font-bold text-white">95%</div>
              <div className="text-xs md:text-sm text-gray-400 mt-1">Pain Relief Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection