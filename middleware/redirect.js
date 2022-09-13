const redirectHome = function(req, res, next){
    // Check session variables
    if(req.session.userID){
        res.redirect("/admin");
    }else{
        next();
    }
}

const redirectLogin = function(req, res, next){
    // Check session variables
    if(!req.session.userID){
        res.redirect("/admin/login");
    }else{
        next();
    }
}

module.exports = {
    redirectHome,
    redirectLogin
}