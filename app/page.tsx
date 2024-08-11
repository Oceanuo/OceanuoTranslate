import Settings from './components/Settings';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <link rel="icon" href="/fathertranslator.png" />
      </Head>
      <main className="min-h-screen">
        <Settings />
      </main>
    </>
  );
}