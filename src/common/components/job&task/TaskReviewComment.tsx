import { MessageOutlined as MessageOutlinedIcon } from '@mui/icons-material';
import { Badge, IconButton } from '@mui/material';
import { useCanvasAnnotationContext, useDialog } from '../../context';
import { TaskReviewDialog } from './TaskReviewDialog';

export const TaskReviewComment = () => {
    const { globalReviews } = useCanvasAnnotationContext();
    const { openDialog } = useDialog();

    return (
        <IconButton
            onClick={() => openDialog(<TaskReviewDialog globalReviews={globalReviews} />)}
            title='Commentaires'
            color='primary'
            size='large'
            sx={{
                position: 'absolute',
                bottom: '2rem',
                left: '2rem',
                background: theme => theme.palette.primary.main,
                color: '#fff',
                ':hover': {
                    background: theme => theme.palette.primary.light,
                },
            }}
        >
            {globalReviews.length !== 0 && (
                <Badge badgeContent={globalReviews.length} color='warning'>
                    <MessageOutlinedIcon />
                </Badge>
            )}
            {globalReviews.length === 0 && <MessageOutlinedIcon />}
        </IconButton>
    );
};
