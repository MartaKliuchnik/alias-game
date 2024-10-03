import { useEffect, useState } from 'react';

export function Timer({ initialCount, onTimeUp }) {
	const [counter, setCounter] = useState(initialCount);

	useEffect(() => {
		if (counter > 0) {
			const timerId = setTimeout(() => setCounter(counter - 1), 1000);
			return () => clearTimeout(timerId); // Clean up timer on unmount
		} else if (onTimeUp) {
			onTimeUp();
		}
	}, [counter, onTimeUp]);

	return <div className='display-4'>{counter}</div>;
}
