const amount = document.getElementById("amount");
const balance = document.getElementById("balance");
const expenditure = document.getElementById("expenses");
const form = document.getElementById("form");
const incomingCash = document.getElementById("income");
const list = document.getElementById("list");
const text = document.getElementById("text");

const localStorageTransactions = JSON.parse(
	localStorage.getItem("transactions")
);
let transactions =
	localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

//Add transaction
function addTransaction(e) {
	e.preventDefault();
	if (text.value.trim() === "" || amount.value.trim() === "") {
		alert("Please add a text and amount");
	} else {
		const transaction = {
			id: generateID(),
			text: text.value,
			amount: +amount.value,
		};

		transactions.push(transaction);
		addTransactionDOM(transaction);
		updateValues();

		updateLocalStorage();

		text.value = "";
		amount.value = "";
	}
}

//Generate random ID
function generateID() {
	return Math.floor(Math.random() * 100000000);
}

//Add transactions to DOM list
function addTransactionDOM(transaction) {
	//Get sign
	const sign = transaction.amount < 0 ? "-" : "+";

	const item = document.createElement("li");

	//Add class based on value
	item.classList.add(transaction.amount < 0 ? "minus" : "plus");

	item.innerHTML = `${transaction.text}<span>${sign}${Math.abs(
		transaction.amount
	)}</span><button class="delete-btn" onclick="removeTransaction(${
		transaction.id
	})">X</button>
  `;

	list.appendChild(item);
}

//update the balance, income and expense
function updateValues() {
	const amounts = transactions.map((transaction) => transaction.amount);
	const total = amounts
		.reduce((acc, item) => Number(acc) + Number(item), 0)
		.toFixed(2);

	const income = amounts
		.filter((item) => item > 0)
		.reduce((acc, item) => Number(acc) + Number(item), 0)
		.toFixed(2);

	const expense = (
		amounts
			.filter((item) => item < 0)
			.reduce((acc, item) => Number(acc) + Number(item), 0) * -1
	).toFixed(2);

	balance.innerText = `$${total}`;
	incomingCash.innerText = `$${income}`;
	expenditure.innerText = `$${expense}`;
}

//Remove transaction by ID
function removeTransaction(id) {
	transactions = transactions.filter((transaction) => transaction.id !== id);

	updateLocalStorage();
	init();
}
//Init app
function init() {
	list.innerHTML = "";

	transactions.forEach(addTransactionDOM);
	updateValues();
}

//Update local storage transactions
function updateLocalStorage() {
	localStorage.setItem("transactions", JSON.stringify(transactions));
}

init();

form.addEventListener("submit", addTransaction);
