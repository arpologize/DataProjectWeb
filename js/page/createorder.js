var urlParams = new URLSearchParams(location.search);
let prodouctlist = document.querySelector('.productList');
let codelist = document.querySelector('.productCodeList');
let namelist = document.querySelector('.productNameList');
let nameinput = document.querySelector('.NameInput');
let codeinput = document.querySelector('.CodeInput');
let qtyinput= document.querySelector('.qty-val');
let pricetext= document.querySelector('.Price');
let totalpricetext= document.querySelector('.TotalPrice');
let instocktext= document.querySelector('.InStock');
let ordertable= document.querySelector('.OrdersTable');
let preordertable= document.querySelector('.PreOrdersTable');
let promotionstable= document.querySelector('.PromosTable');
let cusnametext=document.querySelector('.customerName');
let promotioninput=document.querySelector('#promotion_code');
//

let orderID= document.querySelector('.orderID');
let subtotaltext=document.querySelector('.SubTotal');
let ordertotaltext=document.querySelector('.orderTotal');
let commenttext =document.querySelector('.Comment');
let discounttext =document.querySelector('.sumDiscount');
//
let orderdatetext=document.querySelector('.OrderDate');
let requiredatetext=document.querySelector('.RequireDate');
let shipdatetext=document.querySelector('.ShipDate');
//
let productAll = [];
let preordersAll = [];
let ordersAll = [];
let promotionsAll = [];
let orderNumber=0;
let discount=0;
let qty =0;
let subt=0.00;
let tt=0;
let customerNumber=urlParams.get('customerNumber');
let customer=undefined;
console.log(nameinput);
console.log(namelist);
codelist.innerHTML ="";
namelist.innerHTML ="";

var date = new Date();
var currentDate = date.toISOString().slice(0,10);
orderdatetext.value=currentDate;
writeOrders();
writePromotions();

