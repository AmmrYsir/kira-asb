import { onMount, onCleanup, createEffect } from 'solid-js';
import * as d3 from 'd3';
import type { DividendSchedule } from '~/libs/dividend';

export type PortfolioChartProps = {
  schedule: DividendSchedule;
  formatCurrency: (value: number) => string;
};

export const PortfolioChart = (props: PortfolioChartProps) => {
  let containerRef: HTMLDivElement | undefined;
  let resizeObserver: ResizeObserver | undefined;

  const renderChart = () => {
    if (!containerRef) return;

    const container = containerRef;
    container.innerHTML = '';

    const width = container.clientWidth;
    const height = 256;
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };

    const data: { month: number; principal: number; total: number }[] = [];
    
    let cumulativePrincipal = 0;
    let cumulativeTotal = 0;

    props.schedule.years.forEach((year) => {
      year.monthlyBreakdown.forEach((monthData, idx) => {
        const monthNum = (year.year - 1) * 12 + monthData.month;
        cumulativePrincipal += monthData.contribution;
        cumulativeTotal = monthData.endBalance;
        
        data.push({
          month: monthNum,
          principal: cumulativePrincipal,
          total: cumulativeTotal,
        });
      });
    });

    if (data.length === 0) {
      data.push({ month: 0, principal: 0, total: 0 });
    }

    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const x = d3
      .scaleLinear()
      .domain([0, Math.max(60, d3.max(data, (d) => d.month) || 60)])
      .range([margin.left, width - margin.right]);

    const maxTotal = d3.max(data, (d) => d.total) || 45000;
    const y = d3
      .scaleLinear()
      .domain([0, maxTotal * 1.1])
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
      .call(
        d3
          .axisBottom(x)
          .ticks(Math.min(6, data.length))
          .tickFormat((d) => `Yr ${Math.floor((d as number) / 12)}`)
      )
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
          .tickFormat((d) => `RM ${(d as number) / 1000}k`)
      )
      .selectAll('text')
      .attr('fill', '#64748b')
      .attr('font-size', '11px');

    // Gradient
    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'areaGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#14b8a6').attr('stop-opacity', 0.3);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#14b8a6').attr('stop-opacity', 0);

    // Area
    const area = d3
      .area<{ month: number; principal: number; total: number }>()
      .x((d) => x(d.month))
      .y0(y(0))
      .y1((d) => y(d.total))
      .curve(d3.curveMonotoneX);

    svg.append('path').datum(data).attr('fill', 'url(#areaGradient)').attr('d', area);

    // Principal line
    const linePrincipal = d3
      .line<{ month: number; principal: number; total: number }>()
      .x((d) => x(d.month))
      .y((d) => y(d.principal))
      .curve(d3.curveMonotoneX);

    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 2.5)
      .attr('d', linePrincipal);

    // Total line
    const lineTotal = d3
      .line<{ month: number; principal: number; total: number }>()
      .x((d) => x(d.month))
      .y((d) => y(d.total))
      .curve(d3.curveMonotoneX);

    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#0d9488')
      .attr('stroke-width', 3)
      .attr('d', lineTotal);

    // Tooltip
    const tooltip = d3
      .select(container)
      .append('div')
      .attr(
        'class',
        'absolute bg-slate-900 text-white text-xs px-3 py-2 rounded-lg pointer-events-none opacity-0 transition-opacity z-10'
      )
      .style('transform', 'translate(-50%, -100%)')
      .style('margin-top', '-10px');

    const focusLine = svg
      .append('line')
      .attr('stroke', '#0d9488')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .style('opacity', 0);

    const focusCircleTotal = svg
      .append('circle')
      .attr('r', 5)
      .attr('fill', '#0d9488')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('opacity', 0);

    const focusCirclePrincipal = svg
      .append('circle')
      .attr('r', 5)
      .attr('fill', '#94a3b8')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('opacity', 0);

    const overlay = svg
      .append('rect')
      .attr('width', width - margin.left - margin.right)
      .attr('height', height - margin.top - margin.bottom)
      .attr('x', margin.left)
      .attr('y', margin.top)
      .attr('fill', 'transparent')
      .style('cursor', 'crosshair');

    overlay.on('mousemove', (event) => {
      const [mx] = d3.pointer(event);
      const month = Math.round(x.invert(mx));
      const d = data.find((item) => Math.abs(item.month - month) < 1) || data[0];

      if (d) {
        focusLine
          .attr('x1', x(d.month))
          .attr('x2', x(d.month))
          .attr('y1', margin.top)
          .attr('y2', height - margin.bottom)
          .style('opacity', 1);

        focusCircleTotal.attr('cx', x(d.month)).attr('cy', y(d.total)).style('opacity', 1);

        focusCirclePrincipal.attr('cx', x(d.month)).attr('cy', y(d.principal)).style('opacity', 1);

        tooltip
          .style('left', `${x(d.month)}px`)
          .style('top', `${y(d.total)}px`)
          .style('opacity', 1)
          .html(
            `<div class="font-semibold">Month ${d.month}</div>
            <div class="text-teal-300">Total: ${props.formatCurrency(d.total)}</div>
            <div class="text-slate-400">Principal: ${props.formatCurrency(d.principal)}</div>`
          );
      }
    });

    overlay.on('mouseleave', () => {
      focusLine.style('opacity', 0);
      focusCircleTotal.style('opacity', 0);
      focusCirclePrincipal.style('opacity', 0);
      tooltip.style('opacity', 0);
    });
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
