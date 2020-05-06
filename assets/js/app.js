const aptElement = document.querySelector('.apt')
const btnProximo = document.querySelector('.btnProximo')
const btnAnterior = document.querySelector('.btnAnterior')
let pgAtual = 1

const apiUrl = 'https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72'

const fetchData = async url => {
   const response = await fetch(url)
   return await response.json()
}
/*
const insertBnbIntoPage = (data) => {

  aptElement.innerHTML = data.map(({ photo, property_type, name, price }) => 
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
*/

const insertItemsIntoPage = (items) => {
   aptElement.innerHTML = items.map(({ photo, property_type, name, price }) => 
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
  ).join('')
}

const listItems = (items, paginaAtual, limite=4) => {
   const resultado = []
   let totalPaginas = Math.ceil(items.length / limite)
   let contador = (paginaAtual * limite) - limite
   let delimitador = contador + limite
   
   if (paginaAtual <= totalPaginas) {
      for (let i = contador; i < delimitador; i++) {
         if (items[i] != null) {
            resultado.push(items[i])
         }
         contador++
      }
   }
   
   return resultado
}

btnProximo.addEventListener('click', event => {   
   if (pgAtual < 6) {
      pgAtual++
      getData()
   }   
})

btnAnterior.addEventListener('click', () => {
   if (pgAtual > 1) {
      pgAtual--
      getData()
   }
})

const getData = async () => {
   const data = await fetchData(apiUrl)
   const items = listItems(data, pgAtual)   
   insertItemsIntoPage(items)
}

getData()