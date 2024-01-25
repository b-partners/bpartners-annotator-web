import {
    Comment as CommentIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { Divider, IconButton, ListItem, ListItemText, TextField } from '@mui/material';
import { Stack } from '@mui/system';
import { ChangeEvent, FC, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { useCanvasAnnotationContext } from '../../../context';
import { useEvaluationCommentContext } from '../../../context/admin';
import { IAnnotationItemProps } from '../type';

export const AdminAnnotationItem: FC<IAnnotationItemProps> = ({ annotation }) => {
    const [isComment, setComment] = useState(false);
    const [commentText, setCommentText] = useState('');
    const { addOrUpdateComment, comments } = useEvaluationCommentContext();
    const { toggleAnnotationVisibility } = useCanvasAnnotationContext();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => setCommentText(e.target.value);

    const handleBlur = () => addOrUpdateComment({ annotationId: annotation.uuid, comment: commentText, id: uuidV4() });
    const toggleVisibility = () => toggleAnnotationVisibility(annotation.id);

    return (
        <>
            <ListItem
                secondaryAction={
                    <Stack direction='row'>
                        <IconButton onClick={toggleVisibility}>
                            {annotation.isInvisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                        <IconButton
                            color={!!comments[annotation.uuid || ''] ? 'primary' : 'default'}
                            edge='end'
                            onClick={() => setComment(e => !e)}
                        >
                            <CommentIcon />
                        </IconButton>
                    </Stack>
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
    );
};
