let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const form = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const emptyMessage = document.getElementById("emptyMessage");
const filterCategory = document.getElementById("filterCategory");

const totalExpense = document.getElementById("totalExpense");
const totalTransactions = document.getElementById("totalTransactions");
const averageExpense = document.getElementById("averageExpense");

// Today's date
document.getElementById("expenseDate").valueAsDate = new Date();


// Add Expense
form.addEventListener("submit", function(event) {

  event.preventDefault();

  const name = document.getElementById("expenseName").value.trim();
  const amount = Number(
    document.getElementById("expenseAmount").value
  );
  const category = document.getElementById("expenseCategory").value;
  const date = document.getElementById("expenseDate").value;

  const expense = {
    id: Date.now(),
    name: name,
    amount: amount,
    category: category,
    date: date
  };

  expenses.push(expense);

  saveExpenses();

  form.reset();

  document.getElementById("expenseDate").valueAsDate = new Date();

  displayExpenses();
});


// Filter
filterCategory.addEventListener("change", displayExpenses);


// Save expenses
function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}


// Delete expense
function deleteExpense(id) {

  expenses = expenses.filter(function(expense) {
    return expense.id !== id;
  });

  saveExpenses();

  displayExpenses();
}


// Display expenses
function displayExpenses() {

  const selectedCategory = filterCategory.value;

  let filteredExpenses = expenses;

  if (selectedCategory !== "All") {

    filteredExpenses = expenses.filter(function(expense) {
      return expense.category === selectedCategory;
    });

  }

  expenseList.innerHTML = "";

  if (filteredExpenses.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }


  filteredExpenses
    .slice()
    .reverse()
    .forEach(function(expense) {

      const item = document.createElement("div");

      item.className = "expense-item";

      item.innerHTML = `
        <div class="expense-info">

          <h3>${escapeHTML(expense.name)}</h3>

          <p>
            ${expense.category} • ${expense.date}
          </p>

        </div>

        <div class="expense-right">

          <span class="amount">
            ₹${expense.amount.toFixed(2)}
          </span>

          <button
            class="delete-btn"
            onclick="deleteExpense(${expense.id})">
            Delete
          </button>

        </div>
      `;

      expenseList.appendChild(item);

    });

  updateSummary();
}


// Summary
function updateSummary() {

  const total = expenses.reduce(function(sum, expense) {
    return sum + expense.amount;
  }, 0);

  const count = expenses.length;

  const average = count > 0 ? total / count : 0;

  totalExpense.textContent = `₹${total.toFixed(2)}`;

  totalTransactions.textContent = count;

  averageExpense.textContent = `₹${average.toFixed(2)}`;
}


// Security helper
function escapeHTML(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}


// Initial display
displayExpenses();
