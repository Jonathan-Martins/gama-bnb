const aptElement = document.querySelector('.apt')
const btnProximo = document.querySelector('.btnProximo')
const btnAnterior = document.querySelector('.btnAnterior')
const btnSearch = document.querySelector('.btnSearch')
const inputEl = document.querySelector('input[name="search"')
let pgAtual = 1

const apiUrl = 'https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72'

const fetchData = async url => {
   const response = await fetch(url)
   return await response.json()
}

const insertItemsIntoPage = (items) => {
   aptElement.innerHTML = items.map(({ photo, property_type, name, price }) => 
      `<li class="card">
         <div class="card-img">
            <img src="${photo}">
         </div>
         <div class="card-content">
            <h2 class="card-title">${name}</h2>
            <p class="card-subtitle">${property_type}</p>
            <p class="price">${price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
         </div>
      </li>`
  ).join('')
}

const filterItens = async (name) => {   
   const data = await fetchData(apiUrl)
   /*const item = data.filter((item) => item.name === name)*/
   const item = data.filter(item => {
      return (item.name.toLowerCase().indexOf(name) > -1)
   })
   
   if (item.length === 0) {
      alert('Nenhum item encontrado.')     
      return
   }
   insertItemsIntoPage(item)
}

btnSearch.addEventListener('click', () => {
   const name = inputEl.value.trim()
   filterItens(name)
   inputEl.value = ''
   inputEl.focus()
})

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