$(document).ready(function () {
    var user = JSON.parse(localStorage.getItem('User'));
    console.log(user);
    const requestURL = '/search/products';
    console.log('making ajax request to:', requestURL);

    ///////////////////////////////////////////////////////////////////
    $.ajax({
      // all URLs are relative to http://localhost:3000/
      url: requestURL,
      type: 'GET',
      dataType: 'json', // this URL returns data in JSON format
      success: (data) => {
        // console.log('You received some data!', data);
        productAll = data;
        console.log(productAll);
      }
      
    });

    $.ajax({
      // all URLs are relative to http://localhost:3000/
      url: '/search/preproducts',
      type: 'GET',
      dataType: 'json', // this URL returns data in JSON format
      success: (data) => {
        // console.log('You received some data!', data);
        preproductAll = data;
        console.log(preproductAll);
      }
      
    });
     $.ajax({
      // all URLs are relative to http://localhost:3000/
      url: '/maxOrdersNumber',
      type: 'GET',
      dataType: 'json', // this URL returns data in JSON format
      success: (data) => {
        // console.log('You received some data!', data);
        orderNumber = data+1;
        console.log(orderNumber);
        orderID.innerHTML = orderNumber;
      }
    });

    $.ajax({
      // all URLs are relative to http://localhost:3000/
      url: `/data/customers/number=${customerNumber}`,
      type: 'GET',
      dataType: 'json', // this URL returns data in JSON format
      success: (data) => {
        console.log('You received some data!', data);
        customer=data[0];
        
        cusnametext.innerHTML=customer.customerName;
      }    
    });

    $('.qty-up').on('click',function(event){
      event.preventDefault();
      qtyChange(1);
      qtyinput.innerHTML=parseInt(qtyinput.innerHTML)+1;
  
		});
		$('.qty-down').on('click',function(event){
      event.preventDefault();
      qtyChange(-1);
      qtyinput.innerHTML=parseInt(qtyinput.innerHTML)-1;
      if(qty < 0)
      {
        qty=0;
        qtyinput.innerHTML=0
      }
		
    });
    
    $('.addorder').on('click',function(event){
      event.preventDefault();
      let productdetail =productAll.find(({ productCode }) => productCode == `${codeinput.value}`);

      if(productdetail !=undefined && qtyinput.innerHTML>0)
      {
        let orderdetail=
        {
          orderNumber:orderNumber,
          productCode:productdetail.productCode,
          productName:productdetail.productName,
          quantityOrdered:qtyinput.innerHTML,
          priceEach:productdetail.MSRP,
          orderLineNumber:0,
          totalPrice:totalpricetext.value
        }

        if(instocktext.value>0)
        {
          ordersAll.push(orderdetail);
        }
        else
        {
          orderdetail.priceEach = parseFloat(orderdetail.priceEach*0.5).toFixed(2);
          preordersAll.push(orderdetail);
        }
      
        ReProduct();
        nameinput.value="";
        codeinput.value="";
        writeOrders();
      }
    });

    $('.addpromotion').on('click',function(event){
      event.preventDefault();
      $.ajax({
        // all URLs are relative to http://localhost:3000/
        url: `search/promotions/code=${promotioninput.value}`,
        type: 'GET',
        dataType: 'json', // this URL returns data in JSON format
        success: (data) => {
          console.log('You received some data!', data);
          if(data[0] != undefined)
          {
            if(new Date(orderdatetext.value)<=new Date(data[0].expire))
            {
              promotionsAll.push(data[0]);
              writePromotions();
            }
          }
        }
         
    });
  });
    $('.submit-btn').on('click',function(event){
      event.preventDefault();
      let header={
        orderNumber:orderNumber,
        orderDate:orderdatetext.value,
        requiredDate:requiredatetext.value,
        shippedDate:shipdatetext.value,
        status:"in process",
        comments:commenttext.value,
        customerNumber:customerNumber
      }
      console.log(header);
      if(customer!=undefined && header.orderDate!="" && header.requiredDate!="" && header.shippedDate!="" && ordersAll.length>0)
      {
        $.ajax({
          type: "POST",
          url: "/order",
          data: header,
          dataType: "json",
          success: (user)=>{
            console.log(user);
          }
        });
        for (var i = 0; i < ordersAll.length; i++) {
        
          $.ajax({
            type: "POST",
            url: "/creorderdetail",
            data:ordersAll[i],
            dataType: "json",
            success: (user)=>{
              console.log(user);
            }
            
          });

          $.ajax({
            type: "POST",
            url: "/removeproduct",
            data:ordersAll[i],
            dataType: "json",
            success: (user)=>{
              console.log(user);
            }
            
          });
          for (var i = 0; i < preordersAll.length; i++) {
            $.ajax({
              type: "POST",
              url: "/create/preorderdetail",
              data: preordersAll[i],
              dataType: "json",
              success: (user)=>{
                console.log(user);
              }
              
            });
            }

          console.log(promotionsAll);
          for (var i = 0; i < promotionsAll.length; i++) {
            let promooder={
              orderNumber:orderNumber,
              code:promotionsAll[i].code
            }
            $.ajax({
              type: "POST",
              url: "/createorderspromotions",
              data: promooder,
              dataType: "json",
              success: (user)=>{
                console.log(user);
              }
              
            });

            $.ajax({
              type: "POST",
              url: "/removepromotion",
              data:promotionsAll[i],
              dataType: "json",
              success: (user)=>{
                console.log(user);
              }
              
            });
          }
        }
        location.replace(location.origin + `/orderdetails?orderNumber=${orderNumber}`);
      }
      else
      {
        
      }
    
    });

  });

  function inputName() {
    ReProduct();
    let fitteredName=[];
    //console.log(nameinput.value);
   // console.log(namelist.innerHTML);
    if(nameinput.value != "")
    {
      fitteredName=NameFilther(nameinput.value) ;
      namelist.innerHTML ="";
      for (var i = 0; i < fitteredName.length; i++) {
        namelist.innerHTML +=
          `<li ><a  onclick="clicklist('${fitteredName[i].productCode}')">${fitteredName[i].productName}</a>
														</li> `;
      }
     
    }
  }

  function inputCode() {
    ReProduct();
    let fitteredName=[];

    if(codeinput.value != "")
    {
      fitteredName=CodeFilther(codeinput.value) ;
      codelist.innerHTML ="";
      for (var i = 0; i < fitteredName.length; i++) {
        codelist.innerHTML +=
          `<li ><a  onclick="clicklist('${fitteredName[i].productCode}')">${fitteredName[i].productCode}</a>
														</li> `;
      }
     
    }
  }

  function qtyChange(i)
  {
    qty +=i
    if(instocktext.value >0)
    {
    totalpricetext.value=(parseFloat(qty )*parseFloat(pricetext.value)).toFixed(2);
    }
    else
    {
      totalpricetext.value=(parseFloat(qty)*parseFloat(pricetext.value*0.5)).toFixed(2);
    }
  }

  function ReProduct()
  {
    totalpricetext.value=0;
    qtyinput.innerHTML=0;
    instocktext.value=0;
    pricetext.value=0;
    qty=0;
  }
  function clicklist(code) {
    let productdetail = productAll.find(({ productCode }) => productCode == `${code}`);
    nameinput.value = productdetail.productName;
    codeinput.value=productdetail.productCode;
    instocktext.value =productdetail.quantityInStock;
    pricetext.value=productdetail.MSRP;
    totalpricetext.value=qtyinput.innerHTML*productdetail.MSRP;
    codelist.innerHTML="";
    namelist.innerHTML="";
  }
  
  function NameFilther(textSearch) {
    dataMem = [];
    for (var i = 0; i < productAll.length; i++) {
      if (productAll[i].productName.toUpperCase().search(textSearch.toUpperCase()) != -1) {
        dataMem.push(productAll[i]);
      }
    }
    return dataMem;
  }

    
  function CodeFilther(textSearch) {
    dataMem = [];
    for (var i = 0; i < productAll.length; i++) {
      if (productAll[i].productCode.toUpperCase().search(textSearch.toUpperCase()) != -1) {
        dataMem.push(productAll[i]);
      }
    }
    return dataMem;
  }

