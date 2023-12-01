import { SxProps } from '@mui/material';

export const JOB_ITEM: SxProps = {
  outline: '1px solid #00000030',
  borderRadius: 2,
  marginBlock: 2,
  cursor: 'pointer',
  transition: 'all 300ms',
  width: 400,
  justifyContent: 'space-between',
  '&:hover': {
    boxShadow: '1px 1px 5px rgba(0,0,0,0.2)',
  },
  '&:active': {
    boxShadow: 'none',
  },
  '& a': {
    position: 'absolute',
    right: 0,
  },
  '& .job-title-container': {
    position: 'relative',
    width: 380,
  },
};
