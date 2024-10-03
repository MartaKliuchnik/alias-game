import { useRef, useState } from 'react';
import { Timer } from '../../components/Timer/Timer';
import { useNavigate } from 'react-router-dom';

export default function LeaderPage() {
	const [leaderWord, setLeaderWord] = useState('');
	const [isTimeUp, setIsTimeUp] = useState(false);
	const wordRef = useRef();
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();

		// Time runs out
		if (isTimeUp) {
			console.log(null); // submit null
		}

		// Empty or whitespace-only responses
		if (!leaderWord.trim()) {
			alert('You must provide a valid decision before submitting.');
		}
		// Valid response case
		alert('Your decision has been successfully submitted and recorded.');
		console.log(leaderWord);
		setLeaderWord('');
		navigate('/team-result');
	};

	const handleTimeUp = () => {
		setIsTimeUp(true);
		setLeaderWord('');
		alert(
			'Time is up! You did not submit a decision within the allowed time. No decision has been recorded.'
		);
		navigate('/team-result');
	};

	return (
		<div className='container my-5'>
			<section
				className='row justify-content-center align-items-center gap-5'
				style={{ marginTop: '8rem' }}
			>
				<div className='col-md-6 text-center'>
					<h2 className='mb-4'>
						{isTimeUp ? "Time's up!" : 'Answer Before Time Runs Out!'}
					</h2>
					<Timer initialCount={10} onTimeUp={handleTimeUp} />
				</div>
				<div className='col-md-6'>
					<form onSubmit={handleSubmit} className='p-4 border rounded shadow'>
						<div className='mb-3'>
							<label htmlFor='leaderWord' className='form-label'>
								Your Final Decision
							</label>
							<input
								type='text'
								id='leaderWord'
								className='form-control form-control-lg'
								ref={wordRef}
								autoComplete='off'
								onChange={(e) => setLeaderWord(e.target.value)}
								value={leaderWord}
								required
								placeholder={
									isTimeUp
										? "Time's up! Can't submit a decision."
										: 'Write your final decision'
								}
							/>
						</div>
						<button
							className='btn btn-lg btn-success w-100'
							disabled={isTimeUp}
						>
							Submit Your Answer
						</button>
					</form>
				</div>
			</section>
		</div>
	);
}
