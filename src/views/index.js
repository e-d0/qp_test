document.addEventListener("DOMContentLoaded", function(event) {
    console.log('done')
    const emailField = document.getElementById('email');
    const sendButton = document.getElementById('send');

    document.addEventListener('keyup', function (event) {
        if(event.target && event.target.id== 'email') {
            isValidEmail = emailField.checkValidity();

            if ( isValidEmail ) {
                sendButton.disabled = false;
            } else {
                sendButton.disabled = true;
            }
        }
    });

    document.addEventListener('click', function (event) {
        if(event.target && event.target.id== 'send') {
            event.preventDefault();
            sendFormData();
            console.log('click');
        }
        if(event.target && event.target.id== 'filter-submit') {
            event.preventDefault();
            sendTableFormData();
            console.log('click form filter');
        }
    });

    function handleResponse(result) {

        let container = document.getElementById('form');
        container.innerHTML += result;

    }

    function sendFormData() {

        let payload = {
            email: '',
            password: ''
        }

        for(let prop in payload) {
            payload[prop] = document.getElementById(prop).value
        }

        console.log(payload)

        fetch("/login",
            {
                method: "POST",
                body: JSON.stringify( payload ),
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
            })
            .then(function(res){
                console.log('resp', res)
                return res.text();
            })
            .then(function(data){

                console.log('fetch resp', data )
                try {
                 return window.location.href = window.location.protocol + '//' + window.location.host + '/cabinet/' + JSON.parse(data).id;
                } catch (e) {
                    handleResponse(data)
                }

            })
    }

    function renderTable(jsonData) {
        let table = document.getElementById('table');
        let tableHeaders = ['name', 'email', 'password', 'age']
        let newTable = document.createElement('table');
        let tbody = document.createElement('tbody');

        newTable.className = "table table-striped"

        let headerRow = document.createElement('tr')
        for (let k = 0; k < tableHeaders.length; k++)
        {
            let cell = document.createElement('th')
            cell.innerHTML =  tableHeaders[k]
            headerRow.appendChild(cell);
        }
        tbody.appendChild(headerRow);
        newTable.appendChild(tbody);

        for (let prop in jsonData) {

            for (let i = 0; i < jsonData[prop].length; i++ ) {
                let row = document.createElement('tr')
                    for (let j = 0; j < tableHeaders.length; j++)
                    {
                        let cell = document.createElement('td')
                        cell.innerHTML = jsonData[prop][i][tableHeaders[j]]
                        row.appendChild(cell);
                    }
                newTable.appendChild(row);
            }

        }

        table.removeChild(document.querySelector("#table table"))
        table.appendChild(newTable);

    }

    function sendTableFormData() {

        let filterWord = document.getElementById('filter-word').value ? document.getElementById('filter-word').value : '';
        let filterField = document.getElementById('filter-field').value ? document.getElementById('filter-field').value : '';
        let sortField = document.getElementById('sort-field').value ? document.getElementById('sort-field').value : '';
        let sortOrder = document.getElementById('sort-order').value ? document.getElementById('sort-order').value : '';

        let filterPayload = {
            filter: {},
            order: []
        }

        if ((filterField && filterWord) !== '') {
            filterPayload.filter[filterField] = filterWord;
        }

        filterPayload.order = [sortField, sortOrder]

        console.log('filter payload', filterPayload)

        fetch("/users",
            {
                method: "POST",
                body: JSON.stringify( filterPayload ),
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
            })
            .then(function(res){
                return res.text();
            })
            .then(function(data){
                console.log('form data accept', JSON.parse(data))
                renderTable(JSON.parse(data))
            })
    }
});
