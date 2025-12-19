# ASB Dividend Planner

A comprehensive web application for estimating and planning your Amanah Saham Bumiputera (ASB) dividend income. Built with SolidJS and TailwindCSS, this tool helps you project your returns using the Monthly Minimum Balance (MMB) method with automatic dividend reinvestment.

## Features

### 💰 Accurate Dividend Calculations
- **Monthly Minimum Balance (MMB) Method**: Calculates dividends based on the actual minimum balance held each month
- **Automatic Dividend Reinvestment**: Automatically compounds both base and bonus dividends back into your investment
- **Dual Dividend Rates**: Separate tracking for base dividends and bonus dividends
- **Investment Limit Enforcement**: Respects the RM300,000 contribution limit (configurable)

### 📊 Comprehensive Planning Tools
- **Multi-Year Projections**: Plan for up to 50 years of saving
- **Custom Start Month**: Begin contributions in any month of the year
- **Initial Investment**: Account for existing balances or lump sum investments
- **Monthly Contributions**: Set regular monthly contribution amounts

### 🎯 Advanced Customization
- **Per-Month Custom Contributions**: Override monthly contributions for specific months and years
- **Yearly Breakdown Tables**: Detailed month-by-month breakdown for each year
- **Expandable Year Views**: Click on any year to see monthly contribution and balance details
- **Contribution Reset**: Easily revert custom contributions back to default amounts

### 🎨 User Experience
- **Dark Mode Support**: Toggle between light and dark themes with automatic persistence
- **Animated Numbers**: Smooth animated transitions when values change
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates**: All calculations update instantly as you adjust inputs
- **Currency Formatting**: Display values in Malaysian Ringgit (MYR) format

### 📈 Summary Dashboard
- **Total Contributed**: See total amount you've invested over the period
- **Base Dividends**: Total base dividends earned
- **Bonus Dividends**: Total bonus dividends earned
- **Final Units**: Your total balance at the end of the projection period

## How to Use

### Installation

Dependencies are maintained via [pnpm](https://pnpm.io), but any package manager works:

```bash
npm install
# or
pnpm install
# or
yarn install
```

### Running the Application

Start the development server:

```bash
npm run dev
# or
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload automatically when you make edits.

### Configuring Your Investment Plan

#### Basic Settings

1. **Saving Duration (years)**: Set how many years you plan to invest (0-50 years)
2. **Start Month**: Choose which month to begin monthly contributions (January - December)
3. **Initial Amount (RM)**: Enter any existing balance or lump sum starting amount
4. **Monthly Contribution (RM)**: Set your regular monthly contribution amount
5. **Investment Limit (RM)**: Maximum balance eligible for contributions (default: RM 300,000)

#### Dividend Rates

1. **Base Rate (sen/RM)**: Enter the base dividend rate (e.g., 5.50 means 5.50 sen per RM1)
2. **Bonus Rate (sen/RM)**: Enter the bonus dividend rate (e.g., 0.25 means 0.25 sen per RM1)

*Note: Rates are in sen per RM1 per year. For example, if ASB declares 5.5% base dividend, enter 5.50*

#### Custom Monthly Contributions

1. Click on any year in the "Yearly Breakdown" section to expand it
2. View month-by-month details including contribution, end balance, and MMB
3. Edit any month's contribution by clicking the edit icon (✏️)
4. Enter a custom amount for that specific month
5. Click the reset icon (↻) to revert to the default monthly amount

#### Understanding the Results

**Summary Card** (right panel):
- **Total Contributed**: Sum of all your contributions (initial + monthly)
- **Base Dividends**: Total earnings from base dividend rate
- **Bonus Dividends**: Total earnings from bonus dividend rate
- **Final Units**: Total balance including contributions and all reinvested dividends

**Yearly Breakdown Table**:
- **Year**: Year number in your projection
- **Contributed**: Amount you contributed in that year
- **Avg MMB**: Average Monthly Minimum Balance for dividend calculation
- **Dividend**: Base dividend earned that year
- **Bonus**: Bonus dividend earned that year
- **End Balance**: Total balance at end of year (after reinvestment)

### Tips for Accurate Planning

1. **Check Current Rates**: Update base and bonus rates to match current ASB declarations
2. **Account for Limits**: The calculator enforces the investment limit automatically
3. **Year 1 Contributions**: Initial amount counts as Year 1 contribution
4. **Month-by-Month View**: Expand years to see exactly how your balance grows monthly
5. **Custom Scenarios**: Use custom contributions to model bonus payments, irregular savings, or reduced contributions
6. **Dark Mode**: Toggle dark mode for comfortable viewing in different lighting conditions

### Keyboard Shortcuts

- All number inputs support direct keyboard entry
- Use Tab to navigate between input fields
- Number inputs automatically validate ranges (e.g., years: 0-50)

## Available Scripts

### `npm run dev` or `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm run build`
Builds the app for production to the `dist` folder with optimized bundles

### `npm run serve`
Preview the production build locally

## Technical Details

### Built With
- **SolidJS**: Reactive UI framework
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first styling
- **Vite**: Fast build tool and dev server
- **Motion**: Smooth animations

### Calculation Method

The calculator uses the **Monthly Minimum Balance (MMB)** method:

1. For each month, record the ending balance after contributions
2. Calculate average MMB across all 12 months
3. Apply dividend rates to the average MMB
4. Automatically reinvest dividends into the next year's balance
5. Respect investment limits when processing contributions

### Dark Mode
Dark mode preference is automatically saved to localStorage and persists across sessions.

### Browser Support
Modern browsers supporting ES6+ features are required.

## Deployment

Build the production version:

```bash
npm run build
```

Deploy the `dist` folder to any static host provider:
- Netlify
- Vercel
- GitHub Pages
- Surge
- Firebase Hosting
- Any CDN or static file server

## License

MIT

---

This project was created with the [Solid CLI](https://github.com/solidjs-community/solid-cli).
Learn more about [SolidJS](https://solidjs.com) and join the [Discord community](https://discord.com/invite/solidjs).
