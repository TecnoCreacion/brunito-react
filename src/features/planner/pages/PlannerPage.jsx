import { useState, useMemo } from "react";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";

// Componentes
import { BigCalendarView } from "../components/BigCalendarView";
import { PlannerToolbar } from "../components/PlannerToolbar";
import { SidebarWidget } from "../components/SidebarWidget";
import { PlannerModal } from "../components/PlannerModal";
import { FixedTaskModal } from "../components/FixedTaskModal";
import { WeekTasksModal } from "../components/WeekTasksModal";

import { FAB } from "@/shared/components/FAB/FAB";
import { MiniCalendarPicker } from "@/shared/components/MiniCalendarPicker/MiniCalendarPicker";

// Hooks y Mutaciones
import { usePlanner } from "../hooks/usePlanner";
import { usePlannerResources } from "../hooks/usePlannerResources";
import { usePlannerSidebar } from "../hooks/usePlannerSidebar";
import { useCalendarControls } from "../hooks/useCalendarControls";

import { useCreateFixedTaskMutation } from "../mutations/useCreateFixedTaskMutation";
import { useUpdateFixedTaskMutation } from "../mutations/useUpdateFixedTaskMutation";
import { useScheduleTasksForWeekMutation } from "../mutations/useScheduleTasksForWeekMutation";

import moment from "moment";
import "moment/locale/es";

