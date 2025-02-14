import { useAuth } from "../context/AuthContext";

const UserManagement = () => {
    const { user } = useAuth();

    return (
        <div>
            <h2>Users</h2>
            <button disabled={user?.role === "sub-admin"}>Edit User</button>
            <button disabled={user?.role === "sub-admin"}>Delete User</button>
        </div>
    );
};

export default UserManagement;
