import { INodeProperties } from 'n8n-workflow';

export const preOrderNotificationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['preOrderNotification'] } },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many pre order notifications',
				description: 'List notifications that have been sent for pre-orders',
				routing: {
					request: { method: 'GET', url: '/pre-order-notifications/' },
					send: { paginate: '={{$parameter.returnAll}}' },
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
						postReceive: [{ type: 'rootProperty', properties: { property: 'results' } }],
					},
				},
			},
		],
		default: 'getAll',
	},
];

export const preOrderNotificationFields: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['preOrderNotification'], operation: ['getAll'] } },
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
				resource: ['preOrderNotification'],
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
		displayOptions: { show: { resource: ['preOrderNotification'], operation: ['getAll'] } },
		options: [
			{
				displayName: 'Bundle',
				name: 'bundle',
				type: 'multiOptions',
				default: [],
				options: [
					{ name: 'Delayed Shipment', value: 'DELAYED_SHIPMENT' },
					{ name: 'Pre-Order', value: 'PRE_ORDER' },
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
				displayName: 'Pre-Order ID',
				name: 'pre_order_id',
				type: 'number',
				default: 0,
				routing: { send: { type: 'query', property: 'pre_order_id' } },
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
				displayName: 'SMS Status',
				name: 'sms_status',
				type: 'string',
				default: '',
				description: 'Comma-separated list of SMS statuses',
				routing: { send: { type: 'query', property: 'sms_status' } },
			},
		],
	},
];
