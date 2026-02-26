import React, { useState } from 'react'

const DEFAULT_FORM = {
  result: 'success',
  reflection_notes: '',
  lessons_learned: '',
}

function OutcomeForm({ initialValues, onSubmit, submitting, serverError }) {
  const [formData, setFormData] = useState(initialValues || DEFAULT_FORM)
  const [localError, setLocalError] = useState('')

  const updateField = (name, value) => {
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLocalError('')

    if (!formData.reflection_notes.trim() || !formData.lessons_learned.trim()) {
      setLocalError('Reflection notes and lessons learned are required.')
      return
    }

    await onSubmit({
      ...formData,
      reflection_notes: formData.reflection_notes.trim(),
      lessons_learned: formData.lessons_learned.trim(),
    })
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Add Outcome</h3>

      <label htmlFor="result">Result</label>
      <select
        id="result"
        value={formData.result}
        onChange={(event) => updateField('result', event.target.value)}
      >
        <option value="success">Success</option>
        <option value="neutral">Neutral</option>
        <option value="failure">Failure</option>
      </select>

      <div className="spaced">
        <label htmlFor="reflection_notes">Reflection Notes</label>
        <textarea
          id="reflection_notes"
          value={formData.reflection_notes}
          onChange={(event) => updateField('reflection_notes', event.target.value)}
        />
      </div>

      <div className="spaced">
        <label htmlFor="lessons_learned">Lessons Learned</label>
        <textarea
          id="lessons_learned"
          value={formData.lessons_learned}
          onChange={(event) => updateField('lessons_learned', event.target.value)}
        />
      </div>

      {(localError || serverError) && <p className="error">{localError || serverError}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : 'Save Outcome'}
      </button>
    </form>
  )
}

export default OutcomeForm
