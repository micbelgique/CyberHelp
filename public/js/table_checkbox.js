/*
var checkedRows = [];

$('#table').on('check.bs.table', function (e, row) {
  checkedRows.push({id: row.id, name: row.name, forks: row.forks});
  console.log(checkedRows);
});

$('#eventsTable').on('uncheck.bs.table', function (e, row) {
  $.each(checkedRows, function(index, value) {
    if (value.id === row.id) {
      checkedRows.splice(index,1);
    }
  });
  console.log(checkedRows);
});

$("#update_btn").click(function() {
  $("#output").empty();
  $.each(checkedRows, function(index, value) {
    $('#output').append($('<li></li>').text(value.id + " | " + value.name + " | " + value.forks));
  });
});
*/
$(document).ready(function(){
  $('#update_btn').click(function () {
      $('#table').find('tr').each(function () {
          var row = $(this);

          if (row.find('input[type="checkbox"]').is(':checked'))
          {
            var name =  $(row.find('td')[1]).html();
            var address = $(row.find('td')[2]).html();
            console.log(" data ",name, address)
           
          }
      });
  });
});