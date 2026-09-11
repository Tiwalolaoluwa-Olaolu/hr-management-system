import { clearSession, getSession } from "./Storage";

const API_BASE_URL = 'https://personlwesen-api-512914121676.us-central1.run.app/api';

const request = async (method, endpoint, body, isPublic = false) => {
  const session = getSession();

  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  if (!isPublic) {
    const token = session?.token || session?.accessToken;
    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  const contentType = response.headers.get('content-type');

  let data = null;

  if(contentType?.includes('application/json')) {
    data = await response.json().catch(() => null)
  } else {
    data = await response.text().catch(() => null);
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.title || `Request failed with status ${response.status}.`);
  }

  return data;
};

export const apiGet = (endpoint, isPublic = false) => request('GET', endpoint, undefined, isPublic);

export const apiPost = (endpoint, body, isPublic = false) => request('POST', endpoint, body, isPublic);

export const apiPut = (endpoint, id, body, isPublic = false) => request('PUT', `${endpoint}/${id}`, body, isPublic);

export const apiDelete = (endpoint, id, isPublic = false) => request('DELETE', `${endpoint}/${id}`, isPublic);