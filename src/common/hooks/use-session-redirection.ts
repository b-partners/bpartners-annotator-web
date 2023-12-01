import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authProvider } from '../../providers';

export const useSessionRedirection = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const redirection = authProvider.getRedirectionBySession();
    if (!redirection.includes('login')) {
      navigate(redirection);
    }

    return () => {};
  }, [navigate]);
};
