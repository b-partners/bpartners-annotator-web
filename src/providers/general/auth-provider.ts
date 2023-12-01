import { Configuration } from '@bpartners-annotator/typescript-client';
import { Amplify, Auth } from 'aws-amplify';
import { ICredential } from '..';
import { cache, fromBase64, toBase64 } from '../../common/utils';
import aws_config from './aws-config';

Amplify.configure(aws_config);

const paramIsTemporaryPassword = 't';
const paramUsername = 'u';
const paramTemporaryPassword = 'p';
const successUrl = '/login/success';
const loginUrl = '/login';

export const authProvider = {
  async login({ username, password }: ICredential) {
    const user = await Auth.signIn(username as string, password as string);

    if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
      const encodedUsername = encodeURIComponent(toBase64(username as string));
      const encodedPassword = encodeURIComponent(toBase64(password as string));
      return `/login/complete-password?${paramIsTemporaryPassword}=true&${paramUsername}=${encodedUsername}&${paramTemporaryPassword}=${encodedPassword}`;
    }

    cache.setAccessToken(user['signInUserSession']['idToken']['jwtToken']);
    return successUrl;
  },
  getAuthConf() {
    const accessToken = cache.getAccessToken();
    const apiKey = cache.getApiKey();
    if (accessToken) {
      const conf = new Configuration({ accessToken });
      conf.baseOptions = { headers: { Authorization: accessToken, 'x-api-key': apiKey } };
      return conf;
    }
    return undefined;
  },
  async updatePassword(newPassword: string) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const username = fromBase64(decodeURIComponent(urlParams.get(paramUsername) as string)) as string;
    const temporaryPassword = fromBase64(decodeURIComponent(urlParams.get(paramTemporaryPassword) as string)) as string;
    const user = await Auth.signIn(username, temporaryPassword);
    await Auth.completeNewPassword(user, newPassword);
    const session = await Auth.currentSession();
    cache.setAccessToken(session.getIdToken().getJwtToken());
    return successUrl;
  },
  async isAuthenticated() {
    const session = await Auth.currentSession();
    return session.isValid();
  },
  async logOut() {
    await Auth.signOut();
    cache.clear();
    return loginUrl;
  },
  getRedirectionBySession() {
    const apiKey = cache.getApiKey();
    const whoami = cache.getWhoami();
    if (!!apiKey) {
      return '/jobs';
    } else if (!!whoami) {
      return `/teams/${whoami?.user?.team?.id}/jobs`;
    }
    return '/login';
  },
};
