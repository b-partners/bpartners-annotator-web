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

export const login_container = { ...job_list_container, height: '90vh' };
export const login_card_content: SxProps = { width: { xs: 300, sm: 400, md: 450 }, height: 400, padding: 3 };
export const login_button_container: CSSProperties = { textAlign: 'center', marginTop: '2rem' };
