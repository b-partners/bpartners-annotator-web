import { useLocation } from 'react-router';

export const useSession = () => {
    const { pathname } = useLocation();

    const isAdmin = () => !pathname.includes('team') && !pathname.includes('login') && pathname !== '/';
    const isUser = () => !isAdmin();

    return { isAdmin, isUser };
};
