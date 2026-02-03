import type { Accessor, Setter } from 'solid-js';
import { For } from 'solid-js';

export type InputCardProps = {
  months: string[];
  years: Accessor<number>;
  setYears: Setter<number>;
  baseRate: Accessor<number>;
  setBaseRate: Setter<number>;
  bonusRate: Accessor<number>;
  setBonusRate: Setter<number>;
  startMonth: Accessor<number>;
  setStartMonth: Setter<number>;
  initialAmount: Accessor<number>;
  setInitialAmount: Setter<number>;
  monthlyAmount: Accessor<number>;
  setMonthlyAmount: Setter<number>;
  investmentLimit: Accessor<number>;
  setInvestmentLimit: Setter<number>;
  parseNumber: (value: string, fallback?: number) => number;
};

export const InputCard = (props: InputCardProps) => (
  <div class="lg:col-span-7 animate-slide-up">
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 overflow-hidden transition-all hover:shadow-2xl hover:shadow-slate-200/60 dark:hover:shadow-slate-900/60">
      <div class="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-primary-100 text-xs font-semibold uppercase tracking-wider mb-1">Input</p>
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
              value={props.years()}
              inputMode="numeric"
              onInput={(e) => props.setYears(Math.max(0, props.parseNumber(e.currentTarget.value, props.years())))}
              class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
            />
          </label>

          <label class="group">
            <span class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Dividend rate (sen per RM1)</span>
            <input
              type="number"
              step="0.01"
              value={props.baseRate()}
              inputMode="decimal"
              onInput={(e) => props.setBaseRate(Math.max(0, props.parseNumber(e.currentTarget.value, props.baseRate())))}
              class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
            />
          </label>

          <label class="group">
            <span class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Bonus rate (sen per RM1)</span>
            <input
              type="number"
              step="0.01"
              value={props.bonusRate()}
              inputMode="decimal"
              onInput={(e) => props.setBonusRate(Math.max(0, props.parseNumber(e.currentTarget.value, props.bonusRate())))}
              class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
            />
          </label>

          <label class="group">
            <span class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Starting month</span>
            <select
              value={props.startMonth()}
              onInput={(e) => props.setStartMonth(Number(e.currentTarget.value))}
              class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-slate-600 hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer"
            >
              <For each={props.months}>{(month, index) => (
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
              value={props.initialAmount()}
              inputMode="decimal"
              onInput={(e) => props.setInitialAmount(Math.max(0, props.parseNumber(e.currentTarget.value, props.initialAmount())))}
              class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
            />
          </label>

          <label class="group">
            <span class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Monthly saving amount (RM)</span>
            <input
              type="number"
              step="50"
              min="0"
              value={props.monthlyAmount()}
              inputMode="decimal"
              onInput={(e) => props.setMonthlyAmount(Math.max(0, props.parseNumber(e.currentTarget.value, props.monthlyAmount())))}
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
            value={props.investmentLimit()}
            inputMode="decimal"
            onInput={(e) =>
              props.setInvestmentLimit(Math.max(0, props.parseNumber(e.currentTarget.value, props.investmentLimit())))
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
);
