import { Amplify, Auth } from 'aws-amplify';
import { Configuration } from 'bpartners-annotator-react-client';
import { ICredential } from '.';
import { cache, createRedirectionUrl, toBase64 } from '../common/utils';
import aws_config from './aws-config';

Amplify.configure(aws_config);

const paramIsTemporaryPassword = 't';
const paramUsername = 'u';
const paramTemporaryPassword = 'p';

const setAccessToken = async () => {
  const session = await Auth.currentSession();
  const accessToken = session.getIdToken().getJwtToken();
  cache.setAccessToken(accessToken);
  return accessToken;
};

export const authProvider = {
  async login({ username, password }: ICredential) {
    const redirectionUrl = createRedirectionUrl('/login');
    try {
      const user = await Auth.signIn(username as string, password as string);
      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        const encodedUsername = encodeURIComponent(toBase64(username as string));
        const encodedPassword = encodeURIComponent(toBase64(password as string));
        return `/login?${paramIsTemporaryPassword}=true&${paramUsername}=${encodedUsername}&${paramTemporaryPassword}=${encodedPassword}`;
      }
      await setAccessToken();
      return redirectionUrl.successUrl;
    } catch (error) {
      return redirectionUrl.failureUrl;
    }
  },
  getAuthConf() {
    const accessToken = cache.getAccessToken();
    if (accessToken) {
      const conf = new Configuration({ accessToken });
      conf.baseOptions = { headers: { Authorization: `Bearer ${accessToken}` } };
      return conf;
    }
    return undefined;
  },
};
