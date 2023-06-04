// Conversaciones :
class Conversation {
  constructor() {
    this.conversaciones = {};
    this.bandejaEntrada;
    this.target;
    this.targetReference;
  }

  crearChat(Mensajes) {
    if (!(Mensajes in this.conversaciones)) {
      this.conversaciones[Mensajes] = [];
      this.bandejaEntrada = document.createElement("div");
      this.bandejaEntrada.id = Mensajes;
      document.getElementById("Mensajes").append(this.bandejaEntrada);
    }
  }
}

// Inicializar conversation....
var con = new Conversation();


function modificarDestinatario(){
  console.log("cambio target tRef:" + con.targetReference + "tar:" + con.target);

  con.target = document.getElementById("friendList").value;
  mostrarConversation();
}

function mostrarConversation() {
  if (con.target in con.conversaciones) {
    document.getElementById(con.target).style.display = 'block';
    ocultarConversation();
    recibirMensaje();
  }
}


function ocultarConversation() {
  console.log(con.targetReference + " " + con.target);
  if (con.targetReference != con.target) {
    document.getElementById(con.targetReference).style.display = 'none';
    con.targetReference = con.target;
  }
}

function iniciarConversacion() {
  con.target = document.getElementById("friendList").value;
  con.crearChat(con.target);
  if (con.targetReference == null) con.targetReference = con.target;
  mostrarConversation(con.target);
}


function getMail() {
  document.getElementById("mail").value = sessionStorage.getItem("mail");
  sessionStorage.clear();
}

function logout() {
  sessionStorage.clear();
  location.href = "Login.html";
}

function obtenerPaises() {
  let rhttp = new XMLHttpRequest();

  rhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
          let data = JSON.parse(rhttp.responseText);
          let selectElement = document.getElementById("countries");
          selectElement.innerHTML = "";
          console.log(data[3]);
          for (let i = 0; i < data.length; i++) {
              let option = document.createElement("option");
              option.value = data[i].code;
              option.textContent = data[i].name;
              selectElement.appendChild(option);
          }
          console.log(data);
      }
  }
  let url = "";

  rhttp.open("GET", "http://localhost:8080/XatLLM/Register?" + url, true);
  rhttp.send();
}

function verificarContrasena() {
  let password1 = document.getElementById("pass1").value;
  let password2 = document.getElementById("pass2").value;

  if (password1 != password2) {
      alert("La contraseña no coincide.");
  } else if (password1.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
  } else {
      registrarUsuario();
  }
}

function registrarUsuario() {
  let ehttp = new XMLHttpRequest();
  let user = document.getElementById("user").value;
  let mail = document.getElementById("mail").value;
  let codeCountry = document.getElementById("countries").value;
  let pass = document.getElementById("pass1").value;

  console.log(codeCountry);
  ehttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          location.href = "Login.html";
          sessionStorage.setItem("mail", document.getElementById("mail").value);
      }
  };

  let url = "mail=" + mail + "&pass=" + pass + "&user=" + user + "&codeCountry=" + codeCountry;

  ehttp.open("POST", "http://localhost:8080/XatLLM/Register");
  ehttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  ehttp.send(url);
}

function doLogin() {
  var rhttp = new XMLHttpRequest();
  let mail = document.getElementById("mail").value;
  let pass = document.getElementById("pass").value;

  rhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          let data = rhttp.responseText;
          if (data != "false") {
              console.log(rhttp.responseText);
              sessionStorage.setItem("session", data);
              sessionStorage.setItem("mail", document.getElementById("mail").value);
              location.href = "xat.html";
          } else {
              alert("El usuario o contraseña no es correcto");
          }
      }
  }

  let url = "mail=" + mail + "&pass=" + pass;
  rhttp.open("GET", "http://localhost:8080/XatLLM/Login?" + url, true);
  rhttp.send();
}

function añadirAmigo() {
  let rhttp = new XMLHttpRequest();
  let mail = sessionStorage.getItem("mail");
  let session = sessionStorage.getItem("session");
  let friendMail = document.getElementById("friendMail").value;


  
  rhttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200) {
          let data = rhttp.responseText;
          console.log(data);
          switch (data) {
              case "0":
                  alert("El servidor no responde.");
                  break;
              case "1":
                  document.getElementById("friendMail").value = "";
                  alert("Amigo añadido");
                  document.getElementById("friendList").appendChild(new Option(friendMail, friendMail));
                  break;
              case "2":
                  alert("Ese amigo no esta registrado.");
                  break;
              case "3":
                  alert("El código de sesión ha expirado, haga Login de nuevo.");
                  logout();
          }
      }
  }

  let url = "mail=" + mail + "&session=" + session + "&friend=" + friendMail;
  console.log(url);

  rhttp.open("POST", "http://localhost:8080/XatLLM/Friend", true);
  rhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  rhttp.send(url);
}

function obtenerListaAmigos() {
  let ehttp = new XMLHttpRequest();
  let mail = sessionStorage.getItem("mail");
  let session = sessionStorage.getItem("session");
  console.log(mail + " " + session);

  ehttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
          let data = JSON.parse(ehttp.responseText);
          let selectElement = document.getElementById("friendList");
          selectElement.innerHTML = "";
          console.log(data[0]);
          for (let i = 0; i < data.length; i++) {
              let optionValue = data[i];
              if (selectElement.querySelector(`option[value='${optionValue}']`) !== null) {
                  continue; // Omitir opción repetida
              }
              
              let option = document.createElement("option");
              option.value = data[i];
              option.textContent = data[i];
              selectElement.appendChild(option);
          }
      }
  }

  let url = "mail=" + mail + "&session=" + session;

  ehttp.open("GET", "http://localhost:8080/XatLLM/Friend?" + url, true);
  ehttp.send(url);
}

function enviarMensaje() {
  let ehttp = new XMLHttpRequest();
  let mail = sessionStorage.getItem("mail");
  let session = sessionStorage.getItem("session");
  let receptor = document.getElementById("friendList").value;
  let sms = document.getElementById("sms").value;

  console.log(mail + " " + session + " " + " " + receptor + " " + sms);

  ehttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
          document.getElementById("sms").value = "";
      }
  };
  let url = "mail=" + mail + "&session=" + session + "&receptor=" + receptor + "&sms=" + sms;

  ehttp.open("POST", "http://localhost:8080/XatLLM/Xat", true);
  ehttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  ehttp.send(url);
}

function recibirMensaje() {
  let rhttp = new XMLHttpRequest();
  let mail = sessionStorage.getItem("mail");
  let session = sessionStorage.getItem("session");
  console.log(mail);
  console.log(session);

  rhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
          let data = JSON.parse(rhttp.responseText);
    
          if (data.emisor in con.conversaciones) {
            let p = document.createElement("p");
            p.innerHTML = data.emisor + ": " + data.text;
    
            document.getElementById(data.emisor).append(p);
          }
          else{
            con.crearChat(data.emisor)
            document.getElementById(data.emisor).style.display = 'none';
            let p = document.createElement("p");
            p.innerHTML = data.emisor + ": " + data.text;
    
            document.getElementById(data.emisor).append(p);
          }
    
          recibirMensaje();
        }
  };

  let url = "mail=" + mail + "&session=" + session;
  console.log(url);

  rhttp.open("GET", "http://localhost:8080/XatLLM/Xat?" + url, true);
  rhttp.send();
}










