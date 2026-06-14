const reasons = [
  {
    title: '⚡ 5-Minute AI Response',
    description: 'Message us on WhatsApp or our website — our AI books you in under 5 minutes. No waiting, no phone tag.',
  },
  {
    title: '🌙 Open Until 11 PM',
    description: 'Busy professionals love our late hours. Walk in after work — we are open daily until 11 PM.',
  },
  {
    title: '📅 Same-Day Booking',
    description: 'In acute pain? Book instantly online. No referral needed, no long waiting lists.',
  },
  {
    title: '🔬 Evidence-Based Care',
    description: 'Our techniques are backed by clinical research. We treat the root cause, not just symptoms.',
  },
]

export default function WhyUsSection() {
  return (
    <section id="why-us" className="py-16 md:py-24 bg-teal-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Why Hyderabad Chooses ReliefNow
          </h2>
          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
            We combine cutting-edge technology with expert chiropractic care to get you out of pain — fast.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:bg-white/10 hover:border-teal-light/30 transition-all duration-300"
            >
              <div className="text-3xl mb-4">{reason.title.split(' ')[0]}</div>
              <h3 className="text-lg font-bold mb-3">{reason.title}</h3>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}