import { useState } from 'react';
import { Timer } from '../../components/Timer/Timer';
import { useNavigate } from 'react-router-dom';
import mockWord from '../../data/mockWord';

export default function DescriberPage() {
    const [description, setDescription] = useState('');
    const [isTimeUp, setIsTimeUp] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Time runs out
        if (isTimeUp) {
            console.log(null); // submit null
            return;
        }

        // Empty or whitespace-only responses
        if (!description.trim()) {
            alert('You must provide a valid description before submitting.');
            return;
        }

        // Valid response case
        alert('Your description has been successfully submitted and recorded.');
        console.log(description);
        setDescription('');
        navigate('/team-result');
    };

    const handleTimeUp = () => {
        setIsTimeUp(true);
        setDescription('');
        alert(
            'Time is up! You did not submit a description within the allowed time. No description has been recorded.'
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
                        {isTimeUp ? "Time's up!" : 'Describe the Word Before Time Runs Out!'}
                    </h2>
                    <Timer initialCount={30} onTimeUp={handleTimeUp} />
                </div>
                <div className='col-md-6'>
                    {/* Bordered section for the word and synonyms */}
                    <div className='border p-3 mb-4 rounded'>
                        <h3 className='mb-2'>Word to Describe: <strong>{mockWord.word}</strong></h3>
                        <p>Synonyms: {mockWord.similarWords.join(', ')}</p>
                    </div>
                    <form onSubmit={handleSubmit} className='p-4 border rounded shadow'>
                        <div className='mb-3'>
                            <label htmlFor='description' className='form-label'>
                                Your Description
                            </label>
                            <textarea
                                id='description'
                                className='form-control form-control-lg'
                                rows='4' // Adjust the number of rows as needed
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
