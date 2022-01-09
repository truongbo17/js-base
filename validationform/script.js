//Đối tượng validator
function Validator(options){

	//hàm gọi đúng thẻ cha cần tìm	
	function getParent(element, selector) {
		while (element.parentElement) {
			if(element.parentElement.matches(selector)){
				return element.parentElement;
			}
			element = element.parentElement;
		}
	}

	var selectorRule = {}; //lưu lại các rule của các thẻ input

	//hàm thực hiện validate
	function validate(inputElement, rule) {
		//value = inputElement.value
		//test function = rule.test

		//lấy ra đúng form-error của element input đó
		var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector);
		var errorMessage;

		//tất cả các rule của selector
		var rules = selectorRule[rule.selector];

		//chạy từng rule của selector (kiểm tra)
		for (var i = 0;i < rules.length; ++i) {

			switch (inputElement.type) {
				case 'checkbox':
				case 'radio':
				errorMessage = rules[i](
						formElement.querySelector(rule.selector + ':checked')
					);
				break;
				default:
				errorMessage = rules[i](inputElement.value);
				break;
			}
			// console.log(errorMessage);
			//khi có lỗi sẽ thoát khỏi vòng lặp(tức là chỉ hiển thị ra lỗi đầu tiên)
			if(errorMessage) break; 
		}

		if(errorMessage){
			errorElement.innerText = errorMessage;
			getParent(inputElement,options.formGroupSelector).classList.add('invalid'); //có lỗi thì thêm vào
		}else{
			errorElement.innerText = '';
			getParent(inputElement,options.formGroupSelector).classList.remove('invalid'); //khi không có lỗi xóa class này đi
		}

		// !! chuyển đổi sang boolen (true,false)
		return !errorMessage;
	}

	//hàm thực hiện xóa các thông báo lỗi khi người dùng nhập vào input
	function oninputCheck(inputElement) {
		var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector);//lấy ra đúng form-error của element input đó
		errorElement.innerText = '';
		getParent(inputElement,options.formGroupSelector).classList.remove('invalid'); //khi không có lỗi xóa class này đi
	}
	
	//lấy element của form cần validate
	var formElement = document.querySelector(options.form);

	if(formElement){

		//hủy sự kiện submit khi submit form
		formElement.onsubmit = (e) => {
			e.preventDefault();

			var isFormValid = true;

			//thực hiện lặp qua từng rule và validate
			options.rule.forEach(function(rule){
				var inputElement = formElement.querySelector(rule.selector); //lấy ra input element của formElement để tránh nhầm với form nào khác
				var isValid = validate(inputElement, rule);
	
				//check giá trị trả về của validate xem có false k
				if(!isValid){
					isFormValid = false;
				}
			});

			//nếu không false thì tiếp tục
			if(isFormValid){
				//trường hợp submit với js
				if(typeof options.onSubmit === 'function'){
					//chọn tất cả những thẻ có thuộc tính name và không có thuộc tính là disable
					var enableInput = formElement.querySelectorAll('[name]:not([disabled])');
					//chuyển từ nodelist sang array để dùng reduce
					var formValues = Array.from(enableInput).reduce(function(values,input){
						// console.log(input);
						switch (input.type) {
							case 'checkbox':
								//nếu không có checked trong checkbox thì return luôn values
								if(!input.matches(':checked')){
									values[input.name] = '';//vẫn trả ra chuỗi rỗng
									return values;
								}
								//nếu nó chưa phải mảng thì chuyển thành mảng để lưu nhiều
								//giá trị checkbox cùng lúc
								if(!Array.isArray(values[input.name])){
									values[input.name] = []; //bắt buộc phải là mảng
								}

								values[input.name].push(input.value);

								break;
							case 'radio':
								// values[input.name] = formElement.querySelector('input[name="'+input.name+'"]:checked').value;
								if(input.matches(':checked')){
									values[input.name] = input.value;
								}
								break; 
							case 'file':
							//file thì k lấy đc value mà lấy files
								values[input.name] = input.files;
								break;
							default:
								values[input.name] = input.value;
								break;
						}

						return values;
					}, {}); 
					//gọi tới function onSubmit và trả dữ liệu ra
					options.onSubmit(formValues);
				}else{
					//submit với hành vi mặc định
					formElement.sumit();
				}
			}
		}

		//lặp qua các phần tử rule đc truyền vào từ mảng rule(lắng nghe xự kiên blur,input)
		options.rule.forEach(function(rule){
			// console.log(rule);

			//lưu lại các rule cho mỗi input
			if(Array.isArray(selectorRule[rule.selector])){
				//các rule tiếp theo của input sẽ chạy vào đây(vì rule đầu tiên đã là 1 mảng rồi)
				// => lấy được tất cả các rule
				selectorRule[rule.selector].push(rule.test);
			}else{				
				//rule đầu tiên của input sẽ chạy vào đây vì chưa phải là mảng và chưa có gì
				selectorRule[rule.selector] = [rule.test];
			}
			
			//lấy ra input element của formElement để tránh nhầm với form nào khác
			var inputElements = formElement.querySelectorAll(rule.selector); 

			Array.from(inputElements).forEach(function(inputElement){
				//lắng nghe sự kiện khi nhấp chuột ra ngoài vùng input đang nhập(onblur)
				inputElement.onblur = function () {
					validate(inputElement, rule);
				}
				//xử lý trường hợp khi người dùng nhập input
				inputElement.oninput = function () {
					oninputCheck(inputElement);
				}
			});

		});
	}

}


// Định nghĩa các rule 
//Nguyên tắc của các rule
//1. Khi có lỗi trả ra msg lỗi
//2.Khi không có lỗi không trả ra gì (undefined)
Validator.isRequired = function(selector,message){
	return  {
		selector: selector,
		test: function(value){
			return value ? undefined : message || 'Vui lòng nhập trường này';
		}
	};
}

Validator.isEmail = function(selector,message){
	return  {
		selector: selector,
		test: function(value){
			var regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			return regexEmail.test(value) ? undefined : message || 'Trường này phải là email';
		}
	};
}

Validator.minLength = function(selector,min,message){
	return  {
		selector: selector,
		test: function(value){
			return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} ký tự`;
		}
	};
}

Validator.isConfirmed = function(selector,getConfirmValue,message){
	return  {
		selector: selector,
		test: function(value){
			return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không trùng khớp';
		}
	};
}