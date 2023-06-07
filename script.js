const transactionUl = document.querySelector ('#transactions');
const incomeDisplay = document.querySelector ('#money-plus');
const expenseDisplay = document.querySelector ('#money-minus');
const balanceDisplay = document.querySelector ('#balance');
const form = document.querySelector ('#form');
const inputTransactionName = document.querySelector ('#text');
const inputTransactionLiters = document.querySelector ('#liters');
const inputTransactionAmount = document.querySelector ('#amount');
const searchInput = document.querySelector ('#searchInput');


// Método para salvar as informações no localStorage
const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'));
let transactions = localStorage
.getItem('transactions') !== null ? localStorageTransactions : []

// Método para remover uma transação
const removeTransaction = ID => {
    transactions = transactions.filter(transaction => 
    transaction.id !== ID);
    updateLocalStorage();
    init();
} // removeTransaction;

// Método de adicionar uma transação
const addTransactionIntoDOM = ({ residencial, comercial, name, id }) => {
  // Obtendo o operador matemático
const operator = '-';
const CSSClass = 'minus';
const amountWithoutOperator = residencial !== 0 ? Math.abs(residencial) : Math.abs(comercial);

const li = document.createElement('li');
const icon = document.createElement('i');

// Ícone de fábrica para "comercial"
if (CSSClass === 'minus' && amountWithoutOperator === comercial) {
  icon.classList.add('fas', 'fa-industry');
} 

// Ícone de casa para "residencial"
if (CSSClass === 'minus' && amountWithoutOperator === residencial) {
  icon.classList.add('fas', 'fa-home');
}

  
    li.classList.add(CSSClass);
    li.innerHTML = 
    ` 
    ${name} 
    <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
    `
    transactionUl.append(li);
    li.appendChild(icon);   
} // addTranscationIntoDOM;

// Método de recepimento de valores das despesas das transações
const getExpenses = transactionAmounts => Math.abs(transactionAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0))
  .toFixed(2); // getExpenses();

// Método reduce reduz o "array" para um único componente

// Método filter retorna um novo array que o filter estar gerando. O Método icome gerar um novo array usando o filter somanto os valores positivos
const getIncome = transactionAmounts => transactionAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
  .toFixed(2); //getIncome();

// Método para exibir o soldo total
const getTotal = transactionLiters =>  transactionLiters
.filter(value => value > 0)
.reduce((accumulator, value) => accumulator + value, 0)

// Método de atualização das informações das transações
const updateBalanceValues = () => {
    const transactionResidencial = transactions.map(({ residencial }) => residencial);
    const transactionComercial = transactions.map(({ comercial }) => comercial);
    const transactionLiters = transactions.map(({ liters }) => liters);
    
    const total = getTotal(transactionLiters);
    
    const income = getIncome(transactionResidencial);
    
    const expense = getIncome(transactionComercial);

    const totalToDisplay = (total * 1000).toString().split('').reverse().map((num, i, arr) => {
      return (i + 1) % 3 == 0 && arr.length > i + 1 ? `.${num}` : num;
    }).reverse().join('');
    
  // Exibindo o soldo total no display
    balanceDisplay.textContent = `Litros ${totalToDisplay }`; 
  // Exibindo o valor total das receitas no display
    incomeDisplay.textContent = `R$ ${income}`;
  // Exibindo o valor total despesas no display
    expenseDisplay.textContent = `R$ ${expense}`;

} // updateBalanceValues();

// A função init que executará o estado de preenchimento das aplicações quando a página for carregada
const init = () => {
    transactionUl.innerHTML = '';
    transactions.forEach(addTransactionIntoDOM);
    updateBalanceValues();
} // init();

init();

// Função que irá inserir as informações no localStorage
const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Função para gerar ID aleatório
const generateID = () => Math.round(Math.random() * 1000);

// Método para adicionar as transações no array
const addToTransactionArray = (transactionName, transactionAmount, transactionLiters) => {
    transactions.push({
    id: generateID(),
    name: transactionName,
    residencial: document.querySelector('input[name="tipo"]:checked').value === 'residencial' ? Number(transactionAmount) : 0,
    comercial: document.querySelector('input[name="tipo"]:checked').value !== 'residencial' ? Number(transactionAmount) : 0,
    liters: Number(transactionLiters)
    });
} // addToTransactionArray();

// Método para limpar os inputs
const clearInputs = () => {
    inputTransactionName.value = '';
    inputTransactionAmount.value = '';
    inputTransactionLiters.value = '';
} // clearInputs();

// Método para adicionar os componentes do form
const handleFormSubmit = event => {
    event.preventDefault();

    const transactionName = inputTransactionName.value.trim();
    const transactionAmount = inputTransactionAmount.value.trim();
    const transactionLiters = inputTransactionLiters.value.trim();
    const transactionType = document.querySelector('input[name="tipo"]:checked');
    const isSomeInputEmpty = transactionName === '' || transactionAmount === '' || transactionLiters  === '' || transactionType === null;

  // Verificando se os inputs estão preenchidos
    if (isSomeInputEmpty) {
    alert('Por favor, preencha todos os campos');
    return;
    }
    
    addToTransactionArray(transactionName, transactionAmount, transactionLiters);
    init();
    updateLocalStorage();
    clearInputs();
    
} // form();

// Método de observação de eventos no form
form.addEventListener('submit', handleFormSubmit)

  const filterTransactions = () => {
    const searchInputValue = searchInput.value;
    const filteredTransactions = transactions.filter(transaction => transaction.name.toLowerCase().match(searchInputValue.toLowerCase()));
    transactionUl.innerHTML = '';
    filteredTransactions.forEach(transaction => addTransactionIntoDOM(transaction));
  }
