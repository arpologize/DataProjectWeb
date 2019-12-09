const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const fs = require('fs');
const path = require('path');
// let users =require('../../Users');
const session = require('express-session');
const db = require('./data');
const products = require('./tables/products');
const productlines = require('./tables/productlines');
const payments = require('./tables/payments');
const orders = require('./tables/orders');
const orderdetails = require('./tables/orderdetails');
const preorders = require('./tables/preOrders');
const preorderdetails  = require('./tables/preorderdetails');
const offices = require('./tables/offices');
const employees = require('./tables/employees');
const customers = require('./tables/customers');
const promotions = require('./tables/promotions');
const orderspromotions = require('./tables/orderspromotions');
promotions.hasMany(orderspromotions, { foreignKey: 'code' })
orderspromotions.belongsTo(promotions, { foreignKey: 'code' })

const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const Op = Sequelize.Op;
db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', next);
  });

//get address  
router.get('/', (req, res, next) => {


  res.sendFile(path.join(__dirname, `..`, `..`, `createorder.html`));
  // res.send(result);

});

router.get('/promotionRegister', (req, res, next) => {


  res.sendFile(path.join(__dirname, `..`, `..`, `promotionRegister.html`));
  // res.send(result);

});

router.get('/createorder', (req, res, next) => {


  res.sendFile(path.join(__dirname, `..`, `..`, `createorder.html`));
  // res.send(result);

});
router.get('/orderdetails', (req, res, next) => {


  res.sendFile(path.join(__dirname, `..`, `..`, `orderdetail.html`));
  // res.send(result);

});
router.get('/productslist', (req, res, next) => {
  res.sendFile(path.join(__dirname, `..`, `..`, `ProductLotList.html`), { name: req.user });
  // res.send(result);
});
router.get('/paymentlist', (req, res, next) => {
  res.sendFile(path.join(__dirname, `..`, `..`, `payment.html`), { name: req.user });
  // res.send(result);
});

router.get('/search/productlines', (req, res, next) => {

  productlines.findAll()
    .then(result => {
      //console.log(result);
      res.send(result);
    })
    .catch(err => { console.log(next); });

});

router.get('/login/:email', (req, res, next) => {
  employees.findAll({
    where: {
      email: '${req.params.email}',
    }
  }).then(result => {
    //console.log(result);
    res.send(result);
  }).catch(err => { console.log(next); });

});

//////////////////////products search api//////////////////////////
router.get('/search/products', (req, res, next) => {
  //console.log(`${req.params.size}`);
  /*
  ex. not select size and vendor
  http://localhost:9000/search/products/

  */
  //console.log(`${req.params.size}|${req.params.vender}|${req.params.name}`);
  // db.query(`SELECT * FROM products ORDER BY productName,productScale,productVendor `, { type: db.QueryTypes.SELECT})
  products.findAll({

    order: [`productName`, `productScale`, `productVendor`]
  })
    .then(result => {
      //console.log(result);
      res.send(result);
    })
    .catch(err => { console.log(next); });
});

router.get('/search/preproducts', (req, res, next) => {

  products.findAll({
    where:
    {
      quantityInStock: {
        [Op.eq]: 0
      }
    }
  })
    .then(result => {
      //console.log(result);
      res.send(result);
    })
    .catch(err => { console.log(next); });
});

router.get('/search/products/name=:name', (req, res, next) => {
  //console.log(`${req.params.size}`);
  /*
  ex. 
  http://localhost:9000/search/products/-&-/name=Alpine
  ex. not select size only
  */

  console.log(`${req.params.name}`);
  //db.query(`SELECT * FROM products WHERE productName LIKE '%${name}%' ORDER BY productName,productScale,productVendor`, { type: db.QueryTypes.SELECT})
  let name = req.params.name == '0' ? '%' : req.params.name;
  products.findAll({

    where:
    {
      productName: {
        [Op.like]: `%${name}%`
      }
    },
    order: [`productName`, `productScale`, `productVendor`]
  })
    .then(result => {
      // console.log(result);
      res.send(result);
    })
    .catch(err => { console.log(next); });
});

