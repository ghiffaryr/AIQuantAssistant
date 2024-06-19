/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

type errorHandlerArgsType = {
  axiosErrorHandlerFn?: (err: any) => void;
  generalErrorHandlerFn?: (err: Error) => void;
  error: Error;
};

const errorHandler = ({
  axiosErrorHandlerFn,
  generalErrorHandlerFn,
  error,
}: errorHandlerArgsType) => {
  if (axios.isAxiosError(error)) {
    for (const errorObject of (error.response || { data: { errors: [] } }).data
      .errors) {
      axiosErrorHandlerFn?.(errorObject);
    }
    return;
  }

  generalErrorHandlerFn?.(error);
  return;
};

export default errorHandler;
