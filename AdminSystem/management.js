function addName() {
    var name = document.sample.name.value.trim();
    var description = document.sample.description.value.trim();
    var quantity = document.sample.quantity.value.trim();
    var imageFile = document.sample.image.files[0];
    var medicineChecked = document.getElementById("medicine").checked;
    var equipmentChecked = document.getElementById("equipment").checked;

    if (name === "" || description === "" || quantity === "" || !imageFile) {
        alert("Please enter Name, Description, Quantity, and choose an Image.");
        return;
    }

    if (!medicineChecked && !equipmentChecked) {
        alert("Please select either Medicine or Equipment.");
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

    if (medicineChecked) {
        document.querySelector("#tb1 tbody").appendChild(tr);
    } else if (equipmentChecked) {
        document.querySelector("#tb2 tbody").appendChild(tr);
    }

    document.sample.name.value = "";
    document.sample.description.value = "";
    document.sample.quantity.value = "";
    document.sample.image.value = "";
    document.getElementById("medicine").checked = false;
    document.getElementById("equipment").checked = false;
}

document.getElementById("medicine").addEventListener("change", function() {
    if (this.checked) {
        document.getElementById("equipment").checked = false;
    }
});
document.getElementById("equipment").addEventListener("change", function() {
    if (this.checked) {
        document.getElementById("medicine").checked = false;
    }
});

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

        if ( newName !== null && newName.trim() !== "" && newDesc !== null && newDesc.trim() !== "" && newQuantity !== null && newQuantity.trim() !== "" ) { 
            nameCell.textContent = newName.trim();
            descCell.textContent = newDesc.trim();
            quantityCell.textContent = newQuantity.trim();
        } 
            else { alert("Update canceled or invalid input."); } 
}

function searchTable() {
    var searchValue = document.sample.search.value.trim().toLowerCase();

    var rows1 = document.querySelectorAll("#tb1 tbody tr");
    var rows2 = document.querySelectorAll("#tb2 tbody tr");

    [rows1, rows2].forEach(function(rows) {
        rows.forEach(function(row) {
            var nameCell = row.cells[1].textContent.toLowerCase();

            if (nameCell.includes(searchValue) || searchValue === "") {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });

    return false;
}
