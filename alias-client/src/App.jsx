import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar/Navbar';
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from './pages/LoginPage/LoginPage';
import LeaderBoardPage from './pages/LeaderBoardPage/LeaderBoardPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import DescriberPage from './pages/DescriberPage/DescriberPage';
import LeaderPage from './pages/LeaderPage/LeaderPage';
import TeamsResultPage from './pages/TeamsResultPage/TeamsResultPage';
import Room from './components/room/room';
import Profile from './components/Profile/Profile';
import Discussion from './components/Discussion/Discussion';
import Wait from './components/Wait/Wait';
import 'bootstrap/dist/css/bootstrap.min.css';
import FinalPage from './pages/FinalPage/FinalPage';
import { useCookies } from 'react-cookie';
import Chat from "./components/Chat/Chat.jsx";

export default function App() {
  const [room, setRoom] = useState({});
  const [team, setTeam] = useState({});
  const [cookies] = useCookies(['access_token', 'refresh_token']);

  const getIdFromToken = () => {
    const accessToken = cookies.access_token;
    if (!accessToken) {
      console.error('No access token found.');
      return;
    }

    const tokenParts = accessToken.split('.');
    if (tokenParts.length !== 3) {
      console.error('Invalid token format.');
      return;
    }

    const base64Payload = tokenParts[1];
    const payload = JSON.parse(atob(base64Payload));

    const userId = payload.userId;
    if (!userId) {
      console.error('No userId found in token.');
      return;
    }
    return userId;
  }

  const getTokens = () => {
    return { access_token: cookies.access_token, refresh_token: cookies.refresh_token }
  }

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
        <Route path='room' element={<Room roomObj={room} setRoom={setRoom} setTeam={setTeam} />} />
        <Route path='home' element={<HomePage setRoom={setRoom} getIdFromToken={getIdFromToken} getTokens={getTokens} />} />
        <Route path='profile' element={<Profile getIdFromToken={getIdFromToken}/>} />
        <Route path='final-page' element={<FinalPage />} />
        <Route path='chat--dev' element={<Chat getIdFromToken={getIdFromToken}/>} />

        <Route
          path='discussion'
          element={
            <Discussion
              teamName={team.name}
              description={team.description}
              users={team.players}
            />
          }
        />
        <Route
          path='wait-leader'
          element={
            <Wait
              teamName={team.name}
              users={team.players}
              waitTime={10}
              role={'leader made decision'}
            />
          }
        />
        <Route
          path='wait-describer'
          element={
            <Wait
              teamName={team.name}
              users={team.players}
              waitTime={30}
              role={'describer write description'}
            />
          }
        />
      </Routes>
    </main>
  );
}