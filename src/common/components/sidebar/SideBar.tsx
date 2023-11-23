import { Delete as DeleteIcon, Inbox } from '@mui/icons-material';
import { Box, Divider, IconButton, List, ListItem, ListSubheader, MenuItem, TextField, Typography } from '@mui/material';
import { Label } from 'bpartners-annotator-Ts-client';
import { FC } from 'react';
import { ILabelItemProps } from '.';
import { useCanvasAnnotationContext } from '../../context';

const LabelItem: FC<ILabelItemProps> = ({ annotation }) => {
  const { changeAnnotationLabel, removeAnnotation, labels } = useCanvasAnnotationContext();

  const handleClick = (label: Label) => () => {
    changeAnnotationLabel(annotation.id, label);
  };

  return (
    <>
      <ListItem
        secondaryAction={
          <IconButton edge='end' aria-label='delete' onClick={() => removeAnnotation(annotation.id)}>
            <DeleteIcon />
          </IconButton>
        }
      >
        <TextField select value={annotation.label} size='small' fullWidth>
          {labels.map(label => (
            <MenuItem onClick={handleClick(label)} key={label.id} value={label.name}>
              {label.name}
            </MenuItem>
          ))}
        </TextField>
      </ListItem>
      <Divider />
    </>
  );
};

export const Sidebar = () => {
  const { annotations } = useCanvasAnnotationContext();

  return (
    <List subheader={<ListSubheader>Labels</ListSubheader>}>
      {annotations.map((annotation, k) => (
        <LabelItem annotation={annotation} key={`${k} ${annotation.id}`} />
      ))}
      {annotations.length === 0 && (
        <Box display='flex' color='#00000050' marginTop='2rem' width='100%' alignItems='center' flexDirection='column'>
          <div>
            <Inbox sx={{ fontSize: '6rem' }} />
          </div>
          <Typography width={200} textAlign='center'>
            Pas encore d&apos;annotation effectuée.
          </Typography>
        </Box>
      )}
    </List>
  );
};
