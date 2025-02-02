'use client'

import { useState, FormEvent } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import {
  MapPin,
  Phone,
  Clock,
  Trophy,
  Shield,
  Headphones,
  Mail,
} from 'lucide-react'

export default function LandingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to send message')

      toast.success('Message sent successfully!')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch  {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Toaster position="top-right" />
      <main className="min-h-screen bg-white">
        {/* Contact Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Get In Touch With Us
              </h2>
              <p className="text-lg text-gray-600">
                For More Information About Our Products & Services, Please Feel Free To Drop Us An Email. 
                Our Staff Always Be There To Help You Out. Do Not Hesitate!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Information */}
              <div className="space-y-8 p-8 bg-gray-50 rounded-2xl">
                <ContactInfoItem
                  Icon={MapPin}
                  title="Address"
                  content="236 5th SE Avenue, New York NY10000, United States"
                />
                <ContactInfoItem
                  Icon={Phone}
                  title="Phone"
                  content={
                    <>
                      Mobile: +(84) 546-6789<br />
                      Hotline: +(84) 456-6789
                    </>
                  }
                />
                <ContactInfoItem
                  Icon={Clock}
                  title="Working Time"
                  content={
                    <>
                      Monday-Friday: 9:00 - 22:00<br />
                      Saturday-Sunday: 9:00 - 21:00
                    </>
                  }
                />
              </div>

              {/* Contact Form */}
              <form 
                className="space-y-6 p-8 bg-white shadow-lg rounded-2xl"
                onSubmit={handleSubmit}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 bg-[#029FAE] text-white rounded-lg
                           hover:bg-teal-600 transition-colors duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500
                           flex items-center gap-2 justify-center"
                >
                  {isSubmitting ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>

         {/* Features Section */}
         <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Why Choose Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                Icon={Trophy}
                title="Premium Quality"
                description="All our products are crafted from the finest materials, ensuring lasting quality and satisfaction."
              />
              <FeatureCard
                Icon={Shield}
                title="1 Year Warranty"
                description="Every purchase comes with our comprehensive 1-year warranty protection."
              />
              <FeatureCard
                Icon={Headphones}
                title="24/7 Support"
                description="Our dedicated support team is always ready to assist you with any questions or concerns."
              />
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

function FeatureCard({ 
  Icon, 
  title, 
  description 
}: { 
  Icon: React.ElementType;
  title: string; 
  description: string;
}) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        <Icon className="w-12 h-12 text-teal-600" />
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function ContactInfoItem({ 
  Icon, 
  title, 
  content 
}: { 
  Icon: React.ElementType;
  title: string; 
  content: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-6">
      <div className="flex-shrink-0">
        <Icon className="w-6 h-6 text-teal-600" />
      </div>
      <div>
        <h3 className="text-xl font-medium text-gray-900">{title}</h3>
        <div className="mt-2 text-gray-600">{content}</div>
      </div>
    </div>
  )
}