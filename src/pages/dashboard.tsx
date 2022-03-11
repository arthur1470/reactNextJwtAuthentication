import { useAuth } from "../hooks/useAuth";
import { useCan } from "../hooks/useCan";
import { setupApiClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
    const { user } = useAuth();

    const userCanSeeMetrics = useCan({
        roles: ['administrator']
    })

    return (
        <div>
            <p>Dashboard</p>
            {userCanSeeMetrics && <p>Métricas</p>}
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