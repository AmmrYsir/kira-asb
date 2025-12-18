import type { Accessor, Setter } from 'solid-js';
import { For } from 'solid-js';
import type { DividendSchedule } from '../dividend';
import { months } from '../months';

export type YearlyBreakdownTableProps = {
  schedule: Accessor<DividendSchedule>;
  expandedYear: Accessor<number | null>;
  setExpandedYear: Setter<number | null>;
  formatCurrency: (value: number) => string;
  customContributions: Accessor<Record<number, Record<number, number>>>;
  onContributionChange: (year: number, month: number, amount: number) => void;
  onContributionReset?: (year: number, month: number) => void;
  parseNumber: (value: string, fallback?: number) => number;
};

export const YearlyBreakdownTable = (props: YearlyBreakdownTableProps) => (
  <div class="lg:col-span-12 animate-slide-up" style="animation-delay: 150ms;">
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
      <div class="bg-gradient-to-r from-slate-700 dark:from-slate-900 to-slate-800 dark:to-slate-950 px-6 py-4">
        <div>
          <p class="text-slate-300 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Annual Details</p>
          <h2 class="text-xl font-display font-bold text-white">Yearly Breakdown</h2>
        </div>
      </div>

      <div>
        {props.schedule().years.length === 0 ? (
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
                <For each={props.schedule().years}>{(year) => (
                  <>
                    <tr
                      class="group border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                      onClick={() => props.setExpandedYear(props.expandedYear() === year.year ? null : year.year)}
                    >
                      <td class="py-4 px-4">
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-bold text-sm group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
                          {year.year}
                        </span>
                      </td>
                      <td class="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">{props.formatCurrency(year.contributed)}</td>
                      <td class="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">{props.formatCurrency(year.averageMMB)}</td>
                      <td class="py-4 px-4 font-semibold text-green-600 dark:text-green-400">{props.formatCurrency(year.dividend)}</td>
                      <td class="py-4 px-4 font-semibold text-accent-600 dark:text-accent-400">{props.formatCurrency(year.bonus)}</td>
                      <td class="py-4 px-4 font-bold text-slate-900 dark:text-white">{props.formatCurrency(year.totalUnitsEnd)}</td>
                    </tr>
                    {props.expandedYear() === year.year && (
                      <tr class="bg-slate-50/70 dark:bg-slate-800/60">
                        <td colSpan={6} class="px-4 py-4">
                          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <For each={year.monthlyBreakdown}>{(month) => {
                              const customValue = () => props.customContributions()[year.year]?.[month.month];

                              return (
                                <div class="flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 px-4 py-3 shadow-sm" onClick={(e) => e.stopPropagation()}>
                                  <div class="space-y-1">
                                    <p class="text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">{months[month.month - 1]}</p>
                                    <p class="text-xs text-slate-500 dark:text-slate-400">Applied: {props.formatCurrency(month.contribution)}</p>
                                    <p class="text-xs text-slate-500 dark:text-slate-400">End balance: {props.formatCurrency(month.endBalance)}</p>
                                  </div>
                                  <div class="flex flex-col items-end gap-2">
                                    <label class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                      <span class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Edit</span>
                                      <input
                                        type="number"
                                        inputMode="decimal"
                                        value={customValue() ?? month.contribution}
                                        class="w-24 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        onClick={(e) => e.stopPropagation()}
                                        onInput={(e) => props.onContributionChange(year.year, month.month, props.parseNumber(e.currentTarget.value, customValue() ?? month.contribution))}
                                      />
                                    </label>
                                    {customValue() !== undefined ? (
                                      <button
                                        type="button"
                                        class="text-xs font-semibold text-primary-600 dark:text-primary-300 hover:underline"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          props.onContributionReset?.(year.year, month.month);
                                        }}
                                      >
                                        Reset to default
                                      </button>
                                    ) : null}
                                  </div>
                                </div>
                              );
                            }}</For>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )}</For>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  </div>
);
