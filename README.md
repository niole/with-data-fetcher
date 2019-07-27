# with-data-fetcher

**with-data-fetcher** is a container for React components, which automates getting data from an API when the composed component's props change.

# Why should I use with-data-fetcher?

How many times have you written fetching logic in order to populate the props in a React component? *Way* to many times.

This container gets you up and running with
* data fetching that happens on **componentDidMount** or
* data fetching when specific props change,
* an optional initial state for your React component and
* an optional loading screen component, which shows before the fetched data arrives.
* works with **Typescript**, **React 16.8 >**

# Docs

...

# Examples

## TSX example

```
import * as React from 'react';
import withDataFetcher from 'with-data-fetcher';

const DataRenderer = ({ otherData, data }: ChildProps) => {
    return (
        <>
          <h1>
            {otherData}
          </h1>
          <div>
            {data.map((d: string) => (
              <div>
                {d}
              </div>
            ))}
          </div>
        </>
    );
};

const dataStore = [
  ['a', 'b', 'c'],
  ['1', '2', '3',
];

type OuterProps = { whichData: number };
type FetchResult = { data: string[] };
type ChildProps = FetchResult & { otherData: string }:

const ComposedComponent = withDataFetcher<OuterProps, ChildProps, FetchResult>(
    async ({ whichData }) => ({ data: dataStore[whichData] }),
)(DataRenderer);

ReactDOM.render(<ComposedComponent whichData={0} otherData="otherpieceofdata" />, document.body);

```
