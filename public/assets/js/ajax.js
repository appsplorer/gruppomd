$("#edtime").on("change", function () {
	var sttime=$('#strttime').val();
  var endtime=$('#edtime').val();
  return false;
  alert(sttime+endtime);
    $.ajax({
        type: 'POST',
        url: '/addslot', 
        data: sttime,
        dataType: 'text',
      success: function(msg) {

      }
    });
  });

  function shwtimeslot(chkval){
    //alert(chkval);

    //return false;
      $.ajax({
        type: 'GET',
        url: '/shwtimeslot', 
        data: {"chkval":chkval},
        dataType: 'text',
      success: function(msg) {
        $('#modleditdta').empty().html(msg);
      }
    });
  }
