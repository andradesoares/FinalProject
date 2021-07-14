document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('click', event => {
    if (event.target.id === 'login') {
      login()
    }
  });
  document.addEventListener('click', event => {
    if (event.target.id === 'register') {
      register()
    }
  });
  document.addEventListener('click', event => {
    if (event.target.id === 'buscaButton') {
      let term = document.querySelector('#buscaBooks').value
      event.preventDefault()
      busca(term)
    }
  });
  document.addEventListener('click', event => {
    if (event.target.id === 'launchLoginModal') {
      $('#loginModal').modal('show')
      $('#registerModal').modal('hide')
    }
  });
  document.addEventListener('click', event => {
    if (event.target.id === 'launchRegisterModal') {
      $('#registerModal').modal('show')
      $('#loginModal').modal('hide')
    }
  });
});

function login() {
  let modalBody = document.querySelector('.modal-body-login')
  let message = document.querySelector('#message')
  let csrftoken = getCookie('csrftoken');
  fetch('/login', {
    method: 'POST',
    body: JSON.stringify({
        username: document.querySelector('#loginUser').value,
        password: document.querySelector('#loginPass').value
    }),
    headers: { "X-CSRFToken": csrftoken }
  })
  .then(response => response.json())
  .then(result => {
    if(result.message){
      $('#loginModal').modal('hide')
      location.reload()
    } else {
      message.innerHTML =  result.error
      message.classList.add("mb-0");
      modalBody.appendChild(message)
    }
  });
}


function register() {
  let modalBody = document.querySelector('.modal-body-register')
  let message = document.querySelector('#message')
  let csrftoken = getCookie('csrftoken');
  if (document.querySelector('#registerUser').value == "" ||
    document.querySelector('#registerEmail').value== "" ||
    document.querySelector('#registerPass').value== "" || 
    document.querySelector('#registerConfirmation').value == ""){
      message.innerHTML = "Error, field can't be empty."
      message.classList.add("mb-0");
      modalBody.appendChild(message)
  } else{
    fetch('/register', {
      method: 'POST',
      body: JSON.stringify({
          username: document.querySelector('#registerUser').value,
          email: document.querySelector('#registerEmail').value,
          password: document.querySelector('#registerPass').value,
          confirmation: document.querySelector('#registerConfirmation').value
      }),
      headers: { "X-CSRFToken": csrftoken }
    })
    .then(response => response.json())
    .then(result => {
      if(result.message){
        $('#registerModal').modal('hide')
        location.reload()
      } else {
        message.innerHTML =  result.error
        message.classList.add("mb-0");
        modalBody.appendChild(message)
      }
    });
  }
}

function busca(term) {
  document.querySelector('#response').innerHTML = ''
  document.querySelector('#reviewsContainer').style.visibility = "hidden"
  fetch(`https://www.googleapis.com/books/v1/volumes?q=${term}`)
  .then(response => response.json())
  .then(result => {
    if(result.totalItems == 0 || result.error){
      document.querySelector('#response').innerHTML +=
      `
        <h1 class="mx-auto mt-5 text-center" >0 books found.</h1>
      `
    } else {
      for (let i of result.items){
        document.querySelector('#response').innerHTML +=
        `
          <div class="cards col-sm-12 col-lg-3 col-md-6 mb-5 pb-4">
            <input type="hidden" id="bookId" name="bookId" value="${i.id}">
            <div class="text-center">
              <img src="${i.volumeInfo.imageLinks != undefined ? i.volumeInfo.imageLinks.thumbnail : "https://islandpress.org/sites/default/files/default_book_cover_2015.jpg"}" class="thumbnail rounded" alt="...">
            </div>
            <h4 class="mx-auto text-center"> <strong>${i.volumeInfo.title}</strong></h4>
            <p class="mx-auto text-center"> ${i.volumeInfo.authors}</p>
            <a href="/books/${i.id}" id="singleBook" type="button" class="mx-auto btn btn-outline-primary">More</a>
          </div>
        `
      }
    }
  })
}

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}