router.post('/product/update/', (req, res, next) => {
  db.query(`update products set productDescription = "${req.body.productDescription}",productScale = "${req.body.productScale}",productName = "${req.body.productName}",
          productVendor= "${req.body.productVendor}",productLine= "${req.body.productLine}",quantityInStock= "${req.body.quantityInStock}",buyPrice= "${req.body.buyPrice}",MSRP ="${req.body.MSRP}",productCode = "${req.body.productCode}"
            where productCode = "${req.body.productCodes}"`, { type: db.QueryTypes.update })
    .then(result => {
      console.log(result);
    })
    .catch(err => { console.log(err); });
});
router.delete('/product/delete/', (req, res, next) => {
  db.query(`delete from products where productCode = "${req.body.productCodes}"`, { type: db.QueryTypes.delete })

    .then(result => {
      console.log(result);
    })
    .catch(err => { console.log(err); });

 });


router.get('/data/products/:code', (req, res, next) => {
  /*
  ex. 
  http://localhost:9000/search/products/-&-/code=S12_1099
  ex. not select size only
  */
  //console.log(`${req.params.size}`);
  let code = req.params.code;
  products.findAll({
    where: {
      productCode: `${code}`
    }
  }).then(result => {
    // console.log(result);
    res.send(result);
  })
    .catch(err => { console.log(next); });
});

router.get('/productdetails', (req, res, next) => {
  res.sendFile(path.join(__dirname, `..`, `..`, `productdetails.html`), { name: req.user });
  // res.send(result);
});

///////////////////////////custommer////////////////////////////////////////////
router.get('/search/customers', (req, res, next) => {
  customers.findAll({
    order: [`customerNumber`]
  })
    /* db.query(`SELECT *
     FROM customers
     ORDER by customerName `, { type: db.QueryTypes.SELECT})*/

    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => { console.log(next); });

});



router.get('/sreach/customers/name=:name', (req, res, next) => {

  customers.findAll({

    where:
    {
      customerName: {
        [Op.like]: `${req.params.name}%`
      }
    }
    ,
    order: [`customerName`]
  })
    /* db.query(`SELECT *
     FROM customers
     WHERE customerName LIKE '${req.params.name}%';
     ORDER by customerName  `, { type: db.QueryTypes.SELECT})*/
    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => { console.log(next); });
});

router.get('/search/customers/number=:number', (req, res, next) => {
  customers.findAll({

    where:
    {
      customerNumber: {
        [Op.like]: `${req.params.number}%`
      }
    }
    ,
    order: [`customerName`]
  })
    /*db.query(`SELECT *
    FROM customers
    WHERE customerNumber LIKE '${req.params.number}%';
    ORDER by customerNumber,customerName  `, { type: db.QueryTypes.SELECT})*/
    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => { console.log(next); });
});


router.get('/data/customers/number=:number', (req, res, next) => {
  customers.findAll({
    where:
    {
      customerNumber: `${req.params.number}`
    }

  }).then(result => {
    console.log(result);
    res.send(result);
  })
    .catch(err => { console.log(next); });
});

router.get('/customerInfo=:code', (req, res) => {
  res.sendFile(path.join(__dirname, `..`, `..`, `Profile.html`), { name: req.user });
  // res.send(result);
});

router.get('/customerlist', (req, res) => {
  res.sendFile(path.join(__dirname, `..`, `..`, `CustomerList.html`));
  // res.send(result);
});


router.get('/customerorder=:code', (req, res) => {
  res.sendFile(path.join(__dirname, `..`, `..`, `Customer_DetailOrder.html`));
  // res.send(result);
});
router.get('/addcustomer', (req, res) => {
  res.sendFile(path.join(__dirname, `..`, `..`, `addcustomer.html`));
  // res.send(result);
});

