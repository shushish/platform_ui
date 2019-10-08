import accounting from "accounting"
import moment from "moment";


export default {
	//取两位小数
  numberformat(val, scale) {
		if (val != null && val != '') {
			return accounting.formatNumber(val, (scale || 2));
		} else {
			return '';
		}

	},
//取整数
  numberformat2(val, scale) {
    if (val != null && val != '') {
      return accounting.formatNumber(val, (scale || 0));
    } else {
      return '';
    }

  },

	dateFormat(val, opt) {
		if (val != null) {
			return moment(val).format(opt || 'YYYY-MM-DD');
		} else {
			return '';
		}

	},
	dateFormat2(val, opt) {
		if (val != null) {
			return moment(val).format(opt || 'MM-DD');
		} else {
			return '';
		}

	},

  dateFormat3(val, opt) {
    if (val != null) {
      return moment(val).format(opt || 'YYYY-MM');
    } else {
      return '';
    }

  },

	returnFloat(value) {
		if (value != null) {
			var value = Math.round(parseFloat(value) * 100) / 100;
			var xsd = value.toString().split(".");
			if (xsd.length == 1) {
				value = value.toString() + ".00";
				return value;
			}
			if (xsd.length > 1) {
				if (xsd[1].length < 2) {
					value = value.toString() + "0";
				}
				return value;
			}
		} else {
			return '';
		}
	},
	dateFormatTime(val, opt) {
		if (val) {
			return moment(val).format(opt || 'YYYY-MM-DD HH:mm:ss');
		} else {
			return "";
		}
	},
	dateFormatTime2(val, opt) {
		return moment(val).format(opt || 'YYYY');
	},
	moneyToString(money) {
		let reg;
		if (money >= 0) {
			reg = /^[0-9]+.?[0-9]*$/;
		} else {
			reg = /^-[0-9]+.?[0-9]*$/;
		}
		if (!reg.test(money)) {
			return "";
		} else {
			if (money > 100000000) {
				money = money / 100000000.0;
				money = Math.round(money * 100) / 100;
				return money + "亿";
			} else if (money > 10000) {
				money = money / 10000.0;
				money = Math.round(money * 100) / 100;
				return money + "万";
			} else {
				money = money / 10000.0;
				money = Math.round(money * 100) / 100;
				return money + "万";
			}
		}
	},
	//返回带“万”的金额
	moneyToString2(money) {
		let reg;
		if (money >= 0) {
			reg = /^[0-9]+.?[0-9]*$/;
		} else {
			reg = /^-[0-9]+.?[0-9]*$/;
		}
		// if( money =="" || money == null){
		//   return 0;
		// }
		if (money == 0 || money == 0.0 || money == 0.00) {
			return "";
		}
		if (!reg.test(money)) {
			return "";
		} else {
			if (money > 10000) {
				money = money / 10000.0;
				money = Math.round(money * 100) / 100;
				return money + "万";
			} else {
				money = money / 10000.0;
				money = Math.round(money * 100) / 100;
				return money + "万";
			}
		}
	},
	//返回万元（不带单位）
	moneyToString3(money) {
		let reg;
		if (money >= 0) {
			reg = /^[0-9]+.?[0-9]*$/;
		} else {
			reg = /^-[0-9]+.?[0-9]*$/;
		}
		// if( money =="" || money == null){
		//   return 0;
		// }
		if (money == 0 || money == 0.0 || money == 0.00) {
			return "";
		}
		if (!reg.test(money)) {
			return "";
		} else {
			if (money > 10000) {
				money = money / 10000.0;
				money = Math.round(money * 100) / 100;
				return money;
			} else {
				money = money / 10000.0;
				money = Math.round(money * 100) / 100;
				return money;
			}
		}
	},

	convertTenThousand(money) {
		let reg = /^[0-9]+.?[0-9]*$/;
		if (!reg.test(money)) {
			return "";
		} else {
			money = money / 10000.0;
			money = Math.round(money * 100) / 100;
			return money;
		}
	},
	//返回乘以100后的百分比
	percentToString(rate) {
		let reg;

		if (rate >= 0) {
			reg = /^[0-9]+.?[0-9]*$/;
		} else {
			reg = /^-[0-9]+.?[0-9]*$/;
		}
		if (!reg.test(rate) || rate == 0) {
			return "";
		} else {
			let rate1 = accounting.formatNumber(rate * 100, (2))
			return rate1 + "%"
		}
	},
	//返回百分比的数值
	percentToString1(rate) {
		let reg;
		if (rate >= 0) {
			reg = /^[0-9]+.?[0-9]*$/;
		} else {
			reg = /^-[0-9]+.?[0-9]*$/;
		}
		if (!reg.test(rate) || rate == 0) {
			return "";
		} else {
			let rate1 = accounting.formatNumber(rate, (2))
			return rate1
		}
	},
	//返回百分比
	percentToString2(rate) {
		let reg;
		if (rate >= 0) {
			reg = /^[0-9]+.?[0-9]*$/;
		} else {
			reg = /^-[0-9]+.?[0-9]*$/;
		}
		if (!reg.test(rate) || rate == 0) {
			return "";
		} else {
			let rate1 = accounting.formatNumber(rate, (2))
			return rate1 + "%"
		}
	},
	hidePartName(name) {
		if (name) {
			if (name.length > 10) {
				return name.substring(0, 9) + "..."
			} else {
				return name;
			}
		}
	},
	//获取月份的周数
	getWeeks(dateStr) {
		let date = new Date(dateStr);
		let firstWeek = this.weekIndexInYear(date);
		date.setMonth(date.getMonth() + 1);
		date.setDate(0);
		let lastWeek = this.weekIndexInYear(date);
		let weeks = [];
		for (let i = firstWeek; i <= lastWeek; i++) {
			weeks.push(i);
		}
		return weeks;
	},
	//获取当前日期的周数
	weekIndexInYear(nowDate) {
		let initTime = new Date(nowDate); //new Date(this != '' ? this : new Date());
		initTime.setMonth(0); // 本年初始月份
		initTime.setDate(1); // 本年初始时间
		let firstWeekDay = 7; // 第一周的天数，默认第一周是7天
		firstWeekDay = 7 - initTime.getDay();

		let differenceVal = nowDate - initTime; // 今天的时间减去本年开始时间，获得相差的时间
		let todayYear = Math.ceil(differenceVal / (24 * 60 * 60 * 1000)) + 1; // 获取今天是今年第几天
		let index = 1;
		if (todayYear <= firstWeekDay) {
			index = 1;
		} else {
			index = Math.ceil((todayYear - firstWeekDay) / 7) + 1; // 获取今天是今年第几周
		}
		return index;
	},

	//根据当前年份和周数，获取这周开始时间和结束时间
	dateInWeekYear(year, week) {
		var now = new Date(year, 0, 1),
			year = now.getFullYear();
		//那一年第一天是星期几
		let yearFirstDay = new Date(year, 0, 1).getDay();
		//判断当前年度第一周的天数
		let yearFirstWeekNum = 7 - yearFirstDay;
		//获取当前周周六至当前年第一天的天数
		let intervalDays = (week - 1) * 7 + yearFirstWeekNum - 1;
		let date6 = new Date(new Date(year, 0, 1).getTime() + intervalDays * 24 * 60 * 60 * 1000); //获取当前天数是周几
		let date0 = new Date(new Date(year, 0, 1).getTime() + (intervalDays - 6) * 24 * 60 * 60 * 1000); //得到普通的时间了
		let dates = [date6, date0];
		return dates;
	},
	//
	scaleToString(rate) {
		let scale = ' ';
		if (rate != null && rate > 0 && rate != 'Infinity') {
			// scale =  parseInt(rate)+":1"//直接截取
			scale = Math.round(rate) + ":1" //四舍五入
		}
		return scale;
	},

   zeroToString(num){
	  if(num == '0' || num === 0){
	    return '';
    }
    return num;
   },



	getCurrentMonthLast(year, month, opt) {
		var nextMonth = month;
		var nextMonthFirstDay = new Date(year, nextMonth, 1);
		var oneDay = 1000 * 60 * 60 * 24;
		return moment(new Date(nextMonthFirstDay - oneDay)).format(opt || 'YYYY-MM-DD');
	},
     hiddenTooLongLengthString20(name){
		 if(name !=null){
		 if(name.length>20){
			  return name.substring(0, 20)+"...";
		 }
		 }
		return name;
	 },
	  hiddenTooLongLengthString10(name){
	 		 if(name !=null){
	 		 if(name.length>10){
	 			  return name.substring(0, 10)+"...";
	 		 }
	 		 }
	 		return name;
	 }

}
