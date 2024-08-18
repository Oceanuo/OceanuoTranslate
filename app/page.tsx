import Settings from './components/Settings';

export const metadata = {
  title: 'FatherTranslator',
  description: 'Translate text using AI',
  icons: {
    icon: '/fathertranslator.png',
    apple: '/fathertranslator.png',
  },
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Settings />
    </main>
  );
}