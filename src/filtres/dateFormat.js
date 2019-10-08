import moment from 'moment'

export default function(val,opt){
  return moment(val).format(opt|| 'YYYY-MM-DD');
}



