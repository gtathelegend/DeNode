import React from 'react'

function DecisionFilters({ outcome, confidenceLevel, onChange }) {
  return (
    <div className="card filter-grid">
      <div>
        <label htmlFor="outcome">Outcome</label>
        <select
          id="outcome"
          value={outcome}
          onChange={(event) => onChange({ outcome: event.target.value })}
        >
          <option value="">All</option>
          <option value="success">Success</option>
          <option value="neutral">Neutral</option>
          <option value="failure">Failure</option>
        </select>
      </div>

      <div>
        <label htmlFor="confidenceLevel">Confidence</label>
        <select
          id="confidenceLevel"
          value={confidenceLevel}
          onChange={(event) => onChange({ confidenceLevel: event.target.value })}
        >
          <option value="">All</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
    </div>
  )
}

export default DecisionFilters
