import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
	ArrowLeft,
	BookOpen,
	Globe2,
	MessageSquare,
	RefreshCcw,
	Save,
	ShieldCheck,
	Users,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const audienceTabs = [
	{ key: 'customer', label: 'Customer', icon: Users },
];

const languageTabs = [
	{ key: 'en', label: 'English (EN)' },
	{ key: 'ar', label: 'Arabic (SA)' },
	{ key: 'bn', label: 'Bangla (BD)' },
	{ key: 'hi', label: 'Hindi (IN)' },
];

const notificationConfig = {
	customer: {
		title: 'Push Notifications Setup',
		subtitle: 'Configure multilingual customer push templates, fallback rules, and delivery preferences from one place.',
		eyebrow: 'Customer channel',
		settings: [
			{ key: 'fundAdded', label: 'Fund added by admin message', message: 'Admin added funds to your wallet.', enabled: true },
			{ key: 'messageFromAdmin', label: 'Message from admin', message: 'You have a new message from the admin team.', enabled: true },
			{ key: 'messageFromDeliveryMan', label: 'Message from delivery man', message: 'You have a message from your delivery partner ({deliverymanName}).', enabled: true },
			{ key: 'messageFromSeller', label: 'Message from seller', message: 'You have a message from the seller.', enabled: true },
			{ key: 'orderCanceled', label: 'Order canceled message', message: 'Order #{orderId} has been canceled.', enabled: true },
			{ key: 'orderConfirmation', label: 'Order confirmation message', message: 'Order #{orderId} is confirmed and being prepared.', enabled: true },
			{ key: 'orderDelivered', label: 'Order delivered message', message: 'Order #{orderId} has been delivered.', enabled: true },
			{ key: 'orderEdit', label: 'Order edit message', message: 'Order #{orderId} has been edited.', enabled: true },
			{ key: 'orderEditReturnAmount', label: 'Order edit return amount message', message: 'Refund amount for order #{orderId} has been updated.', enabled: true },
			{ key: 'orderFailed', label: 'Order failed message', message: 'Order #{orderId} could not be completed.', enabled: false },
			{ key: 'orderPending', label: 'Order pending message', message: 'Order #{orderId} is pending confirmation.', enabled: true },
			{ key: 'orderProcessing', label: 'Order processing message', message: 'Order #{orderId} is now in processing.', enabled: true },
			{ key: 'orderRefunded', label: 'Order refunded message', message: 'Your order #{orderId} is refunded.', enabled: true },
			{ key: 'orderReturned', label: 'Order returned message', message: 'Order #{orderId} has been returned.', enabled: true },
			{ key: 'orderOutForDelivery', label: 'Order out for delivery message', message: 'Order #{orderId} is out for delivery.', enabled: true },
			{ key: 'refundRequestCanceled', label: 'Refund request canceled message', message: 'Your refund request for order #{orderId} is canceled.', enabled: true },
			{ key: 'referralPlaced', label: 'Your referred customer has been place order', message: 'Your referred customer has placed an order.', enabled: true },
			{ key: 'referralDelivered', label: 'Your referred customer order has been delivered', message: 'Your referred customer order has been delivered.', enabled: true },
		],
	},
};

const cloneValue = (value) => JSON.parse(JSON.stringify(value));

const buildDefaultLocaleState = (settings) => settings.reduce((accumulator, item) => {
	accumulator[item.key] = {
		enabled: item.enabled,
		message: item.message,
	};
	return accumulator;
}, {});

const buildInitialState = () => audienceTabs.reduce((audienceState, audience) => {
	const config = notificationConfig[audience.key];

	audienceState[audience.key] = languageTabs.reduce((languageState, language) => {
		languageState[language.key] = buildDefaultLocaleState(config.settings);
		return languageState;
	}, {});

	return audienceState;
}, {});

