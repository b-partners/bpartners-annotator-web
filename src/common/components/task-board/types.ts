import { Label, Task } from '@bpartners-annotator/typescript-client';

export interface IConfirmButton {
    task: Task;
    labels: Label[];
    onEnd: () => void;
    isFetcherLoading: boolean;
}
