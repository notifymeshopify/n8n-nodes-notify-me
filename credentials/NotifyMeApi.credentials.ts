import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class NotifyMeApi implements ICredentialType {
	name = 'notifyMeApi';
	displayName = 'Notify Me API';
	// eslint-disable-next-line n8n-nodes-base/cred-class-field-documentation-url-miscased
	documentationUrl = 'https://help.notify-me.io/en/articles/13184354-notify-me-public-api';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Per-shop API key. Generate one in your Shopify admin under Notify Me! → Settings → API.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Api-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.notify-me.app/v1',
			url: '/subscriptions/',
			method: 'GET',
			qs: { limit: 1 },
		},
	};
}
