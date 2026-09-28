import { useState, useMemo } from "react";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";

// Componentes
import { CalendarView } from "../components/CalendarView";
import { SidebarWidget } from "../components/SidebarWidget";
import { PlannerModal } from "../components/PlannerModal";
import { FixedTaskModal } from "../components/FixedTaskModal";
import { FAB } from "@/shared/components/FAB/FAB";

// Hooks y Mutaciones
import { usePlanner } from "../hooks/usePlanner";
import { usePlannerSidebar } from "../hooks/usePlannerSidebar";
import { useCreateFixedTaskMutation } from "../mutations/useCreateFixedTaskMutation";
import { useUpdateFixedTaskMutation } from "../mutations/useUpdateFixedTaskMutation";

export const PlannerPage = () => {
    useDocumentTitle("Agenda y Calendario");

    const { user } = useAuth();
    const isMobile = useMediaQuery("(max-width: 767px)");

    const { events, isLoading: isLoadingEvents, isError } = usePlanner(user?.id);
    const { fixedTasks, tags, isLoading: isLoadingSidebar } = usePlannerSidebar(user?.id);

    // 🚀 Instanciamos ambas Mutaciones para respetar la separación de responsabilidades[cite: 1]
    const { mutate: createFixedTask, isPending: isCreatingFixedTask } = useCreateFixedTaskMutation(user?.id);
    const { mutate: updateFixedTask, isPending: isUpdatingFixedTask } = useUpdateFixedTaskMutation(user?.id);

    // Estado de guardado general para deshabilitar botones en el UI
    const isSavingFixedTask = isCreatingFixedTask || isUpdatingFixedTask;

    const [selectedTags, setSelectedTags] = useState([]);

    const [isFixedTaskModalOpen, setIsFixedTaskModalOpen] = useState(false);
    const [selectedFixedTask, setSelectedFixedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null);

    const filteredEvents = useMemo(() => {
        if (selectedTags.length === 0 || !events) return events;
        return events.filter((event) => {
            const eventTags = event.extendedProps?.tags || event.tags || [];
            return eventTags.some((tag) => selectedTags.includes(tag.id));
        });
    }, [events, selectedTags]);

    const handleToggleTag = (tagId) => {
        setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]));
    };

    // 🚀 Lógica de Tareas Fijas: Modo Creación
    const handleAddFixedTask = () => {
        setSelectedFixedTask(null);
        setIsFixedTaskModalOpen(true);
    };

    // 🚀 Lógica de Tareas Fijas: Modo Edición
    const handleEditFixedTask = (task) => {
        setSelectedFixedTask(task);
        setIsFixedTaskModalOpen(true);
    };

    // 🚀 Lógica de Tareas Fijas: Cierre Seguro para forzar el ciclo de vida de React
    const handleCloseFixedTaskModal = () => {
        setIsFixedTaskModalOpen(false);
        // Limpiamos el dato seleccionado luego de la animación de Bootstrap para evitar "parpadeos"
        setTimeout(() => setSelectedFixedTask(null), 300);
    };

    // 🚀 Lógica de Tareas Fijas: Ruteo de la acción (POST vs PUT)
    const handleSaveFixedTask = (formData) => {
        if (formData.id) {
            // Modo Edición
            updateFixedTask(
                { id: formData.id, data: formData },
                {
                    onSuccess: () => {
                        handleCloseFixedTaskModal();
                        // Opcional: Toast corporativo de actualización exitosa
                    },
                },
            );
        } else {
            // Modo Creación
            createFixedTask(formData, {
                onSuccess: () => {
                    handleCloseFixedTaskModal();
                    // Opcional: Toast corporativo de creación exitosa
                },
            });
        }
    };

    const handleDateSelect = (selectInfo) => {
        setSelectedEvent(null);
        setSelectedDate(selectInfo.startStr);
        setIsModalOpen(true);
    };

    const handleEventClick = (clickInfo) => {
        setSelectedEvent({
            id: clickInfo.event.id,
            title: clickInfo.event.title,
            startStr: clickInfo.event.startStr,
            endStr: clickInfo.event.endStr,
            allDay: clickInfo.event.allDay,
            extendedProps: clickInfo.event.extendedProps,
        });
        setIsModalOpen(true);
    };

    const handleFabClick = () => {
        setSelectedEvent(null);
        const today = new Date().toISOString().split("T")[0];
        setSelectedDate(today);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedEvent(null), 300);
    };

    return (
        <div className="page-body">
            <div className="container-xl">
                {isError && (
                    <div className="alert alert-danger" role="alert">
                        Error al cargar los recordatorios desde el servidor.
                    </div>
                )}

                <div className="row g-3">
                    <div className="col-lg-9 col-md-8">{isLoadingEvents ? <div className="card shadow-sm border-0 p-5 text-center text-muted">Cargando agenda y recordatorios...</div> : <CalendarView events={filteredEvents} onDateSelect={handleDateSelect} onEventClick={handleEventClick} />}</div>

                    <div className="col-lg-3 col-md-4">
                        <SidebarWidget fixedTasks={fixedTasks} tags={tags} selectedTags={selectedTags} onToggleTag={handleToggleTag} onAddFixedTask={handleAddFixedTask} onEditFixedTask={handleEditFixedTask} isLoading={isLoadingSidebar} />
                    </div>
                </div>

                {/* Modal del Calendario Principal */}
                <PlannerModal isOpen={isModalOpen} onClose={handleCloseModal} selectedDate={selectedDate} initialData={selectedEvent} userId={user?.id} />

                {/* 🚀 Modal de Tareas Fijas actualizado */}
                <FixedTaskModal
                    isOpen={isFixedTaskModalOpen}
                    onClose={handleCloseFixedTaskModal} // Usamos nuestra nueva función de cierre seguro
                    onSave={handleSaveFixedTask}
                    isSaving={isSavingFixedTask}
                    notebooks={[]}
                    initialData={selectedFixedTask}
                />

                {isMobile && !isModalOpen && <FAB onClick={handleFabClick} ariaLabel="Agregar nuevo evento" />}
            </div>
        </div>
    );
};
