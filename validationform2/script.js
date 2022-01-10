// Viết mã JS tại đây

function Validator(formSelector) {

	var _this = this;

	//lấy parent của input
	function getParent(element, selector) {
		while (element.parentElement) {
			if(element.parentElement.matches(selector)){
				return element.parentElement;
			}
			element = element.parentElement;
		}
	}

	var formRules = {};

	//Quy ước tạo rule:
	// 1:nếu có lỗi return lại msg
	// 2:nếu không có lỗi return undefined
	var validatorRules = {
		required: function(value){
			return value ? undefined : 'Vui lòng nhập trường này';
		},
		email: function(value){
			var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			return regex.test(value) ? undefined : 'Vui lòng nhập email';
		},
		min: function(min){
			return function(value) {
				return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} kí tự`;
			}
		},
		max: function(max){
			return function(value) {
				return value.length <= min ? undefined : `Vui lòng nhập tối đa ${max} kí tự`;
			}
		},
	}

	//lấy ra form element theo form selector
	var formElement = document.querySelector(formSelector);
	//chỉ xử lý khi có element trong dom
	if(formSelector){
		var inputs = formElement.querySelectorAll('[name][rules]');
		for (input of inputs) {

			var rules = input.getAttribute('rules').split('|');
			for (rule of rules) {

				var ruleInfo;
				var isRuleHasValue = rule.includes(':');
				//xử lý trường hợp ví dụ : min:6,max:20
				if(isRuleHasValue){
					var ruleInfo = rule.split(':');
					rule = ruleInfo[0];//chỉ lấy key: min,max...
				}

				var ruleFunc = validatorRules[rule];

				if(isRuleHasValue){
					ruleFunc = ruleFunc(ruleInfo[1]);
					// console.log(ruleFunc);
				}

				if(Array.isArray(formRules[input.name])){
					//lần thứ 2 là mảng r thì chạy vào đây
					formRules[input.name].push(ruleFunc);
				}else {
					//lần đầu tiên sẽ đưa thành mảng
					// console.log(validatorRules[rule])
					formRules[input.name] = [ruleFunc];
				}
			}


			//lắng nghe sự kiện để validate (blur, onchange,....)
			input.onblur = handlerValidate;
			input.oninput = handlerClearErr;
		}

		//xóa class lỗi
		function handlerClearErr(event) {
			//event.target là phần tử mà sự kiện đã xảy ra hoặc phần tử nơi sự kiện được kích hoạt.
			var formGroup = getParent(event.target, '.form-group');
			//contains kiểm tra xem có class nào không
			if(formGroup.classList.contains('invalid')){
				formGroup.classList.remove('invalid');

				//xóa msg lỗi đi
				var formMessage = formGroup.querySelector('.form-message');
				if(formMessage){
					formMessage.innerText = '';
				}
			}
		}

		//hàm thực hiện validate
		function handlerValidate(event) {
			// console.log(event);
			var rules = formRules[event.target.name];
			var errMessage;

			for (var rule of rules) {
				errMessage = rule(event.target.value);
				if(errMessage) break;	
			}


			//nếu có lỗi thì hiển thị ra UI
			if(errMessage){
				var formGroup = getParent(event.target, '.form-group');
				if(formGroup){
					formGroup.classList.add('invalid');
					var formMessage = formGroup.querySelector('.form-message');
					if(formMessage){
						formMessage.innerText = errMessage;
					}
				}
			}

			return (!errMessage);	
		}

		//xử lý hành vi submit form
		formElement.onsubmit = function (event){
			event.preventDefault();

			var inputs = formElement.querySelectorAll('[name][rules]');
			var isValid = true;

			for(var input of inputs){
				//nếu không hợp lệ(có lỗi)
				
				/*
				handleValidate(event) = handleValidate({ target: input}) 
				suy ra event = { target: input } suy ra event.target có giá trị là input.
				*/
				if(!handlerValidate({ target: input })){
					isValid = false;
				}
			}

			//khi không có lỗi thì submit form
			if(isValid){
				if(typeof _this.onSubmit === 'function'){
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
					return _this.onSubmit(formValues);
				}

				formElement.submit();
			}
		}

		console.log(formRules);
	}
}