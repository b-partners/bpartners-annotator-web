import { Label } from '@bpartners-annotator/typescript-client';
import { Delete as DeleteIcon, Inbox as InboxIcon } from '@mui/icons-material';
import { Box, Divider, IconButton, List, ListItem, ListSubheader, MenuItem, TextField, Typography } from '@mui/material';
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
          <IconButton edge='end' onClick={() => removeAnnotation(annotation.id)}>
            <DeleteIcon />
          </IconButton>
        }
      >
        <TextField select value={annotation.label} size='small' sx={{ flexGrow: 2 }}>
          {labels.map(label => (
            <MenuItem onClick={handleClick(label)} key={label.id} value={label.name}>
              {label.name}
            </MenuItem>
          ))}
        </TextField>
      </ListItem>
      <Box p={1}>
        <Typography textAlign='justify'>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Excepturi labore voluptate illo provident rem quis voluptatibus repellat, minus possimus
          asperiores voluptas veniam harum, numquam unde? Reprehenderit magni ipsum aliquid nam.
        </Typography>
      </Box>
      <Divider />
    </>
  );
};

export const Sidebar = () => {
  const { annotations } = useCanvasAnnotationContext();

  return (
    <List sx={{ maxHeight: window.innerHeight * 0.7, overflow: 'auto' }} subheader={<ListSubheader>Labels</ListSubheader>}>
      <Box py={2}>
        {annotations.map((annotation, k) => (
          <LabelItem annotation={annotation} key={`${k} ${annotation.id}`} />
        ))}
        {annotations.length === 0 && (
          <Box display='flex' color='#00000050' marginTop='2rem' width='100%' alignItems='center' flexDirection='column'>
            <div>
              <InboxIcon sx={{ fontSize: '6rem' }} />
            </div>
            <Typography width={200} textAlign='center'>
              Pas encore d&apos;annotation effectuée.
            </Typography>
          </Box>
        )}
      </Box>
    </List>
  );
};
