export const getUrlParams = () => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    return { url, searchParams: url.searchParams };
};

type UrlParamResult<P extends Record<string, any>> = {
    page: number;
    perPage: number;
    setParam: (name: string, value: string) => void;
} & Record<keyof P, string>;

export const urlParamsHandler = <P extends Record<string, any> = {}>(others: P = {} as any) => {
    const { searchParams } = getUrlParams();

    const page = +(searchParams.get('page') || '1');
    const perPage = +(searchParams.get('perPage') || '10');

    const setParam = (name: string, value: string) => {
        const { searchParams, url } = getUrlParams();
        searchParams.set(name, value);
        window.history.replaceState({}, document.title, url);
    };

    const result: any = {
        page,
        perPage,
        setParam
    };
    Object.keys(others).forEach(key => (result[key] = searchParams.get(key) || others[key]));

    return result as UrlParamResult<P>;
};
