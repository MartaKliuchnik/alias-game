import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useCookies } from "react-cookie";

export default function LoginPage() {
	const userRef = useRef();
	const errRef = useRef();
	const navigate = useNavigate();
	const [cookies, setCookie] = useCookies(['access_token', 'refresh_token']);

	const [user, setUser] = useState('');
	const [pwd, setPwd] = useState('');
	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		userRef.current.focus();
	}, []);

	useEffect(() => {
		setErrMsg('');
	}, [user, pwd]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post('http://localhost:8080/api/v1/auth/login', {
				username: user,
				password: pwd
			});
			const { access_token, refresh_token } = res.data.data;

			setCookie('access_token', access_token, { path: '/', sameSite: 'strict', httpOnly: true, secure: true });
			setCookie('refresh_token', refresh_token, { path: '/', sameSite: 'strict', httpOnly: true, secure: true });
			setUser('');
			setPwd('');
			setSuccess(true);
			console.log('success');
		} catch (error) {
			console.error('Error', error)
		}
	};

	return (
		<div className='container my-5'>
			{success ? (
				navigate('/room')
			) : (
				<section className='row justify-content-center'>
					<div className='col-lg-4 col-md-6'>
						<div className='card shadow-sm p-4'>
							<h2 className='text-center'>Log In</h2>
							<p
								ref={errRef}
								className={errMsg ? 'alert alert-danger' : 'offscreen'}
								aria-live={'assertive'}
							>
								{errMsg}
							</p>

							<form onSubmit={handleSubmit}>
								<div className='mb-3'>
									<label htmlFor='username'>Username</label>
									<input
										type='text'
										id='username'
										className='form-control'
										ref={userRef}
										autoComplete='off'
										onChange={(e) => setUser(e.target.value)}
										value={user}
										required
										placeholder='Enter your username'
									/>
								</div>

								<div className='mb-3'>
									<label htmlFor='password'>Password</label>
									<input
										type='password'
										id='password'
										className='form-control'
										onChange={(e) => setPwd(e.target.value)}
										value={pwd}
										required
										placeholder='Enter your password'
									/>
								</div>

								<button type='submit' className='btn btn-lg btn-secondary w-100'>
									Log In
								</button>
							</form>
						</div>
					</div>
				</section>
			)}
		</div>
	);
}
