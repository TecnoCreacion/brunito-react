import { IconCalendarEvent, IconTags, IconCheck, IconPlus, IconChevronRight, IconX } from "@tabler/icons-react";

// 🚀 Agregamos onClearTags al contrato del componente
export const SidebarWidget = ({ fixedTasks = [], tags = [], selectedTags = [], onToggleTag, onClearTags, onAddFixedTask, onEditFixedTask, isLoading }) => {
    const hasActiveFilters = selectedTags.length > 0;

    return (
        <div className="d-flex flex-column gap-3">
            {/* Card 1: Tareas Fijas del Mes */}
            <div className="card shadow-sm border-0">
                <div className="card-header bg-transparent border-bottom-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                    <h3 className="card-title text-primary d-flex align-items-center gap-2 m-0">
                        <IconCalendarEvent size={20} />
                        Tareas Fijas
                    </h3>
                    <button onClick={onAddFixedTask} className="btn btn-sm btn-primary shadow-sm" title="Agregar tarea fija">
                        <IconPlus size={16} stroke={2.5} />
                    </button>
                </div>
                <div className="card-body pt-2">
                    {isLoading ? (
                        <div className="text-center text-muted small py-3">Cargando tareas...</div>
                    ) : fixedTasks.length === 0 ? (
                        <p className="text-muted small fst-italic mb-0 text-center py-2">No tienes tareas fijas este mes.</p>
                    ) : (
                        <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                            {fixedTasks.map((task) => (
                                <li key={task.id} className="p-2 border rounded bg-light d-flex justify-content-between align-items-center cursor-pointer transition-base hover-shadow-sm hover-border-primary" onClick={() => onEditFixedTask(task)} role="button" tabIndex={0} title="Haz clic para editar">
                                    <div className="d-flex align-items-center gap-2 overflow-hidden">
                                        <span className="small fw-medium text-truncate">{task.title}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                        <span className={`badge bg-${task.color_theme}-subtle text-${task.color_theme}`}>Día {task.day_of_month || "Fijo"}</span>
                                        <IconChevronRight size={14} className="text-muted opacity-50" />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Card 2: Filtro de Etiquetas (Tags) */}
            <div className="card shadow-sm border-0">
                <div className="card-header bg-transparent border-bottom-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                    <h3 className="card-title text-primary d-flex align-items-center gap-2 m-0">
                        <IconTags size={20} />
                        Filtros
                    </h3>

                    {/* 🚀 ARQUITECTURA VISUAL: Botón de Limpiar dinámico */}
                    {hasActiveFilters && (
                        <button className="btn btn-sm btn-ghost-secondary px-2 d-flex align-items-center gap-1 text-muted transition-base hover-text-danger" onClick={onClearTags} title="Limpiar todos los filtros">
                            <IconX size={14} />
                            <span className="small">Limpiar</span>
                        </button>
                    )}
                </div>

                <div className="card-body pt-2">
                    {isLoading ? (
                        <div className="text-center text-muted small py-3">Cargando etiquetas...</div>
                    ) : tags.length === 0 ? (
                        <p className="text-muted small fst-italic mb-0 text-center py-2">No hay etiquetas registradas.</p>
                    ) : (
                        <div className="d-flex flex-wrap gap-2">
                            {tags.map((tag) => {
                                const isSelected = selectedTags.includes(tag.id);
                                return (
                                    <button key={tag.id} onClick={() => onToggleTag(tag.id)} className={`btn btn-sm rounded-pill d-flex align-items-center gap-1 transition-base ${isSelected ? `btn-${tag.color || "primary"} shadow-sm` : "btn-outline-secondary"}`}>
                                        {isSelected && <IconCheck size={14} />}
                                        {tag.name}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
