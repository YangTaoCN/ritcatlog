/*
* Authur, Tao
* txy2539@rit.edu
* CCRG@RIT Catalog of Numerical Simulations layout and search function
* 
*/


// Global. The array of range search columns' index. 
var cols = new Array();
var downloadLinks = [];

// Add favicon of ccrg
var fav = document.createElement("link");
fav.rel = "shortcut icon";
fav.href = "https://ccrg.rit.edu/sites/default/files/ccrg-black-figure-only.png";
fav.type = "image/png";
$('head').prepend(fav);

/**
 *  * Js open new window and post
 *   * @param URL
 *    * @param PARAMS
 *     */
function postOpenWindow(URL, PARAMS) {
    var temp_form = document.createElement("form");
    temp_form.action = URL;
    temp_form.target = "_blank";
    temp_form.method = "post";
    temp_form.style.display = "none";
    for (var x in PARAMS) {
        var opt = document.createElement("textarea");
        opt.name = x;
        opt.value = PARAMS[x];
        temp_form.appendChild(opt);
    }
    document.body.appendChild(temp_form);
    temp_form.submit();
}

function addCheckbox (){
    $('.dataTables_scrollBody tbody tr td a input').remove();
    var inputId = 0;
    $('.dataTables_scrollBody tbody tr td a img').each( function () {
        var aTag = this.parentNode;
        var inputTag = document.createElement("input" );
        inputTag.type = "checkbox";
        inputTag.id = "link-"+inputId;
        if (this.src.indexOf("metadata.png") > -1){
          inputTag.name = "select-text";
        } else if (this.src.indexOf("strain_tarball.png") > -1) {
          inputTag.name = "select-strain";
        } else {
          inputTag.name = "select-psi";
        }
        aTag.prepend(inputTag);
        aTag.target = "view_window";
        names = aTag.href.split('/');
        aTag.download = names.pop();
        inputId += 1;
    });
}


 // Listening to input event.
function listenCheck () {
  $("input[type='checkbox']").each(function (){
    $("#" + this.id).on("change", function () {
      if ($("#"+this.id).is(":checked") ) {
    // add link if checked
    if (downloadLinks.indexOf(this.parentNode.getAttribute('href', 2)) === -1) {
      downloadLinks.push(this.parentNode.getAttribute('href', 2));
    }
      } else {
    // remove link if unchecked
    var remove = downloadLinks.indexOf(this.parentNode.getAttribute('href', 2));
    if (remove > -1) {
      downloadLinks.splice(remove, 1);
    }
      }
    });
  });
}

// Add range search function.
$.fn.dataTable.ext.search.push(
  function( settings, data, dataIndex) {
    if ( cols.length == 0 ) {
      return true;
    }
    for (var i = 0; i < cols.length; i++ ){
      var target = parseFloat( data[i] ) || data[i];
      var flag = false;      
      if (cols[i] != undefined) {
        for (cons of cols[i]) {
          if ( cons.indexOf(':') != -1 ) {
          var range = cons.split(':');
            if (range[0] == "" && target <= parseFloat( range[1] )) {
          flag = true;
        }
            if (range[1] == "" && target >= parseFloat( range[0] )) {
              flag = true;
            }
            if ( target >= parseFloat( range[0] ) && target <= parseFloat( range[1] )) {
            flag = true;    
            } 
      } else {
        var input = parseFloat(cons) || cons;
            if (target == input || cons == "" ){
            flag = true;
            }
          }
        }
      } else {
        flag = true;
      }
      if (flag == false) {
        return false;
      }
    }
    return true;
  }
);

