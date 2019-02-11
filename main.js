function fetchEmployees(employees) {

    console.log(employees)

    var container = document.getElementById("container");
    var containerHtml = container.innerHTML;
    for (var index = 0; index < employees.length; index++) {
        var employee = employees[index];
        var html = '<section id ="' + employee.id + '">\
                    <div class="item">\
                        <h4>'+ employee.name + '</h4>\
                        <h5>'+ employee.contact + '</h5>\
                        <p>$'+ employee.salary + '</p>\
                    </div>\
                    <button class="dltBtn" onclick="deleteIt('+ employee.id + ')">Delete</button>\
                    <button class="editBtn"  data-toggle="modal" data-target="#myModal" \
                    onclick="editIt('+ employee.id + ')">Edit</button>\
                    <button class="viewBtn" data-toggle="modal" data-target="#myModal2" onclick="viewIt('+ employee.id + ')">View</button>\
                </section>';
        containerHtml += html;
    }

    container.innerHTML = containerHtml;
}

function deleteIt(id) {
    var x = document.getElementById(id);
    x.parentNode.removeChild(x);
    var dltSrvrRqst = new XMLHttpRequest;
    dltSrvrRqst.open("DELETE", "http://localhost:3000/employees/" + id, true);
    dltSrvrRqst.send()
}

function editIt(id) {
    if (id == undefined || id === "") {
        document.getElementById('employee').value = '';
        document.getElementById('contact').value = '';
        document.getElementById('salary').value = '';
        document.getElementById('employee-id').value = '';
    } else {
        serverRequest = new XMLHttpRequest;
        serverRequest.open("GET", "http://localhost:3000/employees/" + id, true);
        serverRequest.send();
        serverRequest.onreadystatechange = function () {
            if (serverRequest.readyState == 4 && serverRequest.status == 200) {
                var srvrresponse = JSON.parse(this.responseText)
                document.getElementById('employee').value = srvrresponse.name;
                document.getElementById('contact').value = srvrresponse.contact;
                document.getElementById('salary').value = srvrresponse.salary;
                document.getElementById('employee-id').value = id;
            }

        }

    }
}

function viewIt(id) {
    serverRequest = new XMLHttpRequest;
    serverRequest.open("GET", "http://localhost:3000/employees/" + id, true);
    serverRequest.send();
    serverRequest.onreadystatechange = function () {
        srvrresponse = JSON.parse(this.responseText)
        document.getElementById('modal2').innerHTML =
            srvrresponse.name + '<br>' +
            srvrresponse.contact + '<br>' +
            "$" + srvrresponse.salary

    }

}

function saveIt() {
    var id = document.getElementById('employee-id').value;
    var employeeObj = {
        name: document.getElementById('employee').value,
        contact: document.getElementById('contact').value,
        salary: document.getElementById('salary').value
    }

    var employeeDataToServer = JSON.stringify(employeeObj);
    serverRequest = new XMLHttpRequest;
    if (id === null || id === undefined || id === '') {
        serverRequest.open("POST", "http://localhost:3000/employees", true);
        serverRequest.send(employeeDataToServer);
        serverRequest.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 201) {
                window.alert("Employee Added Successfully.");
                document.getElementById("container").innerHTML = ''
                getEmployeesData()
                editIt(undefined)
            }
        }
    } else {
        employeeObj.id = id;

        serverRequest.open("PUT", "http://localhost:3000/employees/" + id, true);
        serverRequest.send(employeeDataToServer);
        serverRequest.onreadystatechange = function () {
            if (readyState == 4 && status == 200) {
                window.alert("Employee Modified Successfully.");
                document.getElementById("container").innerHTML = ''
                getEmployeesData()
                editIt(undefined)
            }
        }
    }

}

function getEmployeesData() {
    var serverRequest = new XMLHttpRequest();
    serverRequest.open("GET", "http://localhost:3000/employees", true);
    serverRequest.send()
    serverRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var employees = JSON.parse(this.responseText);
            fetchEmployees(employees)
        }
    }
}

getEmployeesData() 
