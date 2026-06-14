export default function CTASection() {
  return (
    <section id="book" className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center bg-teal-lighter rounded-full px-4 py-1.5 mb-4">
          <span className="text-teal-dark text-xs md:text-sm font-semibold">⏰ Open Today Until 11 PM</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Ready for Lasting Relief?
        </h2>
        <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Don't let pain control your life. Book your free consultation now and get back to doing what you love.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => {
              const widget = document.getElementById('chat-widget-trigger')
              if (widget) widget.click()
            }}
            className="w-full sm:w-auto bg-teal-dark hover:bg-teal-mid text-white px-10 py-4 rounded-xl font-bold text-base md:text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Book Free Consultation
          </button>
          <a
            href="#"
            className="w-full sm:w-auto border-2 border-teal-dark text-teal-dark hover:bg-teal-dark hover:text-white px-10 py-4 rounded-xl font-semibold text-base md:text-lg transition-all"
          >
            Chat on WhatsApp 💬
          </a>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-teal-light" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            No referral needed
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-teal-light" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Same-day appointments
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-teal-light" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            30 min sessions
          </span>
        </div>
      </div>
    </section>
  )
}