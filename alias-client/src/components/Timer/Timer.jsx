import React, { useState, useEffect, useRef, useCallback } from 'react';

const Timer = ({ startTime, onTimeOut, small }) => {
	const [time, setTime] = useState(startTime);
	const intervalRef = useRef(null);
	const timeOutCallback = useCallback(onTimeOut, [onTimeOut]);

	useEffect(() => {
		if (time === 0) {
			clearInterval(intervalRef.current);
			timeOutCallback();
			return;
		}

		intervalRef.current = setInterval(() => {
			setTime((prevTime) => {
				if (prevTime <= 1) {
					clearInterval(intervalRef.current);
					return 0;
				}
				return prevTime - 1;
			});
		}, 1000);

		return () => clearInterval(intervalRef.current);
	}, [time]);

	return small ? (
		<div className='text-white'>Timer {time} sec</div>
	) : (
		<div className='display-4'>{time}</div>
	);
};

export default React.memo(Timer);
