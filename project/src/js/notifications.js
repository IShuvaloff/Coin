// import error from '../assets/icons/error.png';
// import success from '../assets/icons/success.png';
import { mount, el, setChildren } from 'redom';

// ! оф. уведомления windows - НЕ ИСПОЛЬЗОВАТЬ!
// let isNotify = 'Notification' in window;
// if (isNotify) {
//   Notification.requestPermission();
// }

// function notify(title, body, isSuccess) {
//   new Notification(title, {
//     body,
//     icon: isSuccess ? success : error,
//   });
// }

// ! список уведомлений
function createNotificationsList() {
  const list = el('ul.notifications');
  mount(document.body, list);
  return list;
}
function showNotification(text, type) {
  const list =
    document.querySelector('.notifications') ?? createNotificationsList();
  const item = el(`li.notifications__item.${type}`);
  const textBlock = el('p.notifications__text', text);
  const btnClose = el('button.notifications__btn');

  btnClose.addEventListener('click', () => item.remove());

  setChildren(item, [textBlock, btnClose]);
  mount(list, item);

  setTimeout(() => item.remove(), 5000);
}

export { showNotification };
