"use client"

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';

export function Sponsors() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  const sponsors = [
    {
      name: '0G',
      logo: '/logos/0g.svg',
      logoDark: '/logos/0g-dark.svg',
      url: 'https://0g.ai',
      width: 150,
      height: 60,
      className: 'h-12 md:h-16'
    },
    {
      name: 'Kite AI',
      logo: '/logos/KiteAI.svg',
      logoDark: '/logos/KiteAI-dark.svg',
      url: 'https://gokite.ai',
      width: 150,
      height: 60,
      className: 'h-12 md:h-20'
    },
    {
      name: 'Camp Network',
      logo: '/logos/camp.svg',
      logoDark: '/logos/camp-dark.svg',
      url: 'https://www.campnetwork.xyz',
      width: 150,
      height: 60,
      className: 'h-12 md:h-16'
    },
    {
      name: 'Delysium',
      logo: '/logos/delysium.svg',
      logoDark: '/logos/delysium-dark.svg',
      url: 'https://www.delysium.com',
      width: 150,
      height: 60,
      className: 'h-20 md:h-30'
    },
  ];

  return (
    <section className="py-16 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">赞助商</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          感谢以下合作伙伴对AI³ Growth Journey的大力支持
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
        {sponsors.map((sponsor) => (
          <Link
            href={sponsor.url}
            key={sponsor.name}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-105 flex items-center justify-center"
          >
            <Image
              src={isDarkMode && sponsor.logoDark ? sponsor.logoDark : sponsor.logo}
              alt={`${sponsor.name} logo`}
              width={sponsor.width}
              height={sponsor.height}
              className={`w-auto object-contain ${sponsor.className}`}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}