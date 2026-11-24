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
import { PlannerTagFormModal } from "../components/PlannerTagFormModal";
import { EventSummaryModal } from "../components/EventSummaryModal"; // Modal de solo lectura para "Resumen"

import { FAB } from "@/shared/components/FAB/FAB";
import { MiniCalendarPicker } from "@/shared/components/MiniCalendarPicker/MiniCalendarPicker";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog/ConfirmDialog";

// Hooks y Mutaciones
import { usePlanner } from "../hooks/usePlanner";
import { usePlannerResources } from "../hooks/usePlannerResources";
import { usePlannerSidebar } from "../hooks/usePlannerSidebar";
import { useCalendarControls } from "../hooks/useCalendarControls";

import { useCreateFixedTaskMutation } from "../mutations/useCreateFixedTaskMutation";
import { useUpdateFixedTaskMutation } from "../mutations/useUpdateFixedTaskMutation";
import { useScheduleTasksForWeekMutation } from "../mutations/useScheduleTasksForWeekMutation";
import { useDeletePlannerMutation } from "../mutations/useDeletePlannerMutation";
import { useReorderPlannerEventsMutation } from "../mutations/useReorderPlannerEventsMutation";

import moment from "moment";
import "moment/locale/es";

export const PlannerPage = () => {
    useDocumentTitle("Agenda y Calendario");

    const { user } = useAuth();
    const isMobile = useMediaQuery("(max-width: 767px)");

    const { events, isLoading: isLoadingEvents, isError } = usePlanner(user?.id);
    const { resources } = usePlannerResources(user?.id);
    const { fixedTasks, tags, isLoading: isLoadingSidebar } = usePlannerSidebar(user?.id);

    const calendarControls = useCalendarControls("month");

    const { mutate: createFixedTask, isPending: isCreatingFixedTask } = useCreateFixedTaskMutation(user?.id);
    const { mutate: updateFixedTask, isPending: isUpdatingFixedTask } = useUpdateFixedTaskMutation(user?.id);
    const { mutate: scheduleTasksForWeek, isPending: isSchedulingWeek } = useScheduleTasksForWeekMutation(user?.id);
    const { mutate: deletePlannerEvent, isPending: isDeletingEvent } = useDeletePlannerMutation(user?.id);
    const { mutate: reorderDayEvents } = useReorderPlannerEventsMutation(user?.id);

    const isSavingFixedTask = isCreatingFixedTask || isUpdatingFixedTask;

    const [selectedTags, setSelectedTags] = useState([]);

    // Estados de Modales
    const [isFixedTaskModalOpen, setIsFixedTaskModalOpen] = useState(false);
    const [selectedFixedTask, setSelectedFixedTask] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedPlannerId, setSelectedPlannerId] = useState(null);

    // Estados para las nuevas acciones del Dropdown [Resumen, Editar, Ordenar, Eliminar]
    const [summaryEvent, setSummaryEvent] = useState(null);
    const [eventIdToDelete, setEventIdToDelete] = useState(null);

    const [isWeekModalOpen, setIsWeekModalOpen] = useState(false);
    const [selectedWeekNumber, setSelectedWeekNumber] = useState(null);
    const [selectedIsoYear, setSelectedIsoYear] = useState(null);

    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [editingTag, setEditingTag] = useState(null);

    const manualFixedTasks = fixedTasks?.filter((task) => !task.rotation_week || task.rotation_week === "") || [];

    const filteredEvents = useMemo(() => {
        if (selectedTags.length === 0 || !events) return events;

        return events.filter((event) => {
            const eventTags = event.tags || [];
            return eventTags.some((tag) => selectedTags.includes(tag.id));
        });
    }, [events, selectedTags]);

    const handleToggleTag = (tagId) => {
        setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]));
    };

    const handleClearTags = () => setSelectedTags([]);

    const handleAddFixedTask = () => {
        setSelectedFixedTask(null);
        setIsFixedTaskModalOpen(true);
    };

    const handleEditFixedTask = (task) => {
        setSelectedFixedTask(task);
        setIsFixedTaskModalOpen(true);
    };

    const handleCloseFixedTaskModal = () => {
        setIsFixedTaskModalOpen(false);
        setTimeout(() => setSelectedFixedTask(null), 300);
    };

    const handleSaveFixedTask = (formData) => {
        if (formData.id) {
            updateFixedTask({ id: formData.id, data: formData }, { onSuccess: () => handleCloseFixedTaskModal() });
        } else {
            createFixedTask(formData, { onSuccess: () => handleCloseFixedTaskModal() });
        }
    };

    const handleDateSelect = (slotInfo) => {
        setSelectedPlannerId(null);
        const formattedDate = moment(slotInfo.start).format("YYYY-MM-DD");
        setSelectedDate(formattedDate);
        setIsModalOpen(true);
    };

    // 🚀 1. RESUMEN: Abre modal de lectura rápida
    const handleSummaryEvent = (event) => {
        setSummaryEvent(event);
    };

    // 🚀 2. EDITAR: Abre PlannerModal con el ID del evento
    const handleEditEvent = (eventId) => {
        setSelectedPlannerId(eventId);
        setIsModalOpen(true);
    };

    // 🚀 3. ORDENAR: Lleva al usuario a la vista Agenda enfocada en el día del evento para arrastrar y ordenar
    const handleOrderEvent = (event) => {
        calendarControls.changeDate(new Date(event.start));
        if (calendarControls.currentView !== "agenda") {
            calendarControls.changeView("agenda");
        }
    };

    // 🚀 4. ELIMINAR: Abre diálogo de confirmación corporativo (nunca window.confirm)
    const handleDeleteEvent = (eventId) => {
        setEventIdToDelete(eventId);
    };

    const handleConfirmDeleteEvent = () => {
        if (!eventIdToDelete) return;
        deletePlannerEvent(eventIdToDelete, {
            onSuccess: () => setEventIdToDelete(null),
        });
    };

    const handleScheduleWeek = (selectedTaskIds) => {
        scheduleTasksForWeek(
            { weekNumber: selectedWeekNumber, taskIds: selectedTaskIds, isoYear: selectedIsoYear },
            {
                onSuccess: () => {
                    setIsWeekModalOpen(false);
                    setSelectedWeekNumber(null);
                    setSelectedIsoYear(null);
                },
            },
        );
    };

    const handleWeekClick = (weekNumber, dateValue) => {
        setSelectedWeekNumber(weekNumber);
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

    const handleOpenAddTag = () => {
        setEditingTag(null);
        setIsTagModalOpen(true);
    };

    const handleOpenEditTag = (tag) => {
        setEditingTag(tag);
        setIsTagModalOpen(true);
    };

    const handleCloseTagModal = () => {
        setIsTagModalOpen(false);
        setEditingTag(null);
    };

    if (isError) {
        return (
            <div className="alert alert-danger" role="alert">
                Error al cargar los recordatorios desde el servidor.
            </div>
        );
    }

    const sidebarContent = (
        <>
            <div className="card shadow-sm border-0 mb-3">
                <div className="card-body">
                    <MiniCalendarPicker selectedDate={calendarControls.currentDate} onChange={(date) => calendarControls.changeDate(date)} />
                </div>
            </div>

            <SidebarWidget fixedTasks={fixedTasks} tags={tags} selectedTags={selectedTags} onToggleTag={handleToggleTag} onClearTags={handleClearTags} onAddFixedTask={handleAddFixedTask} onEditFixedTask={handleEditFixedTask} isLoading={isLoadingSidebar} onAddTag={handleOpenAddTag} onEditTag={handleOpenEditTag} />
        </>
    );

    return (
        <>
            <div className="row w-100">
                {!isMobile && <div className="col-lg-2 col-md-3">{sidebarContent}</div>}

                <div className={isMobile ? "col-12" : "col-lg-10 col-md-9"}>
                    {isLoadingEvents ? (
                        <div className="card shadow-sm border-0 p-5 text-center text-muted">Cargando agenda y recordatorios...</div>
                    ) : (
                        <>
                            <PlannerToolbar controls={calendarControls} mobileSidebarSlot={sidebarContent} activeFiltersCount={selectedTags.length} />

                            <BigCalendarView events={filteredEvents} resources={resources} controls={calendarControls} selectedTags={selectedTags} onSummaryEvent={handleSummaryEvent} onEditEvent={handleEditEvent} onOrderEvent={handleOrderEvent} onDeleteEvent={handleDeleteEvent} onDateSelect={handleDateSelect} onWeekClick={handleWeekClick} onReorderDayEvents={reorderDayEvents} />
                        </>
                    )}
                </div>
            </div>

            {/* Modal de Creación / Edición */}
            <PlannerModal key={selectedPlannerId ? `planner-modal-${selectedPlannerId}` : `planner-modal-new-${selectedDate}`} isOpen={isModalOpen} onClose={handleCloseModal} selectedDate={selectedDate} plannerId={selectedPlannerId} userId={user?.id} />

            {/* Modal de Resumen Rápido */}
            <EventSummaryModal
                isOpen={Boolean(summaryEvent)}
                event={summaryEvent}
                onClose={() => setSummaryEvent(null)}
                onEdit={(id) => {
                    setSummaryEvent(null);
                    handleEditEvent(id);
                }}
            />

            {/* Diálogo Corporativo de Confirmación para Eliminar */}
            <ConfirmDialog isOpen={Boolean(eventIdToDelete)} title="Eliminar evento" message="¿Estás seguro de que deseas eliminar este recordatorio? Esta acción se puede revertir desde la papelera." variant="danger" confirmLabel="Eliminar" loading={isDeletingEvent} onConfirm={handleConfirmDeleteEvent} onCancel={() => setEventIdToDelete(null)} />

            <FixedTaskModal isOpen={isFixedTaskModalOpen} onClose={handleCloseFixedTaskModal} onSave={handleSaveFixedTask} isSaving={isSavingFixedTask} notebooks={[]} initialData={selectedFixedTask} />

            <WeekTasksModal isOpen={isWeekModalOpen} onClose={() => setIsWeekModalOpen(false)} onSave={handleScheduleWeek} weekNumber={selectedWeekNumber} availableManualTasks={manualFixedTasks} isSaving={isSchedulingWeek} />

            <PlannerTagFormModal isOpen={isTagModalOpen} initialData={editingTag} onClose={handleCloseTagModal} />

            {isMobile && !isModalOpen && <FAB onClick={handleFabClick} ariaLabel="Agregar nuevo evento" />}
        </>
    );
};