router.get('/data/customers', (req, res) => {

  db.query(`SELECT *
  FROM customers
  ORDER by customerNumber,customerName`, { type: db.QueryTypes.SELECT })
    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => { console.log(err); });
});
router.post('/customer/update/', (req, res, next) => {
  db.query(`update customers set contactFirstName = "${req.body.contactFirstName}",contactLastName = "${req.body.contactLastName}",
            customerName= "${req.body.customerName}",point= "${req.body.point}",addressLine1= "${req.body.addressLine1}",addressLine2= "${req.body.addressLine2}"
            ,city= "${req.body.city}",state= "${req.body.state}",postalCode= "${req.body.postalCode}"
            ,country= "${req.body.country}",creditLimit= "${req.body.creditLimit}",phone= "${req.body.phone}",customerNumber = "${req.body.customerNumbers}"
            where customerNumber = "${req.body.customerNumber}"`, { type: db.QueryTypes.update })
    .then(result => {
      console.log(result);
    })
    .catch(err => { console.log(next); });
});

router.delete('/customer/delete/', (req, res, next) => {
  db.query(`delete from customers where customerNumber = "${req.body.customerNumber}"`, { type: db.QueryTypes.delete })

    .then(result => {
      console.log(result);
    })
    .catch(err => { console.log(next); });

});
router.post('/customer/insert/', (req, res, next) => {
  db.query(`INSERT INTO customers(contactFirstName,contactLastName,customerName,addressLine1,addressLine2,city,state,postalCode,salesRepEmployeeNumber,country,creditLimit,phone,customerNumber) VALUES("${req.body.contactFirstName}",   
            "${req.body.contactLastName}","${req.body.customerName}","${req.body.addressLine1}","${req.body.addressLine2}"
            ,"${req.body.city}","${req.body.state}","${req.body.postalCode}","${req.body.salesRepEmployeeNumber}"
            ,"${req.body.country}","${req.body.creditLimit}","${req.body.phone}","${req.body.customerNumbers}")`, { type: db.QueryTypes.INSERT })
    .then(result => {
      console.log(result);
    })
    .catch(err => { console.log(err); });

});

///////////////////employees//////////////////////////
router.get('/employeelist', (req, res) => {
  res.sendFile(path.join(__dirname, `..`, `..`, `EmployeeList.html`));
  // res.send(result);
});
router.get('/data/employee', (req, res) => {

  db.query(`SELECT *
  FROM employees
  ORDER by employeeNumber,firstName`, { type: db.QueryTypes.SELECT })
    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => { console.log(err); });
});
router.get('/employeeInfo', (req, res) => {
  res.sendFile(path.join(__dirname, `..`, `..`, `EmployeeInfo.html`), { name: req.user });
  // res.send(result);
});


router.get('/search/employees', (req, res, next) => {
  employees.findAll()
    /* db.query(`SELECT jobTitle
     FROM employees
     GROUP BY jobTitle`, { type: db.QueryTypes.SELECT})*/
    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => { console.log(next); });
});

router.get('/search/employees/allTitle', (req, res, next) => {
  employees.findAll({
    attributes: [Sequelize.literal('DISTINCT `jobTitle`'), 'jobTitle']
  })
    /* db.query(`SELECT jobTitle
     FROM employees
     GROUP BY jobTitle`, { type: db.QueryTypes.SELECT})*/
    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => { console.log(next); });
});

// router.get('/search/employees/name=:name',(req,res,next)=>{

//   let name= req.params.name=='0'?'%':req.params.name;
//   employees.findAll({

//     where:
//     {
//       customerNumber:{
//         [Op.like]: `${req.params.number}%`
//       }
//   }
//   ,
//       order:[`customerName`]
//   })
//   db.query(`SELECT *
//   FROM employees
//   WHERE employees.firstName||" "||employees.lastName LIKE '%${name}% '
//   ORDER BY employees.firstName,employees.lastName`, { type: db.QueryTypes.SELECT})
//   .then(result => {console.log(result);
//   res.send(result);
//   })
//   .catch(err => {console.log(next);});
// });


router.get('/search/employees/number=:number', (req, res, next) => {

  let number = req.params.number == '0' ? '%' : req.params.number;
  employees.findAll({

    where:
    {
      employeeNumber: {
        [Op.like]: `%${number}%`
      }
    }
    ,
    order: [`employeeNumber`, `firstName`, `lastName`]
  })
    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => { console.log(next); });
});


