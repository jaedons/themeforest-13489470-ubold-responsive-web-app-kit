/* Ubold calendar migrated to the native FullCalendar 7 API. */
(function () {
  'use strict';
  const root = document.getElementById('calendar');
  if (!root) return;
  const modalElement = document.getElementById('event-modal');
  const modal = bootstrap.Modal.getOrCreateInstance(modalElement, { backdrop: 'static' });
  const save = modalElement.querySelector('.save-event');
  const remove = modalElement.querySelector('.delete-event');
  let selectedEvent = null;
  let range = null;
  const colors = ['danger', 'success', 'purple', 'primary', 'pink', 'info', 'warning'];
  function openEditor(event, selection) {
    selectedEvent = event;
    range = selection;
    save.disabled = true;
    remove.disabled = true;
    save.textContent = event ? 'Save changes' : 'Create event';
    modalElement.querySelector('.modal-title').textContent = event ? 'Edit Event' : 'Add Event';
    const form = document.createElement('form');
    const label = document.createElement('label');
    label.htmlFor = 'calendar-event-title';
    label.textContent = 'Event Name';
    const title = document.createElement('input');
    title.id = 'calendar-event-title';
    title.name = 'title';
    title.className = 'form-control';
    title.required = true;
    title.value = event ? event.title : '';
    const category = document.createElement('select');
    category.name = 'category';
    category.className = 'form-control m-t-10';
    category.setAttribute('aria-label', 'Category');
    colors.forEach(function (color) { category.add(new Option(color, 'bg-' + color)); });
    if (event && event.className) category.value = event.className;
    form.append(label, title, category);
    modalElement.querySelector('.modal-body').replaceChildren(form);
    save.style.display = '';
    remove.style.display = event ? '' : 'none';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!title.value.trim()) { title.setCustomValidity('Enter an event name'); title.reportValidity(); return; }
      if (selectedEvent) {
        selectedEvent.setProp('title', title.value.trim());
        selectedEvent.setProp('className', category.value);
      } else {
        calendar.addEvent({ title: title.value.trim(), start: range.startStr, end: range.endStr,
          allDay: range.allDay, className: category.value });
      }
      modal.hide();
      calendar.unselect();
    });
    title.addEventListener('input', function () { title.setCustomValidity(''); });
    modal.show();
  }
  const today = new Date();
  const calendar = new FullCalendar.Calendar(root, {
    initialView: 'dayGridMonth',
    height: Math.max(500, window.innerHeight - 200),
    headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' },
    slotDuration: '00:15:00', slotMinTime: '08:00:00', slotMaxTime: '19:00:00',
    editable: true, droppable: true, selectable: true, dayMaxEvents: true,
    events: [
      { title: 'Hey!', start: new Date(today.getTime() + 158000000), className: 'bg-purple' },
      { title: 'See John Deo', start: today, className: 'bg-danger' },
      { title: 'Buy a Theme', start: new Date(today.getTime() + 338000000), className: 'bg-primary' }
    ],
    select: function (info) { openEditor(null, info); },
    eventClick: function (info) { info.jsEvent.preventDefault(); openEditor(info.event, null); },
    eventReceive: function (info) {
      if (document.getElementById('drop-remove').checked) info.draggedEl.remove();
    }
  });
  calendar.render();
  root.uboldCalendar = calendar;
  save.addEventListener('click', function () { modalElement.querySelector('form').requestSubmit(); });
  remove.addEventListener('click', function () { if (selectedEvent) selectedEvent.remove(); modal.hide(); });
  modalElement.addEventListener('shown.bs.modal', function () {
    save.disabled = false;
    remove.disabled = false;
    modalElement.querySelector('input').focus();
  });
  new FullCalendar.Interaction.Draggable(document.getElementById('external-events'), {
    itemSelector: '.external-event',
    eventData: function (element) { return { title: element.textContent.trim(), className: element.dataset.class || 'bg-primary' }; }
  });
  document.querySelector('.save-category').addEventListener('click', function () {
    const form = document.querySelector('#add-category form');
    const title = form.querySelector('[name="category-name"]').value.trim();
    const color = form.querySelector('[name="category-color"]').value;
    if (!title) return;
    const event = document.createElement('div');
    event.className = 'external-event bg-' + color;
    event.dataset.class = 'bg-' + color;
    event.textContent = title;
    document.getElementById('external-events').append(event);
  });
})();
