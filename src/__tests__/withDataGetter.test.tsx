import * as React from 'react';
import { mount } from 'enzyme';
import withDataGetter from '../withDataGetter';

describe('withDataGetter', () => {
    const ChildComponent = (props:  { text: string }) => props.text;

    it('should allow child to render', () => {
        const WrappedComponent = withDataGetter<{}, { text: string }>(
            async () => ({ text: 'fetched' }),
            () => ({ text: 'nothing' })
        )(ChildComponent);

        const wrapper = mount(<WrappedComponent />);

        expect(wrapper.find(ChildComponent)).toHaveLength(1);
    });

    it('should update child state on component did mount', done => {
        const WrappedComponent = withDataGetter<{}, { text: string }>(
            async () => ({ text: 'fetched' }),
            () => ({ text: 'nothing' })
        )(ChildComponent);

        const wrapper = mount(
            <WrappedComponent />
        );

        setTimeout(() => {
            wrapper.update();
            expect(wrapper.text()).toBe('fetched');
            done();
        }, 10);
    });

    it('should update child state when dependent props change', done => {
        const WrappedComponent = withDataGetter<{ query: string }, { text: string }>(
            async ({ query }) => ({ text: query }),
            () => ({ text: 'nothing' }),
            ({ query }) => [query],
        )(ChildComponent);

        const wrapper = mount(
            <WrappedComponent query="A" />
        );

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
        const WrappedComponent = withDataGetter<{ other: string; query: string }, { text: string }>(
            async ({ query }) => ({ text: query }),
            () => ({ text: 'nothing' }),
            ({ query }) => [query],
        )(ChildComponent);

        const wrapper = mount(
            <WrappedComponent query="A" other="Z" />
        );

        setTimeout(() => {
            wrapper.update();
            expect(wrapper.text()).toBe('A');

            wrapper.setProps({ other: 'B' });
            setTimeout(() => {
                wrapper.update();
                expect(wrapper.text()).toBe('A');
                done();
            }, 10);
        }, 10);
    });

    it('should allow child specific props to pass to child and not trigger refetches', done => {
        const spy = jest.fn(async ({ query }) => ({ text: query }));
        const WrappedComponent = withDataGetter<{ other: string; query: string }, { text: string }>(
            spy,
            () => ({ text: 'nothing' }),
            ({ query }) => [query],
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
        const WrappedComponent = withDataGetter<{}, { text: string }>(
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
        const WrappedComponent = withDataGetter<{}, { text: string }>(
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
        const WrappedComponent = withDataGetter<{}, { text: string }>(
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
        const WrappedComponent = withDataGetter<{}, { text: string }>(
            () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({ text: 'fetched' });
                    }, 50);
                });
            },
        )(ChildComponent, CustomLoader);

        const wrapper = mount(<WrappedComponent />);

        expect(wrapper.find(CustomLoader)).toHaveLength(1);
    });
});
