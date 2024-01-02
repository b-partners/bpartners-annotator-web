import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import { FC, useState } from 'react';
import { BpTextField, IBpTextField } from '.';

export const BpPasswordField: FC<Omit<IBpTextField, 'icon' | 'onClickOnIcon' | 'type'>> = props => {
    const [isVisible, setVisibility] = useState(false);

    const type = isVisible ? 'text' : 'password';
    const icon = isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />;
    const handleClickOnIcon = () => setVisibility(last => !last);

    return <BpTextField {...props} onClickOnIcon={handleClickOnIcon} type={type} icon={icon} />;
};
