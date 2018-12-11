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
    });

    function setValues(res) {

        for(let prop in res) {
            if (prop !== null) {
                console.log('prop', res, res[prop])
                document.getElementById(prop.toString()).value = res[prop]
            }
        }

    }

    function handleResponse(result) {

        let container = document.getElementById('container');
        container.innerHTML += result;

    }

    function sendFormData() {
        let payload = {
            name: '',
            age: '',
            email: '',
        }

        for(let prop in payload) {
            payload[prop] = document.getElementById(prop).value
        }

        // console.log(payload)

        fetch("/update/user/" + document.getElementById('idstorage').value ,
        {
            method: "PUT",
            body: JSON.stringify( payload ),
            headers: new Headers({
                'Content-Type': 'application/json'
              }),
        })
        .then(function(res){
            return res.text();
        })
        .then(function(data){
            console.log('fetch resp', data)
            handleResponse(data)
        }).then(function (data) {
            setValues(payload)
        })
     }
});

