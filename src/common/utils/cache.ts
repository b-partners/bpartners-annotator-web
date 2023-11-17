'use client';
import { Task } from 'bpartners-annotator-Ts-client';
const CURRENT_TASK = 's3-image-url-item';
const ACCESS_TOKEN = 'access-token-item';
const WHOAMI = 'whoami-item';

const getJsonFromString = (value: string | null) => {
  try {
    return JSON.parse(value || 'null');
  } catch {
    return null;
  }
};

export const cache = {
  setCurrentTask(task: Task) {
    localStorage.setItem(CURRENT_TASK, JSON.stringify(task || {}));
  },
  getCurrentTask() {
    return JSON.parse(localStorage.getItem(CURRENT_TASK) || 'null');
  },
  deleteCurrentTask() {
    localStorage.setItem(CURRENT_TASK, 'null');
  },
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN);
  },
  setAccessToken(accessToken: string) {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
  },
  getWhoami() {
    return getJsonFromString(localStorage.getItem(WHOAMI));
  },
  setWhoami(whoami: any) {
    localStorage.setItem(WHOAMI, JSON.stringify(whoami));
  },
};
