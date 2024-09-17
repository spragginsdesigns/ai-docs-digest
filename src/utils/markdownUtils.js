export const combineSectionsToMarkdown = (sections) => {
  return sections
    .map((section) => `## ${section.title}\n\n${section.content}`)
    .join('\n\n---\n\n');
};