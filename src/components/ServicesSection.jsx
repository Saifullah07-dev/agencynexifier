const services = [
  {
    title: 'Back Pain Relief',
    description: 'Advanced spinal adjustments to relieve acute and chronic back pain, sciatica, and herniated disc discomfort.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    ),
    color: 'from-teal-dark to-teal-mid',
  },
  {
    title: 'Neck Pain Treatment',
    description: 'Gentle cervical mobilization to release tension, restore mobility, and eliminate chronic neck stiffness.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
    color: 'from-teal-mid to-teal-light',
  },
  {
    title: 'Headache Therapy',
    description: 'Suboccipital release and spinal alignment to target tension headaches and migraine triggers at their source.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'from-teal-light to-teal-mid',
  },
  {
    title: 'Posture Correction',
    description: 'Digital posture analysis with personalized plans to correct alignment and prevent future pain.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    color: 'from-teal-dark to-teal-light',
  },
]

export default function ServicesSection() {
  return (
    <section id="services" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Expert Care for Every Pain Point
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            From acute injuries to chronic discomfort — our specialists target the root cause of your pain.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
            >
              {/* Gradient accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${service.color} rounded-t-2xl`}></div>

              {/* Icon container */}
              <div className="w-14 h-14 bg-teal-lighter rounded-xl flex items-center justify-center text-teal-light mb-5 group-hover:bg-teal-light group-hover:text-white transition-all duration-300">
                {service.icon}
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">{service.description}</p>

              <button
                onClick={() => {
                  const widget = document.getElementById('chat-widget-trigger')
                  if (widget) widget.click()
                }}
                className="mt-5 text-teal-light font-semibold text-sm hover:text-teal-mid transition inline-flex items-center gap-1"
              >
                Book Now
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}