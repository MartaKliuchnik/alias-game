import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import LeaderBoard from './components/LeaderBoard/LeaderBoard';
import Room from './components/Room/Room';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chat from "./components/Chat/Chat.jsx";

export default function App() {
	return (
		<main>
			<Navbar />
			<Routes>
				<Route path='/' element={<Register />} />
				<Route path='login' element={<Login />} />
				<Route path='leaderboard' element={<LeaderBoard />} />
				<Route path='rooms' element={<Room />} />
				<Route path='chat--debug' element={<Chat />} />
			</Routes>
		</main>
	);
}
