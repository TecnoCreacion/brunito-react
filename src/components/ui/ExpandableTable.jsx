import React, { useState } from "react";

export const ExpandableTable = ({ columns, data, rowKey = "id", isLoading, isSearchReady, emptyMessage = "No se encontraron resultados." }) => {
    // Estado para guardar qué filas están expandidas (guardamos sus IDs)
    const [expandedRows, setExpandedRows] = useState({});

    // Separamos las columnas basado en tu configuración manual
    const visibleColumns = columns.filter((col) => col.visible !== false);
    const hiddenColumns = columns.filter((col) => col.visible === false);

    // Función para abrir/cerrar fila
    const toggleRow = (id) => {
        setExpandedRows((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // Calculamos el colspan dinámicamente (+1 por la columna del botón +)
    const totalColSpan = visibleColumns.length + 1;

    return (
        <div className="table-responsive">
            <table className="table card-table table-vcenter text-nowrap datatable">
                <thead>
                    <tr>
                        <th className="w-1"></th> {/* Espacio para el botón + */}
                        {visibleColumns.map((col, index) => (
                            <th key={index}>{col.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {/* ESTADO 1: Pidiendo buscar */}
                    {!isSearchReady && (
                        <tr>
                            <td colSpan={totalColSpan} className="text-center text-muted py-4">
                                Ingresa al menos 3 letras para buscar.
                            </td>
                        </tr>
                    )}

                    {/* ESTADO 2: Cargando */}
                    {isLoading && isSearchReady && (
                        <tr>
                            <td colSpan={totalColSpan} className="text-center py-4">
                                <div className="spinner-border text-primary"></div>
                            </td>
                        </tr>
                    )}

                    {/* ESTADO 3: Vacío */}
                    {data?.length === 0 && !isLoading && isSearchReady && (
                        <tr>
                            <td colSpan={totalColSpan} className="text-center text-muted py-4">
                                {emptyMessage}
                            </td>
                        </tr>
                    )}

                    {/* ESTADO 4: Con Datos */}
                    {data?.length > 0 &&
                        data.map((row) => {
                            const isExpanded = expandedRows[row[rowKey]];

                            return (
                                <React.Fragment key={row[rowKey]}>
                                    {/* FILA PRINCIPAL VISIBLE */}
                                    <tr>
                                        <td>
                                            {/* Solo mostramos el botón si hay columnas ocultas que mostrar */}
                                            {hiddenColumns.length > 0 && (
                                                <button className="btn btn-sm btn-icon btn-ghost-secondary" onClick={() => toggleRow(row[rowKey])} title={isExpanded ? "Ocultar detalles" : "Ver detalles"}>
                                                    {isExpanded ? (
                                                        // Icono Menos (-)
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                            <path d="M5 12l14 0" />
                                                        </svg>
                                                    ) : (
                                                        // Icono Más (+)
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                            <path d="M12 5l0 14" />
                                                            <path d="M5 12l14 0" />
                                                        </svg>
                                                    )}
                                                </button>
                                            )}
                                        </td>
                                        {visibleColumns.map((col, index) => (
                                            <td key={index}>
                                                {/* Si la columna tiene un renderizado personalizado (como un botón), lo usamos. Si no, mostramos el dato crudo */}
                                                {col.render ? col.render(row) : row[col.key]}
                                            </td>
                                        ))}
                                    </tr>

                                    {/* SUB-FILA EXPANDIDA (Datos Ocultos) */}
                                    {isExpanded && hiddenColumns.length > 0 && (
                                        <tr className="bg-light">
                                            <td colSpan={totalColSpan} className="p-3 border-bottom">
                                                <div className="row g-3">
                                                    {hiddenColumns.map((col, index) => (
                                                        <div key={index} className="col-12 col-md-4 col-lg-3">
                                                            <div className="text-muted small fw-bold text-uppercase mb-1">{col.label}</div>
                                                            <div>{col.render ? col.render(row) : row[col.key] || "-"}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
};
