import { INodeProperties } from 'n8n-workflow';

export const subscriptionNotificationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['subscriptionNotification'] } },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many subscription notifications',
				description: 'List notifications that have been sent for back-in-stock subscriptions',
				routing: {
					request: {
						method: 'GET',
						url: '/subscription-notifications/',
					},
					send: {
						paginate: '={{$parameter.returnAll}}',
					},
					operations: {
						pagination: {
							type: 'offset',
							properties: {
								limitParameter: 'limit',
								offsetParameter: 'offset',
								pageSize: 100,
								rootProperty: 'results',
								type: 'query',
							},
						},
					},
					output: {
						postReceive: [
							{ type: 'rootProperty', properties: { property: 'results' } },
						],
					},
				},
			},
		],
		default: 'getAll',
	},
];

export const subscriptionNotificationFields: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['subscriptionNotification'], operation: ['getAll'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		displayOptions: {
			show: {
				resource: ['subscriptionNotification'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
		routing: { send: { type: 'query', property: 'limit' } },
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['subscriptionNotification'], operation: ['getAll'] } },
		options: [
			{
				displayName: 'Bundle',
				name: 'bundle',
				type: 'multiOptions',
				default: [],
				options: [
					{ name: 'After Subscription', value: 'AFTER_SUBSCRIPTION' },
					{ name: 'First Alert', value: 'FIRST_ALERT' },
					{ name: 'GDPR', value: 'GDPR' },
					{ name: 'Reminder', value: 'REMINDER' },
				],
				routing: {
					send: { type: 'query', property: 'bundle', value: '={{$value.join(",")}}' },
				},
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				routing: { send: { type: 'query', property: 'email' } },
			},
			{
				displayName: 'Email Status',
				name: 'email_status',
				type: 'string',
				default: '',
				description: 'Comma-separated list of email statuses',
				routing: { send: { type: 'query', property: 'email_status' } },
			},
			{
				displayName: 'Ordering',
				name: 'ordering',
				type: 'options',
				default: '-sent_at',
				options: [
					{ name: 'Sent (Newest First)', value: '-sent_at' },
					{ name: 'Sent (Oldest First)', value: 'sent_at' },
					{ name: 'ID (Descending)', value: '-id' },
					{ name: 'ID (Ascending)', value: 'id' },
				],
				routing: { send: { type: 'query', property: 'ordering' } },
			},
			{
				displayName: 'Phone Number',
				name: 'phone_number',
				type: 'string',
				default: '',
				routing: { send: { type: 'query', property: 'phone_number' } },
			},
			{
				displayName: 'Product ID',
				name: 'product_id',
				type: 'number',
				default: 0,
				routing: { send: { type: 'query', property: 'product_id' } },
			},
			{
				displayName: 'Push Status',
				name: 'push_status',
				type: 'string',
				default: '',
				description: 'Comma-separated list of push notification statuses',
				routing: { send: { type: 'query', property: 'push_status' } },
			},
			{
				displayName: 'Sent After',
				name: 'sent_at_gte',
				type: 'dateTime',
				default: '',
				routing: { send: { type: 'query', property: 'sent_at_gte' } },
			},
			{
				displayName: 'Sent Before',
				name: 'sent_at_lte',
				type: 'dateTime',
				default: '',
				routing: { send: { type: 'query', property: 'sent_at_lte' } },
			},
			{
				displayName: 'SKU',
				name: 'sku',
				type: 'string',
				default: '',
				routing: { send: { type: 'query', property: 'sku' } },
			},
			{
				displayName: 'SMS Status',
				name: 'sms_status',
				type: 'string',
				default: '',
				description: 'Comma-separated list of SMS statuses',
				routing: { send: { type: 'query', property: 'sms_status' } },
			},
			{
				displayName: 'Subscription ID',
				name: 'subscription_id',
				type: 'number',
				default: 0,
				routing: { send: { type: 'query', property: 'subscription_id' } },
			},
			{
				displayName: 'Variant ID',
				name: 'variant_id',
				type: 'number',
				default: 0,
				routing: { send: { type: 'query', property: 'variant_id' } },
			},
			{
				displayName: 'WhatsApp Number',
				name: 'whatsapp_number',
				type: 'string',
				default: '',
				routing: { send: { type: 'query', property: 'whatsapp_number' } },
			},
			{
				displayName: 'WhatsApp Status',
				name: 'whatsapp_status',
				type: 'string',
				default: '',
				description: 'Comma-separated list of WhatsApp delivery statuses',
				routing: { send: { type: 'query', property: 'whatsapp_status' } },
			},
		],
	},
];
