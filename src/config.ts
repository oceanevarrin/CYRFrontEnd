import axios from "axios";

// export const baseURL = "http://localhost:5000";
export const baseURL = "http://env-4469307.jcloud-ver-jpc.ik-server.com";
// export const baseURL =
//     process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DB_HOST_PROD : process.env.REACT_APP_DB_HOST_DEV

export const AxAsync = async () => {
  const token = localStorage.getItem("token");
  return axios.create({
    baseURL,
    headers: {
      accept: "application/x-www-form-urlencoded",
      "Access-Control-Allow-Origin": "*",
      Authorization: token,
    },
  });
};
export const getAuthToken = () => `${localStorage.getItem("token")}`;
export const config = () => {
  return {
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: getAuthToken(),
    },
  };
};
export const instance = () => axios.create(config());
export const getSource = () => axios.CancelToken.source();
export const sourceConfig = () => {
  const source = getSource();
  return { config: { ...config(), cancelToken: source.token }, source };
};
