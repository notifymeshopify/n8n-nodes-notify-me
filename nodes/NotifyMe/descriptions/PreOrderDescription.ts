import { INodeProperties } from 'n8n-workflow';

export const preOrderOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['preOrder'] } },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a pre order',
				description: 'Retrieve a single pre-order by ID',
				routing: {
					request: { method: 'GET', url: '=/pre-orders/{{$parameter.preOrderId}}/' },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many pre orders',
				description: 'List pre-orders with optional filters',
				routing: {
					request: { method: 'GET', url: '/pre-orders/' },
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

export const preOrderFields: INodeProperties[] = [
	// ─── Get ─────────────────────────────────────────────────────────────────
	{
		displayName: 'Pre-Order ID',
		name: 'preOrderId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['preOrder'], operation: ['get'] } },
		description: 'Numeric ID of the pre-order to retrieve',
	},

	// ─── Get Many ────────────────────────────────────────────────────────────
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['preOrder'], operation: ['getAll'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		displayOptions: {
			show: { resource: ['preOrder'], operation: ['getAll'], returnAll: [false] },
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
		displayOptions: { show: { resource: ['preOrder'], operation: ['getAll'] } },
		options: [
			{
				displayName: 'Active Only (Not Cancelled)',
				name: 'cancelled_at_isnull',
				type: 'boolean',
				default: true,
				routing: { send: { type: 'query', property: 'cancelled_at_isnull' } },
			},
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
				displayName: 'Financial Status',
				name: 'financial_status',
				type: 'multiOptions',
				default: [],
				options: [
					{ name: 'Authorized', value: 'AUTHORIZED' },
					{ name: 'Paid', value: 'PAID' },
					{ name: 'Partially Paid', value: 'PARTIALLY_PAID' },
					{ name: 'Partially Refunded', value: 'PARTIALLY_REFUNDED' },
					{ name: 'Pending', value: 'PENDING' },
					{ name: 'Refunded', value: 'REFUNDED' },
					{ name: 'Voided', value: 'VOIDED' },
				],
				routing: {
					send: { type: 'query', property: 'financial_status', value: '={{$value.join(",")}}' },
				},
			},
			{
				displayName: 'Fulfillment Status',
				name: 'fulfillment_status',
				type: 'multiOptions',
				default: [],
				options: [
					{ name: 'Fulfilled', value: 'FULFILLED' },
					{ name: 'In Progress', value: 'IN_PROGRESS' },
					{ name: 'On Hold', value: 'ON_HOLD' },
					{ name: 'Open', value: 'OPEN' },
					{ name: 'Partially Fulfilled', value: 'PARTIALLY_FULFILLED' },
					{ name: 'Pending Fulfillment', value: 'PENDING_FULFILLMENT' },
					{ name: 'Restocked', value: 'RESTOCKED' },
					{ name: 'Scheduled', value: 'SCHEDULED' },
					{ name: 'Unfulfilled', value: 'UNFULFILLED' },
				],
				routing: {
					send: { type: 'query', property: 'fulfillment_status', value: '={{$value.join(",")}}' },
				},
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
					{ name: 'Total Price (High to Low)', value: '-total_price' },
					{ name: 'Total Price (Low to High)', value: 'total_price' },
				],
				routing: { send: { type: 'query', property: 'ordering' } },
			},
			{
				displayName: 'Product ID',
				name: 'product_id',
				type: 'number',
				default: 0,
				routing: { send: { type: 'query', property: 'product_id' } },
			},
			{
				displayName: 'Selling Plan Settings Name',
				name: 'selling_plan_settings_name',
				type: 'string',
				default: '',
				routing: { send: { type: 'query', property: 'selling_plan_settings_name' } },
			},
			{
				displayName: 'Shopify Order ID',
				name: 'shopify_order_id',
				type: 'number',
				default: 0,
				routing: { send: { type: 'query', property: 'shopify_order_id' } },
			},
			{
				displayName: 'SKU',
				name: 'sku',
				type: 'string',
				default: '',
				routing: { send: { type: 'query', property: 'sku' } },
			},
			{
				displayName: 'Variant ID',
				name: 'variant_id',
				type: 'number',
				default: 0,
				routing: { send: { type: 'query', property: 'variant_id' } },
			},
		],
	},
];
