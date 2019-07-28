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
* a function prop, **getData** is provided to the wrapped child component, which is used to fetch data at adhoc times

# Docs

**withDataGetter**
* param **fetcher** - (outerProps) => Promise<resultData> - *required* function that takes the props passed to the composed child React component and returns a promise with the fetched data.
* param **defaultState** - (outerProps) => defaultResultData - *optional* function that returns the default version of the result data. If not provided, the container will return the loading component until the result data has been fetched.
* param **whenChanges** - (outerProps) => any[] - *optional* function that returns an array of dependencies, any of which change, will trigger the data to be fetched again.
* returns **anonymous function**
* * param **ChildComponent** *required* component to wrap
* * param **LoadingScreen** *optional* loading component to show when no data available

# Examples

## TSX example

```
import * as React from 'react';
import withDataFetcher from 'with-data-fetcher';

const DataRenderer = ({ otherData, data, getData }: ChildProps) => {
    return (
        <>
          <h1>
            {otherData}
          </h1>
          <button onClick={() => getData({ whichData: 1 })}>
            get second set of data
          </button>
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
type ChildProps = FetchResult & { otherData: string; getData: (args?: OuterProps) => void }:

const ComposedComponent = withDataFetcher<OuterProps, ChildProps, FetchResult>(
    async ({ whichData }) => ({ data: dataStore[whichData] }),
)(DataRenderer);

ReactDOM.render(<ComposedComponent whichData={0} otherData="otherpieceofdata" />, document.body);

```
