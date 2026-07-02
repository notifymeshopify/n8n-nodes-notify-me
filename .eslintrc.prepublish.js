module.exports = {
	extends: './.eslintrc.js',
	overrides: [
		{
			files: ['./credentials/**/*.ts'],
			plugins: ['eslint-plugin-n8n-nodes-base'],
			rules: { 'n8n-nodes-base/cred-class-field-documentation-url-missing': 'error' },
		},
		{
			files: ['./nodes/**/*.ts'],
			plugins: ['eslint-plugin-n8n-nodes-base'],
			rules: { 'n8n-nodes-base/node-param-description-missing-from-dynamic-options': 'error' },
		},
	],
};
