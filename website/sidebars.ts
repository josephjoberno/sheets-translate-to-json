import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/installation',
        'getting-started/configuration',
        'getting-started/sheets-setup',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/basic-usage',
        'guides/examples',
      ],
    },
    {
      type: 'category',
      label: 'API',
      items: [
        'api/api-reference',
      ],
    },
  ],
};

export default sidebars;
