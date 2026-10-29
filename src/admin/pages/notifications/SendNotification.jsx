import React, { useMemo, useRef, useState } from 'react';
import {
	Bell,
	ImagePlus,
	Pencil,
	Search,
	Send,
	ToggleLeft,
	ToggleRight,
	Trash2,
	RefreshCw,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const initialNotifications = [
	{
		id: 'PUSH-101',
		title: 'Coupon',
		description: 'From 2024, Use Code "pcuw65ygt" to get flat discount on select items.',
		image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=300&q=80',
		count: 1,
		status: true,
	},
	{
		id: 'PUSH-102',
		title: 'Buy 2 get 1',
		description: 'Buy any 2 products then get any product free for a limited period.',
		image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=300&q=80',
		count: 2,
		status: true,
	},
];

const emptyComposer = {
	title: '',
	description: '',
	image: '',
};

const SendNotification = () => {
	const [rows, setRows] = useState(initialNotifications);
	const [query, setQuery] = useState('');
	const [composer, setComposer] = useState(emptyComposer);
	const [preview, setPreview] = useState('');
	const [editingId, setEditingId] = useState(null);
	const fileInputRef = useRef(null);

	const filteredRows = useMemo(() => {
		const normalized = query.trim().toLowerCase();

		if (!normalized) {
			return rows;
		}

		return rows.filter((row) => row.title.toLowerCase().includes(normalized));
	}, [rows, query]);

	const rowCount = filteredRows.length;

	const updateComposer = (key, value) => {
		setComposer((previous) => ({ ...previous, [key]: value }));
	};

	const clearComposer = () => {
		setComposer(emptyComposer);
		setPreview('');
		setEditingId(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleFileChange = (event) => {
		const file = event.target.files?.[0];
		if (!file) {
			return;
		}

		const objectUrl = URL.createObjectURL(file);
		setPreview(objectUrl);
		updateComposer('image', objectUrl);
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		if (!composer.title.trim() || !composer.description.trim()) {
			return;
		}

		const nextRow = {
			id: editingId || `PUSH-${Date.now().toString().slice(-3)}`,
			title: composer.title.trim(),
			description: composer.description.trim(),
			image: composer.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80',
			count: editingId ? rows.find((row) => row.id === editingId)?.count || 1 : 1,
			status: true,
		};

		setRows((previousRows) => {
			if (editingId) {
				return previousRows.map((row) => (row.id === editingId ? nextRow : row));
			}

			return [nextRow, ...previousRows];
		});

		clearComposer();
	};

	const handleEdit = (row) => {
		setEditingId(row.id);
		setComposer({
			title: row.title,
			description: row.description,
			image: row.image,
		});
		setPreview(row.image);
	};

	const handleResend = (rowId) => {
		setRows((previousRows) => previousRows.map((row) => (
			row.id === rowId ? { ...row, count: row.count + 1 } : row
		)));
	};

	const handleDelete = (rowId) => {
		setRows((previousRows) => previousRows.filter((row) => row.id !== rowId));
	};

	const handleToggleStatus = (rowId) => {
		setRows((previousRows) => previousRows.map((row) => (
			row.id === rowId ? { ...row, status: !row.status } : row
		)));
	};

	const composerTitle = editingId ? 'Edit Notification' : 'Send Notification';

	return (
		<div className="max-w-7xl mx-auto space-y-6 page-enter">
			<section className="rounded-[1.75rem] border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 shadow-sm overflow-hidden">
				<div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-2 flex items-center gap-2 text-surface-900 dark:text-white">
					<Bell size={18} className="text-admin-primary-600" />
					<h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">{composerTitle}</h1>
				</div>

				<div className="px-5 sm:px-6 pb-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
					  <form id="send-notification-form" onSubmit={handleSubmit} className="rounded-[1.5rem] border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/60 p-4 sm:p-5 space-y-4">
						<div className="space-y-2">
							<label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Title</label>
							<input
								value={composer.title}
								onChange={(event) => updateComposer('title', event.target.value)}
								placeholder="New notification"
								className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-4 py-3 text-sm text-surface-800 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-admin-primary-500/20"
							/>
						</div>

						<div className="space-y-2">
							<label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Description</label>
							<textarea
								value={composer.description}
								onChange={(event) => updateComposer('description', event.target.value)}
								rows={5}
								className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-4 py-3 text-sm text-surface-800 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-admin-primary-500/20 resize-none"
							/>
						</div>

						<div className="flex flex-wrap justify-end gap-2">
							<Button type="button" variant="secondary" icon={RefreshCw} onClick={clearComposer}>
								Reset
							</Button>
							<Button type="submit" variant="primary" icon={Send}>
								Send Notification
							</Button>
						</div>
					</form>

					<div className="rounded-[1.5rem] border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/60 p-4 sm:p-5 space-y-4">
						<div className="flex items-center justify-between gap-3">
							<div>
								<p className="text-sm font-semibold text-surface-900 dark:text-white">Image</p>
								<p className="text-xs font-medium text-admin-primary-600">(Ratio 1:1)</p>
							</div>
						</div>

						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className="w-full min-h-[14rem] rounded-[1.25rem] border border-dashed border-surface-300 dark:border-surface-600 bg-white/70 dark:bg-surface-900/80 flex flex-col items-center justify-center gap-3 text-surface-500 hover:border-admin-primary-400 hover:text-admin-primary-600 transition-colors"
						>
							{preview ? (
								<div className="flex flex-col items-center gap-3">
									<img src={preview} alt="Notification preview" className="h-28 w-28 rounded-2xl object-cover shadow-md" />
									<span className="text-sm font-medium">Click to change image</span>
								</div>
							) : (
								<>
									<div className="rounded-2xl bg-surface-100 dark:bg-surface-800 p-4 text-surface-400">
										<ImagePlus size={22} />
									</div>
									<div className="text-center">
										<p className="text-sm font-medium text-admin-primary-600">Click to upload</p>
										<p className="text-xs text-surface-400">Or drag and drop</p>
									</div>
								</>
							)}
						</button>

						<input
							ref={fileInputRef}
							type="file"
							accept="image/png,image/jpeg,image/jpg,image/webp"
							onChange={handleFileChange}
							className="hidden"
						/>

						<p className="text-center text-xs text-surface-500 dark:text-surface-400">
							JPEG, PNG, JPG, WEBP Image size : Max 1MB
						</p>
					</div>
				</div>

				<div className="px-5 sm:px-6 pb-6 flex justify-end gap-2">
					<Button type="button" variant="secondary" onClick={clearComposer}>
						Reset
					</Button>
					<Button type="submit" form="send-notification-form" variant="primary" icon={Send}>
						Send Notification
					</Button>
				</div>
			</section>

			<section className="rounded-[1.75rem] border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 shadow-sm p-4 sm:p-5">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-2 text-surface-900 dark:text-white">
						<h2 className="text-base sm:text-lg font-bold">Push notification table</h2>
						<Badge variant="primary" size="sm">{rows.length}</Badge>
					</div>

					<div className="relative w-full sm:w-[18rem]">
						<Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
						<input
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Search by title"
							className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 pl-10 pr-10 py-2.5 text-sm text-surface-700 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-admin-primary-500/20"
						/>
					</div>
				</div>

				<div className="mt-4 overflow-x-auto rounded-2xl border border-surface-200 dark:border-surface-700">
					<table className="min-w-full text-sm">
						<thead className="bg-surface-50 dark:bg-surface-800/70 text-surface-700 dark:text-surface-300">
							<tr>
								<th className="px-4 py-4 text-left font-semibold">SL</th>
								<th className="px-4 py-4 text-left font-semibold">Title</th>
								<th className="px-4 py-4 text-left font-semibold">Description</th>
								<th className="px-4 py-4 text-left font-semibold">Image</th>
								<th className="px-4 py-4 text-left font-semibold">Notification Count</th>
								<th className="px-4 py-4 text-left font-semibold">Status</th>
								<th className="px-4 py-4 text-left font-semibold">Resend</th>
								<th className="px-4 py-4 text-left font-semibold">Action</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-surface-200 dark:divide-surface-800 bg-white dark:bg-surface-900">
							{filteredRows.map((row, index) => (
								<tr key={row.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/40 transition-colors">
									<td className="px-4 py-4 text-surface-500 dark:text-surface-400">{index + 1}</td>
									<td className="px-4 py-4 font-medium text-surface-900 dark:text-white">{row.title}</td>
									<td className="px-4 py-4 max-w-[24rem] text-surface-600 dark:text-surface-300">
										<p className="truncate">{row.description}</p>
									</td>
									<td className="px-4 py-4">
										<img src={row.image} alt={row.title} className="h-10 w-10 rounded-xl object-cover ring-1 ring-surface-200 dark:ring-surface-700" />
									</td>
									<td className="px-4 py-4 text-surface-700 dark:text-surface-200">{row.count}</td>
									<td className="px-4 py-4">
										<button
											type="button"
											onClick={() => handleToggleStatus(row.id)}
											className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold transition-colors ${row.status
												? 'bg-admin-primary-100 text-admin-primary-700 dark:bg-admin-primary-900/30 dark:text-admin-primary-300'
												: 'bg-surface-100 text-surface-500 dark:bg-surface-800 dark:text-surface-400'
											}`}
										>
											{row.status ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
											{row.status ? 'On' : 'Off'}
										</button>
									</td>
									<td className="px-4 py-4">
										<button
											type="button"
											onClick={() => handleResend(row.id)}
											className="inline-flex items-center justify-center rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900/40 dark:text-emerald-400 dark:hover:bg-emerald-950/20 p-2 transition-colors"
											aria-label={`Resend ${row.title}`}
										>
											<RefreshCw size={15} />
										</button>
									</td>
									<td className="px-4 py-4">
										<div className="flex items-center gap-2">
											<button
												type="button"
												onClick={() => handleEdit(row)}
												className="rounded-lg border border-admin-primary-200 text-admin-primary-600 hover:bg-admin-primary-50 dark:border-admin-primary-900/40 dark:text-admin-primary-300 dark:hover:bg-admin-primary-950/20 p-2 transition-colors"
												aria-label={`Edit ${row.title}`}
											>
												<Pencil size={15} />
											</button>
											<button
												type="button"
												onClick={() => handleDelete(row.id)}
												className="rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-950/20 p-2 transition-colors"
												aria-label={`Delete ${row.title}`}
											>
												<Trash2 size={15} />
											</button>
										</div>
									</td>
								</tr>
							))}

							{rowCount === 0 && (
								<tr>
									<td colSpan={8} className="px-6 py-14 text-center text-surface-500 dark:text-surface-400">
										No notifications match the current search.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
};

export default SendNotification;
