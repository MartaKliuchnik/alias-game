import { useNavigate } from 'react-router-dom';
import { joinRoom } from '../../fetchers/userRoom';

export default function HomePage({ setRoom, getIdFromToken, getTokens }) {
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleLogoutClick = () => {
        navigate('/login');
    };

    const handleStartGameClick = async () => {
        const userId = getIdFromToken();
        const accessToken = getTokens().access_token;
        console.log(userId, accessToken);
        const room = await joinRoom(userId, accessToken);
        console.log("ROOM: ", room);
        setRoom(room);
        navigate('/room');
    };

    return (
        <div className="container-fluid d-flex flex-column justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f8f9fa' }}>
            <h1 className="text-dark mb-5">Alias DEMO</h1>
            <div className="w-100 d-flex justify-content-between px-5 mb-5">
                <button className="btn btn-outline-secondary" onClick={handleProfileClick}>
                    Profile
                </button>
                <button className="btn btn-outline-secondary" onClick={handleLogoutClick}>
                    Logout
                </button>
            </div>
            <button className="btn btn-secondary btn-lg" onClick={handleStartGameClick}>
                Start Game
            </button>
        </div>
    );
}
