var opcion1 = false; // tabla
var opcion2 = false; //mostrar categorias

function chage_state(checkbox){

    if (checkbox == 1){
        if(opcion1 == false){
            opcion1 = true;
            //alert('El archivo debe tener la siguientes caracteristicas: \n 1.- El nombre de la celda (1,A) debe ser "Descripcion" \n 2.- Si selecciona el analisis por categoria la celda (1,B) debe tener el nombre "Categoria"')
            document.getElementById("upload").style.display = 'block';
            document.getElementById("list_of_categories2").style.display = 'none';
            document.getElementById("input-search").style.display = 'none';
            document.getElementById("seccion2").style.display = 'none'
        }
        else if(opcion1 == true){
            opcion1 = false;
            document.getElementById("upload").style.display = 'none'
            document.getElementById("input-search").style.display = 'block';
            if(opcion2== true){
            document.getElementById("list_of_categories2").style.display = 'block'}
        }
        console.log(opcion1);
    }
if(checkbox == 2){
    if(opcion2 == false){
        opcion2 = true;
        if(opcion1 == false){
        document.getElementById("list_of_categories2").style.display = 'block'
        document.getElementById("seccion2").style.display = 'block'
        }
       }
    else if(opcion2 == true){
       opcion2 = false;
        document.getElementById("list_of_categories2").style.display = 'none';
        document.getElementById("seccion2").style.display = 'none'
       }
    console.log(opcion2);
    
}

}

function colocarLoader(){
    document.getElementById("loader-container").style.display = 'block';
}

function quitarLoader(){
    document.getElementById("loader-container").style.display = 'none';
}

function colocarLoader2(){
    document.getElementById("loader-container2").style.display = 'block';
}

function quitarLoader2(){
    document.getElementById("loader-container2").style.display = 'none';
}
function iniciarAnalisis(){
    colocarLoader();
    document.getElementById("upload").style.display = 'none';
}







