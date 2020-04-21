
function limpiarDrop(){
    dropdown_menu.innerHTML = "";
}
function addelement(){
    var a=document.createElement('a');
        a.id="nuevo";
        a.innerHTML=`<a class="dropdown-item" id="1" >"nuevooo"</a>`
        document.getElementById("dropdown_menu").appendChild(a);
}

function changePath(){
    var li=document.createElement('li');
        li.id="nuevo";
        li.className = "breadcrumb-item"
        li.innerHTML=`<a href="#"> Home </a>`
        document.getElementById("change_category").appendChild(li);
        malm.innerHTML.className = "breadcrumb-item";
}       

function obtenerTexto(keywords){
    console.log(keywords.value)
}