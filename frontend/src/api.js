const API_BASE = '/api';

export async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorMsg = `Request failed: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorData.error || errorMsg;
    } catch {
      // not json
    }
    throw new Error(errorMsg);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Alumni APIs
export const fetchAllAlumni = () => request('/alumni');
export const fetchAlumniById = (id) => request(`/alumni/${id}`);
export const registerAlumni = (data) => request('/alumni', { method: 'POST', body: JSON.stringify(data) });
export const updateAlumni = (id, data) => request(`/alumni/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const searchAlumni = ({ name = '', company = '', graduationYear = '', skill = '' } = {}) => {
  const params = new URLSearchParams();
  if (name) params.append('name', name);
  if (company) params.append('company', company);
  if (graduationYear) params.append('graduationYear', graduationYear);
  if (skill) params.append('skill', skill);
  return request(`/alumni/search?${params.toString()}`);
};

// Connection APIs
export const sendConnectionRequest = (senderId, receiverId) =>
  request('/connections', { method: 'POST', body: JSON.stringify({ senderId, receiverId }) });

export const acceptConnection = (connectionId) =>
  request(`/connections/${connectionId}/accept`, { method: 'PUT' });

export const rejectConnection = (connectionId) =>
  request(`/connections/${connectionId}/reject`, { method: 'PUT' });

export const fetchAlumniConnections = (alumniId) =>
  request(`/connections/alumni/${alumniId}`);

export const fetchConnectedAlumni = (alumniId) =>
  request(`/connections/alumni/${alumniId}/connected`);

// Job APIs
export const fetchJobs = () => request('/jobs');
export const createJob = (data) => request('/jobs', { method: 'POST', body: JSON.stringify(data) });
export const deleteJob = (id) => request(`/jobs/${id}`, { method: 'DELETE' });

// Skill APIs
export const fetchSkills = () => request('/skills');

