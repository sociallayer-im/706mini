// Direct entry points for reviewing the static prototype.
(() => {
  const q = new URLSearchParams(location.search);
  const views = ["feed", "discover", "messages", "me", "event", "member", "space", "org", "entity-events", "entity-members", "edit-entity", "admins", "edit-profile", "relations", "calendar", "spaces", "campaign", "campaign-edit", "event-access", "activity-preview", "publish", "approvals", "approval-detail", "approval-progress", "registrations", "my-events", "drafts", "following", "more"];
  if (!views.includes(q.get('view'))) return;
  state.view = q.get('view');
  state.history = [];
  if (['feed','discover','messages','me'].includes(state.view)) state.tab = state.view;
  if (events.some(e => e.id === q.get('id'))) state.activeEvent = q.get('id');
  if (people.some(p => p.id === q.get('id'))) state.activePerson = q.get('id');
  state.activeEntity = state.view === 'org' || q.get('entity') === 'org' ? 'org' : 'space';
  state.activeRelation = q.get('relation') === 'followers' ? 'followers' : 'following';
  state.browseMode = q.get('mode') === 'space' ? 'space' : 'time';
  state.publishStep = ['1','2','3'].includes(q.get('step')) ? Number(q.get('step')) : 1;
  state.publishSubmitted = q.get('submitted') === '1';
  state.approvalDone = q.get('done') === '1';
  render();
  const sheets = {
    signup: () => signupSheet(state.activeEvent), comment: () => commentSheet(),
    recommend: () => recommendSheet(state.activeEvent), mini: miniProgramSheet,
    city: citySheet, language: languageSheet, manage: manageEntitySheet,
    member: memberMoreSheet, why: peopleWhySheet, payment: paymentSheet,
    group: groupSheet, return: returnSheet
  };
  if (Object.hasOwn(sheets, q.get('sheet'))) sheets[q.get('sheet')]();
})();
