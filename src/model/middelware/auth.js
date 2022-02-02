export function isAuth(req, res, next) {
	if (req.session.username && chekDate(req.session.date)){
		req.session.date = new Date();
		next();
	} else {
		res.redirect('/logout/');
	}
}

export function chekDate(date){
	if (date){
		let oldDate = new Date(date);
		let resta = (new Date()).getTime() - oldDate.getTime();
		return(Math.round(resta/ (1000*60) < 10));
	}else{
		return false;
	}
  
}