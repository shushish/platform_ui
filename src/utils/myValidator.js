//非空校验
export const notEmpty = (rule, value, callback) => {
 	const errors = []
 	if (value == null || value == '') {
 		errors.push('不能为空值')
 	}
 	callback(errors)
 }

//电话校验
 export const validatePhone = (rule, value, callback) => {
 	const errors = []
 	if (value != null) {
 		if (/[^0-9.]/g.test(value)) {
 			errors.push('请填写数字类型')
 		}
 	}
 	callback(errors)
 };

 //国内地址校验
 export const validateAddress = (rule, value, callback) => {
	 const reg = /^(.+省.+(市|(自治州)|(自治县)).*)|(((北京市)|(上海市)|(天津市)|(重庆市)).*)|(.+((自治区)|(行政区)|(行政區)).+(市|区|盟|區|(自治州)|(自治县)).*)$/g;
	 const errors = [];
	 if(!reg.test(value)){
		 errors.push('请填写正确地址');
	 }
	 callback(errors);
 }