const PushNotificationsSetup = () => {
	const [activeAudience, setActiveAudience] = useState('customer');
	const [activeLanguage, setActiveLanguage] = useState('en');
	const [settings, setSettings] = useState(() => buildInitialState());
	const [savedSettings, setSavedSettings] = useState(() => buildInitialState());
	const [showGuidelines, setShowGuidelines] = useState(false);
	const [lastSavedAt, setLastSavedAt] = useState('Never saved');

	const activeConfig = notificationConfig[activeAudience];
	const activeLocaleState = settings[activeAudience][activeLanguage];

	const stats = useMemo(() => {
		const totalTemplates = activeConfig.settings.length;
		const enabledTemplates = activeConfig.settings.filter((item) => activeLocaleState[item.key].enabled).length;

		return {
			totalTemplates,
			enabledTemplates,
			disabledTemplates: totalTemplates - enabledTemplates,
			languageLabel: languageTabs.find((language) => language.key === activeLanguage)?.label || activeLanguage,
		};
	}, [activeConfig.settings, activeLanguage, activeLocaleState]);

	const isDirty = useMemo(() => JSON.stringify(settings) !== JSON.stringify(savedSettings), [settings, savedSettings]);

	const updateSetting = (settingKey, updater) => {
		setSettings((previousSettings) => ({
			...previousSettings,
			[activeAudience]: {
				...previousSettings[activeAudience],
				[activeLanguage]: {
					...previousSettings[activeAudience][activeLanguage],
					[settingKey]: updater(previousSettings[activeAudience][activeLanguage][settingKey]),
				},
			},
		}));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setSavedSettings(cloneValue(settings));
		setLastSavedAt(new Intl.DateTimeFormat([], {
			dateStyle: 'medium',
			timeStyle: 'short',
		}).format(new Date()));
	};

	const resetCurrentView = () => {
		setSettings((previousSettings) => ({
			...previousSettings,
			[activeAudience]: {
				...previousSettings[activeAudience],
				[activeLanguage]: buildDefaultLocaleState(activeConfig.settings),
			},
		}));
	};

	return (
		<div className="max-w-7xl mx-auto space-y-6 page-enter relative">
			<section className="relative overflow-hidden rounded-[2rem] border border-surface-200 dark:border-surface-700 bg-white/95 dark:bg-surface-900/95 shadow-2xl shadow-surface-950/10">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.10),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.08),_transparent_28%)]" />
				<div className="relative p-5 sm:p-7 lg:p-8 xl:p-10 space-y-6">
					<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
						<div className="space-y-4">
							<Link to="/modules/notifications" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-surface-500 hover:text-admin-primary-600 transition-colors">
								<ArrowLeft size={14} />
								Notifications
							</Link>

							<div className="flex flex-wrap items-center gap-2">
								<Badge variant="primary" dot>{activeConfig.eyebrow}</Badge>
								<Badge variant={isDirty ? 'warning' : 'success'} dot>{isDirty ? 'Unsaved draft' : 'Saved setup'}</Badge>
								<Badge variant="info" dot>{stats.languageLabel}</Badge>
							</div>

							<div className="space-y-2 max-w-3xl">
								<h1 className="text-3xl sm:text-4xl font-black tracking-tight text-surface-900 dark:text-white">
									{activeConfig.title}
								</h1>
								<p className="text-sm sm:text-base text-surface-600 dark:text-surface-300 max-w-2xl">
									{activeConfig.subtitle}
								</p>
							</div>
						</div>

							<div className="rounded-[1.75rem] border border-surface-200 dark:border-surface-700 bg-surface-50/90 dark:bg-surface-800/90 p-5 shadow-sm xl:w-[22rem]">
								<p className="text-[11px] sm:text-xs font-black uppercase tracking-[0.32em] text-surface-400">Current State</p>
								<div className="mt-4 grid grid-cols-2 gap-4">
									<div className="rounded-[1.4rem] border border-surface-200/80 dark:border-surface-700 bg-white dark:bg-surface-900 px-4 py-5 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
										<p className="text-sm text-surface-500 dark:text-surface-400">Enabled</p>
										<p className="mt-3 text-[2.2rem] leading-none font-extrabold tracking-tight text-surface-900 dark:text-white">{stats.enabledTemplates}</p>
									</div>
									<div className="rounded-[1.4rem] border border-surface-200/80 dark:border-surface-700 bg-white dark:bg-surface-900 px-4 py-5 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
										<p className="text-sm text-surface-500 dark:text-surface-400">Templates</p>
										<p className="mt-3 text-[2.2rem] leading-none font-extrabold tracking-tight text-surface-900 dark:text-white">{stats.totalTemplates}</p>
									</div>
								</div>
								<p className="mt-4 text-xs text-surface-500 dark:text-surface-400">
									{lastSavedAt === 'Never saved' ? 'No saved changes yet.' : `Last saved ${lastSavedAt}`}
								</p>
						</div>
					</div>

					<div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.4rem] border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/70 p-3 sm:p-4">
						<div className="flex flex-wrap gap-2">
							{audienceTabs.map((tab) => {
								const TabIcon = tab.icon;
								const isActive = activeAudience === tab.key;

								return (
									<button
										key={tab.key}
										type="button"
										onClick={() => setActiveAudience(tab.key)}
										className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${isActive
											? 'bg-admin-primary-600 text-white shadow-lg shadow-admin-primary-500/20'
											: 'bg-white text-surface-600 border border-surface-200 hover:border-admin-primary-300 hover:text-admin-primary-600 dark:bg-surface-900 dark:text-surface-300 dark:border-surface-700 dark:hover:border-admin-primary-700'
										}`}
									>
										<TabIcon size={15} />
										{tab.label}
									</button>
								);
							})}
						</div>

						<Button
							type="button"
							variant="ghost"
							icon={BookOpen}
							onClick={() => setShowGuidelines((previous) => !previous)}
							className="text-surface-700 dark:text-surface-200"
						>
							Read Documentation
						</Button>
					</div>

					<div className="flex flex-wrap items-center gap-2">
						{languageTabs.map((language) => {
							const isActive = activeLanguage === language.key;

							return (
								<button
									key={language.key}
									type="button"
									onClick={() => setActiveLanguage(language.key)}
									className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${isActive
										? 'bg-surface-900 text-white dark:bg-white dark:text-surface-900 shadow-lg'
										: 'bg-white text-surface-500 border border-surface-200 hover:text-surface-900 hover:border-surface-300 dark:bg-surface-900 dark:text-surface-400 dark:border-surface-700 dark:hover:text-white dark:hover:border-surface-600'
									}`}
								>
									{language.label}
								</button>
							);
						})}
					</div>

					{showGuidelines && (
						<div className="grid gap-3 rounded-[1.4rem] border border-admin-primary-200 bg-admin-primary-50/80 p-4 text-sm text-surface-700 dark:border-admin-primary-900/40 dark:bg-admin-primary-950/30 dark:text-surface-200 lg:grid-cols-[1fr_auto] lg:items-center">
							<div className="space-y-1.5">
								<p className="font-bold text-surface-900 dark:text-white">Setup guidelines</p>
								<p>Keep toggles enabled only for messages you actually want to publish. Update each language independently before saving.</p>
							</div>
							<div className="flex flex-wrap gap-2">
								<Badge variant="info" icon={Globe2}>Multi-language</Badge>
								<Badge variant="success" icon={ShieldCheck}>Ready for publish</Badge>
							</div>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
							{activeConfig.settings.map((setting, index) => {
								const itemState = activeLocaleState[setting.key];

								return (
									<article
										key={setting.key}
										className="rounded-[1.35rem] border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 p-4 shadow-sm hover:shadow-md transition-shadow"
									>
										<div className="flex items-start justify-between gap-3">
											<div>
												<p className="text-[10px] font-black uppercase tracking-[0.24em] text-surface-400">{String(index + 1).padStart(2, '0')}</p>
												<h3 className="mt-1 text-sm font-semibold text-surface-900 dark:text-white">{setting.label}</h3>
											</div>

												<Button
													type="button"
													size="sm"
													variant={itemState.enabled ? 'primary' : 'secondary'}
													onClick={() => updateSetting(setting.key, (current) => ({ ...current, enabled: !current.enabled }))}
													className="min-w-[4.5rem]"
												>
													{itemState.enabled ? 'On' : 'Off'}
												</Button>
										</div>

										<div className="mt-4 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-950/40 p-3">
											<div className="mb-2 flex items-center gap-2 text-xs font-semibold text-surface-500 dark:text-surface-400">
												<MessageSquare size={14} />
												Message copy
											</div>
											<textarea
												value={itemState.message}
												onChange={(event) => updateSetting(setting.key, (current) => ({ ...current, message: event.target.value }))}
												rows={4}
												className="w-full resize-none rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-3 py-2 text-sm text-surface-700 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-admin-primary-500/20"
												placeholder="Write the push notification message"
											/>
										</div>
									</article>
								);
							})}
						</div>

						<div className="flex flex-col gap-4 rounded-[1.5rem] border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/50 p-4 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex flex-wrap items-center gap-2">
								<Badge variant={isDirty ? 'warning' : 'success'} dot>
									{isDirty ? 'Unsaved draft' : 'Saved setup'}
								</Badge>
								<Badge variant="primary" dot>
									{stats.enabledTemplates} enabled
								</Badge>
								<Badge variant="info" dot>
									{stats.languageLabel}
								</Badge>
							</div>

							<div className="flex flex-wrap gap-2 sm:justify-end">
								<Button type="button" variant="secondary" icon={RefreshCcw} onClick={resetCurrentView}>
									Reset
								</Button>
								<Button type="submit" variant="primary" icon={Save}>
									Submit
								</Button>
							</div>
						</div>
					</form>

					<button
						type="button"
						onClick={() => setShowGuidelines((previous) => !previous)}
						className="hidden xl:flex absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 items-center rounded-l-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-3 py-4 text-xs font-bold uppercase tracking-[0.28em] text-surface-500 shadow-lg dark:text-surface-300"
						style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
					>
						View Guidelines
					</button>
				</div>
			</section>
		</div>
	);
};

export default PushNotificationsSetup;
