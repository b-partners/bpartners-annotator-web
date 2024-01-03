import { SxProps } from '@mui/material';
import { CSSProperties } from 'react';

export const home_container: SxProps = {
    height: '100vh',
    background: '#fff',
    padding: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& img': {
        position: 'relative',
        right: '3rem',
    },
};

export const job_list_container = {
    width: '100%',
    height: '90%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};
export const job_list_card_action = { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' };
export const job_list_circular_progress = { position: 'relative', bottom: '100' };
export const job_list_card_content = {
    width: 500,
    height: 400,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBlock: 4,
};
export const job_list_list_container = {
    paddingBlock: 2,
    overflowY: 'auto',
    overflowX: 'hidden',
    maxHeight: 400,
    paddingX: 1,
};

export const login_container: SxProps = {
    ...job_list_container,
    height: '90vh',
    '& .login-card-container': {
        position: 'relative',
        '& .MuiCardContent-root': {
            paddingTop: '5rem',
        },
    },
    '& .login-card-header-container': {
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translate(-50%, -50%)',
        '& .MuiAvatar-root': {
            height: 150,
            width: 150,
            bgcolor: 'white',
            boxShadow: '1px 1px 10px #00000010',
            '& .MuiSvgIcon-root': {
                color: 'rgb(148, 51, 99)',
                fontSize: '5rem',
            },
        },
    },
};
export const login_card_content: SxProps = {
    width: { xs: 300, sm: 350, md: 400 },
    height: 350,
    padding: 3,
    '& form': {
        marginTop: 13,
    },
};
export const login_button_container: CSSProperties = { textAlign: 'center', marginTop: '3rem', marginBottom: '1rem' };

export const container_center_flex: SxProps = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& .circular-progress-container': {
        textAlign: 'center',
        paddingBottom: 5,
        paddingTop: 2,
    },
    '& .redirection-message': {
        position: 'absolute',
        bottom: 5,
        left: '50%',
        transform: 'translate(-50%)',
    },
};
export const error_card_container: SxProps = {
    padding: 1,
    '& .MuiAvatar-square': {
        height: 100,
        width: 100,
        bgcolor: 'transparent',
        '& .MuiTypography-root': {
            fontSize: '3rem',
            color: '#000000aa',
        },
    },
    '& .MuiDivider-root': {
        border: '2px solid #000000aa',
    },
    '& .error-message-container': {
        paddingLeft: 2,
        width: 398,
    },
};

export const canvas_loading: SxProps = {
    width: '100%',
    height: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};
