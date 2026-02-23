import type { Accessor } from 'solid-js';
import type { DividendSchedule } from '~/libs/dividend';
import { AnimatedCurrency } from './AnimatedCurrency';

export type SummaryCardProps = {
	schedule: Accessor<DividendSchedule>;
	formatCurrency: (value: number) => string;
};

export const SummaryCard = (props: SummaryCardProps) => {
	const totalDividends = () => props.schedule().totals.dividend + props.schedule().totals.bonus;
	const avgMonthly = () => {
		const years = props.schedule().years.length;
		return years > 0 ? totalDividends() / years / 12 : 0;
	};
	const yearsToDouble = () => {
		const contributed = props.schedule().totals.contributed;
		if (contributed <= 0) return 0;
		const rate = (totalDividends() / contributed) * 100;
		if (rate <= 0) return 0;
		return Math.log(2) / Math.log(1 + rate / 100);
	};

	return (
		<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in">
			<div class="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
				<div class="flex items-center gap-3 mb-3">
					<div class="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
						<svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Dividends</span>
				</div>
				<p class="text-2xl font-bold text-slate-900 dark:text-white">
					<AnimatedCurrency value={totalDividends} format={props.formatCurrency} />
				</p>
				<div class="flex items-center gap-1 mt-2">
					<svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
					</svg>
					<span class="text-xs text-green-600 dark:text-green-400 font-medium">
						{props.schedule().totals.contributed > 0
							? ((totalDividends() / props.schedule().totals.contributed) * 100).toFixed(1)
							: 0}%
					</span>
				</div>
			</div>

			<div class="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
				<div class="flex items-center gap-3 mb-3">
					<div class="w-10 h-10 rounded-xl bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
						<svg class="w-5 h-5 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
					</div>
					<span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Avg Monthly</span>
				</div>
				<p class="text-2xl font-bold text-slate-900 dark:text-white">
					<AnimatedCurrency value={avgMonthly} format={props.formatCurrency} />
				</p>
				<div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mt-3">
					<div class="bg-accent-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (avgMonthly() / 500) * 100)}%` }} />
				</div>
			</div>

			<div class="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
				<div class="flex items-center gap-3 mb-3">
					<div class="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
						<svg class="w-5 h-5 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
						</svg>
					</div>
					<span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Final Units</span>
				</div>
				<p class="text-2xl font-bold text-slate-900 dark:text-white">
					{props.schedule().totals.finalUnits.toLocaleString('en-MY', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
				</p>
				<p class="text-xs text-slate-400 dark:text-slate-500 mt-2">Units</p>
			</div>

			<div class="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
				<div class="flex items-center gap-3 mb-3">
					<div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
						<svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Double In</span>
				</div>
				<p class="text-2xl font-bold text-slate-900 dark:text-white">
					{yearsToDouble() > 0 ? `${yearsToDouble().toFixed(1)} yrs` : '--'}
				</p>
				<p class="text-xs text-slate-400 dark:text-slate-500 mt-2">At current rate</p>
			</div>
		</div>
	);
};
