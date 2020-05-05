const aptElement = document.querySelector('.apt')

const apiUrl = 'https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72'

const fetchData = async url => {
   const response = await fetch(url)
   return await response.json()
}

const insertBnbIntoPage = (data) => {
   aptElement.innerHTML = data.map(({photo, property_type, name, price}) => 
      `<li class="card">
         <div class="card-img">
            <img src="${photo}">
         </div>
         <div class="card-content">
            <h2 class="card-title">${name}</h2>
            <p class="card-subtitle">${property_type}</p>
            <p class="price">R$ ${price}</p>
         </div>
      </li>`
   ) 
}

Promise.resolve(fetchData(apiUrl))
   .then(insertBnbIntoPage)