jQuery(document).ready(function($){
  $('#example').DataTable({
    "scrollY": "1000px",
    "scrollX": "true",
    "scrollCollapse": true,
    "aLengthMenu":  [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]]

  });

  // Add instruction about search function
  var ins = document.createElement("p");
  ins.append(document.createTextNode("How to search?"));
  ins.append(document.createElement("br"));
  ins.append(document.createTextNode("1. Input the value or string directly for equality search;"));
  ins.append(document.createElement("br"));
  ins.append(document.createTextNode("2. Input the \"<start value>:<end value>\" for range search;"));
  ins.append(document.createElement("br"));
  ins.append(document.createTextNode("3. Use \",\" as \"or\" to add more search conditions."));

  $('.dataTables_wrapper').prepend(ins);

  // Remove the single search bar
  $(".dataTables_filter").remove();
  
  // Add class for css 
  $('[src="CCRG-logo-black.png"]').addClass('logo');
  $('body table').first().addClass('intro-text');

  var originalTitle = $('.dataTables_scrollHead thead')[0].innerHTML;

  // Start point of range search
  var order = 0;

  // The columns that do not support search.
  var noSearch = [2];

  // Add input elements for equality search and range search.
  $('.dataTables_scrollFoot tfoot th').each( function () {
      if ( noSearch.indexOf(order) === -1 ) {
    $(this).html( '\
    <input id="e-search-'+order+'"  order='+order+'  class="search" type="text" placeholder="Search" />\
    ' );
      } else if (order == 2){
    $(this).html( '\
      <button class="download-selected" type="button">Download Selected Items</button></br>\
      <p class="link-select">Select All</p>\
      <div class="link-select" id="select-text">\
      <label><input name="link-text" type="checkbox" class="select-all" id="select-text" /> </label>\
      </div>\
      <div class="link-select" id="select-psi">\
      <label><input name="link-psi" type="checkbox" class="select-all" id="select-psi" /> </label> </br>\
      </div>\
      <div class="link-select" id="select-strain">\
      <label><input name="link-strain" type="checkbox" class="select-all" id="select-strain" /> </label> </br>\
      </div>\
    ');
      } else {
    $(this).html( '' );
      }
      order ++;
  } );

  var table = $('#example').DataTable();

  // Add link to full screen 
  if(self != top){
    var full = document.createElement("a");
    full.text = " [Full Screen]";
    full.target = "_blank";
    full.href = "https://ccrg.rit.edu/~RITCatalog/";
    $('.dataTables_length').append(full);
  }

  // Move the input to header.
  var inputTitle = $('.dataTables_scrollFoot tfoot tr');
  $('.dataTables_scrollHead thead').prepend(inputTitle);

  // Select all, remove all
  $(".select-all").on("change", function () {
    if ($("thead #" + this.id).is(":checked")) {
      $("input[name=" + this.id + "]").prop("checked", true).each(function () {
    if (downloadLinks.indexOf(this.parentNode.getAttribute('href', 2)) === -1) {
      downloadLinks.push(this.parentNode.getAttribute('href', 2));
    }
      } );          
    } else {
      $("input[name=" + this.id + "]").prop("checked", false).each(function () {
    var remove = downloadLinks.indexOf(this.parentNode.getAttribute('href', 2));
    if (remove > -1) {
      downloadLinks.splice(remove, 1);
    }
      } );    
    }
  });

  $(".download-selected").click(function(){
    if (downloadLinks.length === 0) {
      alert("No selected files! Please check the boxes to select.");
    } else {
      postOpenWindow("package.php", downloadLinks);
    }
  });
    
  // Listening to page change
  $('#example_info').bind("DOMSubtreeModified", function(){
    addCheckbox();
        listenCheck();
  }); 

  // when the length change, remove all the selected files and uncheck the boxes.
  $("[name='example_length']" ).change( function(){ 
    downloadLinks = [];
    $('.select-all').each( function(){
        if ($('thead #' + this.id).is(":checked")){
            this.click();
        } else {
            this.click();
            this.click();
        }

    });
  });

  // Apply the search
  table.columns().every( function () {
      var that = this;

      $('.search', this.footer()).on( 'keyup change', function () {
      var str = this.value;
          str = str.replace(/\s+/g,"");
          arr = str.split(',');
            var idx = $("#"+this.id).attr("order");
          cols[idx] = arr;
       that.draw();
      } );
  } );

  // Make the window visible after js is loaded.  
  $('body').css("visibility", "visible");
  
  // Do a draw to maintain dataTables Layout
  table.draw();
  listenCheck();

});

