import { createEffect, createMemo, createSignal, type Component } from 'solid-js';
import { calculateDividendSchedule } from '../src/libs/dividend';
import { InputCard } from './components/InputCard';
import { SummaryCard } from './components/SummaryCard';
import { YearlyBreakdownTable } from './components/YearlyBreakdownTable';
import { PortfolioChart } from './components/PortfolioChart';
import { YearlyChart } from './components/YearlyChart';
import { months } from '../src/libs/months';
import './style.css';

const formatCurrency = (value: number) =>
	value.toLocaleString('en-MY', {
		style: 'currency',
		currency: 'MYR',
		minimumFractionDigits: 2,
	});

const parseNumber = (value: string, fallback = 0) => {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
};

const App: Component = () => {
	const getInitialDarkMode = () => {
		if (typeof window !== 'undefined') {
			try {
				const saved = localStorage.getItem('darkMode');
				return saved ? JSON.parse(saved) : false;
			} catch {
				return false;
			}
		}
		return false;
	};

	const [isDark, setIsDark] = createSignal(getInitialDarkMode());
	const [years, setYears] = createSignal(5);
	const [baseRate, setBaseRate] = createSignal(5.50);
	const [bonusRate, setBonusRate] = createSignal(0.25);
	const [startMonth, setStartMonth] = createSignal(1);
	const [initialAmount, setInitialAmount] = createSignal(0);
	const [monthlyAmount, setMonthlyAmount] = createSignal(500);
	const [investmentLimit, setInvestmentLimit] = createSignal(300000);
	const [expandedYear, setExpandedYear] = createSignal<number | null>(null);
	const [customContributions, setCustomContributions] = createSignal<Record<number, Record<number, number>>>({});

	createEffect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('darkMode', JSON.stringify(isDark()));
		}
	});

	const schedule = createMemo(() =>
		calculateDividendSchedule({
			years: years(),
			baseRate: baseRate(),
			bonusRate: bonusRate(),
			startMonth: startMonth(),
			initialAmount: initialAmount(),
			monthlyAmount: monthlyAmount(),
			investmentLimit: investmentLimit(),
			customMonthlyContributions: customContributions(),
		}),
	);

	const handleContributionChange = (year: number, month: number, amount: number) => {
		const safeAmount = Math.max(0, amount);
		setCustomContributions((prev) => {
			const yearOverrides = { ...(prev[year] ?? {}) };
			yearOverrides[month] = safeAmount;
			return { ...prev, [year]: yearOverrides };
		});
	};

	const handleContributionReset = (year: number, month: number) => {
		setCustomContributions((prev) => {
			const yearOverrides = prev[year];
			if (!yearOverrides) return prev;
			const updatedYear = { ...yearOverrides };
			delete updatedYear[month];

			if (Object.keys(updatedYear).length === 0) {
				const { [year]: _removed, ...rest } = prev;
				return rest;
			}

			return { ...prev, [year]: updatedYear };
		});
	};

	return (
		<div class={isDark() ? 'dark' : ''}>
			<div class="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
				<header class="px-4 md:px-8 py-6 md:py-10 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
					<div class="max-w-7xl mx-auto">
						<div class="flex items-center justify-between">
							<div>
								<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-semibold tracking-wide uppercase mb-3">
									<span class="w-2 h-2 rounded-full bg-primary-500"></span>
									v2.0
								</div>
								<h1 class="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
									ASB Dividend Planner
								</h1>
								<p class="text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
									Estimate your dividend income with interactive visualizations and real-time projections.
								</p>
							</div>
							<div class="flex items-center gap-3">
								<button
									onClick={() => setIsDark(!isDark())}
									class="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
									aria-label="Toggle dark mode"
								>
									{isDark() ? (
										<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
										</svg>
									) : (
										<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
										</svg>
									)}
								</button>
							</div>
						</div>
					</div>
				</header>

				<main class="max-w-7xl mx-auto px-4 md:px-8 py-8">
					<SummaryCard schedule={schedule} formatCurrency={formatCurrency} />

					<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
						<div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
							<div class="flex items-center justify-between mb-6">
								<div>
									<h3 class="text-lg font-display font-bold text-slate-900 dark:text-white">Portfolio Growth</h3>
									<p class="text-sm text-slate-500 dark:text-slate-400">Total value over time</p>
								</div>
								<div class="flex items-center gap-3">
									<span class="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
										<span class="w-3 h-3 rounded-full bg-primary-500"></span>
										Total Value
									</span>
									<span class="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
										<span class="w-3 h-3 rounded-full bg-slate-400"></span>
										Principal
									</span>
								</div>
							</div>
							<PortfolioChart schedule={schedule()} formatCurrency={formatCurrency} />
						</div>

						<div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
							<div class="flex items-center justify-between mb-6">
								<div>
									<h3 class="text-lg font-display font-bold text-slate-900 dark:text-white">Yearly Dividends</h3>
									<p class="text-sm text-slate-500 dark:text-slate-400">Dividend income by year</p>
								</div>
							</div>
							<YearlyChart schedule={schedule()} formatCurrency={formatCurrency} />
						</div>
					</div>

					<div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
						<InputCard
							months={months}
							years={years}
							setYears={setYears}
							baseRate={baseRate}
							setBaseRate={setBaseRate}
							bonusRate={bonusRate}
							setBonusRate={setBonusRate}
							startMonth={startMonth}
							setStartMonth={setStartMonth}
							initialAmount={initialAmount}
							setInitialAmount={setInitialAmount}
							monthlyAmount={monthlyAmount}
							setMonthlyAmount={setMonthlyAmount}
							investmentLimit={investmentLimit}
							setInvestmentLimit={setInvestmentLimit}
							parseNumber={parseNumber}
						/>

						<YearlyBreakdownTable
							schedule={schedule}
							expandedYear={expandedYear}
							setExpandedYear={setExpandedYear}
							formatCurrency={formatCurrency}
							customContributions={customContributions}
							onContributionChange={handleContributionChange}
							onContributionReset={handleContributionReset}
							parseNumber={parseNumber}
						/>
					</div>
				</main>
			</div>
		</div>
	);
};

export default App;
