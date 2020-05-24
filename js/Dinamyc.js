
let main_category = ""
let offset= 0
let general_url = ""
let using_input = false
let words = ""
let input_used_to_index = false
let shearchOnlyCategory = false
var no_results = 0
main_tags = []
/**
 * This function init the document in a category
 * add the news elements in the table
 * @param {*} category 
 */
async function initDocument(category){
   
    no_results = 0
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
    no_results = await setNoResults()
    getElements(category, offset)
    setPath()
    main_tags = []
    changeButtons2(offset/50 +1)
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
    no_results = await setNoResults()
    main_tags = []
    changeButtons2(offset/50 +1)
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
    changeButtons2(offset/50 +1)

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
    changeButtons2(offset/50 +1)
}

/**
 * This function change the offset of a search,
 * and add the elements in the table
 */
async function changePage(index){
    cleanTable()
    offset=(index-1)*50
    if(input_used_to_index == true){
        doSearchIndex(offset)
    }
    else{
        getElements(main_category, offset)}
    changeButtons2(offset/50 +1)
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
    changeButtons2(offset/50 +1)
}

async function showButtons(){
   document.getElementById("imprimir").style.display = "visible"
  $('#imprimir').addClass('d-inline-block');

}

async function generateList(allow_tags){
    if(input_used_to_index == false){
        data = await GetTableGeneral(main_category, offset, allow_tags, main_tags)
    }
    else{
        if(shearchOnlyCategory==false){
            data = await GetTableSpecificSearch(words, offset, false,"" , allow_tags, main_tags)
           }
        else if(shearchOnlyCategory == true){
            data = await  GetTableSpecificSearch(words, offset, true, main_category, allow_tags, main_tags)
        }
    }
    return data
}

async function download_csv(allow_tags) {
    $('#loaderImprimir').addClass('d-inline-block');
    var sheet_1_data = await generateList(allow_tags)  
    var opts = [{sheetid:'Sheet One',header:true}];
            var result = alasql('SELECT * INTO XLSX("Reporte General.xlsx",?) FROM ?', 
                                                [opts,[sheet_1_data]]);
    $('#loaderImprimir').removeClass('d-inline-block');
}

async function convertDictionary(){
    let list = await generateList()
}


/**
 * Put loader on screen
 */
function colocarLoader(){
    $('#loader').addClass('d-inline-block');
}

/**
 * remove loader from screen
 */
function quitarLoader(){
    $('#loader').removeClass('d-inline-block');
}


/**
 * Shows the total number of results by search or category
 */
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
    return number
}

/**
 * Show the component option to search only in the category
 */
function showChecker(){
    if(main_category != ""){
        $('#checker').addClass('d-inline-block');
    }
    else{
        $('#checker').removeClass('d-inline-block');
    }
}

/**
 * Show the option to search only in the category
 */
function setSearchCategory(){
    if(shearchOnlyCategory == false){
        shearchOnlyCategory = true
    }
    else if(shearchOnlyCategory == true){
        shearchOnlyCategory = false
    }
}

/**
 * clean the search engine entry
 */
function clearInput(){
    $("#inputSearch1").val('');
}


/**
 * add main tags
 */
function getMainTags(word){
    main_tags.push(word)   
}

/**
 * delete the last element
 */
function newMainTags(){
    main_tags.pop()   
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

/**
 * Function that modifies the lower buttons
 */
async function changeButtons(index){
    var results = await no_results
    var max_pages = giveNoPages(results)
    var currentPage = offset/50 +1
    pages.innerHTML = "";
    for(var i =1; i<=7;i++){
        var li=document.createElement('li');
        li.id="item";
        if(i == currentPage){
            li.className = "page-item d-inline-block active"
            li.innerHTML=`<a class="page-link " >${i}</a>`}
        else{
            li.className = "page-item d-inline-block"
            li.innerHTML=`<a class="page-link " id =${i} onclick= "change">${i}</a>`}        
        document.getElementById("pages").appendChild(li);
    }
}

/**
 * 
 */
async function changeButtons2(index){
    var results = await no_results
    var max_pages = giveNoPages(results)
    //var index = offset/50 +1
    pages.innerHTML = "";
    if(max_pages<=10 ){      
        createPageButtons(max_pages,1, index)
    }

    else if( index <=5 && max_pages > 10){
        createPageButtons(10,1, index)
    }
    else if(max_pages > 10){
        if(index < max_pages-5)
            createPageButtons(11,index-5, index)
         else
            createPageButtons(10,max_pages-10, index)
    }
}

function createPageButtons(size, start, currentPage){
    for(var i =start; i<=start+size;i++){
        var li=document.createElement('li');
        li.id="item";
        if(i == currentPage){
            li.className = "page-item d-inline-block active"
            li.innerHTML=`<a class="page-link " >${i}</a>`}
        else{
            li.className = "page-item d-inline-block"
            li.innerHTML=`<a class="page-link " id =${i} onclick= "changePage(id)">${i}</a>`}        
        document.getElementById("pages").appendChild(li);
}
}
/**
 * Function that returns the total number of pages
 */
function giveNoPages(noResults){
    var pages =  Math.floor(noResults/50)
    if((noResults % 50) > 0){
        pages ++
    }
    return pages
}

