import {
    ChevronLeftRounded as ChevronLeftRoundedIcon,
    ChevronRightRounded as ChevronRightRoundedIcon,
} from '@mui/icons-material';
import { IconButton, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { ChangeEvent, FC, useRef } from 'react';
import { jobsProvider } from '../../../providers';
import { urlParamsHandler } from '../../utils';
import { PaginationProps } from './types';

export const Pagination: FC<PaginationProps> = ({ isLoading, onChange, dependencies = [] }) => {
    const { page, setParam, perPage } = urlParamsHandler();
    const pageTypo = useRef<HTMLSpanElement>(null);

    const getPage = () => {
        const { page: stringPage } = urlParamsHandler();
        if (isNaN(stringPage)) return 1;
        return +stringPage;
    };

    const prevPage = () => {
        const currentPage = getPage();
        const prevPage = currentPage - 1;

        if (currentPage !== 1) {
            onChange(prevPage);
            currentPage !== 1 && setParam('page', `${prevPage}`);
        }
    };

    const nextPage = () => {
        const currentPage = getPage();
        const nextPage = getPage() + 1;
        const lastPage = jobsProvider.getLastPage();
        if (currentPage < lastPage) {
            onChange(nextPage);
            setParam('page', `${nextPage}`);
        }
    };

    const handleChangePerPage = (e: ChangeEvent<HTMLInputElement>) => {
        setParam('perPage', e.target.value);
        setParam('page', '1');
        onChange(1, +e.target.value);
    };

    return (
        <Stack
            width='100%'
            justifyContent='flex-end'
            direction='row'
            px={3}
            spacing={1}
            alignItems='center'
            padding={2}
        >
            <TextField value={perPage} onChange={handleChangePerPage} size='small' select>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={15}>15</MenuItem>
            </TextField>
            <IconButton onClick={prevPage} disabled={isLoading || page === 1} color='primary'>
                <ChevronLeftRoundedIcon />
            </IconButton>
            <Typography ref={pageTypo} color='text.secondary'>
                {page}
            </Typography>
            <IconButton onClick={nextPage} disabled={isLoading || page === jobsProvider.getLastPage()} color='primary'>
                <ChevronRightRoundedIcon />
            </IconButton>
        </Stack>
    );
};
