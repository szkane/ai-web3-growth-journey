import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <Image 
          src="/icon.svg" 
          width={24} 
          height={24} 
          alt="01MVP Logo" 
        />
        01MVP
      </>
    ),
  },
  links: [
    {
      text: 'AI Web3指南',
      url: '/docs',
      active: 'nested-url',
    },
  ],
};
