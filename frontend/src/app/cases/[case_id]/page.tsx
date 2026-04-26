'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { formatDistanceToNow } from 'date-fns'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

interface Case {
  case_id: string
  child_name: string
  age: number
  gender: string
  last_seen_location: string
  description: string
  photo_url: string
  parent_name: string
  parent_phone: string
  parent_email?: string
  status: string
  created_at: string
  resolved_at?: string
}

interface Response {
  _id: string
  responder_phone: string
  message: string
  timestamp: string
  analysis?: any
}

export default function CaseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const caseId = params.case_id as string

  const [caseData, setCaseData] = useState<Case | null>(null)
  const [responses, setResponses] = useState<Response[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchCase()
  }, [caseId])

  const fetchCase = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/cases/${caseId}`)
      setCaseData(response.data.case)
      setResponses(response.data.responses)
    } catch (error) {
      console.error('Failed to fetch case:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (newStatus: string) => {
    // Prompt for admin password
    const password = prompt('Enter admin password to update case status:')

    if (!password) {
      return // User cancelled
    }

    // Simple password check (for testing only)
    if (password !== 'admin123') {
      alert('Incorrect password. Access denied.')
      return
    }

    if (!confirm(`Are you sure you want to mark this case as ${newStatus}?`)) {
      return
    }

    setUpdating(true)
    try {
      await axios.patch(`${API_URL}/api/cases/${caseId}/status`, { status: newStatus })
      alert(`Case status updated to ${newStatus}`)
      fetchCase()
    } catch (error) {
      alert('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="mt-6 text-gray-600">Loading case details...</p>
      </div>
    )
  }

  if (!caseData) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Case not found</h1>
        <button
          onClick={() => router.push('/cases')}
          className="px-8 py-3 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition"
        >
          Back to Cases
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-gray-50 border-b border-gray-200 py-8">
        <div className="container mx-auto px-6">
          <button
            onClick={() => router.push('/cases')}
            className="text-gray-600 hover:text-gray-900 transition text-sm font-medium"
          >
            ← Back to Cases
          </button>
        </div>
      </section>

      {/* Status Banner */}
      <section className={`py-6 ${
        caseData.status === 'active' ? 'bg-red-600' :
        caseData.status === 'resolved' ? 'bg-green-600' : 'bg-yellow-600'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center text-white">
            <h1 className="text-2xl font-bold tracking-tight">
              {caseData.status === 'active' ? '🚨 ACTIVE CASE' :
               caseData.status === 'resolved' ? '✅ CASE RESOLVED' : '🔍 UNDER INVESTIGATION'}
            </h1>
            <span className="text-sm font-medium">Case ID: {caseData.case_id}</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Image */}
          <div>
            <div className="bg-gray-100 overflow-hidden">
              <img
                src={`${API_URL}${caseData.photo_url}`}
                alt={caseData.child_name}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="mb-8">
              <div className="text-sm text-gray-500 mb-2 tracking-wide">
                REPORTED {formatDistanceToNow(new Date(caseData.created_at))} AGO
              </div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900 font-playfair">{caseData.child_name}</h2>

              <div className="space-y-4 text-gray-700 mb-8">
                <div className="flex gap-3">
                  <span className="font-semibold min-w-[120px]">Age:</span>
                  <span>{caseData.age} years old</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold min-w-[120px]">Gender:</span>
                  <span className="capitalize">{caseData.gender}</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold min-w-[120px]">Last Seen:</span>
                  <span>{caseData.last_seen_location}</span>
                </div>
                {caseData.resolved_at && (
                  <div className="flex gap-3">
                    <span className="font-semibold min-w-[120px]">Resolved:</span>
                    <span>{formatDistanceToNow(new Date(caseData.resolved_at))} ago</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="font-bold mb-3 text-gray-900 text-sm tracking-wide">DESCRIPTION</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{caseData.description}</p>
            </div>

            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="font-bold mb-4 text-gray-900 text-sm tracking-wide">CONTACT INFORMATION</h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex gap-3">
                  <span className="font-semibold min-w-[120px]">Parent/Guardian:</span>
                  <span>{caseData.parent_name}</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold min-w-[120px]">Phone:</span>
                  <a href={`tel:${caseData.parent_phone}`} className="text-blue-600 hover:underline">
                    {caseData.parent_phone}
                  </a>
                </div>
                {caseData.parent_email && (
                  <div className="flex gap-3">
                    <span className="font-semibold min-w-[120px]">Email:</span>
                    <a href={`mailto:${caseData.parent_email}`} className="text-blue-600 hover:underline">
                      {caseData.parent_email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {caseData.status === 'active' && (
              <div className="space-y-3">
                <button
                  onClick={() => updateStatus('resolved')}
                  disabled={updating}
                  className="w-full bg-violet-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-violet-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {updating ? 'Updating...' : 'Mark as Resolved'}
                </button>
                <button
                  onClick={() => updateStatus('investigating')}
                  disabled={updating}
                  className="w-full bg-gray-200 text-gray-900 py-3 px-6 rounded-full font-semibold hover:bg-gray-300 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {updating ? 'Updating...' : 'Mark as Investigating'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Community Responses */}
      {responses.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-8 text-gray-900 tracking-tight font-playfair">
                COMMUNITY RESPONSES ({responses.length})
              </h2>
              <div className="space-y-6">
                {responses.map((response) => (
                  <div key={response._id} className="bg-white p-6 border-l-4 border-blue-600">
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-semibold text-blue-600">
                        {response.responder_phone}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(response.timestamp))} ago
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{response.message}</p>
                    {response.analysis?.urgency && (
                      <span className={`inline-block mt-3 px-3 py-1 text-xs font-bold tracking-wide ${
                        response.analysis.urgency === 'high'
                          ? 'bg-red-100 text-red-700'
                          : response.analysis.urgency === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {response.analysis.urgency.toUpperCase()} PRIORITY
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
