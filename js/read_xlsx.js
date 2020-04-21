var ExcelToJSON = function() {
          
            
    this.parseExcel = function(file) {

      var reader = new FileReader();

      reader.onload = function(e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, {type: 'binary'});
        var i = 0;
        workbook.SheetNames.forEach(function(sheetName) {
          // Here is your object
          var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
          var json_object = JSON.stringify(XL_row_object);
          var elementos = JSON.parse(json_object);
          //console.log(elementos);
          elementos.forEach(description => console.log(description.Descripcion));
        })
      };

      reader.onerror = function(ex) {
        console.log(ex);
      };

      reader.readAsBinaryString(file);
    };
    
};

function handleFileSelect(evt) {
  
  var files = evt.target.files; // FileList object
  var xl2json = new ExcelToJSON();
 xl2json.parseExcel(files[0]);
  
}

document.getElementById('upload').addEventListener('change', handleFileSelect, false);