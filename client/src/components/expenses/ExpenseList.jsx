import { useState } from "react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ExpenseCard } from "./ExpenseCard";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Receipt } from "lucide-react";

function SortableExpenseCard({ expense, onDelete, onUpdate, isDragMode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: expense._id,
    disabled: !isDragMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ExpenseCard
        expense={expense}
        onDelete={onDelete}
        onUpdate={onUpdate}
        dragHandleProps={isDragMode ? { ...attributes, ...listeners } : null}
        isDragging={isDragging}
      />
    </div>
  );
}

export function ExpenseList({ expenses, setExpenses, loading, error, onDelete, onUpdate, isDragMode }) {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (active.id !== over?.id) {
      setExpenses((items) => {
        const oldIndex = items.findIndex((i) => i._id === active.id);
        const newIndex = items.findIndex((i) => i._id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[72px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={onUpdate} />;
  }

  if (!expenses.length) {
    return (
      <EmptyState
        icon={Receipt}
        title="No expenses found"
        description="Try adjusting your filters or add a new expense."
      />
    );
  }

  const activeExpense = expenses.find((e) => e._id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={expenses.map((e) => e._id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {expenses.map((expense) => (
            <SortableExpenseCard
              key={expense._id}
              expense={expense}
              onDelete={onDelete}
              onUpdate={onUpdate}
              isDragMode={isDragMode}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeExpense && (
          <ExpenseCard
            expense={activeExpense}
            onDelete={() => {}}
            isDragging
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
