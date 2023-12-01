import { UserRole, Whoami } from 'bpartners-annotator-Ts-client';

export const redirectionByRole = (whoami: Whoami | null) => {
  switch (whoami?.user?.role) {
    case UserRole.ADMIN:
      return `/jobs`;
    default:
      return `/teams/${whoami?.user?.team?.id}/jobs`;
  }
};
