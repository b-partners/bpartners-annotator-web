import { UserRole, Whoami } from 'bpartners-annotator-Ts-client';

export const redirectionByRole = (whoami: Whoami | null) => {
  if (whoami?.user?.role && whoami?.user?.team) {
    switch (whoami.user?.role) {
      case UserRole.ADMIN:
        return `/dashboard`;
      default:
        return `/teams/${whoami.user.team.id}/jobs`;
    }
  }
  return '/login';
};
