import React, { useContext, useMemo } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Section from './Section';
import { AppContext } from '../context/AppContext';

const SectionsList = ({ searchTerm }) => {
  const { sections, setSections, darkMode } = useContext(AppContext);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedSections = Array.from(sections);
    const [movedSection] = reorderedSections.splice(result.source.index, 1);
    reorderedSections.splice(result.destination.index, 0, movedSection);
    setSections(reorderedSections);
  };

  const filteredSections = useMemo(() => {
    return sections.filter(
      (section) =>
        section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [sections, searchTerm]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="sections">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {filteredSections.map((section, index) => (
              <Section key={section.id} section={section} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default React.memo(SectionsList);