import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from '../../components/Timer/Timer';
import { getRandomWord } from '../../fetchers/getRandomWord';
import { saveDescription } from '../../fetchers/saveDescription';
import { checkDescription } from '../../fetchers/checkDescription';

// eslint-disable-next-line react/prop-types
export default function DescriberPage({ getTokens, teamObj, setTeam }) {
	const access_token = getTokens().access_token;
	// eslint-disable-next-line react/prop-types
	const { roomId, _id: teamId } = teamObj;

	const [description, setDescription] = useState('');
	const [word, setWord] = useState(null);
	const [message, setMessage] = useState('');
	const [isTimeUp, setIsTimeUp] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const navigate = useNavigate();

	// Fetch the random word when the component loads
	useEffect(() => {
		const fetchWord = async () => {
			try {
				const wordData = await getRandomWord(roomId, teamId, access_token);
				setWord(wordData); // Store the fetched word in state
			} catch {
				setMessage('Failed to load the word. Please try again later.');
			}
		};

		fetchWord();
	}, [roomId, teamId, access_token]);

	// Handle submission logic for the description
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (isTimeUp || isSubmitted) return;

		// Validate if the description is empty or whitespace
		if (!description.trim()) {
			setMessage('You must provide a valid description before submitting.');
			return;
		}

		try {
			// Check if the description is valid by making the API call
			const isValid = await checkDescription(description, word._id);

			if (!isValid) {
				setMessage(
					'Your description contains the word to describe, synonyms, or derivatives. Please try again.'
				);
				return;
			}

			await saveDescription(roomId, teamId, description);
			setTeam((prevTeam) => {
				const updatedTeam = { ...prevTeam, description };
				return updatedTeam;
			});

			setMessage('Your description has been successfully submitted.');
			setDescription('');
			setIsSubmitted(true);
		} catch {
			setMessage('Failed to submit description. Please try again later.');
		}
	};

	const handleTimeOut = async () => {
		setIsTimeUp(true);
		setMessage(
			'Time is up! You did not submit a description within the allowed time.'
		);

		if (!isSubmitted) {
			try {
				const description =
					'Unfortunately, describer send nothing. Good luck, in the next round!';
				await saveDescription(roomId, teamId, description);
				setTeam((prevTeam) => ({ ...prevTeam, description }));
				setDescription('');
			} catch {
				setMessage('Failed to submit. Please try again later.');
			}
		}
	};

	// Trigger navigation when time is up
	useEffect(() => {
		if (isTimeUp) {
			navigate('/discussion');
		}
	}, [isTimeUp, isSubmitted, navigate]);

	return (
		<div className='container my-5'>
			<section
				className='row justify-content-center align-items-center gap-5'
				style={{ marginTop: '8rem' }}
			>
				<div className='col-md-6 text-center'>
					<h2 className='mb-4'>
						{isTimeUp
							? "Time's up!"
							: 'Describe the Word Before Time Runs Out!'}
					</h2>
					<Timer startTime={30} onTimeOut={handleTimeOut} small={false} />
				</div>
				<div className='col-md-6'>
					{/* Section displaying the word and its synonyms */}
					{word ? (
						<div className='border p-3 mb-4 rounded'>
							<h3 className='mb-2'>
								Word to Describe: <strong>{word.word}</strong>
							</h3>
							<p>Synonyms: {word.similarWords.join(', ')}</p>
						</div>
					) : (
						<div>Loading word...</div>
					)}
					{/* Display feedback message */}
					{message && (
						<div className='alert alert-info mt-3'>{message}</div>
					)}{' '}
					<form onSubmit={handleSubmit} className='p-4 border rounded shadow'>
						<div className='mb-3'>
							<label htmlFor='description' className='form-label'>
								Your Description
							</label>
							<textarea
								id='description'
								className='form-control form-control-lg'
								rows='4'
								autoComplete='off'
								onChange={(e) => setDescription(e.target.value)}
								value={description}
								required
								placeholder={
									isTimeUp
										? "Time's up! Can't submit a description."
										: 'Write your description here'
								}
								disabled={isTimeUp || isSubmitted}
							/>
						</div>
						<button
							className='btn btn-lg btn-success w-100'
							disabled={isTimeUp || isSubmitted}
							type='submit'
						>
							Submit Your Description
						</button>
					</form>
				</div>
			</section>
		</div>
	);
}
