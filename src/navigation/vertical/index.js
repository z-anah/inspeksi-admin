export default [
  {
    title: 'Home',
    to: { name: 'root' },
    icon: { icon: 'tabler-smart-home' },
  },
  {
    title: 'Second page',
    to: { name: 'second-page' },
    icon: { icon: 'tabler-file' },
  },
  {
    title: 'Admin',
    icon: { icon: 'tabler-settings' },
    children: [
      {
        title: 'Pages',
        to: { name: 'admin-pages' },
        icon: { icon: 'tabler-file-description' },
      },
      {
        title: 'Articles',
        to: { name: 'admin-articles' },
        icon: { icon: 'tabler-news' },
      },
      {
        title: 'Testimonials',
        to: { name: 'admin-testimonials' },
        icon: { icon: 'tabler-message' },
      },
      {
        title: 'Partners',
        to: { name: 'admin-partners' },
        icon: { icon: 'heart-handshake' },
      },
      {
        title: 'Events',
        to: { name: 'admin-events' },
        icon: { icon: 'tabler-calendar-event' },
      },
      {
        title: 'Forms',
        to: { name: 'admin-forms' },
        icon: { icon: 'tabler-forms' },
      },
    ],
  },
]