router.get('/data/employees/:number', (req, res, next) => {
  employees.findAll({

    where:
    {
      employeeNumber: `${req.params.number}`
    }
  })
    .then(result => {
      //console.log(result);
      res.send(result[0]);

    })
    .catch(err => { console.log(next); });
});
router.post('/employee/update/', (req, res, next) => {
  db.query(`update employees set firstname = "${req.body.firstName}",lastName = "${req.body.lastName}",
            jobTitle= "${req.body.jobTitle}",email= "${req.body.email}",extension= "${req.body.extension}",reportsTo= "${req.body.reportsTo}",officeCode ="${req.body.officeCode}"
            where employeeNumber = "${req.body.employeeNumber}"`, { type: db.QueryTypes.update })
    .then(result => {
      console.log(result);
    })
    .catch(err => { console.log(next); });
});

router.delete('/employee/delete/', (req, res, next) => {
  db.query(`delete from employees where employeeNumber = "${req.body.employeeNumber}"`, { type: db.QueryTypes.delete })

    .then(result => {
      console.log(result);
    })
    .catch(err => { console.log(next); });


});
router.post('/employee/insert/', (req, res, next) => {
  db.query(`INSERT INTO employees(firstname,lastName,jobTitle,email,extension,OfficeCode,reportsTo,password,employeeNumber) VALUES("${req.body.firstName}",   
            "${req.body.lastName}","${req.body.jobTitle}","${req.body.email}","${req.body.extension}"
            ,"${req.body.OfficeCode}","${req.body.reportsTo}","${req.body.password}","${req.body.employeeNumber}")`, { type: db.QueryTypes.INSERT })
    .then(result => {
      console.log(result);
    })
    .catch(err => { console.log(err); });

});
//////////////order/////////////////////////////////////
router.get('/orderlist', (req, res) => {
  res.sendFile(path.join(__dirname, `..`, `..`, `Order_list.html`));
  // res.send(result);
});

router.get('/data/order/:orderNumber', (req, res, next) => {

  orders.findAll({
    where:
    {
      orderNumber: req.params.orderNumber
    }
  })
    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => { console.log(next); });
});
router.get('/data/orderdetails/:orderNumber', (req, res, next) => {

  orderdetails.findAll({
    where:
    {
      orderNumber: req.params.orderNumber
    }
  })
    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => { console.log(next); });
});

router.get('/data/orderdetailsproducts/:orderNumber', (req, res, next) => {

  db.query(
    `SELECT *
  FROM orderdetails  JOIN  products USING (productCode)
  WHERE orderNumber =${req.params.orderNumber}`, { type: db.QueryTypes.SELECT }
  )
    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => { console.log(next); });
});

router.get('/search/orders', (req, res, next) => {
  orders.findAll()
    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => { console.log(next); });
});

router.get('/search/orders/allTitle', (req, res, next) => {
  orders.findAll({
    attributes: [Sequelize.literal('DISTINCT `status`'), 'status']
  })
    /* db.query(`SELECT status
     FROM orders
     GROUP BY orders`, { type: db.QueryTypes.SELECT})*/
    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => { console.log(next); });
});

router.get('/maxOrdersNumber', (req, res, next) => {
  orders.max('orderNumber').then(max => {
    console.log(max);
    res.send(max);
  });
});



router.get('/search/customerorders/number=:number', (req, res, next) => {
  orders.findAll({

    where:
    {
      customerNumber: {
        [Op.like]: `${req.params.number}%`
      }
    }
    ,
    order: [`orderNumber`]
  })
    /*db.query(`SELECT *
    FROM orders
    WHERE customerNumber LIKE '${req.params.number}%';
    ORDER by orderNumber  `, { type: db.QueryTypes.SELECT})*/
    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => { console.log(next); });
});
//////////////////////////////////////////////////////////////////////////////////
router.get('/data/promotions', (req, res) => {

  db.query(`SELECT *
  FROM promotions`, { type: db.QueryTypes.SELECT })
    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => { console.log(err); });
});

router.get('/search/promotions', (req, res, next) => {
  promotions.findAll()
    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => { console.log(next); });
});

router.get('/search/promotions/code=:code', (req, res, next) => {
  promotions.findAll(
    {
      where:
      {
        code: req.params.code,
        amount: {
          [Op.gt]: 0
        }

      }
    }
  )
    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => { console.log(next); });
});

