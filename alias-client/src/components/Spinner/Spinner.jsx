export default function Spinner() {
	return (
		<div className='d-flex justify-content-center align-items-center vh-100'>
			<div
				className='spinner-border text-secondary'
				role='status'
				style={{ width: '3rem', height: '3rem' }}
			>
				<span className='visually-hidden'>Loading...</span>
			</div>
			<p className='ms-3 fs-4'>Loading...</p>
		</div>
	);
}
