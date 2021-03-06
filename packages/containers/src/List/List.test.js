import React from 'react';
import { shallow } from 'enzyme';
import { Map, fromJS } from 'immutable';

import Container, { DEFAULT_STATE } from './List.container';
import Connected, {
	mapStateToProps,
} from './List.connect';

const list = {
	columns: [
		{ key: 'id', label: 'Id' },
		{ key: 'name', label: 'Name' },
		{ key: 'author', label: 'Author' },
		{ key: 'created', label: 'Created' },
		{ key: 'modified', label: 'Modified' },
	],
	titleProps: {
		key: 'label',
	},
};

const toolbar = {
	filter: {
		placeholder: 'find an object',
	},
	sort: {
		options: [
			{ id: 'id', name: 'Id' },
			{ id: 'name', name: 'Name' },
		],
		field: 'id',
		isDescending: false,
	},
	pagination: {
		startIndex: 1,
		itemsPerPage: 25,
		totalResults: 36,
		onChange: 'pagination:change',
	},
};

const actions = {
	title: 'object:open',
	// left: ['object:add'],
	// items: ['object:delete'],
};

const settings = {
	list,
	toolbar,
	actions,
};


const items = [
	{
		id: 1,
		name: 'Title with actions',
		created: '2016-09-22',
		modified: '2016-09-22',
		author: 'Jean-Pierre DUPONT',
		icon: 'fa fa-file-excel-o',
		display: 'text',
		className: 'item-0-class',
	},
	{
		id: 2,
		name: 'Title in input mode',
		created: '2016-09-22',
		modified: '2016-09-22',
		author: 'Jean-Pierre DUPONT',
		icon: 'fa fa-file-pdf-o',
		display: 'input',
		className: 'item-1-class',
	},
	{
		id: 3,
		name: 'Super long title to trigger overflow on tile rendering',
		created: '2016-09-22',
		modified: '2016-09-22',
		author: 'Jean-Pierre DUPONT with super long name',
	},
];

describe('Container List', () => {
	it('should put default props', () => {
		const wrapper = shallow(
			<Container {...settings} items={items} />
		, { lifecycleExperimental: true });
		const props = wrapper.props();
		expect(props.displayMode).toBe('table');
		expect(props.list.items.length).toBe(3);
		expect(props.list.items[0].id).toBe(1);
		expect(props.list.items[1].id).toBe(2);
		expect(props.list.items[2].id).toBe(3);
		expect(props.list.columns).toBe(list.columns);
		expect(props.list.titleProps.key).toBe('label');
		expect(typeof props.list.titleProps.onClick).toBe('function');
		expect(props.toolbar.filter.placeholder).toBe('find an object');
		expect(typeof props.toolbar.filter.onFilter).toBe('function');
		expect(typeof props.toolbar.display.onChange).toBe('function');
		expect(typeof props.toolbar.sort.onChange).toBe('function');
		expect(props.toolbar.sort.options.length).toBe(2);
		expect(props).toMatchSnapshot();
	});

	it('should render without toolbar', () => {
		const wrapper = shallow(
			<Container items={items} />
		, { lifecycleExperimental: true });
		const props = wrapper.props();
		expect(props.toolbar).toBe(undefined);
	});

	it('should support displayMode as props', () => {
		const wrapper = shallow(
			<Container displayMode="large" items={items} />
		, { lifecycleExperimental: true });
		const props = wrapper.props();
		expect(props.displayMode).toBe('large');
	});

	it('should ontitle click call action creator', () => {
		const dispatchActionCreator = jest.fn();
		const actionCreator = jest.fn();
		const context = {
			registry: {
				'actionCreator:object:open': actionCreator,
			},
		};
		const wrapper = shallow(
			<Container {...settings} items={items} dispatchActionCreator={dispatchActionCreator} />
		, {
			lifecycleExperimental: true,
			context,
		});
		const props = wrapper.props();
		const onClick = props.list.titleProps.onClick;
		const e = {};
		const data = { foo: 'bar' };

		onClick(e, data);
		const calls = dispatchActionCreator.mock.calls;
		expect(calls.length).toBe(1);
		expect(calls[0][0]).toBe('object:open');
		expect(calls[0][1]).toBe(e);
		expect(calls[0][2]).toBe(data);
		expect(calls[0][3].registry).toBe(context.registry);
	});

	it('should call action creator on pagination change', () => {
		// given
		const dispatchActionCreator = jest.fn();
		const actionCreator = jest.fn();
		const context = {
			registry: {
				'actionCreator:pagination:change': actionCreator,
			},
		};
		const wrapper = shallow(
			<Container
				{...settings}
				items={items}
				dispatchActionCreator={dispatchActionCreator}
			/>,
			{
				lifecycleExperimental: true,
				context,
			});
		const props = wrapper.props();
		const event = {};
		const data = { foo: 'bar' };

		expect(dispatchActionCreator).not.toBeCalled();

		// when
		props.toolbar.pagination.onChange(event, data);

		// then
		expect(dispatchActionCreator).toBeCalledWith("pagination:change", event, data, context);
	});
});

describe('Connected List', () => {
	it('should connect List', () => {
		expect(Connected.displayName).toBe(`Connect(CMF(${Container.displayName}))`);
		expect(Connected.WrappedComponent).toBe(Container);
	});

	it('should map items to props from collection List', () => {
		// given
		const state = {
			cmf: {
				components: fromJS({
					'Container(List)': {
						cid: DEFAULT_STATE.toJS(),
					},
				}),
				collections: fromJS({
					cid: items,
				}),
			},
		};

		// when
		const props = mapStateToProps(state, { collectionId: 'cid' });

		// then
		expect(props).toMatchSnapshot();
	});

	it('should map items to props from default collection List', () => {
		// given
		const state = {
			cmf: {
				components: fromJS({
					'Container(List)': {
						default: DEFAULT_STATE.toJS(),
					},
				}),
				collections: new Map(),
			},
		};

		// when : no collectionId defined
		const props = mapStateToProps(state, {
			items: fromJS(items),
		});

		// then
		expect(props).toMatchSnapshot();
	});

	it('should map items to props from collection Map', () => {
		// given
		const state = {
			cmf: {
				components: fromJS({
					'Container(List)': {
						cid: {
							...(DEFAULT_STATE.toJS()),
							toolbar: {
								pagination: {
									onChange: 'pagination:change',
								},
							},
						},
					},
				}),
				collections: fromJS({
					cid: {
						pagination: {
							totalResults: 36,
							itemsPerPage: 25,
							startIndex: 1,
						},
						items,
					},
				}),
			},
		};

		// when
		const props = mapStateToProps(state, { collectionId: 'cid', toolbar: {} });

		// then
		expect(props).toMatchSnapshot();
	});
});
