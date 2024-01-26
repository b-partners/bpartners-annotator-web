import { SxProps } from '@mui/material';

export const login_container: SxProps = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '90vh',
    '& .login-card-container': {
        position: 'relative',
        '& .MuiCardContent-root': {
            paddingTop: '5rem'
        }
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
                fontSize: '5rem'
            }
        }
    }
};

export const login_card_content: SxProps = {
    width: { xs: 300, sm: 350, md: 400 },
    height: 350,
    padding: 3,
    '& form': {
        marginTop: 13
    }
};
