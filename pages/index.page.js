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

      <main>
        <h1 className="text-xl md:text-5xl leading-tight mb-6 mt-4 md:mt-20 p-container">
          Optimal 1D-clustering with Dynamic Programming
        </h1>
        <p className="text-xl container-md mb-4 p-container">
          Clustering data is a common requirement for many real-world applications. Well known
          methods like k-means clustering help cluster n-dimensional data, however many applications
          only require the clustering of data across a single dimension.
        </p>
        <p className="text-xl container-md mb-4 p-container">
          In 2016, researchers Haizhou Wang and Mingzhou Song published a new algorithm called
          Ckmeans<sup>1</sup> that allows for fast & optimal 1-dimensional clustering using a
          dynamic programming technique. This new approach has unlocked capabilities in data
          visualization
          <sup>2</sup> and other fields where clustering performance is vital.
        </p>
        <p className="text-xl container-md mb-4 p-container">
          Many dynamic programming solutions can be difficult to grasp by just reading the code or
          algorithm description, and this one is no exception. This document will visualize how the
          algorithm works internally, hopefully helping others understand it better.
        </p>
        <h3 className="text-2xl leading-tight mb-6 mt-10 p-container">Inputs & Outputs</h3>
      </main>

      <style jsx>{`
        .p-container {
          width: 100%;
          max-width: 680px;
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>

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
