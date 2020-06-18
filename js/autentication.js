
 /**
  * get the url of a page
  */
 function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * Get token
 */
async function getToken2(){
    if (token ==""){
        var URLactual = window.location;
        var code = getParameterByName('code', URLactual)
        let response = await fetch(`https://api.mercadolibre.com/oauth/token?grant_type=authorization_code&client_id=1023440189137769&client_secret=x8qnqUeIBvx9FcHqes31j63aZ0rc2NL3&code=${code}&redirect_uri=https://nestor2502.github.io/DataManager/busqueda.html`, {method:'POST'})
        let content = await response.json()
        token = await content.access_token}
    return await token
}

/**
 *Get and save token
 */
async function getToken(){
    var token = document.cookie;
    if(token==""){
        var URLactual = window.location;
        var code = getParameterByName('code', URLactual)
        let response = await fetch(`https://api.mercadolibre.com/oauth/token?grant_type=authorization_code&client_id=1023440189137769&client_secret=x8qnqUeIBvx9FcHqes31j63aZ0rc2NL3&code=${code}&redirect_uri=https://nestor2502.github.io/DataManager/busqueda.html`, {method:'POST'})
        let content = await response.json()
        token = await content.access_token
        document.cookie = await "token="+token+";";
    }
    else{
        var token2 = ""     
        for(var i = 6; i< token.length; i++){
            token2 += token.charAt(i)   
        }
        token = token2
    } 
    console.log("Cookie: "+token) 
    return await token
}

function eliminarToken(){
    document.cookie = "token=; expires= Thu, 01 Jan 1970 00:00:01 GMT";
}
