function enviarGet(){
    let http = new XMLHttpRequest();

    let mail = document.getElementById("mail").value;
    let pass = document.getElementById("pass").value;

    
// Validar campos vacíos
if (mail === "" || pass === "") {
    document.getElementById("Resultat").innerHTML = 'Por favor, complete todos los campos.';
    return;
}

    http.open("GET","http://localhost:8080/ XatLLM/Login?mail="+mail+"&pass="+pass,true);
    /**metodo ,direccion y asincrono/ */
    
    
    http.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200){
        var response = http.responseText;

        if (response == "Error: No se pudo iniciar sesión") {
          // El login no ha sido correcto
            document.getElementById("Resultat").innerHTML = 'Login erróneo';
        } else {
          // El login ha sido exitoso, obtener el código de sesión
            var sessionCode = response;

          // Almacenar el código de sesión en sessionStorage
            sessionStorage.setItem('session', sessionCode);
            sessionStorage.setItem('mail', mail);

          // Redireccionar a la página "Gestio.html"
            
        }
        } else {
        console.error('Error en la petición al backend:', http.status);
        }
    }

    http.send();
}




function enviarPost(){
    let http = new XMLHttpRequest();

    let mail = document.getElementById("mail").value;
    let pass = document.getElementById("pass").value;
    http.open("POST","http://localhost:3006/Dam_tomcat/Login",true);
    http.setRequestHeader("content-Type","application/x-www-form-urlencoded");
    http.send("mail="+mail+"&pass="+pass);
    

}

/** funcion islogged(email,session)   lastlog*/