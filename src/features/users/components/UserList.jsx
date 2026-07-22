import React from "react";
import { useUsers } from "../hooks/useUsers";

export const UserList = () => {
    // Mira lo limpio que queda esto gracias a nuestra arquitectura
    const { data: users, isLoading, isError } = useUsers();

    if (isLoading) return <div className="spinner-border text-primary" role="status"></div>;

    if (isError) return <div className="alert alert-danger">Error al cargar los usuarios.</div>;

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">Lista de Usuarios</h3>
            </div>

            <div className="table-responsive">
                <table className="table card-table table-vcenter text-nowrap datatable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users?.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
