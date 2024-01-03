import { AnnotationReview } from '@bpartners-annotator/typescript-client';
import { Dispatch, FC, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';

type TContext = {
    comments: Record<string, AnnotationReview>;
    setComments: Dispatch<SetStateAction<Record<string, AnnotationReview>>>;
};

const Context = createContext<TContext>({ comments: {}, setComments: () => {} });

export const useEvaluationCommentContext = () => {
    const { comments, setComments } = useContext(Context);

    const addOrUpdateComment = (comment: AnnotationReview) => {
        setComments(e => ({ ...e, [comment.annotationId || '']: comment }));
    };

    const removeComment = (annotationId: string) => {
        const newComments = {} as any;
        Object.keys(comments).forEach(e => {
            if (e !== annotationId) {
                newComments[e] = comments[e];
            }
        });
        setComments(newComments);
    };

    return { addOrUpdateComment, removeComment, comments };
};

export const EvaluationCommentProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [comments, setComments] = useState<Record<string, AnnotationReview>>({});

    return <Context.Provider value={{ comments, setComments }}>{children}</Context.Provider>;
};
