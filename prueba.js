const express = require('express')
const app = express()
const fs=require('fs')

app.get('/', (req, res) =>{
  res.send('Puedes ejecutar los siguientes comandos: Registrar un usuario => /register/:name/:password; Iniciar sesión => /login/:name/:password; Cambiar password => /changepassword/:name/:oldpassword/:newpassword')
})

app.get('/register/:name/:password', (req, res) => {
    const usuario= req.params.name
    const password = req.params.password
    
    if(fs.existsSync('./usuarios/'+usuario+'.json')==false){
        fs.writeFileSync( './usuarios/'+usuario+'.json', `{
    "password":"${password}"
}`)    
        return res.send(`El usuario '${usuario}' ha sido creado correctamente`)
    }
    else{
        return res.status(400).send(`El usuario '${usuario}' ya existe`)
    }
})


app.get('/login/:name/:password', (req, res) => {
    const usuario= req.params.name
    const passwordIntroducido = req.params.password
    const passwordReal=(JSON.parse(fs.readFileSync('./usuarios/'+usuario+'.json', 'utf-8'))).password

    if(fs.existsSync('./usuarios/'+usuario+'.json')==true && passwordReal==passwordIntroducido){
        res.json('"mensaje": "el usuario se ha creado correctamente"')
        return res.send(`El usuario "${usuario}" es autorizado`)

    }
    else{
        return res.send(`Revise el usuario y el password`)
    }
})


app.get('/changepassword/:name/:oldpassword/:newpassword', (req, res) => {
    const {name} = req.params
    const {oldpassword} = req.params
    const {newpassword} = req.params

    if (fs.existsSync('./usuarios/'+name+'.json')){
        const realpassword=(JSON.parse(fs.readFileSync('./usuarios/'+name+'.json', 'utf-8'))).password
        const objetoCompleto = (JSON.parse(fs.readFileSync('./usuarios/'+name+'.json', 'utf-8')))
        
        if (oldpassword==newpassword){
            return res.send('El password nuevo no puede ser igual que el viejo')
        }

        else if(realpassword==oldpassword){
            console.log(objetoCompleto)
            objetoCompleto.password=newpassword
            console.log(objetoCompleto)

            fs.writeFileSync('./usuarios/'+name+'.json', JSON.stringify(objetoCompleto))
            return res.send('El password se ha actualizado de manera exitosa')
        }

        res.send('El password que quieres cambiar es incorrecto')

    }
    else{
        res.send('El usuario no existe')
    }
})

app.get('/deleteprofile/:name/:password', (req, res) => {
    const {name} = req.params
    const {password} = req.params
    console.log(name)
    if(fs.existsSync('./usuarios/'+name+'.json') && JSON.parse(fs.readFileSync('./usuarios/'+name+'.json')).password==password){

        //falta el unlink
        return res.send('Usuario eliminado con éxito')
    }
    else{
        return res.send('Revise el usuario que ha introducido o el password')
    }

})

const puerto = process.env.PORT || 3000
app.listen(puerto, ()=> console.log('el servidor escucha en el puerto', puerto))
    


