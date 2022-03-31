const path = require('path');
const { v4 : uuidv4 } = require('uuid');

const subirArchivo = ( files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], folder = '' ) => {
    return new Promise( (resolve,reject) => {
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[ nombreCortado.length - 1];
    
        if ( !extensionesValidas.includes( extension ) ) {
            return reject(`La extension ${extension} no es permitida, solo se permiten ${extensionesValidas}`)
        }
        
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join( __dirname, '../uploads/', folder, nombreTemp );
      
        archivo.mv(uploadPath, (err) => {
          if (err){
            reject(err);
          }
    
          resolve( nombreTemp );
        });
    })
}

module.exports = {
    subirArchivo
}