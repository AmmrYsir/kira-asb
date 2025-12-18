import type { Accessor } from 'solid-js';
import type { DividendSchedule } from '../dividend';
import { AnimatedCurrency } from './AnimatedCurrency';

export type SummaryCardProps = {
  schedule: Accessor<DividendSchedule>;
  formatCurrency: (value: number) => string;
};

export const SummaryCard = (props: SummaryCardProps) => (
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
            <AnimatedCurrency value={() => props.schedule().totals.contributed} format={props.formatCurrency} />
          </p>
        </div>

        <div class="group bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-all hover:bg-white/15 hover:scale-105">
          <p class="text-xs font-semibold text-primary-100 uppercase tracking-wider mb-2">Base Dividends</p>
          <p class="text-2xl md:text-3xl font-bold text-white">
            <AnimatedCurrency value={() => props.schedule().totals.dividend} format={props.formatCurrency} />
          </p>
        </div>

        <div class="group bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-all hover:bg-white/15 hover:scale-105">
          <p class="text-xs font-semibold text-primary-100 uppercase tracking-wider mb-2">Bonus Dividends</p>
          <p class="text-2xl md:text-3xl font-bold text-white">
            <AnimatedCurrency value={() => props.schedule().totals.bonus} format={props.formatCurrency} />
          </p>
        </div>

        <div class="group bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl p-4 border border-accent-400/30 shadow-lg transition-all hover:shadow-xl hover:scale-105">
          <p class="text-xs font-semibold text-accent-50 uppercase tracking-wider mb-2">Final Units</p>
          <p class="text-3xl md:text-4xl font-bold text-white">
            <AnimatedCurrency value={() => props.schedule().totals.finalUnits} format={props.formatCurrency} />
          </p>
        </div>
      </div>
    </div>
  </div>
);
