import axios from 'axios';

const NODE_ENV = process.env.NODE_ENV;
const ENV_API_BASE_URL = (process.env.REACT_APP_API_URL || '').trim();
const DEV_DEFAULT_API_BASE_URL = 'http://localhost:8080/api';
const REQUEST_TIMEOUT_MS = 5000;

const normalizeBaseUrl = (url) =>
  url.replace(/\/+$/, '').replace(/\/skills$/i, '');

const resolveApiBaseUrl = () => {
  if (NODE_ENV === 'production') {
    if (!ENV_API_BASE_URL) {
      const message =
        '[api] Production configuration error: REACT_APP_API_URL is missing. Set it to your Azure backend URL.';
      console.error(message);
      throw new Error(message);
    }

    const normalizedProdUrl = normalizeBaseUrl(ENV_API_BASE_URL);
    if (normalizedProdUrl.toLowerCase().includes('localhost')) {
      const message =
        '[api] Production configuration error: localhost is not allowed in production.';
      console.error(message);
      throw new Error(message);
    }

    return normalizedProdUrl;
  }

  const developmentUrl = ENV_API_BASE_URL || DEV_DEFAULT_API_BASE_URL;
  return normalizeBaseUrl(developmentUrl);
};

const baseURL = resolveApiBaseUrl();

console.log('ENV:', process.env.NODE_ENV);
console.log('API:', process.env.REACT_APP_API_URL);

const api = axios.create({
  baseURL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
    console.log(
      '[api] Request:',
      `${(config.method || 'GET').toUpperCase()} ${fullUrl}`
    );
    return config;
  },
  (error) => Promise.reject(error)
);

const buildFriendlyError = (error) => {
  const wrappedError = new Error('Unable to fetch skills');
  wrappedError.originalError = error;
  wrappedError.response = error.response;
  wrappedError.code = error.code;
  return wrappedError;
};

const logApiError = (error, method, path) => {
  const fullUrl = `${api.defaults.baseURL || ''}${path}`;

  if (error.response) {
    const responseMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Unknown server error';

    console.error(`[api] ${method.toUpperCase()} ${fullUrl} failed`, {
      url: fullUrl,
      statusCode: error.response.status,
      message: responseMessage,
    });
    return;
  }

  const networkMessage =
    error.code === 'ECONNABORTED'
      ? 'Request timed out after 5000ms'
      : error.message || 'Network error';

  console.error(`[api] ${method.toUpperCase()} ${fullUrl} failed`, {
    url: fullUrl,
    statusCode: null,
    message: networkMessage,
  });
};

const request = async (method, path, data, config = {}) => {
  try {
    return await api.request({
      method,
      url: path,
      data,
      ...config,
    });
  } catch (error) {
    logApiError(error, method, path);
    throw buildFriendlyError(error);
  }
};

export const getSkills = async () => request('get', '/skills');
export const getSkillById = async (id) => request('get', `/skills/${id}`);
export const createSkill = async (skill) => request('post', '/skills', skill);
export const updateSkill = async (id, skill) =>
  request('put', `/skills/${id}`, skill);
export const deleteSkill = async (id) => request('delete', `/skills/${id}`);

export default api;