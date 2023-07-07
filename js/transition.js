
// Page Swithcing by Kevin Alavik
let displayType = 'flex';

function switchPage(page) {
  const pages = document.querySelectorAll('.page-container');
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].getAttribute('page') === page) {
        pages[i].style.display = displayType;
      } else {
        pages[i].style.display = 'none';
      }
   }
}
