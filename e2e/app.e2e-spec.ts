import { NotitiaPage } from './app.po';

describe('notitia App', () => {
  let page: NotitiaPage;

  beforeEach(() => {
    page = new NotitiaPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
