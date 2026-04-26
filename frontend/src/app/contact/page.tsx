'use client'

import { useState } from 'react'
import axios from 'axios'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const header = useScrollAnimation()
  const content = useScrollAnimation()
  const faq = useScrollAnimation()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const data = new URLSearchParams()
    data.append('name', formData.get('name') as string)
    data.append('email', formData.get('email') as string)
    data.append('subject', formData.get('subject') as string)
    data.append('message', formData.get('message') as string)

    try {
      await axios.post(`${API_URL}/api/contact`, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      setSuccess(true)
      ;(e.target as HTMLFormElement).reset()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-gray-50 border-b border-gray-200 py-16">
        <div
          ref={header.ref}
          className={`container mx-auto px-6 transition-all duration-1000 ${
            header.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-gray-900 font-playfair">
              CONTACT US
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Have a question, concern, or complaint? We're here to help. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="container mx-auto px-6 py-16">
        <div
          ref={content.ref}
          className={`max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
            content.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 font-playfair">GET IN TOUCH</h2>
              <div className="space-y-6 text-gray-600">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Emergency Support</h3>
                  <p className="text-sm leading-relaxed">
                    For urgent missing child cases, please contact local authorities immediately. This form is for general inquiries and complaints only.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
                  <p className="text-sm leading-relaxed">
                    We typically respond to all inquiries within 24-48 hours during business days.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Privacy</h3>
                  <p className="text-sm leading-relaxed">
                    All information submitted through this form is kept confidential and used only to address your inquiry.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 tracking-wide">
                    YOUR NAME *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition text-gray-900"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 tracking-wide">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition text-gray-900"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 tracking-wide">
                    SUBJECT *
                  </label>
                  <select
                    name="subject"
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition text-gray-900"
                  >
                    <option value="">Select a subject</option>
                    <option value="complaint">Complaint</option>
                    <option value="technical">Technical Issue</option>
                    <option value="feedback">Feedback</option>
                    <option value="case_inquiry">Case Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 tracking-wide">
                    MESSAGE *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition text-gray-900 resize-none"
                    placeholder="Please provide details about your inquiry..."
                  />
                </div>

                {success && (
                  <div className="bg-green-50 border-l-4 border-green-600 px-4 py-3">
                    <p className="text-green-700 text-sm">
                      Thank you! Your message has been sent successfully. We'll get back to you soon.
                    </p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-600 px-4 py-3">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-3 font-semibold text-sm tracking-wide hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'SENDING...' : 'SEND MESSAGE'}
                </button>
              </form>
            </div>
          </div>

          {/* FAQ Section */}
          <div
            ref={faq.ref}
            className={`border-t border-gray-200 pt-16 transition-all duration-1000 delay-300 ${
              faq.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-2xl font-bold mb-8 text-gray-900 font-playfair text-center">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <div className="space-y-8 max-w-2xl mx-auto">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How do I report a missing child?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Visit our Report page and fill out the form with the child's details and photo. The alert will be distributed immediately through our WhatsApp network.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How can I update a case status?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Navigate to the specific case page and use the status update buttons. Only authorized users can update case statuses.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Is my information kept private?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Contact information is shared only with verified community members to help locate missing children. We take privacy seriously and never share data with third parties.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How do I file a complaint?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Use the contact form above and select "Complaint" as the subject. Provide detailed information about your concern and we'll investigate promptly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
