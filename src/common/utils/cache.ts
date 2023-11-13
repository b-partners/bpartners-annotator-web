'use client';
import { Task } from 'bpartners-annotator-react-client';
const CURRENT_TASK = 's3-image-url-item';

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
};
