import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import OutcomeForm from '../components/OutcomeForm'
import { addDecisionOutcome, getDecision } from '../services/api'

function DecisionDetailPage() {
  const { id } = useParams()
  const [decision, setDecision] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingOutcome, setSavingOutcome] = useState(false)
  const [outcomeError, setOutcomeError] = useState('')

  useEffect(() => {
    const fetchDecision = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await getDecision(id)
        setDecision(data)
      } catch (requestError) {
        setError(requestError.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDecision()
  }, [id])

  const handleOutcomeSubmit = async (payload) => {
    setSavingOutcome(true)
    setOutcomeError('')

    try {
      const updated = await addDecisionOutcome(id, payload)
      setDecision(updated)
    } catch (requestError) {
      setOutcomeError(requestError.message)
    } finally {
      setSavingOutcome(false)
    }
  }

  if (loading) {
    return <p>Loading decision...</p>
  }

  if (error) {
    return (
      <section>
        <p className="error">{error}</p>
        <Link to="/">Back to decisions</Link>
      </section>
    )
  }

  return (
    <section>
      <Link to="/">← Back to decisions</Link>

      <article className="card spaced">
        <h2>{decision.title}</h2>
        <p>{decision.context}</p>
        {decision.options_considered && (
          <p>
            <strong>Options considered:</strong> {decision.options_considered}
          </p>
        )}
        <p className="muted">Confidence: {decision.confidence_level}/5</p>
        <p className="muted">Created: {new Date(decision.created_at).toLocaleString()}</p>
      </article>

      {decision.outcome ? (
        <article className="card">
          <h3>Outcome</h3>
          <p>
            <strong>Result:</strong> {decision.outcome.result}
          </p>
          <p>
            <strong>Reflection:</strong> {decision.outcome.reflection_notes}
          </p>
          <p>
            <strong>Lessons:</strong> {decision.outcome.lessons_learned}
          </p>
          <p className="muted">Reviewed: {new Date(decision.outcome.reviewed_at).toLocaleString()}</p>
        </article>
      ) : (
        <OutcomeForm
          onSubmit={handleOutcomeSubmit}
          submitting={savingOutcome}
          serverError={outcomeError}
        />
      )}
    </section>
  )
}

export default DecisionDetailPage
