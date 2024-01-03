import { IconButton, TextField } from '@mui/material';
import { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { IBpTextField } from './types';

export const BpTextField: FC<IBpTextField> = ({ name, icon, onClickOnIcon, type, ...others }) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();
    const value = useWatch({ name });

    const endAdornment = icon && <IconButton onClick={onClickOnIcon}>{icon}</IconButton>;

    return (
        <TextField
            {...register(name)}
            value={value}
            type={type}
            error={!!errors[name]}
            inputProps={{ icon }}
            helperText={(errors[name]?.message as string) || ''}
            InputProps={{ endAdornment }}
            {...others}
        />
    );
};
