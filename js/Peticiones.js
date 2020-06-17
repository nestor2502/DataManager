
async function getChildrencategories(category){
    categories = {}
    url = `https://api.mercadolibre.com/categories/${category}`
    let response = await fetch(url)
    content = await response.json()
    let children_categories= await content.children_categories
    var size = await  Object.keys(children_categories).length
    for(var i = 0; i< size;i++){
        seccion = await children_categories[i]
        var name = await seccion.name
        var id = await seccion.id
        categories[id]=name 
    }
    return categories
}
/**
 * Function that give only json
 */
async function getPureJson(caracteristicas, tipo_busqueda){
    var url;
    var token = getToken();
    if (tipo_busqueda == 1){
        url = `https://api.mercadolibre.com/sites/MLM/search?q=${caracteristicas.keywords}&offset=${caracteristicas.offset}&access_token=${token}`
    }
    else if(tipo_busqueda == 2){
        url = `https://api.mercadolibre.com/sites/MLM/search?q=${caracteristicas.keywords}&offset=${caracteristicas.offset}&category=${caracteristicas.category}&access_token=${token}`
    }
    else if( tipo_busqueda == 3){
        url = `https://api.mercadolibre.com/sites/MLM/search?category=${caracteristicas.category}&offset=${caracteristicas.offset}&access_token=${token}`
    }
    let response = await fetch(url)
    let content = await response.json()
    return content
}
/**
 * Function that give the total elementos in search
 */
async function getNumberElements(caracteristicas, tipo_busqueda){
    var content=await getPureJson(caracteristicas, tipo_busqueda)
    var publications =  content['paging'].total
    return publications
}

/**
 * Funcion que obtiene json sin modificar y lo pasa a una lista 
 * @param caracteristicas: diccionario con las caracteristicas necesarias
 * @param tipo_busqueda:
 *      1.- busqueda libre  sin categoria
 *      2.- busqueda libre con categoria
 *      3.- resultados al iniciar categoria
 * 
 */
async function getJson(caracteristicas, tipo_busqueda){
    var data = []
    let content = await  getPureJson(caracteristicas, tipo_busqueda)
    var publications =  content['results']
    var tamano = publications.length
    for(var i =tamano-1; i>=0; i--) {
        var diccionario = {}
        singular_publication = publications[i]
        diccionario["seller"]= await getSeller(singular_publication.seller.id)
        diccionario["seller_reputation"]= await getSellerReputation(singular_publication.seller.id)
        diccionario["title"]= await singular_publication.title
        diccionario["price"]=  await singular_publication.price
        diccionario["quantity"]=  await singular_publication.sold_quantity
        var tp_id= await singular_publication.listing_type_id
        diccionario["tipo_publicacion"]= await getExposure(tp_id)
        var state1 =await  singular_publication.address.state_name
        var city1 =await singular_publication.address.city_name
        var address1 =await city1.concat(" / ").concat(state1)
        diccionario["address"]=  await  address1
        var free_shipping = await singular_publication.shipping.free_shipping
        diccionario["free"]= await freeShipping(free_shipping)
        diccionario["publication"]=  await singular_publication.permalink
        data.push(diccionario)
    }
    return data
}


/**
 * 
 * @param {
 * } json: transformacion de jason a datos que se mostraran
 */
async function convertJsonList(json){
    var data = []
    for(var i = 0; i< json.length; i++){
        singular_publication = await json[i]
        var seller_name = await singular_publication.seller
        var seller_reputation = await singular_publication.seller_reputation
        var title = await singular_publication.title
        var price = await "$".concat(singular_publication.price)
        var quantity = await soldExactlyConverter(singular_publication.quantity)
        var tipo_publicacion= await singular_publication.tipo_publicacion
        var address = await singular_publication.address
        var free_shipping = await singular_publication.free
        var publication = await singular_publication.publication
        producto = await [seller_name, seller_reputation, title, price,quantity,tipo_publicacion, address,free_shipping, publication]
        data.push(producto)
    }
    return data
}


/**
 * This function get an json an create the format to download
 * @param 
 * 
 * data: list with charactheristics of search
 * type_search: type of searcho 1,2 or 3.
 */
