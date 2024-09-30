import { Route, Routes } from 'react-router-dom';
import Navbar from './components/nav/index';
import Register from './components/register/index';
import Login from './components/login/index';
import LeaderBoard from './components/leaderboard/index';
import Room from './components/room/room';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
	return (
		<main>
			<Navbar />
			<Routes>
				<Route path='/' element={<Register />} />
				<Route path='login' element={<Login />} />
				<Route path='leaderboard' element={<LeaderBoard />} />
				<Route path='rooms' element={<Room />} />
			</Routes>
		</main>
	);
}
