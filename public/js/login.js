const email = document.getElementById("email");
const contrasena = document.getElementById("contrasena");
const iniciarSesion = document.getElementById("submit")

class Usuarios {
    constructor(email, contrasena){
        this.email = email,
        this.contrasena = contrasena,
        this.nombre = "",
        this.permiso = "",
        this.token = ""
    }

    static async guardaUsuario (usuario) {
        localStorage.setItem("dataUsuario", JSON.stringify(usuario))
    }

    static async recuperaUsuario () {
        let resultado = await JSON.parse(localStorage.getItem('dataUsuario'))
        return resultado
    }
}

iniciarSesion.addEventListener('click', async (event) => {
    console.log(email.value);
    console.log(contrasena.value);
    event.preventDefault();
    Usuarios.guardaUsuario(new Usuarios(email.value, contrasena.value));
    let resultado = await fetch("http://localhost:3000/login", {
        method: 'post',
        headers: {
            "Accept": "application/json, text/plain, *,*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify( {
            "email": email.value,
            "contrasena": contrasena.value
        })
    })

    let vuelta = await resultado.json();
    if(vuelta === 'Usuario o contraseña incorrecta' || vuelta === 'No existe el usuario' ){
        alert('Usuario o contraseña incorrecta')
    } else {
        let data = await Usuarios.recuperaUsuario();
        data.email = vuelta.user.email;
        data.permiso = vuelta.user.bandera_admin;
        data.nombre = vuelta.user.nombre + " " + vuelta.user.apellidos;
        data.token = vuelta.token;
        Usuarios.guardaUsuario(data);
        if(data.permiso === 1){
            location.href = '/index'
        } else {
       location.href = '/index'
        }
    }
})