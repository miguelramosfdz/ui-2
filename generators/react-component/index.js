const yeoman = require('yeoman-generator');
const yosay = require('yosay');
const slug = require('slugg');

module.exports = yeoman.Base.extend({
	prompting() {
		// Have Yeoman greet the user.
		this.log(yosay(
			'Welcome to the react-cmf generator!'
		));
		const prompts = [{
			type: 'input',
			name: 'name',
			message: 'name',
			validate(input) {
				const re = /[^A-Za-z]/;
				if (re.test(input)) {
					return 'a component name can\'t contains special caracters';
				}
				return true;
			},
		}, {
			type: 'list',
			name: 'type',
			message: 'type',
			default: 'es6.class',
			choices: ['es6.class', 'es6.arrow', 'stateless', 'createClass', 'connect'],
		}, {
			type: 'input',
			name: 'purePath',
			message: 'pure component import path',
			default: './',
			when(answers) {
				return answers.type === 'connect';
			},
		}, {
			type: 'list',
			name: 'test',
			message: 'test',
			default: 'snapshot',
			choices: ['snapshot', 'enzyme'],
			when(answers) {
				if (answers.type === 'connect') {
					answers.test = 'connect';
					return false;
				}
				return true;
			},
		}, {
			type: 'input',
			name: 'path',
			message: 'path',
			default: 'src/app/components',
		}];

		return this.prompt(prompts).then((props) => {
			// To access props later use this.props.someAnswer;
			this.props = props;
		});
	},

	writing() {
		this.fs.copyTpl(
			this.templatePath(`src/${this.props.type}.component.js`),
			this.destinationPath(`${this.props.path}/${this.props.name}/${this.props.name}.component.js`),
			this
		);
		this.fs.copyTpl(
			this.templatePath(`src/${this.props.test}.test.js`),
			this.destinationPath(`${this.props.path}/${this.props.name}/${this.props.name}.test.js`),
			this
		);
		this.fs.copyTpl(
			this.templatePath(`src/scss`),
			this.destinationPath(`${this.props.path}/${this.props.name}/${this.props.name}.scss`),
			this
		);
		this.fs.copyTpl(
			this.templatePath('src/index.js'),
			this.destinationPath(`${this.props.path}/${this.props.name}/index.js`),
			this
		);
	},
});
