const ulElement = document.querySelector('.apt') // Selecionando a ul com a classe apt
const btnProximo = document.querySelector('.btnProximo') // selecionando o botão "próximo"
const btnAnterior = document.querySelector('.btnAnterior')  // selecionando o botão "anterior"
const btnSearch = document.querySelector('.btnSearch') // selecionando o botão "buscar"
const inputSearch = document.querySelector('input[name="search"]') 
const inputEl = document.querySelector('input[name="search"') // selecionando o input name="search"
const inputCheckIn = document.querySelector('#check-in') // selecionando o input com a classe check-in
const inputCheckOut = document.querySelector('#check-out') // selecionando o input com a classe check-in
const btnCalendar = document.querySelector('.btnCalendar') // selecionando o botão "calcular"

let pgAtual = 1 // Variavel que indica a página atual



const apiUrl = 'https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72'

const fetchData = async url => {
   const response = await fetch(url)
   return await response.json()
}

/* Gera os cards de itens na página. 
   Recebe dois parâmetros: items(Array), dias(Number)
   items é um array de objetos vindos da api contendo as seguintes propriedades: 
   {
      photo,
      property_name,
      name,
      price
   }
   photo: foto do local; property_name: qual o tipo do local. ex: casa, apartamento;
   name: nome do lugar; price: preço de estadia.
*/
const generateHTML = (items, dias=1) => {
   /* Returna o resultado da função map para colocar cada item do array recebido dentro 
      de uma <li> da classe "card".
   */ 
   return items.map(({ photo, property_type, name, price }) => 
      `<li class="card">
         <div class="card-img">
            <img src="${photo}">
         </div>
         <div class="card-content">
            <h2 class="card-title">${name}</h2>
            <p class="card-subtitle">${property_type}</p>
            <p class="price">Diaria: ${price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            <p class="price">Total: ${Intl.NumberFormat('pt-BR', { style: 'currency',currency: 'BRL'}).format(price*dias)}</p>
         </div>
      </li>`
   ).join('')
}

// Função que insere os itens na página
const insertItemsIntoPage = (items) => {
   // Coloca o resultado da função generateHTML dentro da <ul class="apt"> 
   ulElement.innerHTML = generateHTML(items)   
}

// Filtra os itens da página.
const filterItens = async (name) => {
   // recebendo os dados da api  
   const data = await fetchData(apiUrl)
   /* Filtrando o array de recebido */
   const items = data.filter(item => {
      /* Retornando pra um novo array todos os itens que possuem os
         mesmos caracteres do valor informado no input
      */
      return (item.name.toLowerCase().indexOf(name.toLowerCase()) > -1)
   })
   // Verificando se o array está vazio. Se sim emite um alert e encerra a função
   if (items.length === 0) {
      alert('Nenhum item encontrado.')     
      return
   }
   // Insere os itens encontrados na página
   insertItemsIntoPage(items)
}

// Atualiza o preço do aluguel de acordo com o período de tempo marcado.
const insertTotalRentItemsIntoPage = (itens, dias) => {
   // coloca na <ul class="apt"> os itens com os novos preços
   ulElement.innerHTML = generateHTML(itens, dias)
}


// Função que retorna a diferença entre duas datas(entrada - saída)
const checkRent = (checkIn, checkOut) => {
   /** As duas primeiras linhas criam objetos do tipo Date
    *  usando como argumento checkIn e checkOut que são recebimentos
    *  parâmetro.
    */
   const entrada = new Date(checkIn)
   const saida = new Date(checkOut)
   // diff recebe a diferença em milissegundos entre as duas datas. Math.abs
   // é usado para termos o valor absoluto dessa conta.
   const diff = Math.abs(saida.getTime() - entrada.getTime())
   // dias recebe a conversão do valor obtido em diff para dias.
   // Math.ceil é usado para termos o menor número inteiro próximo a expressão usada como argumento. 
   const dias = Math.ceil(diff / (1000 * 60 * 60 * 24))
   return dias
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

// Função com lógica interna do botão "próxima"
const handleNextPage = () => {
   if (pgAtual < 6) {
      pgAtual++
      getData()
      scroll(0, 100)
   }   
}

// Função com a lógica interna do botão "anterior"
const handlePreviousPage = () => {
   if (pgAtual > 1) {
      pgAtual--
      getData()
      scroll(0, 100)
   }
}

// Função com a lógica interna do botão de busca
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

// Função com a lógica interna do botão para calcular o preço dos alugueis
const handleCheckInCheckOut = async () => {
   // Recebendo os valores dos inputs do tipo date que representam check-in e check-out
   const checkIn = inputCheckIn.value
   const checkOut = inputCheckOut.value

   // Se o valor de um dos dois inputs for nulo a função é encerrada.
   if (!checkIn || !checkOut) return

   /* A const dias recebe a diferença entre a data entrada(check-in) e 
      a data de saída(check-out). Este valor é um Number*/
   const dias = checkRent(checkIn, checkOut)

   // data armazena um array com os dados vindos da api.
   const data = await fetchData(apiUrl)

   // insertTotalRentItemsIntoPage insere os itens na página com 
   // o valor a ser pago proporcional ao período em dias. 
   insertTotalRentItemsIntoPage(data, dias)
}

// Listener que espera um clique no botão "próximo"
btnProximo.addEventListener('click', handleNextPage)

// Listener que espera um clique no botão "anterior"
btnAnterior.addEventListener('click', handlePreviousPage)

// Listener que espera o clique no botão "Buscar"
btnSearch.addEventListener('click', handleSearch)

inputSearch.addEventListener('keydown', e => {
   if (e.keyCode === 13) {
      handleSearch()
   }
})

// Listener que espera o clieque no botão "calcular"
btnCalendar.addEventListener('click', handleCheckInCheckOut)

const getData = async () => {
   // recebendo os dados da api.  
   const data = await fetchData(apiUrl)
   // Fazendo a páginação. Dividindo o array em 6 págs de 4 itens.
   const items = listItems(data, pgAtual)
   // Inserindo os itens na página.
   insertItemsIntoPage(items)
}

getData()