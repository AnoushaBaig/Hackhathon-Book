import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Physical-AI-Humanoid Robots',
  tagline: 'Comprehensive Guide to Artificial Intelligence and Robotics',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://anoushabaig.vercel.app',  // apni Vercel site ka URL yahan dal sakti ho, optional
  baseUrl: '/',  // <-- yeh change kiya hai GitHub Pages se Vercel ke liye

  organizationName: 'AnoushaBaig',
  projectName: 'Physical-AI-Humanoid-Robots',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/AnoushaBaig/Physical-AI-Humanoid-Robots/tree/main/', // apne repo ka link yahan update karo
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/AnoushaBaig/Physical-AI-Humanoid-Robots/tree/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: ['@docusaurus/theme-live-codeblock'],
  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Physical-AI-Humanoid Robots',
      logo: {
        alt: 'Physical-AI-Humanoid Robots Logo',
        src: 'img/logo.svg',
      },
      items: [
        {to: '/docs/chatbot', label: 'AI Assistant', position: 'left'},
        {
          href: 'https://github.com/AnoushaBaig/Physical-AI-Humanoid-Robots',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Resources',
          items: [
            {
              label: 'Documentation',
              to: '/docs/intro',
            },
            {
              label: 'AI Assistant',
              to: '/docs/chatbot',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/AnoushaBaig/Physical-AI-Humanoid-Robots',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'About',
              to: '/docs/intro',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Physical-AI-Humanoid Robots. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
