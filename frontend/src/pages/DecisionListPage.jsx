import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import DecisionFilters from '../components/DecisionFilters'
import { listDecisions } from '../services/api'

function DecisionListPage() {
  const [filters, setFilters] = useState({ outcome: '', confidenceLevel: '' })
  const [decisions, setDecisions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDecisions = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await listDecisions(filters)
        setDecisions(data.items)
      } catch (requestError) {
        setError(requestError.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDecisions()
  }, [filters])

  const applyFilterPatch = (patch) => {
    setFilters((previous) => ({ ...previous, ...patch }))
  }

  return (
    <section>
      <h2 className="section-title">Decision Log</h2>
      <p className="muted">Track decisions and learn from real outcomes.</p>

      <DecisionFilters
        outcome={filters.outcome}
        confidenceLevel={filters.confidenceLevel}
        onChange={applyFilterPatch}
      />

      {loading && <p>Loading decisions...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && decisions.length === 0 && (
        <div className="card">
          <p>No decisions found for the selected filters.</p>
          <p className="muted">Create your first decision to begin.</p>
        </div>
      )}

      {!loading && !error && (
        <div className="list-stack">
          {decisions.map((decision) => (
            <article key={decision.id} className="card">
              <div className="row between">
                <h3>{decision.title}</h3>
                <span className="meta-text muted">Confidence: {decision.confidence_level}/5</span>
              </div>
              <p>{decision.context}</p>
              <p className="muted meta-text">Outcome: {decision.outcome?.result || 'Not reviewed yet'}</p>
              <Link className="item-link" to={`/decisions/${decision.id}`}>
                View details
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default DecisionListPage