export const PlannerPage = () => {
    useDocumentTitle("Agenda y Calendario");

    const { user } = useAuth();
    const isMobile = useMediaQuery("(max-width: 767px)");

    const { events, isLoading: isLoadingEvents, isError } = usePlanner(user?.id);
    const { resources, isLoading: isLoadingResources, isError: isErrorResources } = usePlannerResources(user?.id);
    const { fixedTasks, tags, isLoading: isLoadingSidebar } = usePlannerSidebar(user?.id);

    const calendarControls = useCalendarControls("month");

    // 🚀 Instanciamos ambas Mutaciones para respetar la separación de responsabilidades[cite: 1]
    const { mutate: createFixedTask, isPending: isCreatingFixedTask } = useCreateFixedTaskMutation(user?.id);
    const { mutate: updateFixedTask, isPending: isUpdatingFixedTask } = useUpdateFixedTaskMutation(user?.id);
    const { mutate: scheduleTasksForWeek, isPending: isSchedulingWeek } = useScheduleTasksForWeekMutation(user?.id);

    // Estado de guardado general para deshabilitar botones en el UI
    const isSavingFixedTask = isCreatingFixedTask || isUpdatingFixedTask;

    const [selectedTags, setSelectedTags] = useState([]);

    const [isFixedTaskModalOpen, setIsFixedTaskModalOpen] = useState(false);
    const [selectedFixedTask, setSelectedFixedTask] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedPlannerId, setSelectedPlannerId] = useState(null);

    // 🚀 Estados para el selector de semanas
    const [isWeekModalOpen, setIsWeekModalOpen] = useState(false);
    const [selectedWeekNumber, setSelectedWeekNumber] = useState(null);
    const [selectedIsoYear, setSelectedIsoYear] = useState(null); // Nuevo estado para la precisión ISO

    const manualFixedTasks = fixedTasks?.filter((task) => !task.rotation_week || task.rotation_week === "") || [];

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

    const handleDateSelect = (slotInfo) => {
        // 1. Limpiamos cualquier evento previamente seleccionado
        setSelectedPlannerId(null);

        // 2. react-big-calendar entrega slotInfo.start como un objeto Date nativo.
        // Lo formateamos a un string seguro (YYYY-MM-DD) para mantener la consistencia con tu estado anterior.
        // Utilizamos moment (que ya tienes en el proyecto) para evitar desfases de zona horaria nativos de JS.
        const formattedDate = moment(slotInfo.start).format("YYYY-MM-DD");

        setSelectedDate(formattedDate);
        setIsModalOpen(true);
    };

    const handleEventClick = (event) => {
        // 🚀 ARQUITECTURA: Solo almacenamos el identificador único.
        // Esto evita duplicar la fuente de verdad y previene la edición de datos obsoletos.
        const id = typeof event === "object" ? event.id : event;

        setSelectedPlannerId(id);
        setIsModalOpen(true);
    };

    const handleScheduleWeek = (selectedTaskIds) => {
        // Disparamos la mutación
        scheduleTasksForWeek(
            { weekNumber: selectedWeekNumber, taskIds: selectedTaskIds, isoYear: selectedIsoYear },
            {
                onSuccess: () => {
                    setIsWeekModalOpen(false);
                    setSelectedWeekNumber(null);
                    setSelectedIsoYear(null);
                    // Opcional: Mostrar Toast corporativo de éxito
                },
            },
        );
    };

    const handleWeekClick = (weekNumber, dateValue) => {
        setSelectedWeekNumber(weekNumber);

        // Calculamos el año ISO exacto a partir del objeto Date de la celda de la semana
        const isoYear = moment(dateValue).isoWeekYear();
        setSelectedIsoYear(isoYear);

        setIsWeekModalOpen(true);
    };

    const handleFabClick = () => {
        setSelectedPlannerId(null);
        const today = new Date().toISOString().split("T")[0];
        setSelectedDate(today);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPlannerId(null);
    };

    if (isError)
        return (
            <div className="alert alert-danger" role="alert">
                Error al cargar los recordatorios desde el servidor.
            </div>
        );

    return (
        <>
            <div className="row w-100">
                {/* SIDEBAR IZQUIERDO: Mini-calendario e Filtros */}
                <div className="col-lg-2 col-md-3">
                    <div className="card shadow-sm border-0 mb-3">
                        <div className="card-body">
                            {/* 🚀 MINI CALENDARIO: Simplemente emite una fecha hacia el Hook */}
                            <MiniCalendarPicker selectedDate={calendarControls.currentDate} onChange={(date) => calendarControls.changeDate(date)} />
                        </div>
                    </div>

                    <SidebarWidget fixedTasks={fixedTasks} tags={tags} selectedTags={selectedTags} onToggleTag={handleToggleTag} onAddFixedTask={handleAddFixedTask} onEditFixedTask={handleEditFixedTask} isLoading={isLoadingSidebar} />
                </div>

                {/* ÁREA PRINCIPAL: Calendario Grande */}
                <div className="col-lg-10 col-md-9">
                    {isLoadingEvents ? (
                        <div className="card shadow-sm border-0 p-5 text-center text-muted">Cargando agenda y recordatorios...</div>
                    ) : (
                        <>
                            {/* 🚀 BARRA EXTERNA */}
                            <PlannerToolbar controls={calendarControls} />

                            {/* 🚀 CALENDARIO (Sin Cabecera) */}
                            <BigCalendarView
                                events={filteredEvents}
                                resources={resources}
                                controls={calendarControls}
                                onEventClick={handleEventClick}
                                onDateSelect={handleDateSelect}
                                onWeekClick={handleWeekClick} // 🚀 Tu nueva funcionalidad
                            />
                        </>
                    )}
                </div>
            </div>

            {/* Modal del Calendario Principal */}
            <PlannerModal key={selectedPlannerId ? `planner-modal-${selectedPlannerId}` : `planner-modal-new-${selectedDate}`} isOpen={isModalOpen} onClose={handleCloseModal} selectedDate={selectedDate} plannerId={selectedPlannerId} userId={user?.id} />

            {/* 🚀 Modal de Tareas Fijas actualizado */}
            <FixedTaskModal
                isOpen={isFixedTaskModalOpen}
                onClose={handleCloseFixedTaskModal} // Usamos nuestra nueva función de cierre seguro
                onSave={handleSaveFixedTask}
                isSaving={isSavingFixedTask}
                notebooks={[]}
                initialData={selectedFixedTask}
            />

            <WeekTasksModal
                isOpen={isWeekModalOpen}
                onClose={() => setIsWeekModalOpen(false)}
                onSave={handleScheduleWeek}
                weekNumber={selectedWeekNumber}
                availableManualTasks={manualFixedTasks}
                isSaving={isSchedulingWeek} // El estado pending de tu mutación
            />

            {isMobile && !isModalOpen && <FAB onClick={handleFabClick} ariaLabel="Agregar nuevo evento" />}
        </>
    );
};
