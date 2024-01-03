import { useNavigate } from 'react-router';
import { useGetPrevRoute } from '../../hooks';
import { BpButton } from '../basics';

export const CancelEvaluationButton = () => {
    const getPrevRoute = useGetPrevRoute();
    const navigate = useNavigate();

    const handleClick = () => navigate(getPrevRoute());

    return <BpButton label='Annuler' onClick={handleClick} />;
};
