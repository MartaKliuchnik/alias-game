import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { joinRoom } from '../../fetchers/userRoom';

export default function HomePage({ setRoom }) {
    const [cookies] = useCookies(['access_token', 'refresh_token']);
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleLogoutClick = () => {
        navigate('/login');
    };

    const handleStartGameClick = async () => {
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
        console.log(userId);

        const room = await joinRoom(userId, accessToken);
        console.log(room);
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
