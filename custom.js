/*
* Authur, Tao
* txy2539@rit.edu
* CCRG@RIT Catalog of Numerical Simulations layout and search function
* 
*/

// Global. The array of range search columns' index. 
var cols = [];

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
          <label><input name="link-text" type="checkbox" value="" /> </label>\
          </div>\
          <div class="link-select" id="select-psi">\
          <label><input name="link-psi" type="checkbox" value="" /> </label> </br>\
          </div>\
          <div class="link-select" id="select-strain">\
          <label><input name="link-strain" type="checkbox" value="" /> </label> </br>\
          </div>\
        ');
      } else {
        $(this).html( '' );
      }
      order += 1;
      
  } );


  var table = $('#example').DataTable();

  $('.dataTables_scrollBody tbody tr td a img').each( function () {
    var aTag = this.parentNode;
    var inputTag = document.createElement("input" );
    inputTag.type = "checkbox";
    if (this.src == "metadata.png"){
      inputTag.name = "text-link";
    } else if (this.src == "tarball.png") {
      inputTag.name = "text-link";
    } else {
      inputTag.name = "text-link";
    }
    

    aTag.prepend(inputTag);
    
  });

  // Move the input to header.
  var inputTitle = $('.dataTables_scrollFoot tfoot tr');
  $('.dataTables_scrollHead thead').prepend(inputTitle);

  // Do a draw to maintain dataTables Layout
  table.draw();


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

});