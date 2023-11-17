import { PropsOf } from '@emotion/react';
import { Button, TextField } from '@mui/material';
import { ReactNode } from 'react';

export interface IBpButton extends PropsOf<typeof Button> {
  isLoading?: boolean;
  to?: string;
  label: string;
  icon?: ReactNode;
}

export interface IBpTextField extends PropsOf<typeof TextField> {
  type?: string;
  name: string;
  icon?: ReactNode;
  onClickOnIcon?: () => void;
}
