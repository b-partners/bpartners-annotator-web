export const createRedirectionUrl = (path: `/${string}`) => {
  return {
    successUrl: window.location.origin + path + '/success',
    failureUrl: window.location.origin + path + '/failure',
  };
};
