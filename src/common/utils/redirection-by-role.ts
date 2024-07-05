import { UserRole, Whoami } from '@bpartners-annotator/typescript-client';

export const redirectionByRole = (whoami: Whoami | null) => {
    switch (whoami?.user?.role) {
        case UserRole.ADMIN:
            return `/jobs?page=1&perPage=10`;
        default:
            return `/teams/${whoami?.user?.team?.id}/jobs`;
    }
};
