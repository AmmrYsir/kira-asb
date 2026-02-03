import { useAnimatedNumber } from '~/libs/useAnimatedNumber';

export type AnimatedCurrencyProps = {
	value: () => number;
	format: (value: number) => string;
	durationMs?: number;
};

export const AnimatedCurrency = (props: AnimatedCurrencyProps) => {
	const animated = useAnimatedNumber(props.value, props.durationMs ?? 600);
	return <>{props.format(animated())}</>;
};
