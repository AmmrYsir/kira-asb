import { createSignal, onMount, onCleanup } from 'solid-js';

export function useAnimatedNumber(target: () => number, duration = 800) {
	const [displayed, setDisplayed] = createSignal(target());
	let animationFrame: number | null = null;
	let startTime: number | null = null;
	let startValue = target();

	const animate = (timestamp: number) => {
		if (!startTime) startTime = timestamp;
		const progress = Math.min((timestamp - startTime) / duration, 1);

		// Easing function for smooth animation
		const easeOutQuart = 1 - Math.pow(1 - progress, 4);

		const current = startValue + (target() - startValue) * easeOutQuart;
		setDisplayed(current);

		if (progress < 1) {
			animationFrame = requestAnimationFrame(animate);
		}
	};

	const startAnimation = () => {
		if (animationFrame) cancelAnimationFrame(animationFrame);
		startTime = null;
		startValue = displayed();
		animationFrame = requestAnimationFrame(animate);
	};

	// Watch for target changes
	let previousTarget = target();
	const interval = setInterval(() => {
		const currentTarget = target();
		if (currentTarget !== previousTarget) {
			previousTarget = currentTarget;
			startAnimation();
		}
	}, 50);

	onCleanup(() => {
		if (animationFrame) cancelAnimationFrame(animationFrame);
		clearInterval(interval);
	});

	return displayed;
}
