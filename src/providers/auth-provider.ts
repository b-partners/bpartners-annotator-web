import { Amplify, Auth } from 'aws-amplify';
import { Configuration } from 'bpartners-annotator-Ts-client';
import { ICredential } from '.';
import { cache, toBase64 } from '../common/utils';
import aws_config from './aws-config';

Amplify.configure(aws_config);

const paramIsTemporaryPassword = 't';
const paramUsername = 'u';
const paramTemporaryPassword = 'p';

export const authProvider = {
  async login({ username, password }: ICredential) {
    const successUrl = '/login/success';

    const user = await Auth.signIn(username as string, password as string);

    cache.setAccessToken(user['signInUserSession']['idToken']['jwtToken']);

    if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
      const encodedUsername = encodeURIComponent(toBase64(username as string));
      const encodedPassword = encodeURIComponent(toBase64(password as string));
      return `/login?${paramIsTemporaryPassword}=true&${paramUsername}=${encodedUsername}&${paramTemporaryPassword}=${encodedPassword}`;
    }
    return successUrl;
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
