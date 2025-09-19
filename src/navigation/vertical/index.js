export default [
  {
    title: 'Content',
    icon: { icon: 'tabler-file-description' },
    children: [
      {
        title: 'Pages',
        to: { name: 'admin-pages' },
        icon: { icon: 'tabler-file-description' },
      },
      {
        title: 'Articles',
        to: { name: 'admin' },
        icon: { icon: 'tabler-news' },
      },
      {
        title: 'Events',
        to: { name: 'admin-calendar' },
        icon: { icon: 'tabler-calendar-event' },
      },
      {
        title: 'Forms',
        to: { name: 'admin-forms' },
        icon: { icon: 'tabler-forms' },
      },
      {
        title: 'Products',
        to: { name: 'admin-products' },
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
        to: { name: 'admin-team-members' },
        icon: { icon: 'tabler-users' },
      },
      {
        title: 'Users',
        to: { name: 'admin-users' },
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
        to: { name: 'admin-opinions' },
        icon: { icon: 'tabler-quote' },
      },
      {
        title: 'Testimonials',
        to: { name: 'admin-testimonials' },
        icon: { icon: 'tabler-message' },
      },
      {
        title: 'Partners',
        to: { name: 'admin-partners' },
        icon: { icon: 'tabler-heart-handshake' },
      },
      {
        title: 'FAQs',
        to: { name: 'admin-faqs' },
        icon: { icon: 'tabler-help' },
      },
    ],
  },
]
