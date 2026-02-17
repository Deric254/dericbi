import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="/style.css" />
        <title>DericBI Analytics</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
