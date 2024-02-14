import { getUrlParams } from './get-url-params';

export const paginationNameByDependencies = (deps: string[]) => {
    const { searchParams } = getUrlParams();
    let name = '-';

    for (let dependency of deps) {
        name += `${dependency}=${searchParams.get(dependency)}`;
    }

    return name;
};
