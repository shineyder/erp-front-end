import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'bar-chart',
    link: '/',
    home: true,
  },
  {
    title: 'Produtos',
    icon: 'shopping-cart-outline',
    link: '/',
    home: true,
  },
  {
    title: 'Vendas',
    icon: 'pie-chart-outline',
    link: '/',
    home: true,
  },
  {
    title: 'Relatórios',
    icon: 'clipboard',
    link: '/',
    home: true,
  },
  /* {
    title: 'Autenticação',
    icon: 'lock-outline',
    children: [
      {
        title: 'Login',
        link: '/auth/login',
      },
       {
        title: 'Registrar',
        link: '/auth/sign-up',
      },
    ],
  }, */
];
