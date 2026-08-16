import { Jost, Poppins, Playfair_Display, Outfit, Libre_Baskerville } from 'next/font/google';
import CompanyBrandShell from '@/app/components/CompanyBrandShell';

const jost = Jost({ subsets: ['latin'], variable: '--font-brand-jost', display: 'swap' });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-brand-poppins',
  display: 'swap',
});
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-brand-playfair',
  display: 'swap',
});
const outfit = Outfit({ subsets: ['latin'], variable: '--font-brand-outfit', display: 'swap' });
const libre = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-brand-libre',
  display: 'swap',
});

export default function CompaniesLayout({ children }: { children: React.ReactNode }) {
  return (
    <CompanyBrandShell
      className={`${jost.variable} ${poppins.variable} ${playfair.variable} ${outfit.variable} ${libre.variable}`}
    >
      {children}
    </CompanyBrandShell>
  );
}
