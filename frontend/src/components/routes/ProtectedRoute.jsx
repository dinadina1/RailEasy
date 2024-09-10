import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom";
import Loader from "../layout/Loader";

const ProtectedRoute = ({ children, isAdmin }) => {

    const { isAuthenticatedUser, loading, user } = useSelector(state => state.authState);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const redirectTo = `${location.pathname}${location.search.toString()}`
    searchParams.set('redirect', redirectTo);

    if (!isAuthenticatedUser && !loading) {
        return <Navigate to={`/login?${searchParams.toString()}`} />
    }

    if (isAuthenticatedUser) {
        if (isAdmin === true && user.role !== 'admin') {
            return <Navigate to={"/"} />
        }
        return children;
    }

    if(loading){
        return <Loader/>
    }
}

export default ProtectedRoute;