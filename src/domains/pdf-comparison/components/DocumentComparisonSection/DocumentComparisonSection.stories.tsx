import type { Meta, StoryObj } from '@storybook/react';

import { DocumentComparisonSection } from './DocumentComparisonSection';

const meta: Meta<typeof DocumentComparisonSection> = {
  title: 'Molecules/DocumentComparisonSection',
  component: DocumentComparisonSection,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Component for displaying side-by-side document comparison sections with headers and content.',
      },
    },
  },
  argTypes: {
    leftTitle: {
      control: 'text',
      description: 'Title for the left document section',
    },
    rightTitle: {
      control: 'text',
      description: 'Title for the right document section',
    },
    leftContent: {
      control: 'text',
      description: 'Content for the left document section',
    },
    rightContent: {
      control: 'text',
      description: 'Content for the right document section',
    },
    pageInfo: {
      control: 'text',
      description: 'Optional page information',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    id: {
      control: 'text',
      description: 'Unique identifier for the component',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'document-comparison-1',
    leftTitle: 'Odeslaná',
    rightTitle: 'Podepsaná',
    leftContent:
      'Pro výkon 75999 poskytnutý pojištěncům a zahraničním pojištěncům v ambulantní péči se balíčková cena stanoví ve výši 11 654 Kč, pro výkon 75992 poskytnutý pojištěncům a zahraničním pojištěncům v ambulantní péči se balíčková cena stanoví ve výši 16 200 Kč, pro výkon 75993 poskytnutý pojištěncům a zahraničním pojištěncům v ambulantní péči se balíčková cena stanoví ve výši 16 527 Kč. Pro výkon 75999 poskytnutý pojištěncům a zahraničním pojištěncům v ambulantní péči se balíčková cena stanoví ve výši 11 654 Kč, pro výkon 75992 poskytnutý pojištěncům a zahraničním pojištěncům v ambulantní péči se balíčková cena stanoví ve výši 16 200 Kč, pro výkon 75993 poskytnutý pojištěncům a zahraničním pojištěncům v ambulantní péči se balíčková cena stanoví ve výši 16 527 Kč. Pro výkon 75999 poskytnutý pojištěncům a zahraničním pojištěncům v ambulantní péči se balíčková cena stanoví ve výši 11 654 Kč, pro výkon 75992 poskytnutý pojištěncům a zahraničním pojištěncům v ambulantní péči se balíčková cena stanoví ve výši 16 200 Kč, pro výkon 75993 poskytnutý pojištěncům a zahraničním pojištěncům v ambulantní péči se balíčková cena stanoví ve výši 16 527 Kč. Pro výkon 75999 poskytnutý pojištěncům a zahraničním pojištěncům v ambulantní péči se balíčková cena stanoví ve výši 11 654 Kč, pro výkon 75992 poskytnutý pojištěncům a zahraničním pojištěncům v ambulantní péči se balíčková cena stanoví ve výši 16 200 Kč, pro výkon 75993 poskytnutý pojištěncům a zahraničním pojištěncům v ambulantní péči se balíčková cena stanoví ve výši 16 527 Kč.',
    rightContent:
      'Pro výkon 75999 poskytnutý pojištěncům a zahraničním pojištěncům v ambulantní péči se balíčková cena stanoví ve výši 11 654 Kč, pro výkon 75992 poskytnutý pojištěncům a pro výkon 75993 poskytnutý pojištěncům.',
    pageInfo: 'Stránka 1',
  },
};

export const WithoutSubtitles: Story = {
  args: {
    id: 'document-comparison-2',
    leftTitle: 'Odeslaná',
    rightTitle: 'Podepsaná',
    leftContent:
      'U pojištěnců a zahraničních pojištěnců, kteří v průběhu roku 2025 nedosáhli věk 41 let, je úhrada výkonu OKA podmíněna předchozím schválením revizním lékařem příslušné regionální pobočky Pojišťovny.',
    rightContent:
      'U pojištěnců a zahraničních pojištěnců, kteří v průběhu roku 2025 nedosáhli věk 41 let, je úhrada výkonu OKA podmíněna předchozím schválením revizním lékařem příslušné regionální pobočky Pojišťovny.',
    pageInfo: 'Stránka 12 / Článek VII.',
  },
};

export const DifferentContent: Story = {
  args: {
    id: 'document-comparison-3',
    leftTitle: 'Odeslaná',
    rightTitle: 'Podepsaná',
    leftContent:
      'Původní text s několika odstavci obsahující informace o pojistných událostech a jejich zpracování podle platné legislativy.',
    rightContent:
      'Upravený text s několika změnami v obsahu týkající se pojistných událostí podle nové legislativy.',
    pageInfo: 'Stránka 8 / Článek III.',
  },
};
