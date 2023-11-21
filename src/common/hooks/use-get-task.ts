/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { Job, Task, TaskStatus, Whoami } from 'bpartners-annotator-Ts-client';
import { useCallback, useEffect, useState } from 'react';
import { jobsProvider, userTasksProvider } from '../../providers';
import { cache } from '../utils';

export const useGetTask = () => {
  const [{ job: currentJob, task: currentTask }, setTask] = useState<{ task: Task | null; job: Job | null }>({ job: null, task: null });
  const [isCancelLoading, setCancelLoading] = useState(false);

  const params = {};

  const fetch = useCallback(async (jobId: string, teamId: string, isUpdate = false) => {
    try {
      let task = cache.getCurrentTask();
      const job = await jobsProvider.getOne(jobId);
      if (isUpdate || !task) {
        task = await userTasksProvider.getOne(jobId, teamId);
        cache.setCurrentTask(task);
        setTask({ task, job });
      } else {
        setTask({ job, task });
      }
    } catch (e) {
      console.log((e as Error).message);
    }
  }, []);

  useEffect(() => {
    const { jobId, teamId } = params as Record<string, string>;
    if (jobId && teamId) {
      fetch(jobId, teamId);
    }
  }, []);

  const handleCancel = () => {
    const { jobId, teamId } = params as Record<string, string>;
    setCancelLoading(true);
    const whoami = cache.getWhoami() as Whoami;
    const userId = whoami.user?.id || '';

    userTasksProvider
      .updateOne(teamId, jobId, currentTask?.id || '', { ...currentTask, userId, status: TaskStatus.PENDING })
      .then(() => {
        cache.deleteCurrentTask();
        window.location.replace(`/teams/${teamId}/jobs`);
        fetch(jobId, teamId);
      })
      .catch(err => {
        alert((err as Error).message);
      })
      .finally(() => {
        setCancelLoading(false);
      });
  };

  const handleDone = () => {
    const { jobId, teamId } = params as Record<string, string>;
    setCancelLoading(true);
    userTasksProvider.updateOne(teamId, jobId, currentTask?.id || '', {
      ...currentTask,
      userId: '87910ed1-fb39-4a25-a253-50e43639cd8a',
      status: TaskStatus.COMPLETED,
    });
  };

  return { task: currentTask, job: currentJob, handleCancel, isLoading: isCancelLoading, fetch, handleDone };
};
