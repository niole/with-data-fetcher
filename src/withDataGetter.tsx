import * as React from 'react';

const defaultLoadingScreen = (
    <div>
        Loading...
    </div>
);

type ChildComponent<O extends {}> = React.StatelessComponent<O>
| React.ComponentClass<O>
| ((props: O) => React.ReactNode);

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
    whenChanges?: (props: FetchArguments) => any[],
): (Component: ChildComponent<Result & DefaultChildProps>, LoadingScreen?: any) => React.StatelessComponent<FetchArguments> {
    return (Component, LoadingScreen) => (props: FetchArguments) => {
        const [result, setResult] = React.useState(defaultState ? defaultState(props) : undefined);

        React.useEffect(() => {
            fetcher(props).then(setResult).catch((error: any) => {
                console.error(`fetch failed: ${error}`);
            });
        }, whenChanges ? whenChanges(props) : []);

        // TODO workaround bc ts won't allow reactnode to be returned
        const ChildComponent = Component as React.StatelessComponent<Result & DefaultChildProps>;
        if (!!result) {
            return (
                <ChildComponent
                    {...result}
                    getData={getData(fetcher, props, setResult)}
                />
            );
        }
        return LoadingScreen || defaultLoadingScreen;
    };
}
