document.addEventListener('DOMContentLoaded', function() {
  singleBook(document.querySelector('#singleBook').value)

  document.addEventListener('click', event => {
    if (event.target.id === 'star1'|| event.target.id === 'star2'|| event.target.id === 'star3'|| event.target.id === 'star4' || event.target.id === 'star5'  ) {
      if(document.querySelector('#userauth').value == "AnonymousUser"){
        $('#loginModal').modal('show')
      } else {
        rating(event.target.value)
      }
    }
  });

  document.addEventListener('click', event => {
    if (event.target.id === 'submitReview') {
      if(document.querySelector('#userauth').value == "AnonymousUser"){
        $('#loginModal').modal('show')
      } else {
        review()
      }
    }
  });
  document.addEventListener('click', event => {
    if (event.target.id === 'library') {
      if(document.querySelector('#userauth').value == "AnonymousUser"){
        $('#loginModal').modal('show')
      } else {
        addlibrary(event.target.value)
      }
    }
  });
});

function singleBook(bookId) {
  let csrftoken = getCookie('csrftoken');
  document.querySelector('#response').innerHTML = ''
  Promise.all([
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookId}`)
    .then(value => value.json()),
    fetch(`/reviews`,{
      method: 'POST',
      body: JSON.stringify({
        bookId: bookId
      }),
      headers: { "X-CSRFToken": csrftoken }
    })
    .then(value => value.json()),
    fetch(`/ratings`,{
      method: 'POST',
      body: JSON.stringify({
        bookId: bookId
      }),
      headers: { "X-CSRFToken": csrftoken }
    })
    .then(value => value.json()),
    fetch(`/status`,{
      method: 'POST',
      body: JSON.stringify({
        bookId: bookId
      }),
      headers: { "X-CSRFToken": csrftoken }
    })
    .then(value => value.json())
  ])
  .then(allResponses => {
    const result = allResponses[0]
    const response2 = allResponses[1]
    const ratings = allResponses[2]
    const status = allResponses[3]
    document.querySelector('#response').innerHTML =
        `
          <div class="container-fluid">
            <div class="row">
              <div class="col-lg-5 col-md-12 mb-md-4 d-flex justify-content-center">
                <img src="${result.items[0].volumeInfo.imageLinks != undefined ? result.items[0].volumeInfo.imageLinks.thumbnail : "https://islandpress.org/sites/default/files/default_book_cover_2015.jpg"}"  alt="" class="col-6">
              </div>
              <div class="col-lg-5 col-md-12 mx-md-5 px-md-5">
                <h2 class="mx-auto text-left"> ${result.items[0].volumeInfo.title}</h2>
                <p class="mx-auto text-left"> ${result.items[0].volumeInfo.authors}</p>
                <h5 class="mx-auto text-left"> Characteristics:</h5>
                <div class="ml-3">
                  <p class="mb-1 mx-auto text-left responsive"> <strong>Language:</strong> ${result.items[0].volumeInfo.language}</p>
                  <p class="mb-1 mx-auto text-left responsive"> <strong>Page count:</strong> ${result.items[0].volumeInfo.pageCount}</p>
                  <p class="mb-1 mx-auto text-left responsive"> <strong>Publisher:</strong> ${result.items[0].volumeInfo.publisher}</p>
                  <p class="mb-1 mx-auto text-left responsive"> <strong>Publish date:</strong> ${result.items[0].volumeInfo.publishedDate}</p>
                  <p class="mb-1 mx-auto text-left responsive"> <strong>Average Rating:</strong> ${result.items[0].volumeInfo.averageRating}</p>
                  <div class="mt-4 container">
                    <h5 class="ml-n1"><strong>Rate</strong></h5>
                    <div class="row">
                      <div class="rating">
                        <input type="radio" id="star5" name="rating" value="5" /><label for="star5" title="Amazing">5 stars</label>
                        <input type="radio" id="star4" name="rating" value="4" /><label for="star4" title="Good">4 stars</label>
                        <input type="radio" id="star3" name="rating" value="3" /><label for="star3" title="Ok">3 stars</label>
                        <input type="radio" id="star2" name="rating" value="2" /><label for="star2" title="Meh">2 stars</label>
                        <input type="radio" id="star1" name="rating" value="1" /><label for="star1" title="Bad">1 star</label>
                      </div>
                    </div>
                  </div>
                  <div class="container">
                    <h5 class="ml-n2 mb-4"><strong>Library</strong></h5>
                    <div class="row ml-n1">
                      <button id="library" value="wishlist" class="wishlist lineheight btn btn-primary">Wishlist</button>
                      <p class="arrow-margin"><i class="arrow right"></i></p>
                      <button id="library" value="toread" class="toread lineheight btn btn-primary">To read</button>
                      <p class="arrow-margin"><i class="arrow right"></i></p>
                      <button id="library" value="reading" class="reading lineheight btn btn-primary">Reading</button>
                      <p class="arrow-margin"><i class="arrow right"></i></p>
                      <button id="library" value="read" class="read lineheight btn btn-primary">Read</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-5 container">
            <h3 class="mb-3" style="color:#17a2b8;">Description</h3>
            <p class="mx-auto text-left"> ${result.items[0].volumeInfo.description != undefined ? result.items[0].volumeInfo.description : "No description available."}</p>
          </div>
          <div class="mt-5 mb-3 container">
            <h3 class="mb-3" style="color:#17a2b8;">Reviews</h3>
            <textarea class="textReview" style="overflow:auto;resize:none" rows="10"></textarea>
            <button id="submitReview" type="button" class="mx-0 btn btn-outline-primary">Submit</button>
          </div>
          <div id="reviewsContainer" class="mt-5 container">

          </div>
        `
        history.pushState({ 
          bookId: result.items[0].id,
          bookTitle: result.items[0].volumeInfo.title
        }, null, `/books/${result.items[0].id}`);
        for (let i of response2){
          document.querySelector('#reviewsContainer').innerHTML +=
          `
          <div class="eachreview">
            <a href="/mylibrary/${i.fields.user_id}"  class="mb-4 hover h4">${i.fields.user_id}</a>
            <p class="mt-4 text-left"> ${i.fields.review}</p>
          </div>
          `
        }
        if(document.querySelector(`#star${ratings.rating}`) != null){
          document.querySelector(`#star${ratings.rating}`).checked = true;
        }
        if(document.querySelector(`.${status.status}`) != null) {
          document.querySelector(`.${status.status}`).setAttribute("id", "librarystatus");
          document.querySelector(`.${status.status}`).disabled = true;
        }
  });
}

