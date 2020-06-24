import Head from 'next/head';
import ShapeApp from '../components/ShapeApp';
import CommitTimeline from '../components/CommitTimeline';
import {NUM_COMMITS} from '../constants/constants';
import Tool from '../components/Tool';
import Legend from '../components/Legend';
import Chart from '../components/Chart';

export default function Home() {
  const vizWidth = 800;
  return (
    <>
      <Head>
        <title>Understanding Git Bisect</title>
        <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;700&family=Montserrat&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="mb-10 md:mb-40">
        <h1 className="text-2xl md:text-5xl leading-tight mb-6 mt-4 md:mt-20 p-container">
          Using Git Bisect Effectively
        </h1>
        <p className="text-xl mb-4 p-container">
          Software developers generally use a version control system like git to save and manage the
          history of the code they write. When they add a new feature or fix a bug, they "commit"
          these changes to their code repository.
        </p>
        <p className="text-xl mb-4 p-container">
          As a project moves forward, developers may discover that some existing feature or behavior
          has broken. Often it's not clear <em>why</em> this functionality broke, and searching
          through dozens of commits and files to debug the issue can be painful.
        </p>
        <p className="text-xl mb-4 p-container">
          Thankfully, the git version control system has a feature called "bisect" that is a
          lifesaver in these scenarios. This document offers an interactive visualization to help
          understand how git bisect works and why its so effective.
        </p>
        <h3 className="text-xl md:text-2xl leading-tight mb-6 mt-4 md:mt-8 p-container">
          Discovering an Issue
        </h3>
        <p className="text-xl mb-4 p-container">
          Imagine we're working on an app that renders a collection of fun shapes. Unfortunately it
          appears that the star shape got misaligned at some point, but its unclear when or why.
        </p>
        <div className="mt-8 mb-8 v-container">
          <Tool
            showTerminal={false}
            showLegend
            goodRange={[1, 1]}
            badRange={[NUM_COMMITS, NUM_COMMITS]}
            width={vizWidth}
          />
        </div>
        <p className="text-xl mb-4 p-container">
          We know that it was working when we launched v1 of the app last month, but there have been
          dozens of changes since then and finding the problematic commit would be tedious.
        </p>
        <h3 className="text-xl md:text-2xl leading-tight mb-6 mt-4 md:mt-8 p-container">
          Bisecting the Issue
        </h3>
        <p className="text-xl mb-4 p-container">
          Git bisect allows you to do a binary search of the commits between a known good and known
          bad commit. Because it uses a binary search, you will need to verify at most log(n)
          commits – which is much easier than manually checking all commits one by one.
        </p>
        <p className="text-xl mb-4 p-container">
          Use the interactive tool below to see how git bisect works in action:
        </p>
        <div className="mt-8 mb-8 v-container">
          <Tool width={vizWidth} />
        </div>
        <h3 className="text-xl md:text-2xl leading-tight mb-6 mt-4 md:mt-8 p-container">
          How Bisect Scales
        </h3>
        <div className="p-container">
          <div className="chart-container">
            <Chart />
          </div>
          <p className="text-xl mb-4 p-container">
            This chart shows how the number of steps required to perform a git bisect scales with
            the number of commits that fall between the known good and known bad commits.
          </p>
          <p className="text-xl mb-4 p-container">
            You can see that even if there are ten thousand commits to search through, we can still
            find the problematic commit in roughly 14 steps. This is a non-intuitive concept that
            really illustrates the power of git bisect and binary searches in general.
          </p>
          <p className="text-xl mb-4 p-container clear-both">
            Lorem ipsum dolor sit amet. Hello world okay.
          </p>
        </div>
      </main>

      <style jsx>{`
        .p-container {
          width: 100%;
          max-width: 680px;
          margin-left: auto;
          margin-right: auto;
          padding: 0 10px;
        }
        .v-container {
          width: 100%;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
          padding: 0 10px;
        }

        .monospace {
          font-family: monospace;
        }
        .chart-container {
          width: 400px;
        }
        @media (min-width: 600px) {
          .chart-container {
            margin: 0 10px 10px 10px;
            float: right;
          }
        }
        @media (min-width: 768px) {
          .chart-container {
            margin: 0 -20px 10px 10px;
          }
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
