import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Optimal 1D-clustering with Dynamic Programming</title>
        <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;700&family=Montserrat&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="container mx-auto">
        <h1 className="text-xl md:text-3xl leading-tight mb-4 mt-4 md:mt-20">
          Optimal 1D-clustering with Dynamic Programming
        </h1>
        <p className="text-xl">Hello world</p>
      </main>

      <style jsx>{``}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
            Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }

        p {
          font-family: 'EB Garamond', serif;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: 'Montserrat', sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </>
  );
}
