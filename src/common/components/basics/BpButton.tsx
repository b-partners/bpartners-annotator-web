import { Button, CircularProgress } from '@mui/material';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { IBpButton } from './types';
import { defaultFontSize as fontSize } from '../../utils/theme';

export const BpButtonTemplate: FC<Omit<IBpButton, 'to'>> = ({ label, isLoading, icon, disabled, sx, ...others }) => {
    return (
        <Button
            {...others}
            sx={{ fontSize, ...sx }}
            name={others.name || label}
            endIcon={isLoading ? <CircularProgress size='25px' /> : icon}
            disabled={isLoading || disabled}
        >
            {label}
        </Button>
    );
};

export const BpButton: FC<IBpButton> = ({ to, ...others }) => {
    if (to) {
        return (
            <Link to={to}>
                <BpButtonTemplate {...others} />
            </Link>
        );
    }
    return <BpButtonTemplate {...others} />;
};
