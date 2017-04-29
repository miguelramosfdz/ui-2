import React, { PropTypes } from 'react';
import keycode from 'keycode';

/**
 * Title input mode.
 * - It initializes the input value
 * - It adds handlers on form submit, ESC (cancel) and blur (submit) events
 */
export default class CellTitleInput extends React.Component {
	constructor(props) {
		super(props);
		this.onBlur = this.onBlur.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentDidMount() {
		this.titleInput.value = this.props.cellData;
	}

	onKeyUp(event) {
		if (event.keyCode === keycode('escape')) {
			this.props.onEditCancel(event, this.props.rowData);
		}
	}

	onBlur(event) {
		this.onSubmit(event);
	}

	onSubmit(event) {
		this.props.onEditSubmit(event, {
			value: this.titleInput.value,
			model: this.props.rowData,
		});
		event.preventDefault();
	}

	render() {
		return (
			<form onSubmit={this.onSubmit}>
				<input
					id={this.props.id}
					ref={(input) => { this.titleInput = input; }}
					onBlur={this.onBlur}
					onKeyUp={this.onKeyUp}
					autoFocus
				/>
			</form>
		);
	}
}

CellTitleInput.propTypes = {
	/** The id prefix. */
	id: PropTypes.string,
	/** The input value. */
	cellData: PropTypes.string.isRequired,
	/** The cancel callback on ESC keydown. */
	onEditCancel: PropTypes.func.isRequired,
	/** The submit callback on ENTER keydown or blur. */
	onEditSubmit: PropTypes.func.isRequired,
	/** The collection item. */
	rowData: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};
