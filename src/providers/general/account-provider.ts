import { cache } from '../../common/utils';
import { securityApi } from '../api';

export const accountProvider = {
    async whoami() {
        const { data } = await securityApi().whoami();
        cache.setWhoami(data);
        return data;
    },
};
