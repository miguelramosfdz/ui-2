/**
 * This file contains all utility functions that applies to table
 */
import React from 'react';
import classNames from 'classnames';
import { Column } from 'react-virtualized';

import CellCheckboxRenderer from '../CellCheckbox';
import { internalIds } from './constants';

/**
 * Insert a checkbox column configuration to select a row.
 */
export function insertSelectionConfiguration({ children, isSelected, selectionToggle }) {
	let contentsConfiguration = React.Children.toArray(children);
	if (selectionToggle) {
		const toggleColumn = (
			<Column
				id={internalIds.rowSelector}
				label={''}
				dataKey={''}
				disableSort
				width={35}
				flexShrink={0}
				flexGrow={0}
				cellDataGetter={({ rowData }) => isSelected(rowData)}
				columnData={{ label: 'Select this element', onChange: selectionToggle }}
				{...CellCheckboxRenderer}
			/>);
		contentsConfiguration = [toggleColumn].concat(contentsConfiguration);
	}
	return contentsConfiguration;
}

/**
 * Create new Columns from children, enhanced with
 * - header and row fixed classnames
 * - parent id (via columnData)
 */
export function toColumns(id, theme, children) {
	return React.Children.toArray(children)
		.map((field, index) => {
			const colProps = {
				...field.props,
				headerClassName: classNames(
					field.props.headerClassName,
					theme.header,
				),
				className: classNames(
					field.props.className,
					theme.cell,
				),
				columnData: {
					...field.props.columnData,
					id,
				},
			};
			return <Column key={index} {...colProps} />;
		});
}
