const API_BASE_URL = '';

const request = async (method, endpoint, body) => {
  if (!API_BASE_URL) {
    throw new Error('Backend API is not connected yet.');
  }

  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'The request could not be completed.');
  }

  return data;
};

export const apiGet = (endpoint) => request('GET', endpoint);
export const apiPost = (endpoint, body) => request('POST', endpoint, body);
export const apiPatch = (endpoint, id, body) => request('PATCH', `${endpoint}/${id}`, body);
export const apiDelete = (endpoint, id) => request('DELETE', `${endpoint}/${id}`);