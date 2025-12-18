export type DividendInput = {
  years: number;
  baseRate: number; // sen per RM1 per year (e.g., 4.25)
  bonusRate: number; // sen per RM1 per year (e.g., 1.0)
  startMonth: number; // 1-12, month when monthly savings start
  initialAmount: number;
  monthlyAmount: number;
  bonusCap?: number | null; // optional cap on balance eligible for bonus
};

export type YearResult = {
  year: number;
  contributed: number;
  averageMMB: number;
  dividend: number;
  bonus: number;
  totalUnitsEnd: number;
  monthlyMMB: number[];
};

export type DividendSchedule = {
  years: YearResult[];
  totals: {
    contributed: number;
    dividend: number;
    bonus: number;
    finalUnits: number;
  };
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const asNonNegative = (value: number) => (Number.isFinite(value) && value > 0 ? value : 0);

export function calculateDividendSchedule(input: DividendInput): DividendSchedule {
  const yearsCount = clamp(Math.round(input.years) || 0, 0, 50);
  const startMonth = clamp(Math.round(input.startMonth) || 1, 1, 12);

  let balance = asNonNegative(input.initialAmount);
  let totalContributed = 0;
  let totalDividend = 0;
  let totalBonus = 0;

  const years: YearResult[] = [];

  for (let yearIndex = 0; yearIndex < yearsCount; yearIndex++) {
    const yearNumber = yearIndex + 1;
    const monthlyMMB: number[] = [];

    // Initial contribution only counts in year 1 (already inside balance)
    let yearContribution = yearNumber === 1 ? balance : 0;

    for (let month = 1; month <= 12; month++) {
      const contributionEligible =
        yearNumber > 1 || month >= startMonth ? asNonNegative(input.monthlyAmount) : 0;

      if (contributionEligible > 0) {
        balance += contributionEligible;
        yearContribution += contributionEligible;
      }

      monthlyMMB.push(balance);
    }

    const sumMMB = monthlyMMB.reduce((acc, value) => acc + value, 0);
    const averageMMB = monthlyMMB.length ? sumMMB / monthlyMMB.length : 0;

    const dividend = averageMMB * (asNonNegative(input.baseRate) / 100);

    const bonusEligibleBalance = input.bonusCap
      ? Math.min(averageMMB, asNonNegative(input.bonusCap))
      : averageMMB;

    const bonus = bonusEligibleBalance * (asNonNegative(input.bonusRate) / 100);

    const reinvested = dividend + bonus;
    balance += reinvested;

    totalContributed += yearContribution;
    totalDividend += dividend;
    totalBonus += bonus;

    years.push({
      year: yearNumber,
      contributed: yearContribution,
      averageMMB,
      dividend,
      bonus,
      totalUnitsEnd: balance,
      monthlyMMB,
    });
  }

  return {
    years,
    totals: {
      contributed: totalContributed,
      dividend: totalDividend,
      bonus: totalBonus,
      finalUnits: balance,
    },
  };
}
