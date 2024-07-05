import { Task } from '@bpartners-annotator/typescript-client';

export const getTaskToValidate = (tasks: Task[]) => {
    const toValidate = tasks.filter(task => !!task.status && task.status === ('TO_REVIEW' as any));

    if (toValidate.length === 0) {
        return null;
    }
    return toValidate[0];
};
