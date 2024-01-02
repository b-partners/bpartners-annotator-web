import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles(() => ({
    form: {
        '& input': {
            outline: 'none',
            border: 'none',
            transition: 'all 300ms',
            borderRadius: '4px',
            padding: '4px',
        },
        '& input:focus': {
            border: '1px solid black',
        },
    },
    inputError: {
        border: '1px solid red !important',
    },
    noDisplay: {
        visibility: 'hidden',
        position: 'absolute',
    },
    colorContainer: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        position: 'relative',
    },
}));