function DeleteOrder(i)
{
  event.preventDefault();
  ordersAll.splice(i, 1);
  writeOrders();
}

function DeletePromotions(i)
{
  event.preventDefault();
  promotionsAll.splice(i, 1);
  writePromotions();
}

  function writeOrders()
  {
    subt=0.00;
    ordertable.innerHTML="";
    for (var i = 0; i < ordersAll.length; i++) {
      subt=parseFloat( subt+ordersAll[i].totalPrice).toFixed(2);
      ordertable.innerHTML+=
      `
      <tr class="cart_item">
												<td class="product-remove">
													<a class="remove" href="#"  onclick="DeleteOrder(${i})"><i class="fa fa-times"></i></a>
												</td>
												<td class="product-code">
                        ${ordersAll[i].productCode}
												</td>
												<td class="product-name">
													<a href="#">${ordersAll[i].productName} </a>
												</td>
												<td class="product-p">
													<span class="amount">  ${ordersAll[i].priceEach}</span>
												</td>
												<td class="product-quantity">

														<span class="qty-val"> ${ordersAll[i].quantityOrdered}</span>
													
													</div>
												</td>
												<td class="product-subtotal">
													<span class="amount">${ordersAll[i].totalPrice}</span>
												</td>
											</tr>
      `
    }

    preordertable.innerHTML="";
    for (var i = 0; i < preordersAll.length; i++) {
      subt=parseFloat( subt+preordersAll[i].totalPrice).toFixed(2);
      preordertable.innerHTML+=
      `
      <tr class="cart_item">
												<td class="product-remove">
													<a class="remove" href="#"  onclick="DeleteOrder(${i})"><i class="fa fa-times"></i></a>
												</td>
												<td class="product-code">
                        ${preordersAll[i].productCode}
												</td>
												<td class="product-name">
													<a href="#">${preordersAll[i].productName} </a>
												</td>
												<td class="product-p">
													<span class="amount">  ${preordersAll[i].priceEach}</span>
												</td>
												<td class="product-quantity">

														<span class="qty-val"> ${preordersAll[i].quantityOrdered}</span>
													
													</div>
												</td>
												<td class="product-subtotal">
													<span class="amount">${preordersAll[i].totalPrice}</span>
												</td>
											</tr>
      `
    }
    subtotaltext.innerHTML='$'+subt;
    tt=parseFloat((subt-discount)).toFixed(2);
    if(tt<0)tt=0;
    ordertotaltext.innerHTML='$'+parseFloat(tt).toFixed(2);
  }
  function writePromotions()
  {
    let disc=0;
    promotionstable.innerHTML="";
    for (var i = 0; i <promotionsAll.length; i++) {
      disc=parseFloat( disc+promotionsAll[i].discount)
      promotionstable.innerHTML+=
      `
      <tr class="cart_item">
												<td class="product-remove">
													<a class="remove" href="#"  onclick="DeletePromotions(${i})"><i class="fa fa-times"></i></a>
												</td>
												<td class="product-code">
											${promotionsAll[i].code}
										</td>
										<td class="product-discount">
											<span class="amount">${promotionsAll[i].discount}</span>
										</td>
											</tr>
      `
    }
    discount=disc;
     discounttext.innerHTML='$'+discount.toFixed(2);
     tt=parseFloat((subt-discount)).toFixed(2);
     if(tt<0)
     {tt=0;
     }
    ordertotaltext.innerHTML='$'+parseFloat(tt).toFixed(2);
  }