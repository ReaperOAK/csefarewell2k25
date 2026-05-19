import React from 'react';
import type { Metadata } from 'next';
import Providers from './providers';
import '../index.css';
import './global-styles.css';

export const metadata: Metadata = {
  title: 'OBLIVION - Gothic Masquerade Farewell',
  description: 'OBLIVION - A Gothic Masquerade Farewell by CSE Juniors',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo192.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#000000" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700&family=Montserrat:wght@400;500;600&family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=Oswald:wght@300;400;500;700&family=Inter:wght@200;300;400;500&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}