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
  let noAnim = true;
  let noAnimTimeout;
  let lastScrolled = false;
  function scrollIfNeeded(animate, isScrolled) {
    if (isScrolled && !lastScrolled) {
      $myName.classList.add('scrolled');
    } else if (!isScrolled && lastScrolled) {
      $myName.classList.remove('scrolled');
    } else {
      return;
    }
    lastScrolled = isScrolled;
    if (!animate && noAnim) {
      $myName.classList.add('no-animations');
      noAnim = true;
    } else {
      $myName.classList.remove('no-animations');
      noAnim = false;
      clearTimeout(noAnimTimeout);
      noAnimTimeout = setTimeout(() => {
        noAnimTimeout = undefined;
        $myName.classList.add('no-animations');
        noAnim = true;
      }, 800);
    }
  }
  let firstTime = true;
  new IntersectionObserver(e => {
    scrollIfNeeded(!firstTime, e[0].intersectionRatio < 1);
    firstTime = false;
  }, {rootMargin: '-1px 0px 0px 0px', threshold: [1]}).observe($myName);

  let isFixed;
  window.addEventListener('scroll', () => {
    const isNowFixed = window.scrollY >= Math.min(window.innerWidth, window.innerHeight) - $myName.clientHeight - 100;
    if (isNowFixed && !isFixed) {
      $myName.classList.add('fixed');
    } else if (!isNowFixed && isFixed) {
      $myName.classList.remove('fixed');
    }
    isFixed = isNowFixed;
  });
}

copyright: {
  document.getElementById('current-year').innerText = new Date().getFullYear().toString();
}
