import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import LeaderBoard from './components/LeaderBoard/LeaderBoard';
import Room from './components/Room/Room';
import HomePage from './components/HomePage/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from './components/Profile/Profile';
import Discussion from './components/Discussion/Discussion';

export default function App() {
	return (
		<main>
			<Navbar />
			<Routes>
				<Route path='/' element={<Register />} />
				<Route path='login' element={<Login />} />
				<Route path='leaderboard' element={<LeaderBoard />} />
				<Route path='room' element={<Room name={"DEMO"} />} />
				<Route path='home' element={<HomePage />} />
				<Route path='profile' element={<Profile />} />
				<Route path='discussion' element={<Discussion
					teamName={'TestTeam'}
					description={'Description for word team has to guess.'}
					users={[
						{ username: 'User1' },
						{ username: 'User2' },
						{ username: 'User3' }
					]} />} />
			</Routes>
		</main>
	);
}
