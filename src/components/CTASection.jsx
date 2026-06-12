import React from 'react'

function CTASection() {
  return (
    <section id="contact" className="py-16 md:py-24 bg-teal-lighter">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-teal-dark mb-4">
          Ready for Relief?
        </h2>
        <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Don't let pain wait. Book your appointment now and get back to feeling your best.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#book"
            className="w-full sm:w-auto bg-teal-dark hover:bg-teal-mid text-white px-8 py-3.5 rounded-xl font-bold text-base md:text-lg transition-all shadow-lg"
          >
            Book Appointment
          </a>
          <a
            href="#"
            className="w-full sm:w-auto border-2 border-teal-dark text-teal-dark hover:bg-teal-dark hover:text-white px-8 py-3.5 rounded-xl font-semibold text-base md:text-lg transition-all"
          >
            Chat with Us on WhatsApp
          </a>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          ⏰ Open today until 11 PM · Same-day appointments available
        </p>
      </div>
    </section>
  )
}

export default CTASection