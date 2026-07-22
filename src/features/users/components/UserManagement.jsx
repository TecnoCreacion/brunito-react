import { useState, useMemo } from "react";
import { useUsersSearch, useUserMutations } from "../hooks/useUsers";
import { useTipoUsuario, useSucursales } from "../hooks/useSupport";
import { ExpandableTable } from "@/components/ui/ExpandableTable";
import { DynamicFormModal } from "@/components/ui/DynamicFormModal";

export const UserManagement = () => {
    // 1. ESTADO VISUAL: Solo guarda lo que el usuario escribe (texto)
    const [searchText, setSearchText] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);

    const isSearchReady = searchText.length >= 3 || Number.isInteger(Number(searchText));

    // Consultas Principales
    const queryPayload = isSearchReady
        ? {
              with: ["tipo", "sucursal"],
              orWhere: {
                  idUsuario: { LIKE: `%${searchText}%` },
                  Nombre_Usuario: { LIKE: `%${searchText}%` },
                  Nombres: { LIKE: `%${searchText}%` },
                  Apellido_Paterno: { LIKE: `%${searchText}%` },
                  Apellido_Materno: { LIKE: `%${searchText}%` },
                  Correo_Factorone: { LIKE: `%${searchText}%` },
                  Correo_Servione: { LIKE: `%${searchText}%` },
              },
              orWhereHas: {
                  sucursal: {
                      where: {
                          Nombre: { LIKE: `%${searchText}%` },
                      },
                  },
                  tipo: {
                      where: {
                          Nombre_TipoUsuario: { LIKE: `%${searchText}%` },
                      },
                  },
              },
              orderBy: {
                  idUsuario: "ASC",
              },
              visible: "Contrasena",
          }
        : {
              with: ["tipo", "sucursal"],
          };
    const { data, isLoading } = useUsersSearch(queryPayload, isSearchReady);
    const { createMutation, updateMutation } = useUserMutations();

    // Datos del Soporte
    const { data: tiposData, isLoading: isLoadingTipos } = useTipoUsuario();
    const { data: sucursalesData, isLoading: isLoadingSucursales } = useSucursales();

    // Helpers para abrir el modal
    const handleOpenCreate = () => {
        setUserToEdit(null);
        setShowModal(true);
    };

    const handleOpenEdit = (user) => {
        setUserToEdit(user);
        setShowModal(true);
    };

    // Función que el Modal llamará al hacer Submit
    const handleSaveUser = async (formData) => {
        try {
            if (userToEdit) {
                // Si editamos, mandamos el ID y la data
                await updateMutation.mutateAsync({ id: userToEdit.idUsuario, ...formData });
            } else {
                // Si creamos, mandamos solo la data
                await createMutation.mutateAsync(formData);
            }
            setShowModal(false); // Cerramos si fue exitoso
        } catch (error) {
            console.error("Error al guardar el usuario", error);
        }
    };

    // ---------------------------------------------------------
    // LA CONFIGURACIÓN DE LA TABLA (El Esquema)
    // Aquí decides manualmente qué se ve, qué se oculta y cómo se dibuja
    // ---------------------------------------------------------
    const tableColumns = [
        // VISIBLES
        { key: "idUsuario", label: "ID", visible: true, render: (user) => <span className="text-muted">{user.idUsuario}</span> },
        { key: "Nombre_Usuario", label: "Usuario", visible: true },
        { key: "Nombres", label: "Nombre Completo", visible: true, render: (user) => `${user.Nombres} ${user.Apellido_Paterno} ${user.Apellido_Materno}` },
        { key: "tipo", label: "Tipo", visible: true, render: (user) => user.tipo?.Nombre_TipoUsuario },
        { key: "sucursal", label: "Sucursal", visible: true, render: (user) => user.sucursal?.Nombre },
        {
            key: "Estado",
            label: "Estado",
            visible: true,
            render: (user) => {
                if (user.Eliminado == 1) {
                    return <span className="badge bg-danger-lt">Eliminado</span>;
                } else if (user.Ausente == 1) {
                    return <span className="badge bg-secondary-lt">Ausente</span>;
                } else if (user.Estado == 0) {
                    return <span className="badge bg-warning-lt">Inactivo</span>;
                } else {
                    return <span className="badge bg-primary-lt">Activo</span>;
                }
            },
        },
        {
            key: "acciones",
            label: "Op.",
            visible: true,
            render: (user) => (
                // Reemplazamos el texto por un botón de ícono
                <button className="btn btn-icon btn-sm btn-ghost-primary" onClick={() => handleOpenEdit(user)} title="Editar Usuario">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                        <path d="M13.5 6.5l4 4" />
                    </svg>
                </button>
            ),
        },

        // OCULTOS (Se mostrarán en la sub-fila al presionar +)
        { key: "Contrasena", label: "Contraseña", visible: false },
        { key: "Fecha_Creacion", label: "Creación", visible: false },
        {
            key: "correos",
            label: "Correos",
            visible: false,
            render: (user) => (
                <>
                    <div>{user.Correo_Factorone}</div>
                    <div className="text-muted">{user.Correo_Servione}</div>
                </>
            ),
        },
    ];

    // ---------------------------------------------------------
    // ESQUEMA DEL FORMULARIO (La novedad)
    // ---------------------------------------------------------
    const formSchema = useMemo(() => {
        // Mapeamos los datos de la API al formato { value, label } que espera nuestro modal
        const opcionesTipos =
            tiposData?.map((tipo) => ({
                value: tipo.idTipo_Usuario, // Ajusta el nombre del ID según tu base de datos
                label: tipo.Nombre_TipoUsuario,
            })) || [];

        const opcionesSucursales =
            sucursalesData?.map((suc) => ({
                value: suc.idSucursal, // Ajusta el nombre del ID según tu base de datos
                label: suc.Nombre,
            })) || [];

        return [
            // Fila 1 a 3 (Igual)
            { name: "Nombre_Usuario", label: "Nombre de Usuario", type: "text", required: true, colSpan: "col-md-6" },
            { name: "Contrasena", label: "Contraseña", type: "password", colSpan: "col-md-6" },
            { name: "Nombres", label: "Nombres", type: "text", required: true, colSpan: "col-md-12" },
            { name: "Apellido_Paterno", label: "Apellido Paterno", type: "text", required: true, colSpan: "col-md-6" },
            { name: "Apellido_Materno", label: "Apellido Materno", type: "text", required: false, colSpan: "col-md-6" },
            { name: "Correo_Factorone", label: "Correo Factorone", type: "email", required: true, colSpan: "col-md-6" },
            { name: "Correo_Servione", label: "Correo Servione", type: "email", required: false, colSpan: "col-md-6" },

            // Fila 4 (Con los datos dinámicos inyectados)
            {
                name: "Estado",
                label: "Estado",
                type: "select",
                required: true,
                defaultValue: "1",
                colSpan: "col-md-4",
                options: [
                    { value: "0", label: "Inactivo" },
                    { value: "1", label: "Activo" },
                    { value: "2", label: "Ausente" },
                    { value: "3", label: "Eliminado" },
                ],
            },
            {
                name: "Tipo_Usuario",
                label: "Tipo de Usuario",
                type: "select",
                required: true,
                colSpan: "col-md-4",
                options: opcionesTipos, // <--- Aquí inyectamos
            },
            {
                name: "Sucursal",
                label: "Sucursal",
                type: "select",
                required: true,
                colSpan: "col-md-4",
                options: opcionesSucursales, // <--- Aquí inyectamos
            },
        ];
    }, [tiposData, sucursalesData]);

    const isModalPending = createMutation.isPending || updateMutation.isPending || isLoadingTipos || isLoadingSucursales;

    return (
        <div className="row row-cards">
            <div className="col-12">
                <div className="card">
                    {/* Header */}
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h3 className="card-title">Gestión de Usuarios</h3>
                        <button className="btn btn-primary" onClick={handleOpenCreate}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon me-2" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M12 5l0 14" />
                                <path d="M5 12l14 0" />
                            </svg>
                            Nuevo
                        </button>
                    </div>

                    {/* Buscador */}
                    <div className="card-body border-bottom py-3">
                        <div className="d-flex">
                            <div className="text-muted d-flex align-items-center">
                                <span className="me-2">Buscar:</span>
                                <div className="d-inline-block" style={{ width: "250px" }}>
                                    <div className="input-group input-group-sm">
                                        <input type="text" className="form-control" placeholder="Nombre, correo, usuario..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                                        {/* El botón "X" solo aparece si hay texto escrito */}
                                        {searchText && (
                                            <button className="btn btn-icon btn-ghost-secondary border border-start-0" type="button" onClick={() => setSearchText("")} title="Limpiar búsqueda">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M18 6l-12 12" />
                                                    <path d="M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ¡MIRA QUÉ LIMPIO QUEDA ESTO AHORA! */}
                    <ExpandableTable columns={tableColumns} data={data?.data} rowKey="idUsuario" isLoading={isLoading} isSearchReady={isSearchReady} emptyMessage="No se encontraron usuarios con esos filtros." />
                </div>
            </div>

            {/* AHORA USAMOS EL MOTOR DE FORMULARIOS */}
            <DynamicFormModal show={showModal} onClose={() => setShowModal(false)} title={userToEdit ? "Editar Usuario" : "Crear Nuevo Usuario"} schema={formSchema} initialData={userToEdit} onSubmit={handleSaveUser} isPending={isModalPending} />
        </div>
    );
};
