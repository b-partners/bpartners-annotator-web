import { useCanvasAnnotationContext } from '@/common/context';
import { Delete as DeleteIcon, Inbox } from '@mui/icons-material';
import { Box, Divider, IconButton, List, ListItem, ListItemAvatar, ListSubheader, MenuItem, TextField, Typography } from '@mui/material';
import { Label } from 'bpartners-annotator-react-client';
import { ChangeEvent, FC, useRef } from 'react';
import { IInputPickerProps, ILabelItemProps, useStyles } from '.';

const InputPicker: FC<IInputPickerProps> = ({ annotation }) => {
  const { noDisplay, colorContainer } = useStyles();
  const { changeAnnotationColor } = useCanvasAnnotationContext();
  const color = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent) => {
    event.preventDefault();
    changeAnnotationColor(annotation.id, color.current?.value || '');
  };

  return (
    <label htmlFor={`${annotation.id}-input-color`}>
      <form className={colorContainer} style={{ background: annotation.polygon.strokeColor }}>
        <input onChange={handleChange} ref={color} type='color' id={`${annotation.id}-input-color`} className={noDisplay} />
      </form>
    </label>
  );
};

const LabelItem: FC<ILabelItemProps> = ({ annotation }) => {
  const { changeAnnotationLabel, removeAnnotation, labels } = useCanvasAnnotationContext();

  const handleClick = (label: Label) => () => {
    changeAnnotationLabel(annotation.id, label.name || '');
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
        <ListItemAvatar>
          <InputPicker annotation={annotation} />
        </ListItemAvatar>
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
    <List subheader={<ListSubheader>Labelles</ListSubheader>}>
      {annotations.map((annotation, k) => (
        <LabelItem annotation={annotation} key={`${k} ${annotation.id}`} />
      ))}
      {annotations.length === 0 && (
        <Box display='flex' color='#00000050' marginTop='2rem' width='100%' alignItems='center' flexDirection='column'>
          <div>
            <Inbox sx={{ fontSize: '6rem' }} />
          </div>
          <Typography width={200} textAlign='center'>
            Pas encore d&apos;annotation effectué.
          </Typography>
        </Box>
      )}
    </List>
  );
};
