import { INodeProperties } from 'n8n-workflow';

export const subscriptionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['subscription'] } },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a subscription',
				description: 'Retrieve a single subscription by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/subscriptions/{{$parameter.subscriptionId}}/',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many subscriptions',
				description: 'List subscriptions with optional filters',
				routing: {
					request: {
						method: 'GET',
						url: '/subscriptions/',
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
							{
								type: 'rootProperty',
								properties: { property: 'results' },
							},
						],
					},
				},
			},
		],
		default: 'getAll',
	},
];

export const subscriptionFields: INodeProperties[] = [
	// ─── Get ─────────────────────────────────────────────────────────────────
	{
		displayName: 'Subscription ID',
		name: 'subscriptionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['subscription'], operation: ['get'] } },
		description: 'Numeric ID of the subscription to retrieve',
	},

	// ─── Get Many ────────────────────────────────────────────────────────────
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['subscription'], operation: ['getAll'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		displayOptions: {
			show: { resource: ['subscription'], operation: ['getAll'], returnAll: [false] },
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
		displayOptions: { show: { resource: ['subscription'], operation: ['getAll'] } },
		options: [
			{
				displayName: 'Created After',
				name: 'created_at_gte',
				type: 'dateTime',
				default: '',
				routing: { send: { type: 'query', property: 'created_at_gte' } },
			},
			{
				displayName: 'Created Before',
				name: 'created_at_lte',
				type: 'dateTime',
				default: '',
				routing: { send: { type: 'query', property: 'created_at_lte' } },
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
				displayName: 'Is Imported',
				name: 'is_imported',
				type: 'boolean',
				default: false,
				routing: { send: { type: 'query', property: 'is_imported' } },
			},
			{
				displayName: 'Ordering',
				name: 'ordering',
				type: 'options',
				default: '-created_at',
				options: [
					{ name: 'Created (Newest First)', value: '-created_at' },
					{ name: 'Created (Oldest First)', value: 'created_at' },
					{ name: 'ID (Ascending)', value: 'id' },
					{ name: 'ID (Descending)', value: '-id' },
					{ name: 'Sent (Newest First)', value: '-sent_at' },
					{ name: 'Sent (Oldest First)', value: 'sent_at' },
					{ name: 'Subscribed (Newest First)', value: '-subscribe_at' },
					{ name: 'Subscribed (Oldest First)', value: 'subscribe_at' },
				],
				routing: { send: { type: 'query', property: 'ordering' } },
			},
			{
				displayName: 'Pending Only (No Notification Sent Yet)',
				name: 'sent_at_isnull',
				type: 'boolean',
				default: false,
				routing: { send: { type: 'query', property: 'sent_at_isnull' } },
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
				displayName: 'SKU',
				name: 'sku',
				type: 'string',
				default: '',
				routing: { send: { type: 'query', property: 'sku' } },
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'multiOptions',
				default: [],
				options: [
					{ name: 'Expired', value: 'EXPIRED' },
					{ name: 'Fraud Detected', value: 'FRAUD_DETECTED_BY_AI' },
					{ name: 'Ordered', value: 'ORDERED' },
					{ name: 'Pending GDPR', value: 'PENDING_GDPR' },
					{ name: 'Restocked', value: 'RESTOCKED' },
					{ name: 'Scheduled', value: 'SCHEDULED' },
					{ name: 'Waiting Restock', value: 'WAITING_RESTOCK' },
					{ name: 'Waiting Upgrade', value: 'WAITING_UPGRADE' },
				],
				routing: {
					send: {
						type: 'query',
						property: 'status',
						value: '={{$value.join(",")}}',
					},
				},
			},
			{
				displayName: 'Subscribed After',
				name: 'subscribe_at_gte',
				type: 'dateTime',
				default: '',
				routing: { send: { type: 'query', property: 'subscribe_at_gte' } },
			},
			{
				displayName: 'Subscribed Before',
				name: 'subscribe_at_lte',
				type: 'dateTime',
				default: '',
				routing: { send: { type: 'query', property: 'subscribe_at_lte' } },
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
		],
	},
];
