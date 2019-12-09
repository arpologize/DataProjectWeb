var urlParams = new URLSearchParams(location.search);
let orderNumber=urlParams.get('orderNumber');
let list1 = document.querySelector('.bread-crumb');
let ordersAll = [];
let productsAll = [];
let promotionsAll = [];
let header;
let customer;
let discount=0;
let subt=0.00;
let tt=0;
//
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
let statusinput=document.querySelector('.orderStatus');
let statustext=document.querySelector('.orderstatustext');

let discounttext =document.querySelector('.sumDiscount');;
//
let orderdatetext=document.querySelector('.OrderDate');
let requiredatetext=document.querySelector('.RequireDate');
let shipdatetext=document.querySelector('.ShipDate');
let summitbtn =document.querySelector('.submit-btn')
//
getHeader();
getorders();
getPromotion();

$(document).ready(function () {
    $('.submit-btn').on('click',function(event){
        event.preventDefault();
        if( summitbtn.innerHTML=="Apply")
        {
            statustext.innerHTML=statusinput.value;
            statusinput.style.display = "none";
            statustext.style.display = "block";
            shipdatetext.readOnly=true;
            requiredatetext.readOnly=true;
            commenttext.readOnly=true;
            //
            document.querySelector('.submit-btn').innerHTML="Edit";
            let header={
                
                orderNumber:orderNumber,
                requiredDate:requiredatetext.value,
                shippedDate:shipdatetext.value,
                status:statusinput.value,
                comments:commenttext.value,

            }
            console.log(header);
            $.ajax({
                type: "POST",
                url: "/update/order",
                data: header,
                dataType: "json",
                success: (user)=>{
                console.log(user);
                }
            });
        }
        else
        {
            shipdatetext.readOnly=false;
            requiredatetext.readOnly=false;
            commenttext.readOnly=false;
            statusinput.style.display = "block";
            statustext.style.display = "none";
            document.querySelector('.submit-btn').innerHTML="Apply";
        }
          
      });

});

function getHeader()
{
    $.ajax({
        // all URLs are relative to http://localhost:3000/
        url: `/data/order/${orderNumber}`,
        type: 'GET',
        dataType: 'json', // this URL returns data in JSON format
        success: (data) => {
          list1.innerHTML += `<a href="Order_list.html">Orders</a><span>Order ${orderNumber}</span>`;
          // console.log('You received some data!', data);
          header = data[0];
          console.log(header);
          if(header!=undefined)
            {
                getcustomer();
                orderID.innerHTML = orderNumber;
                orderdatetext.innerHTML = header.orderDate;
                requiredatetext.value = header.requiredDate;
                shipdatetext.value = header.shippedDate;
                console.log(header.status);
                statustext.innerHTML =header.status;
                statusinput.value = header.status;
                statusinput.style.display = "none"
                commenttext.value = header.comments;

            }
        }
    });
}

function getcustomer()
{
    $.ajax({

        url: `/data/customers/number=${header.customerNumber}`,
        type: 'GET',
        dataType: 'json', // this URL returns data in JSON format
        success: (data) => {
          // console.log('You received some data!', data);
          customer = data[0];
          console.log(customer);
          cusnametext.innerHTML = customer.customerName;
        }
    });
}

function getorders()
{
    $.ajax({
        // all URLs are relative to http://localhost:3000/
        url: `/data/orderdetailsproducts/${orderNumber}`,
        type: 'GET',
        dataType: 'json', // this URL returns data in JSON format
        success: (data) => {
          // console.log('You received some data!', data);
          ordersAll = data;
          console.log(ordersAll);
          
          writeOrders();
        }
    });
}

function getPromotion()
{
    $.ajax({
        // all URLs are relative to http://localhost:3000/
        url: `/search/orderspromotions/orderNumber=${orderNumber}`,
        type: 'GET',
        dataType: 'json', // this URL returns data in JSON format
        success: (data) => {
          // console.log('You received some data!', data);
          promotionsAll = data;
          console.log(promotionsAll);
          writePromotions();
        }
    });
}

function writeOrders()
  {
    subt=0;
    ordertable.innerHTML="";
    for (var i = 0; i < ordersAll.length; i++) {
      let add=parseFloat(ordersAll[i].priceEach*ordersAll[i].quantityOrdered).toFixed(2);
      subt=parseFloat(subt)+parseFloat(add);
      console.log(add);
      ordertable.innerHTML+=
      `
      <tr class="cart_item">
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
													<span class="amount">${parseFloat(ordersAll[i].priceEach*ordersAll[i].quantityOrdered).toFixed(2)}</span>
												</td>
											</tr>
      `
    }
    subtotaltext.innerHTML='$'+subt;
    tt=parseFloat((subt-discount));
    if(tt<0)tt=0;
    ordertotaltext.innerHTML='$'+parseFloat(tt);
  }

  function writePromotions()
  {
    let disc=0;
    promotionstable.innerHTML="";
    for (var i = 0; i <promotionsAll.length; i++) {
      disc=parseFloat(promotionsAll[i].promotion.discount)

      promotionstable.innerHTML+=
      `
      <tr class="cart_item">
												<td class="product-code">
											${promotionsAll[i].code}
										</td>
										<td class="product-discount">
											<span class="amount">${promotionsAll[i].promotion.discount}</span>
										</td>
											</tr>
      `
    }
    discount=disc;
     discounttext.innerHTML='$'+discount.toFixed(2);
     tt=parseFloat((subt-discount));
     if(tt<0)
     {
         tt=0;
     }
    ordertotaltext.innerHTML='$'+parseFloat(tt);
  }