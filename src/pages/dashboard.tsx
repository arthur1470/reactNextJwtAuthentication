import { Can } from "../components/Can";
import { setupApiClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
    return (
        <div>
            <p>Dashboard</p>
            
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