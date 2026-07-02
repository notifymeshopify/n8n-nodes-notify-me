import {
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IPollFunctions,
	INodeExecutionData,
} from 'n8n-workflow';

interface Subscription extends IDataObject {
	id: number;
	created_at: string;
}

interface ListResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: Subscription[];
}

export class NotifyMeTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Notify Me! Trigger',
		name: 'notifyMeTrigger',
		icon: 'file:notifyMe.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Starts the workflow when something happens in Notify Me!',
		defaults: { name: 'Notify Me! Trigger' },
		credentials: [{ name: 'notifyMeApi', required: true }],
		polling: true,
		inputs: [],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				default: 'newSubscription',
				options: [
					{
						name: 'New Subscription',
						value: 'newSubscription',
						description: 'Triggers when a new back-in-stock subscription is created',
					},
				],
				description:
					'Notify Me! does not yet emit outbound webhooks, so this trigger polls the API on a schedule. Default poll interval is set on the workflow (top right).',
			},
			{
				displayName: 'Emit On First Activation',
				name: 'emitOnFirstActivation',
				type: 'boolean',
				default: false,
				description:
					'Whether to emit the most recent items on the very first poll. Off by default to avoid flooding the workflow when activated against a populated account.',
			},
		],
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const event = this.getNodeParameter('event') as string;
		if (event !== 'newSubscription') return null;

		const emitOnFirstActivation = this.getNodeParameter('emitOnFirstActivation') as boolean;
		const workflowStaticData = this.getWorkflowStaticData('node');
		const lastId = (workflowStaticData.lastId as number | undefined) ?? 0;

		// Page through anything with id > lastId, newest first, capping at 100 per page.
		const collected: Subscription[] = [];
		let offset = 0;
		const pageSize = 100;
		const hardCap = 500;

		while (collected.length < hardCap) {
			const response = (await this.helpers.httpRequestWithAuthentication.call(
				this,
				'notifyMeApi',
				{
					method: 'GET',
					url: 'https://api.notify-me.app/v1/subscriptions/',
					qs: {
						ordering: '-id',
						limit: pageSize,
						offset,
					},
					json: true,
				},
			)) as ListResponse;

			const results = response.results ?? [];
			if (results.length === 0) break;

			const fresh = results.filter((s) => typeof s.id === 'number' && s.id > lastId);
			collected.push(...fresh);

			// Stop as soon as the page includes anything we've already seen — older pages won't have new items.
			if (fresh.length < results.length) break;
			if (!response.next) break;
			offset += pageSize;
		}

		if (collected.length === 0) {
			// No new items. Still record the highest id we've seen so first activation doesn't refire later.
			if (workflowStaticData.lastId === undefined) {
				const probe = (await this.helpers.httpRequestWithAuthentication.call(
					this,
					'notifyMeApi',
					{
						method: 'GET',
						url: 'https://api.notify-me.app/v1/subscriptions/',
						qs: { ordering: '-id', limit: 1 },
						json: true,
					},
				)) as ListResponse;
				const top = probe.results?.[0]?.id;
				if (typeof top === 'number') workflowStaticData.lastId = top;
			}
			return null;
		}

		// Newest id seen this poll becomes the new watermark.
		const highest = collected.reduce((acc, s) => (s.id > acc ? s.id : acc), lastId);
		const firstActivation = workflowStaticData.lastId === undefined;
		workflowStaticData.lastId = highest;

		if (firstActivation && !emitOnFirstActivation) return null;

		// Emit oldest-first so downstream nodes get them in chronological order.
		const ordered = [...collected].sort((a, b) => a.id - b.id);
		return [ordered.map((json) => ({ json }))];
	}
}
