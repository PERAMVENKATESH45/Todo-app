let entries = JSON.parse(localStorage.getItem('entries')) || [];

function updateUI() {
    const totalIncome = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
    const totalExpense = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
    const balance = totalIncome - totalExpense;
    
    document.getElementById('total-income').textContent = totalIncome;
    document.getElementById('total-expense').textContent = totalExpense;
    document.getElementById('net-balance').textContent = balance;
    
    filterEntries();
    localStorage.setItem('entries', JSON.stringify(entries));
}

function addEntry() {
    const desc = document.getElementById('desc').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    if (!desc || isNaN(amount) || amount <= 0) return;
    
    entries.push({ id: Date.now(), desc, amount, type });
    document.getElementById('desc').value = '';
    document.getElementById('amount').value = '';
    updateUI();
}

function deleteEntry(id) {
    entries = entries.filter(e => e.id !== id);
    updateUI();
}

function editEntry(id) {
    const entry = entries.find(e => e.id === id);
    document.getElementById('desc').value = entry.desc;
    document.getElementById('amount').value = entry.amount;
    document.getElementById('type').value = entry.type;
    deleteEntry(id);
}

function filterEntries() {
    const filter = document.querySelector('input[name="filter"]:checked').value;
    const list = document.getElementById('entries-list');
    list.innerHTML = '';
    entries.filter(e => filter === 'all' || e.type === filter).forEach(entry => {
        list.innerHTML += `
            <li>
                <span>${entry.desc} - $${entry.amount} (${entry.type})</span>
                <div>
                    <button onclick="editEntry(${entry.id})">Edit</button>
                    <button onclick="deleteEntry(${entry.id})">Delete</button>
                </div>
            </li>`;
    });
}

updateUI();
