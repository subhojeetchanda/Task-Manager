export class ApiError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const httpClient = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  const response = await fetch(url, { ...options, headers });

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.message || 'Something went wrong',
      data?.errors || []
    );
  }

  return data;
};
