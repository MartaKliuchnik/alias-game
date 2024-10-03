import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar/Navbar';
import HomePage from './components/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import LeaderBoardPage from './pages/LeaderBoardPage/LeaderBoardPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import LeaderPage from './pages/LeaderPage/LeaderPage';
import TeamResultPage from './pages/TeamResultPage/TeamResultPage';
import Room from './components/room/room';
import Profile from './components/Profile/Profile';
import Discussion from './components/Discussion/Discussion';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
	return (
		<main>
			<Navbar />
			<Routes>
				<Route path='/' element={<RegisterPage />} />
				<Route path='login' element={<LoginPage />} />
				<Route path='leaderboard' element={<LeaderBoardPage />} />
				<Route path='leader' element={<LeaderPage />} />
				<Route path='team-result' element={<TeamResultPage />} />
				<Route path='room' element={<Room name={'DEMO'} />} />
				<Route path='home' element={<HomePage />} />
				<Route path='profile' element={<Profile />} />
				<Route
					path='discussion'
					element={
						<Discussion
							teamName={'TestTeam'}
							users={[
								{ username: 'User1' },
								{ username: 'User2' },
								{ username: 'User3' },
							]}
						/>
					}
				/>
			</Routes>
		</main>
	);
}
