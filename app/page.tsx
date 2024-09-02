import Settings from './components/Settings';

export const metadata = {
  title: 'OceanuoTranslate',
  description: 'Translate text using AI',
  icons: {
    icon: '/oceanuotranslate.png',
    apple: '/oceanuotranslate.png',
  },
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Settings />
    </main>
  );
}