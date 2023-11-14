import { SxProps } from '@mui/material';

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

export const job_list_container = { width: '100%', height: '90%', display: 'flex', justifyContent: 'center', alignItems: 'center' };
export const job_list_card_action = { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' };
export const job_list_circular_progress = { position: 'relative', bottom: '100' };
export const job_list_card_content = { width: 500, height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBlock: 4 };
export const job_list_list_container = {
  paddingBlock: 2,
  overflowY: 'auto',
  overflowX: 'hidden',
  maxHeight: 400,
  paddingX: 1,
};
