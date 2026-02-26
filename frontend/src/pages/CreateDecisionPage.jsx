import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { createDecision } from '../services/api'

const INITIAL_FORM = {
  title: '',
  context: '',
  options_considered: '',
  confidence_level: 3,
}

function CreateDecisionPage() {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const updateField = (name, value) => {
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!formData.title.trim() || !formData.context.trim()) {
      setError('Title and context are required.')
      return
    }

    setSubmitting(true)

    try {
      const created = await createDecision({
        ...formData,
        title: formData.title.trim(),
        context: formData.context.trim(),
        options_considered: formData.options_considered.trim(),
        confidence_level: Number(formData.confidence_level),
      })

      navigate(`/decisions/${created.id}`)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section>
      <h2>Create Decision</h2>
      <form className="card" onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          value={formData.title}
          onChange={(event) => updateField('title', event.target.value)}
          required
        />

        <div className="spaced">
          <label htmlFor="context">Context</label>
          <textarea
            id="context"
            value={formData.context}
            onChange={(event) => updateField('context', event.target.value)}
            required
          />
        </div>

        <div className="spaced">
          <label htmlFor="options_considered">Options Considered (optional)</label>
          <textarea
            id="options_considered"
            value={formData.options_considered}
            onChange={(event) => updateField('options_considered', event.target.value)}
          />
        </div>

        <div className="spaced">
          <label htmlFor="confidence_level">Confidence Level</label>
          <select
            id="confidence_level"
            value={formData.confidence_level}
            onChange={(event) => updateField('confidence_level', event.target.value)}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Create Decision'}
        </button>
      </form>
    </section>
  )
}

export default CreateDecisionPage
