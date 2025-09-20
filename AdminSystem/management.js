function addName() {
    var name = document.sample.name.value.trim();
    var description = document.sample.description.value.trim();
    var quantity = document.sample.quantity.value.trim();
    var imageFile = document.sample.image.files[0];

    if (name === "" || description === "" || quantity === "" || !imageFile) {
        alert("Please enter Name, Description, Quantity, and choose an Image.");
        return;
    }

    var tr = document.createElement('tr');

    var tdImg = tr.appendChild(document.createElement('td'));
    var tdName = tr.appendChild(document.createElement('td'));
    var tdDesc = tr.appendChild(document.createElement('td'));
    var tdQty = tr.appendChild(document.createElement('td'));
    var tdEdit = tr.appendChild(document.createElement('td'));
    var tdDel = tr.appendChild(document.createElement('td'));

    var img = document.createElement('img');
    img.src = URL.createObjectURL(imageFile);
    img.width = 50;
    img.height = 50;
    tdImg.appendChild(img);

    tdName.textContent = name;
    tdDesc.textContent = description;
    tdQty.textContent = quantity;

    tdEdit.innerHTML = '<input type="button" value="Edit" onclick="editName(this);" class="btn btn-warning">';
    tdDel.innerHTML = '<input type="button" value="Delete" onclick="delName(this);" class="btn btn-danger">';

    document.querySelector("#tb1 tbody").appendChild(tr);

    document.sample.name.value = "";
    document.sample.description.value = "";
    document.sample.quantity.value = "";
    document.sample.image.value = "";
}

function delName(btn) {
    var row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function editName(btn) {
    var row = btn.parentNode.parentNode;
    var nameCell = row.cells[1];     
    var descCell = row.cells[2];     
    var quantityCell = row.cells[3]; 

    var newName = prompt("Enter new Name:", nameCell.textContent);
    var newDesc = prompt("Enter new Description:", descCell.textContent);
    var newQuantity = prompt("Enter new Quantity:", quantityCell.textContent);

    if (
        newName !== null && newName.trim() !== "" &&
        newDesc !== null && newDesc.trim() !== "" &&
        newQuantity !== null && newQuantity.trim() !== ""
    ) {
        nameCell.textContent = newName.trim();
        descCell.textContent = newDesc.trim();
        quantityCell.textContent = newQuantity.trim();
    } else {
        alert("Update canceled or invalid input.");
    }
}
