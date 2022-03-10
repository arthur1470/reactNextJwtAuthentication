import { useAuth } from "../contexts/AuthContext";
import { setupApiClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
    const { user } = useAuth();
    return (
        <p> Dashboard</p>
    )
}

export const getServerSideProps = withSSRAuth(async (ctx)=> {
    const apiClient = setupApiClient(ctx);

    const response = await apiClient.get('/me');

    return {
        props: {}
    }
})