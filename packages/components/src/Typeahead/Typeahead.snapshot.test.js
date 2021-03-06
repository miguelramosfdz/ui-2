import React from 'react';
import renderer from 'react-test-renderer';
import Typeahead from './Typeahead.component';

jest.mock('react-dom');

const items = [
	{
		title: 'category 1',
		icon: {
			name: 'fa fa-filter',
			title: 'icon',
		},
		suggestions: [
			{
				title: 'le title 1',
				description: 'description: Uxoresque est in pacto est marito est hastam nomine in eos discessura incredibile tempus ardore.',
			},
			{
				title: 'title 2 les elephants elementaires ont des aile ',
				description: 'description: Aut aut cum satis inter Epicuri quidem cum erat inquam controversia autem mihi utrumque Attico.',
			},
		],
	},
	{
		title: 'category 2',
		icon: {
			name: 'fa fa-asterisk',
			title: 'icon',
		},
		suggestions: [
			{
				title: 'title 3',
				description: 'description: In sanciatur libere audeamus exspectemus amicitia et dum ne audeamus causa monendum honesta studium valeat.',
			},
		],
	},
];

describe('Typeahead', () => {
	describe('with toggle', () => {
		it('should render button', () => {
			// given
			const props = {
				id: 'my-search',
				onToggle: jest.fn(),
				icon: {
					name: 'fa fa-search',
					title: 'Toggle search bar',
					bsStyle: 'link',
				},
			};

			// when
			const wrapper = renderer
				.create(<Typeahead {...props} />)
				.toJSON();

			// then
			expect(wrapper).toMatchSnapshot();
		});
	});

	describe('position', () => {
		it('should render search bar on the right', () => {
			// given
			const props = {
				id: 'my-search',
				position: 'right',
			};

			// when
			const wrapper = renderer
				.create(<Typeahead {...props} />)
				.toJSON();

			// then
			expect(wrapper).toMatchSnapshot();
		});
	});

	describe('items', () => {
		it('should render typeahead with results', () => {
			// given
			const props = {
				id: 'my-search',
				items,
			};
			// when
			const wrapper = renderer
				.create(<Typeahead {...props} />)
				.toJSON();

			// then
			expect(wrapper).toMatchSnapshot();
		});

		it('should render typeahead without results', () => {
			// given
			const props = {
				id: 'my-search',
				items: [],
			};

			// when
			const wrapper = renderer
				.create(<Typeahead {...props} />)
				.toJSON();

			// then
			expect(wrapper).toMatchSnapshot();
		});

		it('should render typeahead results with match', () => {
			// given
			const props = {
				id: 'my-search',
				value: 'le',
				items,
			};

			// when
			const wrapper = renderer
				.create(<Typeahead {...props} />)
				.toJSON();

			// then
			expect(wrapper).toMatchSnapshot();
		});
	});
});
