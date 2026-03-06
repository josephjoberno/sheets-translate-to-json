import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "sheets-translate-to-json",
  tagline: "Convert Google Sheets translations to structured JSON files",
  favicon: "img/sheets-translate-to-json.ico",

  url: "https://josephjoberno.github.io",
  baseUrl: "/sheets-translate-to-json/",

  organizationName: "josephjoberno",
  projectName: "sheets-translate-to-json",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr", "es"],
    localeConfigs: {
      en: { label: "English" },
      fr: { label: "Francais" },
      es: { label: "Espanol" },
    },
  },

  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        language: ["en", "fr", "es"],
        indexBlog: false,
        docsRouteBasePath: "/docs",
      },
    ],
  ],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl:
            "https://github.com/josephjoberno/sheets-translate-to-json/tree/main/website/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/sheets-translate-to-json.png",
    navbar: {
      title: "sheets-translate-to-json",
      logo: {
        alt: "sheets-translate-to-json logo",
        src: "img/sheets-translate-to-json.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docs",
          position: "left",
          label: "Docs",
        },
        {
          type: "localeDropdown",
          position: "right",
        },
        {
          href: "https://github.com/josephjoberno/sheets-translate-to-json",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Installation",
              to: "/docs/getting-started/installation",
            },
            {
              label: "API Reference",
              to: "/docs/api/api-reference",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/josephjoberno/sheets-translate-to-json",
            },
            {
              label: "npm",
              href: "https://www.npmjs.com/package/sheets-translate-to-json",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} @josephjoberno, MIT License`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "json"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
