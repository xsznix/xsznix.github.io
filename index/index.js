'use strict';

greeting: {
  const $greeting = document.getElementById('greeting');
  const hour = new Date().getHours();
  $greeting.innerText =
    hour >= 18 || hour < 5 ? 'Good evening' :
    hour >= 12 ? 'Good afternoon' : 'Good morning';
}

animateName: {
  const $myName = document.getElementById('my-name');
  let lastScrolled = false;
  let noAnim = true;
  let noAnimTimeout;
  function scrollIfNeeded(animate) {
    const isScrolled = window.scrollY > 0;
    if (isScrolled && !lastScrolled) {
      $myName.classList.add('scrolled');
    } else if (!isScrolled && lastScrolled) {
      $myName.classList.remove('scrolled');
    }
    if (!animate && noAnim) {
      $myName.classList.add('no-animations');
      noAnim = true;
    } else if (isScrolled !== lastScrolled) {
      $myName.classList.remove('no-animations');
      noAnim = false;
      clearTimeout(noAnimTimeout);
      noAnimTimeout = setTimeout(() => {
        noAnimTimeout = undefined;
        $myName.classList.add('no-animations');
        noAnim = true;
      }, 800);
    }
    lastScrolled = isScrolled;
  }
  document.addEventListener('scroll', () => {
    scrollIfNeeded(true);
  });
  scrollIfNeeded(false);
}
