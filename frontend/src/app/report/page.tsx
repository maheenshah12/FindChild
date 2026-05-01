'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

export default function ReportPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<string | null>(null)

  const header = useScrollAnimation()
  const form = useScrollAnimation()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)

    // Additional validation
    const childName = formData.get('child_name') as string
    const parentName = formData.get('parent_name') as string
    const description = formData.get('description') as string
    const location = formData.get('last_seen_location') as string
    const phone = formData.get('parent_phone') as string

    // Validate names contain actual words (not just dots or special characters)
    const namePattern = /^[a-zA-Z\s]{2,}$/
    if (!namePattern.test(childName.trim())) {
      setError("Child's name must contain only letters and spaces (minimum 2 characters)")
      setLoading(false)
      return
    }

    if (!namePattern.test(parentName.trim())) {
      setError("Your name must contain only letters and spaces (minimum 2 characters)")
      setLoading(false)
      return
    }

    // Validate description contains meaningful text
    if (description.trim().length < 10 || !/[a-zA-Z]{5,}/.test(description)) {
      setError("Description must contain meaningful text (at least 10 characters with actual words)")
      setLoading(false)
      return
    }

    // Validate location contains actual words
    if (location.trim().length < 3 || !/[a-zA-Z]{3,}/.test(location)) {
      setError("Location must contain actual place name (minimum 3 characters)")
      setLoading(false)
      return
    }

    // Validate phone number is exactly 11 digits
    const phoneDigits = phone.replace(/\D/g, '')
    if (phoneDigits.length !== 11) {
      setError("Phone number must be exactly 11 digits (e.g., 03001234567)")
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(`${API_URL}/api/cases`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Build success message based on WhatsApp status
      let alertMessage = `Case created successfully!\nCase ID: ${response.data.case_id}\n\n`

      if (response.data.whatsapp_status === 'sent') {
        alertMessage += '✓ WhatsApp alert has been sent to community groups.'
      } else if (response.data.whatsapp_status === 'failed') {
        alertMessage += '⚠ Case created but WhatsApp alert failed to send.\n'
        if (response.data.whatsapp_error?.includes('429') || response.data.whatsapp_error?.includes('limit')) {
          alertMessage += 'Reason: Daily message limit reached. Alert will be sent tomorrow.'
        } else {
          alertMessage += `Reason: ${response.data.whatsapp_error || 'Unknown error'}`
        }
      } else {
        alertMessage += 'WhatsApp alert status: Unknown'
      }

      alert(alertMessage)
      router.push(`/cases/${response.data.case_id}`)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="bg-white">
      {/* Emergency Banner */}
      <section className="bg-red-50 border-b border-red-100 py-6">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚨</span>
              <div>
                <h2 className="text-lg font-bold text-red-900 mb-1">Emergency First</h2>
                <p className="text-red-800 text-sm leading-relaxed">
                  If your child is missing, call local police immediately. This platform is a supplementary tool to help spread awareness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Header */}
      <section className="py-20 bg-white">
        <div
          ref={header.ref}
          className={`container mx-auto px-6 transition-all duration-1000 ${
            header.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Report missing child
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Complete the form below with accurate information. Our AI will generate an alert and distribute it instantly through our WhatsApp community network.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="container mx-auto px-6 py-16 pb-32">
        <div
          ref={form.ref}
          className={`transition-all duration-1000 delay-200 ${
            form.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto"
          >
          {/* Child Information */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-gray-900">
              Child Information
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Child's full name *
                </label>
                <input
                  type="text"
                  name="child_name"
                  required
                  minLength={2}
                  pattern="[a-zA-Z\s]+"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-gray-900"
                  placeholder="Enter child's name"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Letters and spaces only (minimum 2 characters)
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    name="age"
                    required
                    min="0"
                    max="18"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-gray-900"
                    placeholder="Age"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-gray-900"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Last seen location *
                </label>
                <input
                  type="text"
                  name="last_seen_location"
                  required
                  minLength={3}
                  pattern=".*[a-zA-Z]{3,}.*"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-gray-900"
                  placeholder="e.g., Central Park, New York"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Enter actual place name (minimum 3 characters)
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  minLength={10}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-gray-900 resize-none"
                  placeholder="Physical description, clothing worn, any distinguishing features..."
                />
                <p className="text-sm text-gray-500 mt-2">
                  Provide detailed description with actual words (minimum 10 characters)
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Recent photo *
                </label>
                <input
                  type="file"
                  name="photo"
                  required
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
                {preview && (
                  <div className="mt-6">
                    <img src={preview} alt="Preview" className="max-w-md w-full h-auto rounded-2xl border border-gray-200" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Parent/Guardian Contact */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-8 text-gray-900">
              Parent/Guardian Contact
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Your full name *
                </label>
                <input
                  type="text"
                  name="parent_name"
                  required
                  minLength={2}
                  pattern="[a-zA-Z\s]+"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-gray-900"
                  placeholder="Your name"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Letters and spaces only (minimum 2 characters)
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone number (11 digits) *
                </label>
                <input
                  type="tel"
                  name="parent_phone"
                  required
                  pattern="[0-9]{11}"
                  maxLength={11}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-gray-900"
                  placeholder="03001234567"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Enter exactly 11 digits (e.g., 03001234567)
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email (optional)
                </label>
                <input
                  type="email"
                  name="parent_email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-gray-900"
                  placeholder="your@email.com"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-8 bg-red-50 border border-red-200 rounded-2xl px-6 py-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="pt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 text-white py-4 px-8 rounded-full font-semibold text-base hover:bg-violet-700 hover:shadow-lg transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Report & Send Alert'}
            </button>

            <p className="text-sm text-gray-500 mt-6 text-center leading-relaxed">
              By submitting, you agree that the information will be shared through WhatsApp community groups to help find your child.
            </p>
          </div>
        </form>
        </div>
      </section>
    </div>
  )
}
