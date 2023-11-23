import { UserTask, Whoami } from 'bpartners-annotator-Ts-client';
const CURRENT_TASK = 'current-task-item';
const ACCESS_TOKEN = 'access-token-item';
const USER_ID = 'user-id-item';
const WHOAMI = 'whoami-item';

const getJsonFromString = (value: string | null) => {
  try {
    return JSON.parse(value || 'null');
  } catch {
    return null;
  }
};

export const cache = {
  setCurrentTask(task: UserTask) {
    localStorage.setItem(CURRENT_TASK, JSON.stringify(task || {}));
  },
  getCurrentTask(): UserTask | null {
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
  getWhoami(): Whoami {
    return getJsonFromString(localStorage.getItem(WHOAMI));
  },
  setWhoami(whoami: any) {
    localStorage.setItem(WHOAMI, JSON.stringify(whoami));
  },
  setUserId(userId: string) {
    localStorage.setItem(USER_ID, userId);
  },
  getUserId() {
    localStorage.getItem(USER_ID);
  },
  clear() {
    localStorage.clear();
  },
};
