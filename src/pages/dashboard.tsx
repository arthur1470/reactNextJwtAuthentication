import { Can } from "../components/Can";
import { useAuth } from "../hooks/useAuth";
import { setupApiClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
    const { signOut } = useAuth();

    return (
        <div>
            <p>Dashboard</p>
            <button onClick={signOut}>signOut</button>
            
            <Can roles={['administrator']} permissions={['metrics.list']}><p>Métricas</p></Can>
        </div>
    )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {    
    const apiClient = setupApiClient(ctx);
    const response = await apiClient.get('/me');

    return {
        props: {}
    }
})