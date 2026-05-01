'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { formatDistanceToNow } from 'date-fns'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

interface Case {
  _id: string
  case_id: string
  child_name: string
  age: number
  gender: string
  last_seen_location: string
  photo_url: string
  status: string
  created_at: string
}

function CasesContent() {
  const searchParams = useSearchParams()
  const status = searchParams.get('status') || 'active'

  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)

  const header = useScrollAnimation()

  useEffect(() => {
    fetchCases()
  }, [status])

  const fetchCases = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/cases?status=${status}`)
      setCases(response.data.cases)
    } catch (error) {
      console.error('Failed to fetch cases:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Header Section */}
      <section className="bg-gray-50 border-b border-gray-200 py-16">
        <div
          ref={header.ref}
          className={`container mx-auto px-6 transition-all duration-1000 ${
            header.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-gray-900 font-playfair">
            {status === 'active' ? 'ACTIVE CASES' : 'RESOLVED CASES'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            {status === 'active'
              ? 'Help us bring these children home. If you have any information, please contact the authorities immediately.'
              : 'Success stories of children who have been safely reunited with their families.'}
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="container mx-auto px-6">
          <div className="flex gap-8 py-4">
            <Link
              href="/cases"
              className={`pb-2 font-semibold text-sm tracking-wide transition ${
                status === 'active'
                  ? 'border-b-2 border-gray-900 text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              ACTIVE
            </Link>
            <Link
              href="/cases?status=resolved"
              className={`pb-2 font-semibold text-sm tracking-wide transition ${
                status === 'resolved'
                  ? 'border-b-2 border-gray-900 text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              RESOLVED
            </Link>
            <Link
              href="/cases?status=investigating"
              className={`pb-2 font-semibold text-sm tracking-wide transition ${
                status === 'investigating'
                  ? 'border-b-2 border-gray-900 text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              INVESTIGATING
            </Link>
          </div>
        </div>
      </section>

      {/* Cases Grid */}
      <section className="container mx-auto px-6 py-16">
        {loading ? (
          <div className="text-center py-24">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-6 text-gray-600">Loading cases...</p>
          </div>
        ) : cases.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-xl text-gray-600">
              {status === 'active'
                ? 'No active cases at the moment.'
                : status === 'resolved'
                ? 'No resolved cases yet.'
                : 'No cases under investigation.'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cases.map((caseItem, index) => {
              const CaseCard = () => {
                const cardRef = useScrollAnimation()
                return (
                  <Link
                    key={caseItem.case_id}
                    href={`/cases/${caseItem.case_id}`}
                    className="group"
                  >
                    <div
                      ref={cardRef.ref}
                      className={`bg-white overflow-hidden transition-all duration-1000 hover:shadow-2xl hover-lift ${
                        cardRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <div className="relative h-80 overflow-hidden bg-gray-100">
                        <img
                          src={`${API_URL}${caseItem.photo_url}`}
                          alt={caseItem.child_name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold tracking-wide ${
                          caseItem.status === 'active'
                            ? 'bg-red-600 text-white'
                            : caseItem.status === 'resolved'
                            ? 'bg-green-600 text-white'
                            : 'bg-yellow-600 text-white'
                        }`}>
                          {caseItem.status.toUpperCase()}
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="text-xs text-gray-500 mb-2 tracking-wide">
                          {formatDistanceToNow(new Date(caseItem.created_at))} ago
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition font-playfair">
                          {caseItem.child_name}
                        </h3>
                        <div className="text-sm text-gray-600 space-y-1 mb-4">
                          <p>{caseItem.age} years old • {caseItem.gender}</p>
                          <p className="flex items-center gap-1">
                            <span>📍</span>
                            <span>{caseItem.last_seen_location}</span>
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 group-hover:underline">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              }
              return <CaseCard key={caseItem.case_id} />
            })}
          </div>
        )}
      </section>
    </div>
  )
}

export default function CasesPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-24">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="mt-6 text-gray-600">Loading cases...</p>
      </div>
    }>
      <CasesContent />
    </Suspense>
  )
}
