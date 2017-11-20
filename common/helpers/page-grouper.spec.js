import groupPages from './page-grouper.js';

describe('When pages should be grouped', () => {
  const pages = [
    { name: 'apage1' },
    { name: 'apage2' },
    { name: 'bpage' }
  ];
  const expectedGroups = [
    { letter: 'A', pages: [{ name: 'apage1' }, { name: 'apage2' }] },
    { letter: 'B', pages: [{ name: 'bpage' }] },
  ];

  it('Should return the expected groups', () => {
    expect(groupPages(pages)).toEqual(expectedGroups);
  });
});
