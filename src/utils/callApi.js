import axios from 'axios';

const apiHeaders = () => {
  return {
    headers: {
      'Content-Type': 'application/json',
    }
  };
}

const callApi = async ({ method = 'GET', url, data = {}, headers = {} }) => {
  try {
    const defaultHeaders = apiHeaders().headers;

    const mergedHeaders = { ...defaultHeaders, ...headers };

    const response = await axios({
      method,
      url: `${import.meta.env.VITE_BACKEND_URL}/api/v1/${url}`,
      data,
      headers: mergedHeaders,
      withCredentials: true, 
    });

    return {
      error: false,
      data: response.data,
      status: response.status
    };
  } catch (err) {
    console.log(err);

    return {
      error: true,
      message: err.response?.data?.message || err.message,
      status: err.response?.status || 500
    };
  }
};

export default callApi;