async function getTable(data, type_search){
    var table = []
    var json1 = await getJson(data, type_search);
    var json2 = await convertJsonList(json1);
    for(var i = 0; i< await  json2.length; i++){
        var row = await json2[i]
        var singular_data = {"Vendedor":row[0],"Reputacion":row[1], "Titulo":row[2], "Precio":row[3],"Vendidos":row[4], "Tipo de Publicacion": row[5],"Direccion":row[6],"Envio Gratis":row[7],  "Publicacion":row[8]} 
        table.push(singular_data)
    }
    return table
}

/*
*Add a row in the table of html
*@param data: jason with data
*/
async function addTableRow(data1, offset){
    var data = await data1

    var i = data.length+offset
    data.forEach(product =>{
    
        newRowTable(i,product[0],product[1], product[2], product[3],product[4],product[5], product[6],product[7], product[8])
        i--
    })
}

/**
 * This function get the nickname seller
 */
async function getSeller(id){
    var seller = ""
    url = `https://api.mercadolibre.com/users/${id}`
    let response = await fetch(url)
    let content =  await response.json()
    let name = await content.nickname
    return name
}

/**
 * This function give the reputation seller
 */
async function getSellerReputation(id){
    var seller = ""
    url = `https://api.mercadolibre.com/users/${id}`
    let response = await fetch(url)
    let content =  await response.json()
    let reputation = await content.seller_reputation.level_id
    return reputationConverter(reputation)
}

/**
 * This function give the id category
 */
async function getNameCategorybyID(id){
    url = `https://api.mercadolibre.com/categories/${id}`
    let response = await fetch(url)
    let content = await response.json() 
    return content.name
}


/**
 * This function get all the elements in a specific category with a rank
 * The api only allows get 50 elements by call
 * @param category: id of the catategory
 * @param offset: move the lower limit of the result block
 */
async function getElements(category, offset){
    var data = {category: category, offset: offset}
    colocarLoader()
    var json1 =await  getJson(data, 3)
    var json2 = await convertJsonList(json1)
    await cleanTable()
    await addTableRow(json2, offset)
    quitarLoader()
    showButtons()

}

/**
 * This function get all the elements in a specific category or free category  with a rank
 * The api only allows get 50 elements by call
 * @param category: id of the catategory
 * @param offset: move the lower limit of the result block
 */
