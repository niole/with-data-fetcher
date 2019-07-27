import * as React from 'react';

type ChildComponent<O> = (outerProps: O) => JSX.Element;

type DefaultChildProps = {
    getData: () => void;
};

function getData<FetchArguments, Result>(
        fetcher: (input: FetchArguments) => Promise<Result>,
        props: FetchArguments,
        setResult: (result: any) => any
    ): () => void {
    return () => fetcher(props).then(setResult).catch((error: any) => {
        console.error(`fetch failed: ${error}`);
    });
}

export default function withDataGetter<FetchArguments, Result extends {}>(
    fetcher: (input: FetchArguments) => Promise<Result>,
    defaultState?: (props: FetchArguments) => Result,
    whenChanges?: (props: FetchArguments) => any,
): (Component: ChildComponent<Result & DefaultChildProps>) => ChildComponent<FetchArguments> {
    return Component => props => {
        const [result, setResult] = React.useState(defaultState ? defaultState(props) : undefined);
        React.useEffect(() => {
            fetcher(props).then(setResult).catch((error: any) => {
                console.error(`fetch failed: ${error}`);
            });
        }, whenChanges ? [whenChanges(props)] : []);
        return !!result ? (
            <Component
                {...result}
                getData={getData(fetcher, props, setResult)}
            />
        ) : (
            <div>
                Loading...
            </div>
        );
    };
}
