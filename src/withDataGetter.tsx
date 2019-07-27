import * as React from 'react';

const defaultLoadingScreen = (
    <div>
        Loading...
    </div>
);

type ChildComponent<O extends {}> = React.StatelessComponent<O>
| React.ComponentClass<O>
| ((props: O) => React.ReactNode);

export type DefaultChildProps = {
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

export default function withDataGetter<OuterProps extends {}, ChildProps extends (Result & DefaultChildProps), Result extends {}>(
    fetcher: (input: OuterProps) => Promise<Result>,
    defaultState?: (props: OuterProps) => Result,
    whenChanges?: (props: OuterProps) => any[],
): (Component: ChildComponent<ChildProps>, LoadingScreen?: any) => React.StatelessComponent<OuterProps> {
    return (Component, LoadingScreen) => (props: OuterProps) => {
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
                    {...props}
                    getData={getData(fetcher, props, setResult)}
                />
            );
        }
        return LoadingScreen || defaultLoadingScreen;
    };
}
