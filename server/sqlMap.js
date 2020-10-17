var sqlMap = {
    user: {
        
       check : 'SELECT cu.user_id, cu.sch_id,cu.role_id,cu.name,cu.path, csd.name as sch_name FROM `cv_users` as cu, cv_school_detail as csd WHERE cu.sch_id=csd.sch_id and status=1 and cu.username=? and password=? ',
       display : 'SELECT * FROM cv_user',
       
       
    }
}

module.exports = sqlMap;