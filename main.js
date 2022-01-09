// var fullName = "Nguyen Quang Truong";

/*
alert(fullName);
console.log(fullName);
confirm('Xac nhan');
prompt('Nhap tuoi', '20');
setTimeout(function(){
	alert("hien thi sau 3 giay");
}, 3000);

var index = 0;
setInterval(function(){
	console.log("Hien thi" + index++);
},1000)
*/

/*
Toán tử số học - Arithmetic
Toán tử gán - Assignment
Toán tử so sánh - Comparison
Toán tử logic - Logical
*/

// /*Chuỗi*/
// var mystring = "Nguyen Quang Truong";
// // find index
// mystring.indexOf("Quang");
// //cắt chuỗi
// mystring.slice(4,10);
//replace
//trim
//toupcaser
//split ->string to array
//get a character by index
//includes kiểm tra xem chuỗi được cung cấp có nằm trong chuỗi hay không -> trả về tru false




/*Hàm*/
/*
Loại hàm Build-in,tự định nghĩa
Không thực thi khi được định nghĩa
Thực thi khi được gọi
Có thể nhận tham số
Có thể trả về giá trị
-arguments : nhận giá trị không cần tham số trong function

Các loại : Declaration function,Expression function, Arrow function
*/



/*Polyfill*/
//Là một đoạn mã được sử dụng để cung cấp chức năng hiện đại trên các trình duyệt cũ hơn vốn không hỗ trợ


/*Object*/

//Object Constructor

// function User(firstname,lastname,avtar){
// 	this.firstname = firstname,
// 	this.avtar = avtar,
// 	this.lastname = lastname
// }

//Object prototype thêm vào đối tượng đã được tạo ra
// User.prototype.className = "F8";
// User.prototype.getClassName = function(){
// 	return this.className;
// }

// var author = new User("Truong","Nguyen","avtar1");
// var user = new User("Vu","Nguyen","avtar2");

// console.log(author);
// console.log(user);

// console.log(author.className);
// console.log(author.getClassName());


/*Datetime*/
// var date = new Date();
// console.log(date);


/*For in loop*/
// var myInfo = {
// 	name:"Nguyen Quang Truong",
// 	age:18,
// 	address:"Ha Noi"
// }

// for (var key in myInfo){
// 	console.log(key);
// }


/*For of loop*/
// var myInfo = [
// "Nguyen Quang Truong",
// 18,
// "Ha Noi"
// ]

// for (var key of myInfo){
// 	console.log(key);
// }

/*convert to object to key : Object.keys(objectname)*/

// var i = 0;
// while (i<10) {
// 	console.log(i);
// 	i++;
// }



/*Math Object*/
//Math.round : làm tròn số
//abs : giá trị tuyệt đối
//ceil : làm tròn lên trên
//floor : làm tròn xuống dưới
//random : ngẫu nhiên
//min max


/*Callback*/
// -Là hàm
// -Được truyền qua đối số
// -Được gọi lại


/*forEach*/
// Array.prototype.forEach2 = function(callback){
// 	for (var index in this){
// 		console.log(index);
// 	}
// }

// var courses = [
// 'Javascript',
// 'HTML',
// 'CSS',
// ];

// courses.forEach2(function(course,index,array){
// 	console.log(course,index,array);
// });


/*DOM*/

/*HTML DOM - DOM API*/
// document.write('hahahaha');
// querySelector()
// querySelectorAll()

//CALLBACK,PROMISE,ASYNC AWAIT

//ES6
//Letq
//${} template literals
//Enhanced object property
//Extend Parameter handling


/*innerText, textContent*/
//innerText : return a text
//textContent : skip all tag,return all text

// boxElement = document.querySelector('.box');

// boxElement.innerHTML = '<h1>Hello</h1>';
// boxElement.outerHTML = '<h1>Hello haha</h1>'
//Node property

// boxElement.style.color = 'red';

// Object().assign(boxElement.style, {
// 	size:'20px',
// 	fontWeight: 'bold'
// });

//ClassList: add,contains,remove,toggle

//DOM Events
// var inputElement = document.querySelector('input[type="text"]');
// var text = document.querySelector('.text');

// //oninput lấy trực tiếp khi gõ
// inputElement.oninput = function(e){
// 	console.log(e);
// 	text.innerText = e.target.value;
// }
