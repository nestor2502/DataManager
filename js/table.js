async function newRowTable(num, seller,seller_reputation,  title, price, cantidad,tipo_publicacio, address,free_shipping,  link)
{   
    var number = num
    var vendedor =  seller
    var reputacion =   seller_reputation
	var titulo =   title
	var precio =   price
    var vendidos =   cantidad
    var tipo_publicacion =  tipo_publicacio
	var direccion =   address
    var tipo_envio =   free_shipping
    var publicacion =   link

	
	var name_table=document.getElementById("tabla_factura");

    var row = name_table.insertRow(0+1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);
    var cell8 = row.insertCell(7);
    var cell9 = row.insertCell(8);
    var cell10 = row.insertCell(9);

    cell1.innerHTML =   '<p name="vendedor[]" class="non-margin">'+number+'</p>';
    cell2.innerHTML =   '<p name="vendedor[]" class="non-margin">'+vendedor+'</p>';
    cell3.innerHTML =  '<p name="vendedor[]" class="non-margin">'+reputacion+'</p>';
    cell4.innerHTML =   '<p name="titulo[]" class="non-margin">'+titulo+'</p>';
    cell5.innerHTML =  '<p name="precio[]" class="non-margin">'+precio+'</p>';
    cell6.innerHTML =   '<p name="vendidos[]" class="non-margin">'+vendidos+'</p>';
    cell7.innerHTML =   '<p name="tipo_publicacion[]" class="non-margin">'+tipo_publicacion+'</p>';
    cell8.innerHTML =   '<p name="direccion[]" class="non-margin">'+direccion+'</p>';
    cell9.innerHTML =   '<p name="tipo_envio[]" class="non-margin">'+tipo_envio+'</p>';
    cell10.innerHTML =   `<a name="publicacion[]" class="non-margin" href=${publicacion} >`+publicacion+'</a>';
}



function cleanTable(){
    var name_table=document.getElementById("tabla_factura");
    var tamanio = name_table.rows.length
    for(var i = 0; i<tamanio-2;i++){
        name_table.deleteRow(0+1);
    }
}
