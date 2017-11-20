export default function groupPages(pages) {
  const groups = [];
  let currentLetter = '';
  let group;

  for (const page of pages) {
    const firstLetter = page.name.substr(0, 1).toUpperCase();
    if (currentLetter !== firstLetter) {
      currentLetter = firstLetter;
      group = { letter: firstLetter, pages: [] };
      groups.push(group);
    }
    group.pages.push(page);
  }
  return groups;
}
