export const getUrlParams = () => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    return { url, searchParams: url.searchParams };
};

export const paginationUrlHandler = (others: Record<string, any> = {}) => {
    const { searchParams } = getUrlParams();

    const page = +(searchParams.get('page') || '1');
    const perPage = +(searchParams.get('perPage') || '10');

    const result: Record<keyof typeof others, any> = {
        page,
        perPage,
        setParam: (name: string, value: string) => {
            const { searchParams, url } = getUrlParams();
            searchParams.set(name, value);
            window.history.replaceState({}, document.title, url);
        },
    };
    Object.keys(others).forEach(key => (result[key] = searchParams.get(key) || others[key]));

    return { ...result };
};
