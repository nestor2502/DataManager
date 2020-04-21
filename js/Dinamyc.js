let main_category = ""
let offset= 0
let general_url = ""
let using_input = false
let words = ""
let input_used_to_index = false

/**
 * This function init the document in a category
 * add the news elements in the table
 * @param {*} category 
 */
async function initDocument(category){
    await cleanTable()
    change_category.innerHTML = "";
    dropdown_menu.innerHTML = "";
    offset = 0
    main_category = category
    using_input = false
    addElements(category)
    //changeCategoryTitle(await getPath(category))
    getElements(category, offset)
    console.log(main_category)
    setPath()
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
 * This function change the path of a category
 * @param {title} title 
 */
function changeCategoryTitle(title){

    getElementById("atras").style.display = 'visible'
    getElementById("siguiente").style.display = "visible"
    getElementById("imprimir").style.display = "visible"
}

/** 
 * this function do the search of a specific word
 * @param keywords 
 * @param offset
*/
async function doSearch(keywords){
    input_used_to_index=true
    if(keywords == false){
        words = document.getElementById("input-search").value
    }
    else{
    words = keywords.value}
    offset=0
    console.log(words)
    if(main_category==""){
        getElementsFree(words, offset, false,"" )}
    else if(main_category != ""){
        getElementsFree(words, offset, true, main_category)
    }
}

/** 
 * this function do the search of a specific word
 * @param keywords 
 * @param offset
*/
async function doSearchIndex(offset){
    if(main_category==""){
        getElementsFree(words, offset, false,"" )}
    else if(main_category != ""){
        getElementsFree(words, offset, true, main_category)
    }
    
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
   document.getElementById("atras").style.displlay = "visible"
   document.getElementById("siguiente").style.display = "visible"
   document.getElementById("imprimir").style.display = "visible"
  $('#atras').addClass('d-block');
  $('#siguiente').addClass('d-block');
  $('#imprimir').addClass('d-inline-block');

}

async function generateList(){
    if(input_used_to_index == false){
        data = await GetTableGeneral(main_category, offset)
    }
    else{
        if(main_category==""){
            data = await GetTableSpecificSearch(words, offset, false,"" )
           }
        else if(main_category != ""){
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
