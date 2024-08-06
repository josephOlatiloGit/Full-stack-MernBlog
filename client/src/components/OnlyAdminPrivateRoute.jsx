import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
/**
 * We want to make the create post page private for only the admin.
 * So we wrap this private route with the profile page/dashboard route with this component in the App.jsx
 *We use the current user from our store through useSelector then we use only the current logged in user should have access to the dashboard.
 If the current user exist && currentUser isAdmin then we use <Outlet to render the children prop contained otherwise we return to the signin page
 */

export default function OnlyAdminPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser && currentUser.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to={"/sign-in"} />
  );
}
