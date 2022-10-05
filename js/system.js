window.addEventListener('load',function() { 
  let nav_toggle = document.getElementsByClassName('nav_toggle');
  if(nav_toggle.length > 0) {
    nav_toggle[0].addEventListener('click', toggle_navigation);
  }

  let toTopButtons = this.document.getElementsByClassName('toTopButton');
  let scrollObject = document.getElementById('scrollObject');

  if(toTopButtons.length > 0 && scrollObject != null)  {

    toTopButtons[0].addEventListener('click', function() {
      scrollObject.scrollTo({top:0,behavior:'smooth'});
    });

    scrollObject.onscroll = function() {
      if(scrollObject.scrollTop > 30) {
        toTopButtons[0].className = 'toTopButton show';
      }
      else {
        toTopButtons[0].className = 'toTopButton';
      }
    };
  }

});


function toggle_navigation() {
  let nav_toggle = document.getElementsByClassName('nav_toggle');
  nav_toggle[0].classList.toggle('show');
  document.getElementsByClassName('nav_header')[0].classList.toggle('show');
}