$(document).ready(function () {
    $(document).on("click", ".updatevalue", function(){      
          console.log("Am in");
      const requestURL1 = '/customer/update/';				
      console.log('making ajax request to:', requestURL1);
      
      var memvalue = {									
          customerNumber :$('#cnumber').val(), 			
          contactFirstName : $('#cfname').val(), 
          contactLastName : $('#clname').val(),
          customerName : $('#cname').val(),
          point : $('#cpoint').val(),
          addressLine1 : $('#caddr1').val(),
          addressLine2 : $('#caddr2').val(),
          city : $('#city').val(),
          state : $('#state').val(),
          phone : $('#phone').val(),
          postalCode : $('#postal').val(),
          country : $('#country').val(),
          customerNumbers :$('#cnumbers').val(),
          creditLimit : $('#ccredit').val()
      };
      console.log($('#cnumber').val().toString());
      $.ajax({												
      // all URLs are relative to http://localhost:3000/
      url: requestURL1,										
      type: 'POST',											
      data: memvalue,											
      dataType: 'json', // this URL returns data in JSON format  
      });
      console.log(memvalue);
      location.reload(true);
    });
  $(document).on("click", ".deletevalue", function(){      
      console.log("Am in");
  const requestURL2 = '/customer/delete/';
  console.log('making ajax request to:', requestURL2);
  
  var memvalue = {
      customerNumber :$('#cnumber').val()};
  $.ajax({
  url: requestURL2,
  type: 'DELETE',
  data: memvalue,
  dataType: 'json', // this URL returns data in JSON format
  });
  window.location.href = "CustomerList.html";
  console.log(memvalue);
  });
  $(document).on("click", ".cancle", function(){		
      location.reload(true);
  });
  
  });