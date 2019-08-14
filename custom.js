/*
* Authur, Tao
* txy2539@rit.edu
* CCRG@RIT Catalog of Numerical Simulations layout and search function
* 
*/


// Global. The array of range search columns' index. 

var cols = [];
var downloadLinks = [];

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
        if ( $('.dataTables_scrollBody tbody tr td a input').length == 0) {
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
}


// Add range search function.
$.fn.dataTable.ext.search.push(
  function( settings, data, dataIndex) {
    var result = true;
    for (col of cols ){
      var min = parseFloat( $('#min-r-search-'+col).val(), 10 );
      var max = parseFloat( $('#max-r-search-'+col).val(), 10 );
      var target = parseFloat( data[col] ) || 0; 
      if ( !( ( isNaN( min ) && isNaN( max ) ) ||
           ( isNaN( min ) && target <= max ) ||
           ( min <= target   && isNaN( max ) ) ||
           ( min <= target   && target <= max ) ))
      {
          result = false;
      }
      if ( isNaN(min) && isNaN(max) ) {
          remove = cols.indexOf(col);
          if (remove > -1) cols.splice(remove, 1);
      }
    }
    return result;
  }
);


jQuery(document).ready(function($){
  $('#example').DataTable({
    "scrollY": "1000px",
    "scrollX": "true",
    "scrollCollapse": true,
    "aLengthMenu":  [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]]

  });

  // Add class for css 
  $('[src="CCRG-logo-black.png"]').addClass('logo');
  $('body table').first().addClass('intro-text');
/*
  var introText = $('body table tr td ').html();
  introText = introText.replace(/<br>/g, '');
  var introPara = document.createElement("td");
  introPara.innerHTML = introText; 
  $('.intro-text tr').prepend(introPara);  
*/
  var originalTitle = $('.dataTables_scrollHead thead')[0].innerHTML;

  // Start point of range search
  var order = 0;

  // The columns that do not support search.
  var noSearch = [2];

  // Add input elements for equality search and range search.
  $('.dataTables_scrollFoot tfoot th').each( function () {
      if ( noSearch.indexOf(order) === -1 ) {
	$(this).html( '\
	<input id="e-search" class="search" type="text" placeholder="Equality Search" />\
	</br><span class="search">Min:<input class="r-search" id="min-r-search-'+order+'" type="text" placeholder="Range Start" /></span>\
	</br><span class="search">Max:<input class="r-search" id="max-r-search-'+order+'" type="text" placeholder="Range End" /></span>\
	' );
      } else if (order == 2){
	$(this).html( '\
	  <button class="download-selected" type="button">Download Selected Items</button></br>\
	  <p>Select All</p>\
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
      order += 1;
  } );


  var table = $('#example').DataTable();

  // Add checkbox to the table

  inputId = 0;
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

  // Do a draw to maintain dataTables Layout
  table.draw();

  // Listening to input event.
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

      $('#e-search', this.footer()).on( 'keyup change', function () {
	  if ( that.search() !== this.value ) {
	      that
		  .search( this.value )
		  .draw();
	  }
      } );

      $('.r-search', this.footer()).keyup(function (e) {
	  if (cols.indexOf(that.index()) === -1) cols.push(that.index());
	  that.draw();
      } );
  } );

  // Make the window visible after js is loaded.  
  $('body').css("visibility", "visible");
});


