import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar/Navbar';
import HomePage from './components/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import LeaderBoardPage from './pages/LeaderBoardPage/LeaderBoardPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import DescriberPage from './pages/DescriberPage/DescriberPage';
import LeaderPage from './pages/LeaderPage/LeaderPage';
import TeamsResultPage from './pages/TeamsResultPage/TeamsResultPage';
import Room from './components/room/room';
import Profile from './components/Profile/Profile';
import Discussion from './components/Discussion/Discussion';
import 'bootstrap/dist/css/bootstrap.min.css';
import FinalPage from './pages/FinalPage/FinalPage';

export default function App() {
	return (
		<main>
			<Navbar />
			<Routes>
				<Route path='/' element={<RegisterPage />} />
				<Route path='login' element={<LoginPage />} />
				<Route path='leaderboard' element={<LeaderBoardPage />} />
				<Route path='describer' element={<DescriberPage />} />
				<Route path='leader' element={<LeaderPage />} />
				<Route path='teams-result' element={<TeamsResultPage />} />
				<Route path='room' element={<Room name={'DEMO'} />} />
				<Route path='home' element={<HomePage />} />
				<Route path='profile' element={<Profile />} />
				<Route
					path='discussion'
					element={
						<Discussion
							teamName={'TestTeam'}
							description={'Description for word team has to guess.'}
							users={[
								{ username: 'User1' },
								{ username: 'User2' },
								{ username: 'User3' },
							]}
						/>
					}
				/>
				<Route path='/final-page' element={<FinalPage />} />
			</Routes>
		</main>
	);
}
