import { createMemo, createSignal, type Component } from 'solid-js';
import { calculateDividendSchedule } from './dividend';
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

const App: Component = () => {
  const [years, setYears] = createSignal(5);
  const [baseRate, setBaseRate] = createSignal(4.25);
  const [bonusRate, setBonusRate] = createSignal(1);
  const [startMonth, setStartMonth] = createSignal(1);
  const [initialAmount, setInitialAmount] = createSignal(0);
  const [monthlyAmount, setMonthlyAmount] = createSignal(500);
  const [bonusCapEnabled, setBonusCapEnabled] = createSignal(true);
  const [bonusCap, setBonusCap] = createSignal(30000);
  const [bonusYearsEnabled, setBonusYearsEnabled] = createSignal(true);
  const [bonusYears, setBonusYears] = createSignal(10);

  const schedule = createMemo(() =>
    calculateDividendSchedule({
      years: years(),
      baseRate: baseRate(),
      bonusRate: bonusRate(),
      startMonth: startMonth(),
      initialAmount: initialAmount(),
      monthlyAmount: monthlyAmount(),
      bonusCap: bonusCapEnabled() ? bonusCap() : null,
      bonusEligibleYears: bonusYearsEnabled() ? bonusYears() : null,
    }),
  );

  return (
    <div class="page">
      <header class="hero">
        <div>
          <p class="eyebrow">ASB-style dividend simulator</p>
          <h1>Plan yearly dividends with compounding</h1>
          <p class="lede">
            Estimate dividend income using monthly minimum balances, bonus caps, and automatic
            reinvestment.
          </p>
        </div>
        <div class="pill">SolidJS · TypeScript · RM</div>
      </header>

      <section class="grid">
        <div class="card form">
          <div class="card-header">
            <div>
              <p class="eyebrow">Inputs</p>
              <h2>Saving plan</h2>
            </div>
            <div class="badge">MMB based</div>
          </div>

          <div class="form-grid">
            <label class="field">
              <span>Saving duration (years)</span>
              <input
                type="number"
                min="0"
                max="50"
                value={years()}
                inputMode="numeric"
                onInput={(e) => setYears(Math.max(0, parseNumber(e.currentTarget.value, years())))}
              />
            </label>

            <label class="field">
              <span>Dividend rate (sen per RM1)</span>
              <input
                type="number"
                step="0.01"
                value={baseRate()}
                inputMode="decimal"
                onInput={(e) => setBaseRate(Math.max(0, parseNumber(e.currentTarget.value, baseRate())))}
              />
            </label>

            <label class="field">
              <span>Bonus rate (sen per RM1)</span>
              <input
                type="number"
                step="0.01"
                value={bonusRate()}
                inputMode="decimal"
                onInput={(e) => setBonusRate(Math.max(0, parseNumber(e.currentTarget.value, bonusRate())))}
              />
            </label>

            <label class="field">
              <span>Starting month</span>
              <select
                value={startMonth()}
                onInput={(e) => setStartMonth(Number(e.currentTarget.value))}
              >
                {months.map((month, index) => (
                  <option value={index + 1}>{month}</option>
                ))}
              </select>
            </label>

            <label class="field">
              <span>Initial saving amount (RM)</span>
              <input
                type="number"
                step="100"
                min="0"
                value={initialAmount()}
                inputMode="decimal"
                onInput={(e) => setInitialAmount(Math.max(0, parseNumber(e.currentTarget.value, initialAmount())))}
              />
            </label>

            <label class="field">
              <span>Monthly saving amount (RM)</span>
              <input
                type="number"
                step="50"
                min="0"
                value={monthlyAmount()}
                inputMode="decimal"
                onInput={(e) => setMonthlyAmount(Math.max(0, parseNumber(e.currentTarget.value, monthlyAmount())))}
              />
            </label>
          </div>

          <div class="divider" />

          <div class="bonus-controls">
            <div class="bonus-row">
              <label class="switch">
                <input
                  type="checkbox"
                  checked={bonusCapEnabled()}
                  onInput={(e) => setBonusCapEnabled(e.currentTarget.checked)}
                />
                <span>Bonus balance cap</span>
              </label>
              <input
                type="number"
                step="1000"
                min="0"
                disabled={!bonusCapEnabled()}
                value={bonusCap()}
                inputmode="decimal"
                onInput={(e) => setBonusCap(Math.max(0, parseNumber(e.currentTarget.value, bonusCap())))}
              />
            </div>

            <div class="bonus-row">
              <label class="switch">
                <input
                  type="checkbox"
                  checked={bonusYearsEnabled()}
                  onInput={(e) => setBonusYearsEnabled(e.currentTarget.checked)}
                />
                <span>Bonus applies for first (years)</span>
              </label>
              <input
                type="number"
                min="1"
                max="50"
                disabled={!bonusYearsEnabled()}
                value={bonusYears()}
                inputMode="numeric"
                onInput={(e) => setBonusYears(Math.max(1, parseNumber(e.currentTarget.value, bonusYears())))}
              />
            </div>
          </div>
        </div>

        <div class="card summary">
          <div class="card-header">
            <div>
              <p class="eyebrow">Overview</p>
              <h2>Projected outcome</h2>
            </div>
            <div class="badge ghost">Compounded</div>
          </div>

          <div class="stats">
            <div>
              <p>Total contributed</p>
              <strong>{formatCurrency(schedule().totals.contributed)}</strong>
            </div>
            <div>
              <p>Base dividends</p>
              <strong>{formatCurrency(schedule().totals.dividend)}</strong>
            </div>
            <div>
              <p>Bonus dividends</p>
              <strong>{formatCurrency(schedule().totals.bonus)}</strong>
            </div>
            <div>
              <p>Final units</p>
              <strong>{formatCurrency(schedule().totals.finalUnits)}</strong>
            </div>
          </div>
        </div>
      </section>

      <section class="card table">
        <div class="card-header">
          <div>
            <p class="eyebrow">Yearly breakdown</p>
            <h2>Average MMB and dividends</h2>
          </div>
        </div>

        {schedule().years.length === 0 ? (
          <p class="muted">Set duration above zero to see projections.</p>
        ) : (
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Contributed</th>
                  <th>Average MMB</th>
                  <th>Dividend</th>
                  <th>Bonus</th>
                  <th>Total units (end)</th>
                </tr>
              </thead>
              <tbody>
                {schedule().years.map((year) => (
                  <tr>
                    <td>{year.year}</td>
                    <td>{formatCurrency(year.contributed)}</td>
                    <td>{formatCurrency(year.averageMMB)}</td>
                    <td>{formatCurrency(year.dividend)}</td>
                    <td>{formatCurrency(year.bonus)}</td>
                    <td>{formatCurrency(year.totalUnitsEnd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default App;
