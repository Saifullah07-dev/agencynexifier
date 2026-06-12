import React from 'react'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import ServicesSection from '../components/ServicesSection'
import WhyUsSection from '../components/WhyUsSection'
import TestimonialsSection from '../components/TestimonialsSection'
import CTASection from '../components/CTASection'
import Footer from '../components/Footer'
import ChatWidget from '../components/ChatWidget'

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <WhyUsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}

export default LandingPage