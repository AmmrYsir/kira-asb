import { createEffect, createMemo, createSignal, type Component } from 'solid-js';
import { calculateDividendSchedule } from './dividend';
import { InputCard } from './components/InputCard';
import { SummaryCard } from './components/SummaryCard';
import { YearlyBreakdownTable } from './components/YearlyBreakdownTable';
import { months } from './months';
import './app.css';

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
			const saved = localStorage.getItem('darkMode');
			return saved ? JSON.parse(saved) : false;
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
				{/* Header */}
				<header class="animate-fade-in px-4 py-8 md:py-12">
					<div class="max-w-7xl mx-auto">
						<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
							<div class="space-y-2">
								<div class="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-semibold tracking-wide uppercase">
									v1.0
								</div>
								<h1 class="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
									ASB Dividend Planner
								</h1>
								<p class="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
									Estimate your dividend income with monthly minimum balance calculations, automatic reinvestment, and contribution limits.
								</p>
							</div>
							<div class="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
								<div class="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
									<div class="h-2 w-2 rounded-full bg-green-500 animate-pulse-soft"></div>
									<span class="text-sm font-medium text-slate-700 dark:text-slate-300">Live calculation</span>
								</div>
								<button
									onClick={() => setIsDark(!isDark())}
									class="flex items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
									aria-label="Toggle dark mode"
								>
									{isDark() ? (
										<span class="material-icons text-yellow-500">light_mode</span>
									) : (
										<span class="material-icons text-yellow-500">dark_mode</span>
									)}
								</button>
							</div>
						</div>
					</div>
				</header>

				{/* Main Content */}
				<main class="max-w-7xl mx-auto px-4 pb-16">
					<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
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

						<SummaryCard schedule={schedule} formatCurrency={formatCurrency} />

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
