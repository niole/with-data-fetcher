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

});
