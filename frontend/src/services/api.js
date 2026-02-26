const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(body.error || 'Something went wrong')
  }

  return body
}

export function listDecisions(filters = {}) {
  const params = new URLSearchParams()

  if (filters.outcome) {
    params.set('outcome', filters.outcome)
  }

  if (filters.confidenceLevel) {
    params.set('confidence_level', String(filters.confidenceLevel))
  }

  const query = params.toString()
  return request(`/decisions${query ? `?${query}` : ''}`)
}

export function createDecision(payload) {
  return request('/decisions', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getDecision(id) {
  return request(`/decisions/${id}`)
}

export function addDecisionOutcome(id, payload) {
  return request(`/decisions/${id}/outcome`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}
