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

    xit('should update child state only when props change', done => {

    });

    xit('should allow child specific props to update the child component', done => {

    });

    xit('should allow child specific props to pass to child and not trigger refetches', done => {

    });

    xit('should show loading screen before fetch returns and child has never been rendered', done => {

    });

    xit('should not show loading screen once initial fetch has finished', done => {

    });

    xit('should not show loading screen if initial data is supplied', done => {

    });

    xit('should allow use of custom loading screen', done => {

    });
});
