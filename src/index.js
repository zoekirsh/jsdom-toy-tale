let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  fetchAllToys();
  addEvents();

  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  //GET
  function fetchAllToys() {
    fetch('http://localhost:3000/toys')
    .then (res => res.json())
    .then (toys => {
      toys.forEach(toy => renderToys(toy))
    })
  }

  function renderToys(toy) {
    const toyDiv = document.getElementById('toy-collection')
    const cardDiv = document.createElement('div')
    const toyImg = document.createElement('img')
    const toyName = document.createElement('h2')
    const toyLikes = document.createElement('p')
    const likeBtn = document.createElement('button')

    toyName.textContent = toy.name;
    toyImg.src = toy.image;
    toyImg.style.width = '200px';
    toyImg.className = "toy-avatar"
    toyLikes.textContent = `${toy.likes} likes`;
    likeBtn.className = "like-btn";
    likeBtn.textContent = "Like ❤️"
    likeBtn.addEventListener("click", patchToy)

    cardDiv.className = "card";
    cardDiv.id = toy.id;

    cardDiv.append(toyName, toyImg, toyLikes, likeBtn)
    toyDiv.appendChild(cardDiv)
  }

  //POST 
  function postToy(toy) {
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(toy)
    })
    .then(res => res.json())
    .then(toy => {
      renderToys(toy)
    })
    .catch(error => console.log(error))
  }

  //PATCH
  function patchToy(e) {
    const id = e.target.parentElement.id
    const newLikes = parseInt(e.target.parentElement.querySelector('p').textContent.split(" ")[0])+1
    
    fetch(`http://localhost:3000/toys/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        "likes": newLikes
      })
    })
    .then(res => res.json())
    .then(toy => {
      document.getElementById(toy.id).querySelector('p').textContent = `${toy.likes} likes`
    })
    .catch(error => console.log(error))
  }

  //Event Handlers
  function handleSubmit(e) {
    e.preventDefault()
    let toy = {
      "name": e.target.name.value,
      "image": e.target.image.value,
      "likes": 0
    }
    postToy(toy) 
    document.querySelector('form').reset();
  }

  //Events
  function addEvents() {
    let form = document.querySelector('form')

    form.addEventListener("submit", handleSubmit)

  }
});