router.get('/search/orderspromotions/orderNumber=:num', (req, res, next) => {
  orderspromotions.findAll(
    {
      include: [{
        model: promotions,
      }],
      where: { orderNumber: req.params.num }
    }
  )
    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => { console.log(next); });
});
//////////////////////////////////////////////////////////////////////////////////////////

router.get('/i', (req, res, next) => {

  db.query(`INSERT INTO productlines SELECT * FROM productlines`, { type: db.QueryTypes.INSERT })
    .then(result => {
      console.log(result);
      res.sendFile(path.join(__dirname, `..`, `..`, `LOGIN.html`));
    })
    .catch(err => { console.log(next); });
});

/////////////////////////
router.get('/login', (req, res, next) => {


  res.sendFile(path.join(__dirname, `..`, `..`, `LOGIN.html`));
  // res.send(result);

});


router.post('/login', (req, res, next) => {
  // console.log(req);
  // (req, res) => res.sendFile('productslist', req.user)
  console.log(req.body.username);
  console.log(req.body.password);
  const username = req.body.username;
  const password = req.body.password;
  employees.findAll({
    where: {
      employeeNumber: `${username}`
    }
  }).then(result => {
    // console.log(result[0]);
    const user = result[0];
    if (user == undefined) {
      console.log("authirize fail :user not found");

    }
    else {
      // let hashPass;
      // bcrypt.genSalt(10, function (err, salt) {
      //   bcrypt.hash(password, salt, function (err, hash) {
      //     hashPass=hash;
      //     console.log(`hash:${hashPass}|||${user.password}`);

      //   });
      // });

      bcrypt.compare(password, user.password, function (err, resq) {
        if (resq) {
          console.log("authirize succes");
          res.send(user);
        }
        else {
          console.log("authirize fail worng password");

        }
      });
      // if (user.password === hashPass) {
      //   console.log("authirize succes");
      //   res.send(user);
      // }

    }
  });

});

router.post('/createpromotion', (req, res, next) => {
  const promotion = req.body;
  console.log(promotion);
  return db.query(
    `INSERT INTO promotions(code, amount, discount, expire)
    SELECT * FROM(SELECT '${promotion.code}','${promotion.amount}', '${promotion.discount}', '${promotion.expire}') AS tmp
    WHERE NOT EXISTS(
      SELECT code FROM promotions WHERE code = '${promotion.code}'
    ) LIMIT 1;`, { type: db.QueryTypes.INSERT }
  ).then(function (promo) {
    if (promo) {
      response.send(promo);
    } else {
      response.status(400).send('Error in insert new promotion');
    }
  });
  // promotions.create({
  //     code: promotion.code,
  //     amount: promotion.amount,
  //     discount: promotion.discount,
  //     expire: promotion.expire
  //   })

});

router.post('/product', (req, res, next) => {
  const product = req.body;
  console.log(product);
  return db.query(
    `INSERT INTO products(productCode, productName, productLine, productScale, productVendor, productDescription, quantityInStock, buyPrice, MSRP)
    SELECT * FROM(SELECT '${product.productCode}','${product.productName}', '${product.productLine}', '${product.productScale}', '${product.productVendor}', '${product.productDescription}', '${product.quantityInStock}', '${product.buyPrice}', '${product.MSRP}') AS tmp
    WHERE NOT EXISTS(
      SELECT productCode FROM products WHERE productCode = '${product.productCode}'
    ) LIMIT 1;`, { type: db.QueryTypes.INSERT }
  ).then(function (item) {
    if (item) {
      response.send(item);
    } else {
      response.status(400).send('Error in insert new product');
    }
  });


});

router.post('/order', (req, res, next) => {
  const order = req.body;
  return orders.create({
    orderNumber: order.orderNumber,
    orderDate: order.orderDate,
    requiredDate: order.requiredDate,
    shippedDate: order.shippedDate,
    status: "in process",
    comments: order.comments,
    customerNumber: order.customerNumber
  }).then(function (order) {
    if (order) {
      response.send(order);
    } else {
      response.status(400).send('Error in insert new order');
    }
  });
});

