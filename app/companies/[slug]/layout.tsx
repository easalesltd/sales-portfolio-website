import CompanyRouteDarkTheme from '@/app/components/CompanyRouteDarkTheme';

export default async function CompaniesSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const darkBrandPage = slug === 'cambridge-confectionery-company';

  return (
    <CompanyRouteDarkTheme enabled={darkBrandPage}>{children}</CompanyRouteDarkTheme>
  );
}
