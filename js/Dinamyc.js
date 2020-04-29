//onclick="download_csv()"
let main_category = ""
let offset= 0
let general_url = ""
let using_input = false
let words = ""
let input_used_to_index = false
let shearchOnlyCategory = false
tags = []
/**
 * This function init the document in a category
 * add the news elements in the table
 * @param {*} category 
 */
async function initDocument(category){
    await cleanTable()
    clearInput()
    change_category.innerHTML = "";
    dropdown_menu.innerHTML = "";
    no_elements.innerHTML = "";
    inputSearch1.innerHTML = "";
    offset = 0
    main_category = category
    using_input = false
    showChecker()
    addElements(category)
    getElements(category, offset)
    setNoResults()
    setPath()
    tags = []
}


async function setPath(){
    change_category.innerHTML = "";
    var li=document.createElement('li');
    li.id="nuevo";
    li.className = "breadcrumb-item"
    li.innerHTML=`<a href="#" onclick = refresh()> Inicio </a>`
    document.getElementById("change_category").appendChild(li);
    var path = await getPath(main_category)
    var size = path.length
    for(var i = 0; i<size; i++){
        if(i== size-1){
            var li=document.createElement('li');
            li.id="nuevo";
            li.className = "breadcrumb-item active"
            li.innerHTML=`<a >${path[i].name}</a>`
            document.getElementById("change_category").appendChild(li);
        }
        else{
            var li=document.createElement('li');
            li.id="nuevo";
            li.className = "breadcrumb-item"
            li.innerHTML=`<a href="#" id="${path[i].id}" onclick= "initDocument('${path[i].id}')">${path[i].name}</a>`
            document.getElementById("change_category").appendChild(li);
        }
    }
}

function refresh(){
location.reload(true);
}

/**
 * This function add the subcategories in the page
 * @param {*} category 
 */
async function addElements(category){
    json = await getChildrencategories(category)
    name_categories= []
    id_categories= Object.keys(json)
    size = id_categories.length
    for(var i=0; i<size; i++){
        id_category = id_categories[i]
        var nuevoLi=await json[id_category]
        var a=document.createElement('a');
        a.id="nuevo";
        a.innerHTML=`<a class="dropdown-item" id="${id_category}" onclick= "initDocument('${id_category}')" >${nuevoLi}</a>`
        document.getElementById("dropdown_menu").appendChild(a);           
    }
    
}


/** 
 * this function do the search of a specific word
 * @param keywords 
 * @param offset
*/
async function doSearch(keywords){
    input_used_to_index=true
    words = keywords.value
    no_elements.innerHTML = "";
    offset=0
    await cleanTable()
    if(shearchOnlyCategory==false){
        getElementsFree(words, offset, false,"" )}
    else if(shearchOnlyCategory ==true){
        getElementsFree(words, offset, true, main_category)
    }
    setNoResults()
}


/**
 * This function change the offset of a search
 * and add the elements in the table
 */
async function nextPage(){
    cleanTable()
    offset+=50
    if(input_used_to_index == true){
        doSearchIndex(offset)
    }
    else{
        getElements(main_category, offset)}
 
}

/**
 * This function change the offset of a specific search
 * and add the elements in the table
 */
async function backPage(){
    //input_used_to_index = true
    if(offset!=0){
        cleanTable()
        offset -=50
        if(input_used_to_index== true){          
           doSearchIndex( offset)           
        }
        else{
        getElements(main_category, offset)}
    }
}

async function showButtons(){
   document.getElementById("imprimir").style.display = "visible"
  $('#imprimir').addClass('d-inline-block');

}

async function generateList(){
    if(input_used_to_index == false){
        data = await GetTableGeneral(main_category, offset)
    }
    else{
        if(shearchOnlyCategory==false){
            data = await GetTableSpecificSearch(words, offset, false,"" )
           }
        else if(shearchOnlyCategory == true){
            data = await  GetTableSpecificSearch(words, offset, true, main_category)
        }
    }
    return data
}

async function download_csv() {
    $('#loaderImprimir').addClass('d-inline-block');
    var sheet_1_data = await generateList()  
    var opts = [{sheetid:'Sheet One',header:true}];
            var result = alasql('SELECT * INTO XLSX("Reporte General.xlsx",?) FROM ?', 
                                                [opts,[sheet_1_data]]);
    $('#loaderImprimir').removeClass('d-inline-block');
}

async function convertDictionary(){
    let list = await generateList()
}

function colocarLoader(){
    $('#loader').addClass('d-inline-block');
}

function quitarLoader(){
    $('#loader').removeClass('d-inline-block');
}

async function setNoResults(){
    var data
    var number
    if(input_used_to_index == false){
        data = {category:main_category, offset: offset}
        number = await getNumberElements(data,3)
    }
    else{
        if(shearchOnlyCategory==false){
            data = {keywords: words, category: "", offset: offset};
            number = await getNumberElements(data,1)
           }
        else if(shearchOnlyCategory == true){
            data = {keywords: words, category: main_category, offset: offset};
            number = await getNumberElements(data,2)
        }
    }
    
    var content =  document.getElementById("no_elements")
    content.innerHTML = "";
    var p=document.createElement('p');
    p.id="nuevo";
    p.innerHTML=`<p  style="display: inline-block;">${"Resultados: ".concat(number)}</p>`
    document.getElementById("no_elements").appendChild(p);
    
}

function showChecker(){
    if(main_category != ""){
        $('#checker').addClass('d-inline-block');
    }
    else{
        $('#checker').removeClass('d-inline-block');
    }
}

function setSearchCategory(){
    if(shearchOnlyCategory == false){
        shearchOnlyCategory = true
    }
    else if(shearchOnlyCategory == true){
        shearchOnlyCategory = false
    }
    console.log(shearchOnlyCategory)
}

function clearInput(){
    $("#inputSearch1").val('');
    console.log("se usa funcion")
}

function getTags(word){
    tags.push(word)    
}

function showTagsDiv(){
    $('#tagsDivv').addClass('d-inline-block');
    $('#no_mostra_div').addClass('d-none');
    $('#mostrar_div').addClass('d-none');
    $('#hecho').addClass('d-inline-block');
    $('#atrasDiv').addClass('d-inline-block');
}

function showTagsDiv2(){
    $('#tagsDivv').removeClass('d-inline-block');
    $('#no_mostra_div').removeClass('d-none');
    $('#mostrar_div').removeClass('d-none');
    $('#hecho').removeClass('d-inline-block');
    $('#atrasDiv').removeClass('d-inline-block');
}
