import { TErrorSources, TGenericErrorResponse } from "../interface/error";

// eslint-disable-next-line
const handleDuplicateError = (error: any): TGenericErrorResponse => {
  const match = error?.message?.match(/"([^"]*)"/);

  const extractedMessage = match ? match[1] : "";
  const errorSources: TErrorSources = [
    {
      path: "",
      message: `${extractedMessage} already exists`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: "validation error",
    errorSources,
  };
};

export default handleDuplicateError;
