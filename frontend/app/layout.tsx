import './globals.css';
import "leaflet/dist/leaflet.css";

export const metadata = {
  title: 'CareCompass',
  description: 'Probabilistic breast cancer outcome projection engine. SEER, CMS, PubMed.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
