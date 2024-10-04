import { useState, useEffect } from 'react';
import { Timer } from '../../components/Timer/Timer';
import { useNavigate } from 'react-router-dom';
import { getRandomWord } from '../../fetchers/getRandomWord';
import { saveDescription } from '../../fetchers/saveDescription';
import { checkDescription } from '../../fetchers/checkDescription';

export default function DescriberPage() {
  const [description, setDescription] = useState('');
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [word, setWord] = useState(null); // State to store the fetched word
  const navigate = useNavigate();
  const roomId = '66fec8a584fc0bafc9cb2cdb'; // Example roomId
  const teamId = '66ff01fabd03b4188e6d61dc'; // Example teamId
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmZkYmYxZGYwZWFmOGU0OTM5MzNkZmUiLCJpYXQiOjE3Mjc5OTE3MzYsImV4cCI6MTcyNzk5NTMzNn0.GuvGdBWstst_pRCtyCyisxOnXu4FHXwt-Wxf539b6eI'; // Example token

  // Fetch the random word when the component loads
  useEffect(() => {
    const fetchWord = async () => {
      try {
        const wordData = await getRandomWord(roomId, teamId, token);
        setWord(wordData); // Store the fetched word in state
      } catch {
        alert('Failed to load the word. Please try again later.');
      }
    };

    fetchWord();
  }, [roomId, teamId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the timer has run out
    if (isTimeUp) {
      console.log(null); // Submit null if time is up
      return;
    }

    // Validate if the description is empty or whitespace
    if (!description.trim()) {
      alert('You must provide a valid description before submitting.');
      return;
    }

    try {
      // Check if the description is valid by making the API call
      const isValid = await checkDescription(description, word._id);

      if (!isValid) {
        alert(
          'Your description contains the word to describe, synonyms or derivatives.'
        );
        return;
      }

      // If valid, proceed to save the description
      await saveDescription(roomId, teamId, description);

      alert('Your description has been successfully submitted and recorded.');
      setDescription('');
      navigate('/discussion');
    } catch {
      alert('Failed to submit description. Please try again later.');
    }
  };

  const handleTimeUp = () => {
    setIsTimeUp(true);
    setDescription('');
    alert(
      'Time is up! You did not submit a description within the allowed time. No description has been recorded.'
    );
    navigate('/teams-result');
  };

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
          <Timer initialCount={30} onTimeUp={handleTimeUp} />
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
              />
            </div>
            <button
              className='btn btn-lg btn-success w-100'
              disabled={isTimeUp}
            >
              Submit Your Description
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
