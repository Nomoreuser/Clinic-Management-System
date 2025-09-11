function addName() {
    var name = document.sample.name.value.trim();
    var quantity = document.sample.quantity.value.trim();

    if (name === "" || quantity === "") {
        alert("Please enter both Name and Quantity.");
        return;
    }

    var tr = document.createElement('tr');

    var td1 = tr.appendChild(document.createElement('td'));
    var td2 = tr.appendChild(document.createElement('td'));
    var td3 = tr.appendChild(document.createElement('td'));

    td1.textContent = name;
    td2.textContent = quantity;
    td3.innerHTML = '<input type="button" value="Delete" onclick="delName(this);" class="btn btn-danger">';

    document.querySelector("#tb1 tbody").appendChild(tr);

    // Clear inputs after adding
    document.sample.name.value = "";
    document.sample.quantity.value = "";
}

function delName(btn) {
    var row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
}
