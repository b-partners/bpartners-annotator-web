import { useLocation } from 'react-router-dom';

export const useGetListPageTitle = () => {
    const { pathname } = useLocation();

    return pathname.includes('tasks') ? 'Liste des tâches' : 'Liste des jobs';
};
