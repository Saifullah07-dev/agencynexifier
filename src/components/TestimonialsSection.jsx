import React from 'react'

const testimonials = [
  {
    name: 'Rahul M.',
    role: 'Software Engineer, HITEC City',
    text: 'I had severe lower back pain from sitting at my desk all day. ReliefNow got me in the same evening, and after one session I could move freely again. The 5-minute WhatsApp booking is incredible.',
    rating: 5,
  },
  {
    name: 'Priya S.',
    role: 'Marketing Manager, Jubilee Hills',
    text: 'Was skeptical about chiropractic care, but my chronic neck pain is finally gone. Staff is professional, the clinic is modern, and their late hours are a lifesaver.',
    rating: 5,
  },
  {
    name: 'Ankit K.',
    role: 'Entrepreneur, Gachibowli',
    text: 'The AI response system booked me in under 2 minutes. Walked in with a stiff neck, walked out feeling like a new person. Highly recommend.',
    rating: 5,
  },
]

function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Hear from Our Patients
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Real stories from Hyderabad residents who found relief.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>

              <div>
                <p className="font-bold text-gray-900 text-sm">{testimonial.name}</p>
                <p className="text-xs text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection