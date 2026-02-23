import { onMount, onCleanup, createEffect } from 'solid-js';
import * as d3 from 'd3';
import type { DividendSchedule } from '~/libs/dividend';

export type YearlyChartProps = {
  schedule: DividendSchedule;
  formatCurrency: (value: number) => string;
};

export const YearlyChart = (props: YearlyChartProps) => {
  let containerRef: HTMLDivElement | undefined;
  let resizeObserver: ResizeObserver | undefined;

  const renderChart = () => {
    if (!containerRef) return;

    const container = containerRef;
    container.innerHTML = '';

    const width = container.clientWidth;
    const height = 256;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };

    const data = props.schedule.years.map((year) => ({
      year: year.year,
      base: year.dividend,
      bonus: year.bonus,
    }));

    if (data.length === 0) {
      container.innerHTML = '<div class="flex items-center justify-center h-full text-slate-400 text-sm">Set duration above zero to see data</div>';
      return;
    }

    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const x0 = d3
      .scaleBand()
      .domain(data.map((d) => String(d.year)))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const x1 = d3
      .scaleBand()
      .domain(['base', 'bonus'])
      .range([0, x0.bandwidth()])
      .padding(0.1);

    const maxValue = d3.max(data, (d) => d.base + d.bonus) || 4000;
    const y = d3
      .scaleLinear()
      .domain([0, maxValue * 1.1])
      .range([height - margin.bottom, margin.top]);

    // Grid
    svg
      .append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(y)
          .tickSize(-(width - margin.left - margin.right))
          .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', '#f1f5f9')
      .attr('stroke-dasharray', '3,3');

    svg.selectAll('.grid .domain').remove();

    // X Axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x0).tickFormat((d) => `Y${d}`))
      .selectAll('text')
      .attr('fill', '#64748b')
      .attr('font-size', '11px');

    svg.selectAll('.domain').attr('stroke', '#e2e8f0');
    svg.selectAll('.tick line').attr('stroke', '#e2e8f0');

    // Y Axis
    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `RM ${d}`)
      )
      .selectAll('text')
      .attr('fill', '#64748b')
      .attr('font-size', '11px');

    // Bars
    const yearGroups = svg
      .selectAll('.year-group')
      .data(data)
      .join('g')
      .attr('class', 'year-group')
      .attr('transform', (d) => `translate(${x0(String(d.year))},0)`);

    // Base dividend bars
    yearGroups
      .append('rect')
      .attr('x', (d) => x1('base') ?? 0)
      .attr('y', (d) => y(d.base))
      .attr('width', x1.bandwidth())
      .attr('height', (d) => height - margin.bottom - y(d.base))
      .attr('fill', '#0d9488')
      .attr('rx', 4)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        d3.select(this).attr('fill', '#14b8a6');
        tooltip
          .style('opacity', 1)
          .html(`<div class="font-semibold">Year ${d.year}</div><div class="text-teal-300">Base: ${props.formatCurrency(d.base)}</div>`)
          .style('left', `${event.offsetX + 10}px`)
          .style('top', `${event.offsetY - 10}px`);
      })
      .on('mouseleave', function () {
        d3.select(this).attr('fill', '#0d9488');
        tooltip.style('opacity', 0);
      });

    // Bonus bars
    yearGroups
      .append('rect')
      .attr('x', (d) => x1('bonus') ?? 0)
      .attr('y', (d) => y(d.bonus))
      .attr('width', x1.bandwidth())
      .attr('height', (d) => height - margin.bottom - y(d.bonus))
      .attr('fill', '#f59e0b')
      .attr('rx', 4)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        d3.select(this).attr('fill', '#fbbf24');
        tooltip
          .style('opacity', 1)
          .html(`<div class="font-semibold">Year ${d.year}</div><div class="text-amber-300">Bonus: ${props.formatCurrency(d.bonus)}</div>`)
          .style('left', `${event.offsetX + 10}px`)
          .style('top', `${event.offsetY - 10}px`);
      })
      .on('mouseleave', function () {
        d3.select(this).attr('fill', '#f59e0b');
        tooltip.style('opacity', 0);
      });

    // Tooltip
    const tooltip = d3
      .select(container)
      .append('div')
      .attr(
        'class',
        'absolute bg-slate-900 text-white text-xs px-3 py-2 rounded-lg pointer-events-none opacity-0 transition-opacity z-10'
      );
  };

  onMount(() => {
    renderChart();

    resizeObserver = new ResizeObserver(() => {
      renderChart();
    });

    if (containerRef) {
      resizeObserver.observe(containerRef);
    }
  });

  createEffect(() => {
    props.schedule;
    renderChart();
  });

  onCleanup(() => {
    resizeObserver?.disconnect();
  });

  return (
    <div ref={containerRef} class="w-full h-64 relative" />
  );
};
