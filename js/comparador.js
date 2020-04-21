var usuario_id = "198797947";
var usuario_nickname = "sucursal ecatepec";


 /**
  * Funcion que obtiene la categoria de una publicacion
  * 
  */
 async function getCategorybyUser(id, keywords, offset){
    url = `https://api.mercadolibre.com/sites/MLM/search?q=${keywords}&seller_id=${id}&offset=${offset}`
    let response = await fetch(url)
    let content = await response.json()
    var publications = await content['results']
    var tamano = await publications.length
    for(var i =0 ; i< tamano; i++){
        singular_publication = await publications[i]
        category = singular_publication.category_id
        console.log(category)
    }
 }
/**
 * Analiza una publicacion
 */
async function  analyzePublication(){

}


 function swap(items, leftIndex, rightIndex){
    var temp = items[leftIndex];
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = temp;
}
function partition(items, left, right) {
    var pivot   = items[Math.floor((right + left) / 2)][1], //middle element
        i       = left, //left pointer
        j       = right; //right pointer
    while (i <= j) {
        while (items[i][1] < pivot) {
            i++;
        }
        while (items[j][1] > pivot) {
            j--;
        }
        if (i <= j) {
            swap(items, i, j); //sawpping two elements
            i++;
            j--;
        }
    }
    return i;
}

 function quickSort(items, left, right) {
    var index;
    if (items.length > 1) {
        index = partition(items, left, right); //index returned from partition
        if (left < index - 1) { //more elements on the left side of the pivot
            quickSort(items, left, index - 1);
        }
        if (index < right) { //more elements on the right side of the pivot
            quickSort(items, index, right);
        }
    }
    return items;
}
// first call to quick sort
function test(){
    var items=[[1,150], [0, 100],[4, 200],[2, 300],[3, 5], [5, 80], [6,3], [7,2], [8, 1]]
   //var items = [5,3,7,6,2,9];
var sortedArray = quickSort(items, 0, items.length - 1);
console.log(sortedArray); //prints [2,3,5,6,7,9]

//console.log(items)
//console.log(items[1][1])
}

async function test2(){
    var rankingSales=[];
  var elementosPub =  await getElementsComparator("Base de amortiguador peugeot 206", 0, false, "category")
  var tamano = await elementosPub.length
  console.log(elementosPub)
  //console.log(tamano)
  for(var i=0; i<tamano;i++){
      //console.log(elementosPub[i].Precio)
      rankingSales.push([i, elementosPub[i].Vendidos])
  }
  //console.log(rankingPrice)
  var sortedArray = await quickSort(rankingSales, 0, rankingSales.length - 1);
  console.log(sortedArray); //prints [2,3,5,6,7,9]
  console.log(elementosPub[sortedArray[tamano-1][0]])
 console.log(elementosPub[sortedArray[tamano-2][0]])
  console.log(elementosPub[sortedArray[tamano-3][0]])
  console.log(elementosPub[sortedArray[tamano-4][0]])
  console.log(elementosPub[sortedArray[tamano-5][0]])

}

async function giveUserPublication(){
    var elements = []
    var elementosPub =  await getElementsComparator("Base de amortiguador peugeot 206", 0, false, "category")
    var tamano = await elementosPub.length
    for(var i = 0; i< tamano;i++){
        if(elementosPub[i].Vendedor.toLowerCase() == usuario_nickname){
            elements.push([i, elementosPub[i].Vendedor]);
        }
    }
    console.log(elements);
    return elements
}