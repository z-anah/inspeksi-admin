export default [
  {
    title: 'Content',
    icon: { icon: 'tabler-file-description' },
    children: [
      {
        title: 'Pages',
        to: { name: 'pages' },
        icon: { icon: 'tabler-file-description' },
      },
      {
        title: 'Articles',
        to: { path: '/' },
        icon: { icon: 'tabler-news' },
      },
      {
        title: 'Events',
        to: { name: 'calendar' },
        icon: { icon: 'tabler-calendar-event' },
      },
      {
        title: 'Forms',
        to: { name: 'forms' },
        icon: { icon: 'tabler-forms' },
      },
      {
        title: 'Products',
        to: { name: 'products' },
        icon: { icon: 'tabler-package' },
      },
    ],
  },
  {
    title: 'People',
    icon: { icon: 'tabler-users' },
    children: [
      {
        title: 'Team Members',
        to: { name: 'team-members' },
        icon: { icon: 'tabler-users' },
      },
      {
        title: 'Users',
        to: { name: 'users' },
        icon: { icon: 'tabler-users' },
      },
    ],
  },
  {
    title: 'Community',
    icon: { icon: 'tabler-messages' },
    children: [
      {
        title: 'Opinions',
        to: { name: 'opinions' },
        icon: { icon: 'tabler-quote' },
      },
      {
        title: 'Testimonials',
        to: { name: 'testimonials' },
        icon: { icon: 'tabler-message' },
      },
      {
        title: 'Partners',
        to: { name: 'partners' },
        icon: { icon: 'tabler-heart-handshake' },
      },
      {
        title: 'FAQs',
        to: { name: 'faqs' },
        icon: { icon: 'tabler-help' },
      },
    ],
  },
]
