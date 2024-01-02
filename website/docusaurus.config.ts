import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "sheets-translate-to-json",
  tagline: "Translate Google Sheets to JSON",
  favicon: "img/sheets-translate-to-json.ico",

  // Set the production url of your site here
  url: "https://josephjoberno.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/sheets-translate-to-json/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "josephjoberno", // Usually your GitHub org/user name.
  projectName: "sheets-translate-to-json", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },

        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "Home",
      logo: {
        alt: "sheets-translate-to-json-logo",
        src: "img/sheets-translate-to-json.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "GettingStarted",
          position: "left",
          label: "docs",
          items: [
            {
              type: "doc",
              id: "GettingStarted/installation",
            },
            {
              type: "doc",
              id: "GettingStarted/configuration",
            },
          ],
        },
        // {
        //   type: "localeDropdown",
        //   position: "right",
        // },

        {
          href: "https://github.com/josephjoberno/sheets-translate-to-json.git",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      copyright: `Copyright © ${new Date().getFullYear()} @josephjoberno, MIT License`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
