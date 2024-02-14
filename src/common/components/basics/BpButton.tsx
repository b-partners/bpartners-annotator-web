import { Button, CircularProgress } from '@mui/material';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { IBpButton } from './types';

export const BpButtonTemplate: FC<Omit<IBpButton, 'to'>> = ({ label, isLoading, icon, disabled, ...others }) => {
    return (
        <Button
            {...others}
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
