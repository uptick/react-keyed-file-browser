/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'React Keyed File Browser | Uptick',
  tagline: 'Folder based file browser given a flat keyed list of objects, powered by React.',
  url: 'https://uptick.github.io/react-keyed-file-browser/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'uptick', // Usually your GitHub org/user name.
  projectName: 'react-keyed-file-browser', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'React Keyed File Browser',
      logo: {
        alt: 'React Keyed File Browser',
        src: 'img/favicon.ico',
      },
      items: [
        {
          href: 'https://github.com/uptick/react-keyed-file-browser/',
          label: 'GitHub',
        },
        {
          href: 'https://www.npmjs.com/package/react-keyed-file-browser/',
          label: 'NPM',
        },
      ],
    },
    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} Uptick Pty Ltd. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
      },
    ],
  ],
};
