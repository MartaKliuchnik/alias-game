import React, { useEffect } from 'react';
import { useTimer } from 'react-timer-hook';

// eslint-disable-next-line react/prop-types
const Timer = ({ startTime, onTimeOut, small }) => {
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + startTime); // set expiry time

  const {
    seconds,
    minutes,
    isRunning,
    start,
    restart
  } = useTimer({
    expiryTimestamp,
    onExpire: onTimeOut,
    autoStart: true,
  });

  // Restart the timer if `startTime` changes
  useEffect(() => {
    const newExpiry = new Date();
    newExpiry.setSeconds(newExpiry.getSeconds() + startTime);
    restart(newExpiry);
  }, [startTime, restart]);

  return small ? (
    <div className='text-white'>Timer {seconds} sec</div>
  ) : (
    <div className='display-4'>{minutes}:{seconds}</div>
  );
};

export default React.memo(Timer);
