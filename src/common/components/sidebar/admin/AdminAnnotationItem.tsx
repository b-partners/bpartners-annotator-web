import { Comment as CommentIcon } from '@mui/icons-material';
import { Divider, IconButton, ListItem, ListItemText, TextField } from '@mui/material';
import { Stack } from '@mui/system';
import { ChangeEvent, FC, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { useEvaluationCommentContext } from '../../../context/admin';
import { useSession } from '../../../hooks';
import { IAnnotationItemProps } from '../type';

export const AdminAnnotationItem: FC<IAnnotationItemProps> = ({ annotation }) => {
    const [isComment, setComment] = useState(false);
    const [commentText, setCommentText] = useState('');
    const { addOrUpdateComment, comments } = useEvaluationCommentContext();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => setCommentText(e.target.value);

    const handleBlur = () => addOrUpdateComment({ annotationId: annotation.uuid, comment: commentText, id: uuidV4() });

    const { isAdmin } = useSession();
    return isAdmin() ? (
        <>
            <ListItem
                secondaryAction={
                    <IconButton
                        color={!!comments[annotation.uuid || ''] ? 'primary' : 'default'}
                        edge='end'
                        onClick={() => setComment(e => !e)}
                    >
                        <CommentIcon />
                    </IconButton>
                }
            >
                <ListItemText>{annotation.label}</ListItemText>
            </ListItem>
            {isComment && (
                <Stack padding={1}>
                    <TextField
                        value={commentText}
                        name={`comment-${annotation.id}`}
                        fullWidth
                        multiline
                        onBlur={handleBlur}
                        onChange={handleChange}
                        minRows={2}
                    />
                </Stack>
            )}
            <Divider />
        </>
    ) : (
        <div style={{ display: 'none' }}></div>
    );
};