function rating(rate) {
  let csrftoken = getCookie('csrftoken');
  fetch("/rating", {
    method: 'POST',
    body: JSON.stringify({
      rating: rate,
      bookId: history.state.bookId,
      bookTitle: history.state.bookTitle
    }),
    headers: { "X-CSRFToken": csrftoken }
  })
  .then(response => response.json())
  .then(result => {
    document.querySelector(`.${status.status}`).disabled = true;
  });
}

function review() {
  let csrftoken = getCookie('csrftoken');
  console.log(document.querySelector('.textReview').value )
  if(document.querySelector('.textReview').value !== ""){
    Promise.all([
      fetch("/review", {
        method: 'POST',
        body: JSON.stringify({
          reviewBody: document.querySelector('.textReview').value,
          bookId: history.state.bookId,
          bookTitle: history.state.bookTitle
        }),
        headers: { "X-CSRFToken": csrftoken }
      })
      .then(value => value.json()),
      fetch(`/reviews`,{
        method: 'POST',
        body: JSON.stringify({
          bookId: history.state.bookId,
          bookTitle: history.state.bookTitle
        }),
        headers: { "X-CSRFToken": csrftoken }
      })
      .then(value => value.json())
    ])
    .then(allResponses => {
      const review = allResponses[0]
      const response = allResponses[1]
      document.querySelector('#reviewsContainer').innerHTML = 
        `
        <div class="eachreview">
          <a href="/mylibrary/${review.user}"  class="mb-4 hover h4">${review.user}</a>
          <p class="mt-4 text-left"> ${review.review}</p>
        </div>
        `
      for (let i of response){
        document.querySelector('#reviewsContainer').innerHTML +=
        `
        <div class="eachreview">
            <a href="/mylibrary/${i.fields.user_id}"  class="mb-4 hover h4">${i.fields.user_id}</a>
            <p class="mt-4 text-left"> ${i.fields.review}</p>
        </div>
        `
      }
    });
  }else{
    document.querySelector('.textReview').value = "  Your review cannot be empty."
  }
  
}

function addlibrary(library) {
  let csrftoken = getCookie('csrftoken');
  fetch("/addlibrary", {
    method: 'POST',
    body: JSON.stringify({
      status: library,
      bookId: history.state.bookId,
      bookTitle: history.state.bookTitle
    }),
    headers: { "X-CSRFToken": csrftoken }
  })
  .then(response => response.json())
  .then(result => {
    let status = document.querySelector(`#librarystatus`)
    if(status != null){
      document.querySelector(`#librarystatus`).disabled = false;
      document.querySelector(`#librarystatus`).setAttribute("id", "library");
    }
    document.querySelector(`.${library}`).setAttribute("id", "librarystatus");
    document.querySelector(`.${library}`).disabled = true;
  });
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