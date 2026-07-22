import { useState, useEffect } from "react";
import { useUserMutations } from "../hooks/useUsers";

export const UserFormModal = ({ show, onClose, userToEdit }) => {
    const isEditing = !!userToEdit;
    const { createMutation, updateMutation } = useUserMutations();

    // Estado del formulario
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });

    // Si abrimos el modal para editar, llenamos los datos
    useEffect(() => {
        if (userToEdit) {
            setFormData({
                name: userToEdit.name,
                username: userToEdit.username,
                email: userToEdit.email,
                password: "",
            });
        } else {
            setFormData({
                name: "",
                username: "",
                email: "",
                password: "",
            });
        }
    }, [userToEdit, show]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateMutation.mutateAsync({ id: userToEdit.id, ...formData });
            } else {
                await createMutation.mutateAsync(formData);
            }
            onClose(); // Cerramos el modal si todo sale bien
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    if (!show) return null; // Si no se debe mostrar, no renderizamos nada

    return (
        <>
            <div className="modal modal-blur fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{isEditing ? "Editar Usuario" : "Nuevo Usuario"}</h5>

                            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                        </div>

                        <form onSubmit={handleSubmit} autoComplete="off">
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Nombre Completo</label>

                                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Nombre de Usuario (Login)</label>

                                    <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Correo Electrónico</label>

                                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Contraseña
                                        {isEditing && <span className="text-muted ms-1">(Deja en blanco para no cambiar)</span>}
                                    </label>

                                    <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required={!isEditing} />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-link link-secondary" onClick={onClose}>
                                    Cancelar
                                </button>

                                <button type="submit" className="btn btn-primary ms-auto" disabled={createMutation.isPending || updateMutation.isPending}>
                                    {createMutation.isPending || updateMutation.isPending ? "Guardando..." : "Guardar Usuario"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};
