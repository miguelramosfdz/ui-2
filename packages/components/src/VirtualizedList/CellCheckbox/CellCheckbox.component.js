import React, { PropTypes } from 'react';

import theme from './CellCheckbox.scss';

/**
 * Cell renderer that displays a checkbox
 */
function CellCheckbox({ cellData, columnData, rowData }) {
	const { id, label, onChange } = columnData;
	return (
		<form className={`tc-list-checkbox ${theme['tc-list-checkbox']}`} >
			<div className="checkbox">
				<label htmlFor={id && `${id}-check`}>
					<input
						id={id && `${id}-check`}
						type="checkbox"
						onChange={(e) => { onChange(e, rowData); }}
						checked={cellData}
					/>
					<span><span className="sr-only">{label}</span></span>
				</label>
			</div>
		</form>
	);
}

CellCheckbox.displayName = 'VirtualizedList(CellCheckbox)';
CellCheckbox.propTypes = {
	cellData: PropTypes.string,
	columnData: PropTypes.shape({
		id: PropTypes.string,
		label: PropTypes.string,
		onChange: PropTypes.func.isRequired,
	}),
	rowData: PropTypes.object, // eslint-disable-line
};

export default CellCheckbox;