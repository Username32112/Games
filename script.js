// ======= Users, Items, Orders =======
let users = [
  {email:"pokhrelryan303@gmail.com", password:"pokhrel1@", role:"admin"},
  {email:"worker1@gmail.com", password:"worker123", role:"worker"},
  {email:"customer1@gmail.com", password:"cust123", role:"customer"}
];

let items = [
  {id:1, name:"Sword", addedBy:"worker1", stock:5},
  {id:2, name:"Shield", addedBy:"worker1", stock:3}
];

let orders = [];
let currentUser = null;

// ======= LOGIN FUNCTION =======
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const user = users.find(u => u.email === email && u.password === password);
  if(!user) return document.getElementById("error").innerText = "Invalid email or password";
  
  currentUser = user;

  if(user.role === "admin") window.location.href = "admin.html";
  else if(user.role === "worker") window.location.href = "worker.html";
  else window.location.href = "customer.html";
}

// ======= ADMIN FUNCTIONS =======
function addWorker(email, password){
  if(!email || !password) return alert("Enter email and password");
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
  tbody.innerHTML = "";
  users.forEach((u,i)=>{
    if(u.role === "worker"){
      tbody.innerHTML += `<tr>
        <td>${u.email}</td>
        <td>
          <button onclick="removeWorker(${i})">Remove</button>
        </td>
      </tr>`;
    }
  });
}

// ======= WORKER FUNCTIONS =======
function addItem(name){
  if(!name) return alert("Enter item name");
  let id = items.length + 1;
  items.push({id,name,addedBy: currentUser.email, stock:5});
  alert("Item added!");
  renderItems();
  renderOrders();
}

function renderOrders(){
  const tbody = document.getElementById("ordersTable");
  if(!tbody) return;
  tbody.innerHTML = "";
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

function updateShipping(index, status){
  if(!orders[index]) return alert("Invalid order");
  orders[index].shipping = status;
  renderOrders();
}

// ======= CUSTOMER FUNCTIONS =======
function renderItems(){
  const tbody = document.getElementById("itemsTable");
  if(!tbody) return;
  tbody.innerHTML = "";
  items.forEach((i)=>{
    tbody.innerHTML += `<tr>
      <td>${i.name}</td>
      <td>${i.addedBy}</td>
      <td>${i.stock}</td>
      <td><button onclick="orderItem(${i.id})">Order</button></td>
    </tr>`;
  });
}

function orderItem(itemId){
  let item = items.find(i=>i.id===itemId);
  if(!item || item.stock <=0) return alert("Item not available");
  item.stock -=1;
  orders.push({customer: currentUser.email, item:item.name, shipping:"Pending"});
  alert("Ordered "+item.name);
  renderItems();
  renderOrders();
}
