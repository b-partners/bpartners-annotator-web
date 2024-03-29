import { Task, Whoami } from '@bpartners-annotator/typescript-client';
import { fromBase64, toBase64 } from './base64-utilities';
const CURRENT_TASK = 'current-task-item';
const ACCESS_TOKEN = 'access-token-item';
const USER_ID = 'user-id-item';
const WHOAMI = 'whoami-item';
const API_KEY = 'api-key-item';
const LAST_PAGE = 'last-page';

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
    getCurrentTask(): Task | null {
        return JSON.parse(localStorage.getItem(CURRENT_TASK) || 'null');
    },
    deleteCurrentTask() {
        localStorage.setItem(CURRENT_TASK, 'null');
    },
    getAccessToken() {
        return localStorage.getItem(ACCESS_TOKEN) || undefined;
    },
    setAccessToken(accessToken: string) {
        localStorage.setItem(ACCESS_TOKEN, accessToken.length > 0 ? 'Bearer ' + accessToken : '');
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
    getApiKey() {
        return fromBase64(localStorage.getItem(API_KEY) || '');
    },
    setApiKey(apiKey: any) {
        localStorage.setItem(API_KEY, toBase64(apiKey));
    },
    setLastPage(name: string, page: number) {
        localStorage.setItem(`${name}-${LAST_PAGE}`, `${page}`);
    },
    getLastPage(name: string) {
        const page = localStorage.getItem(`${name}-${LAST_PAGE}`);
        if (!page) return 1;
        return +page;
    },
};
