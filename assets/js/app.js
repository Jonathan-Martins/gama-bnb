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

/* Função que insere os itens na página. Recebe como parâmetro um array de objetos.
   {
      photo,
      property_name,
      name,
      price
   }
   photo: foto do local; property_name: qual o tipo do local. ex: casa, apartamento;
   name: nome do lugar; price: preço de estadia.
*/
const insertItemsIntoPage = (items) => {
   /* Usando a função map para colocar cada item do array recebido dentro 
      de uma <li> da classe "card" e em seguida adicioná-la a <ul> aptElement.
   */ 
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
   // recebendo os dados da api  
   const data = await fetchData(apiUrl)
   /* Filtrando o array de recebido */
   const items = data.filter(item => {
      /* Retornando pra um novo array todos os itens que possuem os
         mesmos caracteres do valor informado no input
      */
      return (item.name.toLowerCase().indexOf(name) > -1)
   })
   // Verificando se o array está vazio. Se sim emite um alert e encerra a função
   if (items.length === 0) {
      alert('Nenhum item encontrado.')     
      return
   }
   // Insere os itens encontrados na página
   insertItemsIntoPage(items)
}

const handleSearch = () => {
   // name recebe o valor do input de texto "search" sem espaços no ínicio e no fim.
   const name = inputEl.value.trim()
   // invocação da função filterItens() passando name como parâmetro de busca
   filterItens(name)
   // O input recebe o valor vazio
   inputEl.value = ''
   // O foco vai para o input "search"
   inputEl.focus()
}

// Listener que espera o clique no botão "Buscar"
btnSearch.addEventListener('click', handleSearch)

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

const handleNextPage = () => {
   if (pgAtual < 6) {
      pgAtual++
      getData()
   }   
}

const handlePreviousPage = () => {
   if (pgAtual > 1) {
      pgAtual--
      getData()
   }
}

btnProximo.addEventListener('click', handleNextPage)

btnAnterior.addEventListener('click', handlePreviousPage)

const getData = async () => {
   // recebendo os dados da api.  
   const data = await fetchData(apiUrl)
   // Fazendo a páginação. Dividindo o array em 6 págs de 4 itens.
   const items = listItems(data, pgAtual)
   // Inserindo os itens na página.
   insertItemsIntoPage(items)
}

getData()