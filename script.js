// Users, Items, Orders
let users = [
  {email:"pokhrelryan303@gmail.com", password:"pokhrel1@", role:"admin"},
  {email:"worker1@gmail.com", password:"worker123", role:"worker"},
  {email:"customer1@gmail.com", password:"cust123", role:"customer"}
];

let items = [
  {id:1, name:"Sword", addedBy:"worker1@gmail.com", stock:5},
  {id:2, name:"Shield", addedBy:"worker1@gmail.com", stock:3}
];

let orders = [];
let currentUser = null;

// ===== LOGIN =====
function login(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const user = users.find(u=>u.email===email && u.password===password);
  if(!user) return document.getElementById("error").innerText = "Invalid email or password";
  currentUser = user;

  if(user.role==="admin") window.location.href="admin.html";
  else if(user.role==="worker") window.location.href="worker.html";
  else window.location.href="customer.html";
}

// ===== SIGN UP =====
function signUp(){
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  if(!email || !password) return alert("Enter email & password");
  if(users.find(u=>u.email===email)) return alert("Email exists");
  users.push({email,password,role:"customer"});
  alert("Signed up! Login now.");
}

// ===== ADMIN FUNCTIONS =====
function addWorker(email,password){
  if(!email || !password) return alert("Enter email & password");
  users.push({email,password,role:"worker"});
  renderWorkers();
}

function removeWorker(index){
  if(confirm("Remove this worker?")){
    users.splice(index,1);
    renderWorkers();
  }
}

function renderWorkers(){
  const tbody = document.getElementById("workersTable");
  if(!tbody) return;
  tbody.innerHTML="";
  users.forEach((u,i)=>{
    if(u.role==="worker"){
      tbody.innerHTML += `<tr>
        <td>${u.email}</td>
        <td><button onclick="removeWorker(${i})">Remove</button></td>
      </tr>`;
    }
  });
}

// ===== WORKER FUNCTIONS =====
function addItem(name, stock){
  if(!name || !stock) return alert("Enter name and stock");
  let id = items.length +1;
  items.push({id,name,addedBy:currentUser.email, stock:parseInt(stock)});
  alert("Item added!");
  renderWorkerItems();
  renderOrders();
}

function renderWorkerItems(){
  const container = document.getElementById("workerItems");
  if(!container) return;
  container.innerHTML="";
  items.forEach(item=>{
    if(item.addedBy===currentUser.email){
      container.innerHTML += `
      <div class="card">
        <h3>${item.name}</h3>
        <p>Stock: ${item.stock}</p>
        <input type="number" id="stock${item.id}" placeholder="Add Stock" min="1">
        <button onclick="updateStock(${item.id}, document.getElementById('stock${item.id}').value)">Update Stock</button>
      </div>
      `;
    }
  });
}

function updateStock(itemId, addedStock){
  let item = items.find(i=>i.id===itemId);
  if(!item || !addedStock) return alert("Invalid input");
  item.stock += parseInt(addedStock);
  renderWorkerItems();
  alert(`${item.name} stock updated to ${item.stock}`);
}

// Orders Table for Worker/Admin
function renderOrders(){
  const tbody = document.getElementById("ordersTable");
  if(!tbody) return;
  tbody.innerHTML="";
  orders.forEach((o,i)=>{
    tbody.innerHTML += `<tr>
      <td>${o.customer}</td>
      <td>${o.item}</td>
      <td>${o.shipping}</td>
      <td>
        <input type="text" id="status${i}" placeholder="New Status">
        <button onclick="updateShipping(${i}, document.getElementById('status${i}').value)">Update</button>
      </td>
    </tr>`;
  });
}

function updateShipping(index,status){
  if(!orders[index]) return alert("Invalid order");
  orders[index].shipping = status;
  renderOrders();
}

// ===== CUSTOMER FUNCTIONS =====
function renderItems(){
  const container = document.getElementById("itemsTable");
  if(!container) return;
  container.innerHTML="";
  items.forEach(i=>{
    container.innerHTML += `
    <div class="card">
      <h3>${i.name}</h3>
      <p>Added By: ${i.addedBy}</p>
      <p>Stock: ${i.stock}</p>
      <button onclick="orderItem(${i.id})">Order</button>
    </div>
    `;
  });
}

function orderItem(itemId){
  let item = items.find(i=>i.id===itemId);
  if(!item || item.stock <=0) return alert("Item not available");
  item.stock -=1;
  orders.push({customer:currentUser.email, item:item.name, shipping:"Pending"});
  alert("Ordered "+item.name);
  renderItems();
  renderOrderHistory();
}

function renderOrderHistory(){
  const container = document.getElementById("orderHistory");
  if(!container) return;
  container.innerHTML="<h2>Your Orders</h2>";
  orders.filter(o=>o.customer===currentUser.email).forEach((o,i)=>{
    container.innerHTML += `<p>${i+1}. ${o.item} - ${o.shipping}</p>`;
  });
}
