import * as React from 'react';
import { mount } from 'enzyme';
import withDataGetter, { DefaultChildProps } from '../withDataGetter';

describe('withDataGetter', () => {
    const ChildComponent = (props:  { text: string } & DefaultChildProps) => props.text;

    it('should allow child to render', () => {
        const WrappedComponent = withDataGetter(
            async () => ({ text: 'fetched' }),
            () => ({ text: 'nothing' })
        )(ChildComponent);

        const wrapper = mount(<WrappedComponent />);

        expect(wrapper.find(ChildComponent)).toHaveLength(1);
    });

    it('should update child state on component did mount', done => {
        const WrappedComponent = withDataGetter(
            async () => ({ text: 'fetched' }),
            () => ({ text: 'nothing' })
        )(ChildComponent);

        const wrapper = mount(<WrappedComponent />);

        setTimeout(() => {
            wrapper.update();
            expect(wrapper.text()).toBe('fetched');
            done();
        }, 10);
    });

    it('should update child state when dependent props change', done => {
        type OuterProps = {
            query: string;
        };
        const WrappedComponent = withDataGetter(
            async ({ query }: OuterProps) => ({ text: query }),
            () => ({ text: 'nothing' }),
            ({ query }: OuterProps) => [query],
        )(ChildComponent);

        const wrapper = mount(<WrappedComponent query="A" />);

        setTimeout(() => {
            wrapper.update();
            expect(wrapper.text()).toBe('A');

            wrapper.setProps({ query: 'B' });
            setTimeout(() => {
                wrapper.update();
                expect(wrapper.text()).toBe('B');
                done();
            }, 10);
        }, 10);
    });

    it('should allow child specific props to update the child component', done => {
        type OuterProps = {
            query: string;
            other: string;
        };
        type InnerProps = {
            other: string;
        } & Result & DefaultChildProps;
        type Result = {
            text: string;
        };
        const MultiOutputChildComponent = (props: InnerProps) => <>{props.other}{props.text}</>;

        const WrappedComponent = withDataGetter<OuterProps, InnerProps, Result>(
            async ({ query }: OuterProps) => ({ text: query }),
            () => ({ text: 'nothing' }),
            ({ query }: OuterProps) => [query],
        )(MultiOutputChildComponent);

        const wrapper = mount(<WrappedComponent query="A" other="Z" />);

        setTimeout(() => {
            wrapper.update();
            expect(wrapper.text()).toBe('ZA');

            wrapper.setProps({ other: 'B' });
            setTimeout(() => {
                wrapper.update();
                expect(wrapper.text()).toBe('BA');
                done();
            }, 10);
        }, 10);
    });

    it('should allow child specific props to pass to child and not trigger refetches', done => {
        type OuterProps = {
            query: string;
            other: string;
        };
        const spy = jest.fn(async ({ query }) => ({ text: query }));
        const WrappedComponent = withDataGetter(
            spy,
            () => ({ text: 'nothing' }),
            ({ query }: OuterProps) => [query],
        )(ChildComponent);

        const wrapper = mount(<WrappedComponent query="A" other="Z" />);

        setTimeout(() => {
            wrapper.update();
            wrapper.setProps({ other: 'B' });
            setTimeout(() => {
                wrapper.update();
                expect(spy).toHaveBeenCalledTimes(1);
                done();
            }, 10);
        }, 10);
    });

    it('should show loading screen before fetch returns, default state exists, and child never rendered', () => {
        const WrappedComponent = withDataGetter(
            () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({ text: 'fetched' });
                    }, 50);
                });
            },
        )(ChildComponent);

        const wrapper = mount(<WrappedComponent />);

        expect(wrapper.text()).toBe('Loading...');
    });

    it('should not show loading screen once initial fetch has finished', done => {
        const WrappedComponent = withDataGetter(
            () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({ text: 'fetched' });
                    }, 50);
                });
            },
        )(ChildComponent);

        const wrapper = mount(<WrappedComponent />);

        setTimeout(() => {
            wrapper.update();
            expect(wrapper.text()).toBe('fetched');
            done();
        }, 60);
    });

    it('should not show loading screen if initial data is supplied', () => {
        const WrappedComponent = withDataGetter(
            () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({ text: 'fetched' });
                    }, 50);
                });
            },
            () => ({ text: 'child shown' }),
        )(ChildComponent);

        const wrapper = mount(<WrappedComponent />);

        expect(wrapper.text()).toBe('child shown');
    });

    it('should allow use of custom loading screen', () => {
        const CustomLoader = () => (
            <div>
                this is myu custom loading screen
            </div>
        );
        const WrappedComponent = withDataGetter(
            () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({ text: 'fetched' });
                    }, 50);
                });
            },
        )(ChildComponent, <CustomLoader />);

        const wrapper = mount(<WrappedComponent />);

        expect(wrapper.find(CustomLoader)).toHaveLength(1);
    });
});
