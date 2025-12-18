import { createEffect, createMemo, createSignal, type Component, For } from 'solid-js';
import { calculateDividendSchedule } from './dividend';
import { useAnimatedNumber } from './useAnimatedNumber';
import './app.css';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const formatCurrency = (value: number) =>
  value.toLocaleString('en-MY', {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: 2,
  });

const formatNumber = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 2 });

const parseNumber = (value: string, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const AnimatedCurrency = (props: { value: () => number }) => {
  const animated = useAnimatedNumber(props.value, 600);
  return <>{formatCurrency(animated())}</>;
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
    }),
  );

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
            <div class="hidden md:flex items-center gap-3">
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
                  <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                  </svg>
                ) : (
                  <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1m-16 0H1m15.364 1.636l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main class="max-w-7xl mx-auto px-4 pb-16">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Input Card */}
          <div class="lg:col-span-7 animate-slide-up">
            <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden transition-all e-200/60 dark:hover:shadow-slate-900/60">
              <div class="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-primary-100 text-xs font-semibold uppercase tracking-wider mb-1">INPUT</p>
                    <h2 class="text-xl font-display font-bold text-white">Saving Plan</h2>
                  </div>
                  <div class="px-3 py-1 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30">
                    <span class="text-xs font-semibold text-white">MMB Method</span>
                  </div>
                </div>
              </div>

              <div class="p-6 space-y-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <label class="group">
                    <span class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Saving duration (years)</span>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={years()}
                      inputMode="numeric"
                      onInput={(e) => setYears(Math.max(0, parseNumber(e.currentTarget.value, years())))}
                      class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
                    />
                  </label>

                  <label class="group">
                    <span class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Dividend rate (sen per RM1)</span>
                    <input
                      type="number"
                      step="0.01"
                      value={baseRate()}
                      inputMode="decimal"
                      onInput={(e) => setBaseRate(Math.max(0, parseNumber(e.currentTarget.value, baseRate())))}
                      class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
                    />
                  </label>

                  <label class="group">
                    <span class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Bonus rate (sen per RM1)</span>
                    <input
                      type="number"
                      step="0.01"
                      value={bonusRate()}
                      inputMode="decimal"
                      onInput={(e) => setBonusRate(Math.max(0, parseNumber(e.currentTarget.value, bonusRate())))}
                      class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
                    />
                  </label>

                  <label class="group">
                    <span class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Starting month</span>
                    <select
                      value={startMonth()}
                      onInput={(e) => setStartMonth(Number(e.currentTarget.value))}
                      class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-slate-600 hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer"
                    >
                      <For each={months}>{(month, index) => (
                        <option value={index() + 1}>{month}</option>
                      )}</For>
                    </select>
                  </label>

                  <label class="group">
                    <span class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Initial saving amount (RM)</span>
                    <input
                      type="number"
                      step="100"
                      min="0"
                      value={initialAmount()}
                      inputMode="decimal"
                      onInput={(e) => setInitialAmount(Math.max(0, parseNumber(e.currentTarget.value, initialAmount())))}
                      class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
                    />
                  </label>

                  <label class="group">
                    <span class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Monthly saving amount (RM)</span>
                    <input
                      type="number"
                      step="50"
                      min="0"
                      value={monthlyAmount()}
                      inputMode="decimal"
                      onInput={(e) => setMonthlyAmount(Math.max(0, parseNumber(e.currentTarget.value, monthlyAmount())))}
                      class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
                    />
                  </label>
                </div>

                <div class="border-t border-slate-200 dark:border-slate-700 my-6"></div>

                <label class="group">
                  <span class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Investment limit (RM)</span>
                  <input
                    type="number"
                    step="1000"
                    min="0"
                    value={investmentLimit()}
                    inputMode="decimal"
                    onInput={(e) =>
                      setInvestmentLimit(Math.max(0, parseNumber(e.currentTarget.value, investmentLimit())))
                    }
                    class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
                  />
                  <p class="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Contributions stop once balance reaches this limit; dividends continue compounding.
                  </p>
                </label>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div class="lg:col-span-5 animate-slide-in-right">
            <div class="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl shadow-xl dark:shadow-none border border-slate-200/60 dark:border-slate-700/60 overflow-hidden sticky top-6">
              <div class="px-6 py-4 border-b border-white/10">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-primary-100 text-xs font-semibold uppercase tracking-wider mb-1">Summary</p>
                    <h2 class="text-xl font-display font-bold text-white">Projected Outcome</h2>
                  </div>
                  <div class="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                    <span class="text-xs font-semibold text-white">Compounded</span>
                  </div>
                </div>
              </div>

              <div class="p-6 space-y-4">
                <div class="group bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-all hover:bg-white/15 hover:scale-105">
                  <p class="text-xs font-semibold text-primary-100 uppercase tracking-wider mb-2">Total Contributed</p>
                  <p class="text-2xl md:text-3xl font-bold text-white">
                    <AnimatedCurrency value={() => schedule().totals.contributed} />
                  </p>
                </div>

                <div class="group bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-all hover:bg-white/15 hover:scale-105">
                  <p class="text-xs font-semibold text-primary-100 uppercase tracking-wider mb-2">Base Dividends</p>
                  <p class="text-2xl md:text-3xl font-bold text-white">
                    <AnimatedCurrency value={() => schedule().totals.dividend} />
                  </p>
                </div>

                <div class="group bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-all hover:bg-white/15 hover:scale-105">
                  <p class="text-xs font-semibold text-primary-100 uppercase tracking-wider mb-2">Bonus Dividends</p>
                  <p class="text-2xl md:text-3xl font-bold text-white">
                    <AnimatedCurrency value={() => schedule().totals.bonus} />
                  </p>
                </div>

                <div class="group bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl p-4 border border-accent-400/30 shadow-lg transition-all hover:shadow-xl hover:scale-105">
                  <p class="text-xs font-semibold text-accent-50 uppercase tracking-wider mb-2">Final Units</p>
                  <p class="text-3xl md:text-4xl font-bold text-white">
                    <AnimatedCurrency value={() => schedule().totals.finalUnits} />
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div class="lg:col-span-12 animate-slide-up" style="animation-delay: 150ms;">
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
              <div class="bg-gradient-to-r from-slate-700 dark:from-slate-900 to-slate-800 dark:to-slate-950 px-6 py-4">
                <div>
                  <p class="text-slate-300 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Annual Details</p>
                  <h2 class="text-xl font-display font-bold text-white">Yearly Breakdown</h2>
                </div>
              </div>

              <div class="">
              {schedule().years.length === 0 ? (
                <div class="text-center py-16">
                  <svg class="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p class="text-slate-500 dark:text-slate-400 font-medium">Set duration above zero to see yearly projections</p>
                </div>
              ) : (
                <div class="overflow-x-auto -mx-6 px-6">
                  <table class="w-full min-w-[720px]">
                    <thead>
                      <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                        <th class="text-left py-3 px-4 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Year</th>
                        <th class="text-left py-3 px-4 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Contributed</th>
                        <th class="text-left py-3 px-4 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Average MMB</th>
                        <th class="text-left py-3 px-4 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Dividend</th>
                        <th class="text-left py-3 px-4 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Bonus</th>
                        <th class="text-left py-3 px-4 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Total Units (End)</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                      <For each={schedule().years}>{(year) => (
                        <tr class="group border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <td class="py-4 px-4">
                            <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-bold text-sm group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
                              {year.year}
                            </span>
                          </td>
                          <td class="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(year.contributed)}</td>
                          <td class="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(year.averageMMB)}</td>
                          <td class="py-4 px-4 font-semibold text-green-600 dark:text-green-400">{formatCurrency(year.dividend)}</td>
                          <td class="py-4 px-4 font-semibold text-accent-600 dark:text-accent-400">{formatCurrency(year.bonus)}</td>
                          <td class="py-4 px-4 font-bold text-slate-900 dark:text-white">{formatCurrency(year.totalUnitsEnd)}</td>
                        </tr>
                      )}</For>
                    </tbody>
                  </table>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
};

export default App;
