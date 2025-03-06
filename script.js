document.addEventListener("DOMContentLoaded", function () {
    const descriptionInput = document.getElementById("description");
    const amountInput = document.getElementById("amount");
    const typeInput = document.getElementById("type");
    const addButton = document.getElementById("add-btn");
    const resetButton = document.getElementById("reset-btn");
    const entriesList = document.getElementById("entries-list");
    const totalIncomeElem = document.getElementById("total-income");
    const totalExpenseElem = document.getElementById("total-expense");
    const netBalanceElem = document.getElementById("net-balance");
    const filters = document.getElementsByName("filter");

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    function updateSummary() {
        let totalIncome = transactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);

        let totalExpense = transactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);

        totalIncomeElem.textContent = totalIncome;
        totalExpenseElem.textContent = totalExpense;
        netBalanceElem.textContent = totalIncome - totalExpense;
    }

    function renderTransactions(filter = "all") {
        entriesList.innerHTML = "";

        let filteredTransactions = transactions.filter((t) =>
            filter === "all" ? true : t.type === filter
        );

        filteredTransactions.forEach((transaction, index) => {
            const li = document.createElement("li");
            li.classList.add("entry", transaction.type);
            li.innerHTML = `
                ${transaction.description}: ₹${transaction.amount}
                <button onclick="editTransaction(${index})">✏️</button>
                <button onclick="deleteTransaction(${index})">❌</button>
            `;
            entriesList.appendChild(li);
        });

        updateSummary();
    }

    addButton.addEventListener("click", function () {
        const description = descriptionInput.value.trim();
        const amount = parseFloat(amountInput.value.trim());
        const type = typeInput.value;

        if (description === "" || isNaN(amount) || amount <= 0) {
            alert("Please enter valid details.");
            return;
        }

        transactions.push({ description, amount, type });
        localStorage.setItem("transactions", JSON.stringify(transactions));

        descriptionInput.value = "";
        amountInput.value = "";
        renderTransactions();
    });

    resetButton.addEventListener("click", function () {
        descriptionInput.value = "";
        amountInput.value = "";
    });

    window.deleteTransaction = function (index) {
        transactions.splice(index, 1);
        localStorage.setItem("transactions", JSON.stringify(transactions));
        renderTransactions();
    };

    window.editTransaction = function (index) {
        const transaction = transactions[index];

        descriptionInput.value = transaction.description;
        amountInput.value = transaction.amount;
        typeInput.value = transaction.type;

        deleteTransaction(index);
    };

    filters.forEach((filter) => {
        filter.addEventListener("change", function () {
            renderTransactions(this.value);
        });
    });

    renderTransactions();
});
