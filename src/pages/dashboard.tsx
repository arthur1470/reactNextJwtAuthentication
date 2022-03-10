import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
    const { user } = useAuth();
    return (
        <p> Dashboard {user.email}</p>
    )
}