async function getElementsFree(keywords, offset, allow_category, category){
    var data = {keywords: keywords, category: category, offset: offset};
    var json1, json2;
     colocarLoader()
     if(allow_category == false){
        json1 =await  getJson(data, 1)
        json2 = await convertJsonList(json1)}
     else {
        json1 =await  getJson(data, 2)
        json2 = await convertJsonList(json1)}
    cleanTable();
    await addTableRow(json2, offset)
    quitarLoader()
    showButtons()
 }

 /**
  * Get the path of a product
  * @param {*} category 
  */
 async function getPath(category){
     var rutas= []
     url = `https://api.mercadolibre.com/categories/${category}`
     let response = await fetch(url)
     let content = await response.json()
     var path_from_root = await content['path_from_root']
     size =Object.keys(path_from_root).length
     for(var i = 0; i<size; i++){
         rutas.push({id:path_from_root[i].id, name: path_from_root[i].name })
     }
     return rutas
 }

 /**
  * This function gives the publication exposure
  */
 async function getExposure(id){
    url= `https://api.mercadolibre.com/sites/MLM/listing_types/${id}`
    let response = await fetch(url)
     let content = await response.json()
     var exposure = await content.configuration.name
     return exposure
 }

 /**
  * This function converts a number to the information that will be shown in the reputation
  */
 async function reputationConverter(seller_reputation){
     var reputation = await seller_reputation
     if(reputation == "5_green") return 5
     else if(reputation == "4_light_green") return 4
     else if(reputation == "3_yellow") return 3
     else if(reputation == "2_orange") return 2
     else if(reputation == "1_red") return 1
     else return 0
 }

 /**
  * Returns if a publication has free shipping
  */
 async function freeShipping(value){
     free = await value
     if(free == true) return "Si"
     else return "No"
 }

 /**
  * This function converts a number to the information that will be shown in sold queantity
  */
 async function soldExactlyConverter(sold_quantity){
    quantity  = await sold_quantity
    if(quantity == 1) return "1"
    if(quantity == 2) return "2"
    if(quantity == 3) return "3"
    if(quantity == 4) return "4"
    if(quantity == 5) return "5-25"
    if(quantity == 25) return "26-50"
    if(quantity == 50) return "51-100"
    if(quantity == 100) return "101-150"
    if(quantity == 150) return "151-200"
    if(quantity == 200) return "201-250"
    if(quantity == 250) return "251-500"
    if(quantity == 500) return "501-5000"
    if(quantity == 5000) return "5001-50000"
    if(quantity == 50000) return "50001-500000"
    else return "0"
 }

 
 /**
  * Function that returns a dictionary with the data to add to the file
  */
 async function GetTableGeneral(category, offset, allow_tags, tags){
     data = []
     for(var j =0; j<=offset; j+=50){
        url = `https://api.mercadolibre.com/sites/MLM/search?category=${category}&offset=${j}`
        let response = await fetch(url)
        let content = await response.json()
        var publications = await content['results']
        var tamano = await publications.length
        for(var i =0; i<=tamano-1; i++) {
            
            singular_publication = await publications[i]
            var seller = await singular_publication.seller.id 
            var seller_name = await getSeller(seller)
            var seller_reputation = await getSellerReputation(seller)
            var title = await singular_publication.title
            var price = await "$".concat(singular_publication.price)
            var cantidad = await singular_publication.sold_quantity
            var quantity = await soldExactlyConverter(cantidad)
            var state =  await singular_publication.address.state_name
            var city = await singular_publication.address.city_name
            var tp_id= await singular_publication.listing_type_id
            var tipo_publicacion= await getExposure(tp_id)
            var address = await city.concat(" / ").concat(state)
            var free_shipping = await singular_publication.shipping.free_shipping
            var free = await freeShipping(free_shipping)
            var publication = await singular_publication.permalink
            var singular_data = {"Vendedor":seller_name,"Reputacion":seller_reputation, "Titulo":title, "Precio":price,"Vendidos":quantity, "Tipo de Publicacion": tipo_publicacion,"Direccion":address,"Envio Gratis":free,  "Publicacion":publication}
            data.push(singular_data)
        }
     }
     if(allow_tags == true){
         data = await addTagsTable(data, tags)
     }
     return data
 }

 /**
  * Function that returns a dictionary with the data to add to the file
  */
 async function GetTableSpecificSearch(keywords, offset, allow_category, category,  allow_tags, tags){
    data = []
    for(var j =0; j<=offset; j+=50){
        if(allow_category == false){
            url = `https://api.mercadolibre.com/sites/MLM/search?q=${keywords}&offset=${j}`}
        else {
            url = `https://api.mercadolibre.com/sites/MLM/search?q=${keywords}&offset=${j}&category=${category}`
        }
        let response = await fetch(url)
        let content = await response.json()
        var publications = await content['results']
        var tamano = await publications.length
        
        for(var i =0; i<=tamano-1; i++) {
            singular_publication = await publications[i]
            
            var seller = await singular_publication.seller.id 
            var seller_name = await getSeller(seller)
            var seller_reputation = await getSellerReputation(seller)
            var title = await singular_publication.title
            var price = await "$".concat(singular_publication.price)
            var cantidad = await singular_publication.sold_quantity
            var quantity = await soldExactlyConverter(cantidad)
            var state =  await singular_publication.address.state_name
            var city = await singular_publication.address.city_name
            var tp_id= await singular_publication.listing_type_id
            var tipo_publicacion= await getExposure(tp_id)
            var address = await city.concat(" / ").concat(state)
            var free_shipping = await singular_publication.shipping.free_shipping
            var free = await freeShipping(free_shipping)
            var publication = await singular_publication.permalink
            var singular_data = {"Vendedor":seller_name,"Reputacion":seller_reputation, "Titulo":title, "Precio":price,"Vendidos":quantity, "Tipo de Publicacion": tipo_publicacion, "Direccion":address,"Envio Gratis":free,  "Publicacion":publication}
            data.push(singular_data)
        }
    }
    if(allow_tags == true){
        data = await addTagsTable(data, tags)
    }
    return data
 }


 /**
  * Function that adds tags to the list
  */
 function addTagsTable(data, tags){  
     for(var i = 0; i <data.length;i++){
        var keywords = ""
         var publication = data[i]
         var title = publication["Titulo"].toLowerCase()
         for(var j = 0; j< tags.length; j++){
             if(title.includes(tags[j].toLowerCase())){
                if(keywords.length == 0)
                    keywords =  tags[j].toLowerCase()
                else 
                    keywords = keywords + ", " + tags[j].toLowerCase()
             }
        publication["Coincidencias"] = keywords
         } 
     }
     return data
 }

