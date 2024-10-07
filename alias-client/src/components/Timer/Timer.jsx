import React, { useState, useEffect, useRef, useCallback } from 'react';

// eslint-disable-next-line react/prop-types
const Timer = ({ startTime, onTimeOut, small }) => {
	const [time, setTime] = useState(startTime);
	const intervalRef = useRef(null);
	const lastTimeRef = useRef(Date.now());
	const timeOutCallback = useCallback(onTimeOut, [onTimeOut]);

	const tick = () => {
		const now = Date.now();
		const deltaTime = (now - lastTimeRef.current) / 1000; // difference in seconds
		lastTimeRef.current = now;

		setTime((prevTime) => {
			const newTime = Math.max(prevTime - deltaTime, 0);
			if (newTime <= 0) {
				clearInterval(intervalRef.current);
				timeOutCallback();
			}
			return newTime;
		});

		// Continue updating
		intervalRef.current = requestAnimationFrame(tick);
	};

	useEffect(() => {
		lastTimeRef.current = Date.now();
		intervalRef.current = requestAnimationFrame(tick);

		return () => cancelAnimationFrame(intervalRef.current);
	}, [timeOutCallback]);

	return small ? (
		<div className='text-white'>Timer {Math.ceil(time)} sec</div>
	) : (
		<div className='display-4'>{Math.ceil(time)}</div>
	);
};

export default React.memo(Timer);
