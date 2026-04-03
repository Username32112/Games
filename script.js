// Sample initial data
let data = {
  players: {
    "Ryan": ["Sword", "Shield"],
    "Alex": ["Bow"]
  },
  logs: []
};

// DOM references
const playersTable = document.querySelector("#playersTable tbody");
const logsTable = document.querySelector("#logsTable tbody");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.querySelector(".close");

closeModal.onclick = () => modal.style.display = "none";

// Render players dashboard
function renderPlayers() {
  playersTable.innerHTML = "";
  for (let player in data.players) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${player}</td>
      <td>${data.players[player].join(", ") || "-"}</td>
      <td>
        <button onclick="openAddItem('${player}')">Add Item</button>
        <button onclick="openShipItem('${player}')">Ship Item</button>
      </td>
    `;
    playersTable.appendChild(row);
  }
}

// Render logs
function renderLogs() {
  logsTable.innerHTML = "";
  data.logs.forEach(log => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${log.player}</td>
      <td>${log.action}</td>
      <td>${log.item}</td>
      <td>${log.to || "-"}</td>
      <td>${log.date}</td>
    `;
    logsTable.appendChild(row);
  });
}

// Modal forms
function openAddItem(player) {
  modalBody.innerHTML = `
    <h3>Add Item to ${player}</h3>
    <input type="text" id="itemName" placeholder="Item Name">
    <button onclick="addItem('${player}')">Add</button>
  `;
  modal.style.display = "block";
}

function addItem(player) {
  const itemName = document.getElementById("itemName").value;
  if (!itemName) return alert("Enter an item name");
  data.players[player].push(itemName);
  data.logs.push({player, action:"Added", item:itemName, date: new Date().toLocaleString()});
  modal.style.display = "none";
  renderPlayers();
  renderLogs();
}

function openShipItem(player) {
  let items = data.players[player];
  if (items.length === 0) return alert("No items to ship");
  let playerOptions = Object.keys(data.players).filter(p => p !== player);
  modalBody.innerHTML = `
    <h3>Ship Item from ${player}</h3>
    <select id="itemSelect">
      ${items.map(i => `<option value="${i}">${i}</option>`).join('')}
    </select>
    <select id="toPlayer">
      ${playerOptions.map(p => `<option value="${p}">${p}</option>`).join('')}
    </select>
    <button onclick="shipItem('${player}')">Ship</button>
  `;
  modal.style.display = "block";
}

function shipItem(fromPlayer) {
  const item = document.getElementById("itemSelect").value;
  const toPlayer = document.getElementById("toPlayer").value;

  // Remove from sender
  const idx = data.players[fromPlayer].indexOf(item);
  if (idx > -1) data.players[fromPlayer].splice(idx, 1);

  // Add to receiver
  data.players[toPlayer].push(item);

  // Log action
  data.logs.push({player: fromPlayer, action:"Shipped", item, to: toPlayer, date: new Date().toLocaleString()});

  modal.style.display = "none";
  renderPlayers();
  renderLogs();
}

// Initial render
renderPlayers();
renderLogs();
