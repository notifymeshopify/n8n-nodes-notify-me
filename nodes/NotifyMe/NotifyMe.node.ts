import { INodeType, INodeTypeDescription } from 'n8n-workflow';

import {
	subscriptionOperations,
	subscriptionFields,
} from './descriptions/SubscriptionDescription';
import {
	subscriptionNotificationOperations,
	subscriptionNotificationFields,
} from './descriptions/SubscriptionNotificationDescription';
import {
	preOrderOperations,
	preOrderFields,
} from './descriptions/PreOrderDescription';
import {
	preOrderNotificationOperations,
	preOrderNotificationFields,
} from './descriptions/PreOrderNotificationDescription';

export class NotifyMe implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Notify Me!',
		name: 'notifyMe',
		icon: 'file:notifyMe.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Manage Notify Me! back-in-stock, pre-order, and waitlist subscriptions and notifications.',
		defaults: { name: 'Notify Me!' },
		inputs: ['main'],
		outputs: ['main'],
		credentials: [{ name: 'notifyMeApi', required: true }],
		requestDefaults: {
			baseURL: 'https://api.notify-me.app/v1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Pre-Order', value: 'preOrder' },
					{ name: 'Pre-Order Notification', value: 'preOrderNotification' },
					{ name: 'Subscription', value: 'subscription' },
					{ name: 'Subscription Notification', value: 'subscriptionNotification' },
				],
				default: 'subscription',
			},
			...subscriptionOperations,
			...subscriptionFields,
			...subscriptionNotificationOperations,
			...subscriptionNotificationFields,
			...preOrderOperations,
			...preOrderFields,
			...preOrderNotificationOperations,
			...preOrderNotificationFields,
		],
	};
}
