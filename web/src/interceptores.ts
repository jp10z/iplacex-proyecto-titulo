import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

const onRequest = (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  config.withCredentials = true;
  return Promise.resolve(config);
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

export function configurarInterceptores(axiosInstance: AxiosInstance): AxiosInstance {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  return axiosInstance;
}