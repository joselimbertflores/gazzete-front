import { UserRole } from '../../../../core/auth/auth.types';

export const USER_ROLE_OPTIONS = [
  {
    value: UserRole.ADMIN,
    title: 'Administrador',
    description: 'Administracion de accesos y catalogos',
  },
  {
    value: UserRole.USER,
    title: 'Usuario',
    description: 'Administracion de documentos',
  },
];