router.post('/createorderspromotions', (req, res, next) => {
  const promoorder = req.body;
  return orderspromotions.create({
    orderNumber: promoorder.orderNumber,
    code: promoorder.code
  }).then(function (order) {
    if (order) {
      response.send(order);
    } else {
      response.status(400).send('Error in insert new order');
    }
  });
});

router.post('/update/order', (req, res, next) => {
  const order = req.body;
  console.log(order);
  return orders.update({
    requiredDate: order.requiredDate,
    shippedDate: order.shippedDate,
    status: order.status,
    comments: order.comments,

  }, {
    where: { orderNumber: order.orderNumber }
  }).then(function (order) {
    if (order) {
      response.send(order);
    } else {
      response.status(400).send('Error in insert new order');
    }
  });
});

router.post('/creorderdetail', (req, res, next) => {
  const orderdetail = req.body;
  return orderdetails.create({
    orderNumber: orderdetail.orderNumber,
    productCode: orderdetail.productCode,
    quantityOrdered: orderdetail.quantityOrdered,
    priceEach: orderdetail.priceEach,
    orderLineNumber: null,
    status: null
  }).then(function (order) {
    if (order) {
      response.send(order);
    } else {
      response.status(400).send('Error in insert new order');
    }
  });

});

router.post('/removeproduct', (req, res, next) => {
  const orderdetail = req.body;
  return products.update({
    quantityInStock: Sequelize.literal(`quantityInStock-${orderdetail.quantityOrdered}`)

  }, {
    where: { productCode: orderdetail.productCode, }
  }).then(function (order) {
    if (order) {
      response.send(order);
    } else {
      response.status(400).send('Error in insert new order');
    }
  });
});

router.post('/removepromotion', (req, res, next) => {
  const promo = req.body;
  return promotions.update({
    amount: Sequelize.literal(`amount-1`)

  }, {
    where: { code: promo.code }
  }).then(function (order) {
    if (order) {
      response.send(order);
    } else {
      response.status(400).send('Error in insert new order');
    }
  });
});
router.post('/preorder', (req, res, next) => {
  const order = req.body;
  return preOrders.create({
    orderNumber: order.orderNumber,
    orderDate: order.orderDate,
    comments: order.comments,
    customerNumber: order.customerNumber
  }).then(function (order) {
    if (order) {
      response.send(order);
    } else {
      response.status(400).send('Error in insert new order');
    }
  });
});

router.post('/create/preorderdetail', (req, res, next) => {
  const orderdetail = req.body;
  return preorderdetails.create({
    preOrderNumber: orderdetail.orderNumber,
    productCode: orderdetail.productCode,
    quantityOrdered: orderdetail.quantityOrdered,
    priceEach: orderdetail.priceEach,
    orderLineNumber: null,
    status: null
  }).then(function (order) {
    if (order) {
      response.send(order);
    } else {
      response.status(400).send('Error in insert new order');
    }
  });
});
router.get('/search/products/allSize', (req, res, next) => {
  products.findAll({
    attributes: [Sequelize.literal('DISTINCT `productScale`'), 'productScale'],
    order: ['productScale']
  })
    .then(result => {
      console.log(result);
      res.send(result);
      next();
    })


});
router.get('/search/products/allVendor', (req, res, next) => {
  //console.log(`${req.params.size}`);\
  products.findAll({
    attributes: [Sequelize.literal('DISTINCT `productVendor`'), 'productVendor'],
    order: ['productVendor']
  })
    // db.query(`SELECT productVendor FROM products GROUP by productVendor`, { type: db.QueryTypes.SELECT})
    .then(result => {
      // console.log(result);
      res.send(result);
    })
    .catch(next);

});

////////////////////////////payment/////////////////////////////
router.get('/data/payment', (req, res, next) => {
  //console.log(`${req.params.size}`);
  /*
  ex. not select size and vendor
  http://localhost:9000/search/products/

  */
  //console.log(`${req.params.size}|${req.params.vender}|${req.params.name}`);
  // db.query(`SELECT * FROM products ORDER BY productName,productScale,productVendor `, { type: db.QueryTypes.SELECT})
  payments.findAll({

    order: [`paymentDate`]
  })
    .then(result => {
      //console.log(result);
      res.send(result);
    })
    .catch(err => { console.log(next); });
});

module.exports = router;
