import { Box, Card, CardActions, CardContent, CardHeader, CircularProgress } from '@mui/material';
import { FC, ReactNode, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { page_list_card_action, page_list_card_content, page_list_container } from '.';
import { ListPageProvider, useListPageContext } from '../../context';
import { useGetListPageTitle } from '../../hooks';

const Loading: FC<{ children?: any }> = props => {
    const { children } = props;
    const { isLoading, setLoading } = useListPageContext();
    const { pathname } = useLocation();

    useEffect(() => {
        setLoading(false);
    }, [setLoading, pathname]);

    return isLoading ? (
        <Box textAlign='center' sx={{ color: 'text.secondary' }}>
            <CircularProgress />
        </Box>
    ) : (
        children || <Outlet />
    );
};

export const ListPageLayout: FC<{ children?: ReactNode; actions?: ReactNode }> = ({ children, actions }) => {
    // const getPath = useGetPrevRoute();
    // const [isLoading, setLoading] = useState(false);
    // const { pathname } = useLocation();
    // const navigate = useNavigate();

    // useEffect(() => {
    //     setLoading(false);
    // }, [pathname]);

    // const handleClick = () => {
    //     setLoading(true);
    //     navigate(getPath());
    // };

    const title = useGetListPageTitle();

    return (
        <ListPageProvider>
            <Box sx={page_list_container}>
                <Card>
                    <CardHeader title={title} />
                    <CardContent sx={page_list_card_content}>
                        <Loading>{children}</Loading>
                    </CardContent>
                    <CardActions sx={page_list_card_action}>{actions}</CardActions>
                </Card>
            </Box>
        </ListPageProvider>
    );
};
