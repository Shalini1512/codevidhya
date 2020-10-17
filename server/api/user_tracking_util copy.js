var dbUtils = require("./database-utils");

/*******Trackign utility function */
let TrackingIdealUser = async function(){
  let query ="SELECT t.user_id from (select user_spent_time.user_id,user_spent_time.user_status ,(case when user_visited_page.page_in_time  then (SELECT TIMESTAMPDIFF(MINUTE,max(user_visited_page.page_in_time),now()) from user_visited_page where user_visited_page.user_spen_id =user_spent_time.user_spen_id GROUP by user_spent_time.user_spen_id) else TIMESTAMPDIFF(MINUTE,(SELECT max(user_spent_ip_address.login_time) from user_spent_ip_address where user_spent_ip_address.user_spen_id =user_spent_time.user_spen_id) ,now()) end)'page_in_time',user_spent_time.login_time from user_spent_time left join user_visited_page on(user_spent_time.user_spen_id = user_visited_page.user_spen_id) where user_spent_time.user_status =1)t where t.page_in_time > 10 group by t.user_id";
 return dbUtils.runSqlQueryAsyncSelect(query,[]).then(async res =>{
   let dataResult = res.result;
     await dataResult.forEach(async (item,index)=>{
         let ip="";
          await loginCheckFunction(dataResult[index].user_id,ip).then(async () =>{ 
             await trackinglogoutUpdate(dataResult[index].user_id,ip).then(async =>{
              console.log('log out call'+dataResult[index].user_id);
            }); 
            });
    });
  });
};
let trackingloginUpdate = async function(user_id,ip_address)
{
   let query ="select * from user_spent_time where user_spent_time.user_id=? and date_format(login_time,'%d%m%y') = date_format(now(),'%d%m%y')";
   let param =[user_id];
   return  dbUtils.runSqlQueryAsyncSelect(query,param).then(async res =>{
     /***Ideal time */
     query="UPDATE `user_spent_time` SET `user_status`=0 ,logout_time = now() WHERE user_spent_time.user_id=? and date_format(login_time,'%d%m%y') <> date_format(now(),'%d%m%y')";
     param =[user_id];
     await dbUtils.runSqlQueryAsyncUpdate(query,param).then(async (updated) =>{
      if(res.result.length)
      {
       let count = parseInt(res.result[0].times_in_day)+1;
        query = "update `user_spent_time` set times_in_day =?,login_time=now(),user_status=? where user_id =? and DATE_FORMAT(user_spent_time.login_time,'%d %m %y') = DATE_FORMAT(now(),'%d %m %y')";
        param = [count, 1,user_id];
        await dbUtils.runSqlQueryAsyncUpdate(query,param).then(async (data1)=>{
          query ="UPDATE user_spent_ip_address inner join(SELECT * from user_spent_time)as u on(u.user_spen_id =user_spent_ip_address.user_spen_id and u.user_id=?) SET user_spent_ip_address.logout_time = now() WHERE  user_spent_ip_address.logout_time IS NULL";
          param =[user_id];
          await dbUtils.runSqlQueryAsyncUpdate(query,param).then(async (dat)=>{
            return dat
          });
        });
      }
      else
      {
          query ="INSERT INTO `user_spent_time`(`user_id`,`user_status`) VALUES (?,?)";
          param =[user_id,1];
          await dbUtils.runSqlQueryAsyncInsert(query,param).then(async res1 =>{
             return res1;
          });
      }
      query="SELECT max(user_spen_id) user_spen_id from user_spent_time where user_spent_time.user_status=1 and user_id=?";
      param=[user_id];
      await dbUtils.runSqlQueryAsyncSelect(query,param).then(async (user_spent)=>{
        console.log(user_spent);
        console.log(user_spent.result[0].user_spen_id)
          if(user_spent.result.err)
          {
            return user_spent.result.err;
          }
          else{
            query="INSERT INTO `user_spent_ip_address`(`user_spen_id`,  `login_ip_address`)values(?,?)";
            param =[user_spent.result[0].user_spen_id,ip_address];
            await dbUtils.runSqlQueryAsyncInsert(query,param).then(async (insertRec)=>{
          //    console.log(insertRec);
            });

          }
      });
     });
  /****End ideal time */
   
    });
};
/*********End login time user updation */
/**********Tracking logout user updation */
let trackinglogoutUpdate = async function(user_id,ip_address)
{
   console.log('trackinglogoutUpdate calling'+user_id);
        query = "update `user_spent_time`  set logout_time = (SELECT user_spent_ip_address.logout_time from user_spent_ip_address where user_spent_ip_address.ip_id in (SELECT max(ip_id) from user_spent_ip_address where (user_spent_time.user_spen_id = user_spent_ip_address.user_spen_id) and user_spent_time.user_id=?)),user_status=0 where user_id =? and (DATE(login_time) = DATE(now()) or user_status=1)";
        param = [user_id,user_id];
        return  dbUtils.runSqlQueryAsyncUpdate(query,param).then(async (data1)=>{
          console.log(data1);
              return data1;
        });
     /****End ideal time */
    
};
/*********End logout time user updation */
/*******login/logout time tracking data and transfer data */
let loginCheckFunction = async function(user_id,ip_address)
{
  
  

   let query="update user_spent_time inner join (SELECT user_visited_page.user_spen_id from user_visited_page left join user_spent_time on (user_spent_time.user_spen_id = user_visited_page.user_spen_id) where user_spent_time.user_id=? group by user_visited_page.user_spen_id limit 1) as t on (user_spent_time.user_spen_id = t.user_spen_id) set user_spent_time.user_status =1 where user_spent_time.user_status=0";
    let param =[user_id,user_id];
    return dbUtils.runSqlQueryAsyncUpdate(query,param).then(async UpdateUserapi =>{
       if(UpdateUserapi.result.err)
       {
         console.log(UpdateUserapi.result.err);
        return UpdateUserapi.result.err;
       }
       
       else{
        console.log('user_spent_time');
         console.log(UpdateUserapi);
 /***insert ip updation */
  let query1 ="update user_spent_time inner join (SELECT user_spent_ip_address.user_spen_id from user_spent_ip_address left join user_spent_time on (user_spent_time.user_spen_id = user_spent_ip_address.user_spen_id and user_spent_ip_address.logout_time IS NULL) where user_spent_time.user_id=? group by user_spent_ip_address.user_spen_id) as t on (user_spent_time.user_spen_id = t.user_spen_id) set user_spent_time.user_status =1 where user_spent_time.user_status=0";
  let par1 =[user_id];
      await dbUtils.runSqlQueryAsyncUpdate(query1,par1).then(async res=>{ 
        console.log('user_spent_time'+user_id);
        console.log(res);
        query="SELECT max(user_spen_id) user_spen_id from user_spent_time where user_spent_time.user_status=1 and user_id=?";
        param=[user_id];
        await dbUtils.runSqlQueryAsyncSelect(query,param).then(async (user_spent)=>{
            console.log('max_user_spen_time'+user_id)
         console.log(user_spent);
            if(user_spent.result.err)
            {
              return user_spent.result.err;
            }
            else{
              
             query ="UPDATE `user_spent_ip_address` inner join (SELECT max(user_spent_ip_address.ip_id) ip_id from user_spent_ip_address left join user_spent_time on (user_spent_time.user_spen_id =user_spent_ip_address.user_spen_id and user_spent_time.user_id=? and user_spent_time.user_status=1)) as u on (u.ip_id =user_spent_ip_address.ip_id) SET  user_spent_ip_address.logout_time =null ";
              param =[user_id]
              await dbUtils.runSqlQueryAsyncUpdate(query,param).then(async (insertRec)=>{
                if(insertRec.result.err)
                return insertRec.result.err
                else{
                 //  console.log('user_spent_ip_address'+user_id);
                  console.log(insertRec);
                         
            query ="update user_visited_page u1 INNER JOIN user_visited_page u2 on (u1.visited_id = u2.visited_id) left JOIN user_spent_time on(user_spent_time.user_spen_id = u1.user_spen_id and user_spent_time.user_id=? and u1.page_out_time IS NULL) set u1.update_time= now(),u1.spen_time_sec =u1.spen_time_sec+TIME_TO_SEC(TIMEDIFF(now(),u1.page_in_time)) where user_spent_time.user_spen_id =? and u1.page_out_time IS NULL";
            param =[user_id,user_id];
           await dbUtils.runSqlQueryAsyncUpdate(query,param).then(async updateVisitedPage =>{
               if(updateVisitedPage.result.err)
               return updateVisitedPage.result.err;
               else
               {
                 console.log('visit_page_updation'+user_id);
                 console.log(updateVisitedPage);
                
                query ="UPDATE `visited_page_summary` INNER JOIN  user_spent_time on (user_spent_time.user_id = visited_page_summary.user_id and user_spent_time.user_id=? and user_spent_time.user_status=1) INNER JOIN  (SELECT max(user_visited_page.user_spen_id) 'user_spen_id',SUM(user_visited_page.spen_time_sec) 'spen_time_sec',sum(user_visited_page.ideal_time) 'ideal_time',max(user_visited_page.update_time) 'update_time',user_visited_page.page_to FROM `user_visited_page` GROUP by page_to) as user_visited_page on (user_visited_page.user_spen_id = user_spent_time.user_spen_id and user_spent_time.user_id=? and user_spent_time.user_status=1) SET `spent_time`=visited_page_summary.spent_time+(user_visited_page.spen_time_sec), visited_page_summary.ideal_time = visited_page_summary.ideal_time+(user_visited_page.ideal_time),`visited_times`=(user_visited_page.update_time) where visited_page_summary.user_id=? and visited_page_summary.page_name = user_visited_page.page_to";
                param =[user_id,user_id,user_id];
              await   dbUtils.runSqlQueryAsyncUpdate(query,param).then(async updateRec =>{
               console.log("updated visit_page_summary page"+user_id);
                console.log(updateRec);
              if(updateRec.result.err)
                      return updateRec.result.err
                   else
                   {
                 //  console.log('visited_page_summagry'+user_id);
                  console.log(updateRec);
                      query ="INSERT INTO `visited_page_summary`(`page_name`, `user_id`, `spent_time`, `ideal_time`, `visited_times`) SELECT max(user_visited_page.page_to) 'page_name',user_spent_time.user_id 'user_id',sum(user_visited_page.spen_time_sec)'spent_time',sum(user_visited_page.ideal_time) 'ideal_time',max(user_visited_page.update_time) 'visited_times' from user_visited_page left join user_spent_time on user_spent_time.user_spen_id = user_visited_page.user_spen_id left join visited_page_summary on visited_page_summary.page_name = user_visited_page.page_to where user_spent_time.user_id=? and user_spent_time.user_status=1 and user_visited_page.page_to not in(SELECT visited_page_summary.page_name from visited_page_summary where visited_page_summary.user_id=?) GROUP by user_visited_page.page_to";
                      param =[user_id,user_id];
                      await dbUtils.runSqlQueryAsyncInsert(query,param).then(async insertResult=>{
                     console.log('visited_page_summary'+user_id);
                      
                     /****ip tracking */
                     query="UPDATE `user_spent_ip_address` INNER join user_spent_time on(user_spent_ip_address.user_spen_id = user_spent_time.user_spen_id and user_spent_ip_address.logout_time is NULL and user_spent_time.user_id=? and user_spent_time.user_status =1) INNER join (SELECT max(user_visited_page.user_spen_id) 'user_spen_id',sum(user_visited_page.spen_time_sec) 'spen_time_sec',sum(user_visited_page.ideal_time) 'ideal_time' from user_visited_page left join user_spent_time on user_spent_time.user_spen_id = user_visited_page.user_spen_id where user_spent_time.user_id =? and user_spent_time.user_status =1 group by user_visited_page.user_spen_id) as u on (user_spent_time.user_spen_id = u.user_spen_id) SET user_spent_ip_address.logout_time = now(), user_spent_ip_address.logout_ip_address=?,user_spent_ip_address.time_spend =user_spent_ip_address.time_spend + u.spen_time_sec where user_spent_time.user_id=? and user_spent_time.user_status=1 and user_spent_ip_address.logout_time is NULL";
                     param=[user_id,user_id,ip_address,user_id];
                     await dbUtils.runSqlQueryAsyncUpdate(query,param).then(async updateiprec =>{
                      console.log('user_spent_ip_address'+user_id);
                      
                       query ="UPDATE `user_spent_ip_address` INNER join user_spent_time on(user_spent_ip_address.user_spen_id = user_spent_time.user_spen_id and user_spent_ip_address.logout_time is NULL and user_spent_time.user_id=? and user_spent_time.user_status =1)  SET user_spent_ip_address.logout_time = now(), user_spent_ip_address.logout_ip_address=? where user_spent_time.user_id=? and user_spent_time.user_status=1 and user_spent_ip_address.logout_time is NULL";
                       param=[user_id,ip_address,user_id];
                       await dbUtils.runSqlQueryAsyncUpdate(query,param).then(async upiprecifleft =>{
                         if(upiprecifleft.result.err)
                         return upiprecifleft.result.err;
                         else{
                          console.log('user_spent_ip_address'+user_id);
                          
                          query ="update user_spent_time inner join (SELECT max(user_visited_page.user_spen_id) 'user_spen_id',sum(user_visited_page.spen_time_sec) 'spen_time_sec',sum(user_visited_page.ideal_time) 'ideal_time' from user_visited_page left join user_spent_time on user_spent_time.user_spen_id = user_visited_page.user_spen_id where user_spent_time.user_id =? and user_spent_time.user_status =1 group by user_visited_page.user_spen_id) as u on (user_spent_time.user_spen_id = u.user_spen_id) set user_spent_time.user_status = 0,user_spent_time.spend_time = user_spent_time.spend_time + u.spen_time_sec, user_spent_time.logout_time =now() where user_spent_time.user_id=? and user_spent_time.user_status=1";
                          param =[user_id,user_id],
                          await dbUtils.runSqlQueryAsyncUpdate(query,param).then(async updateLogs =>{
                            //ipaddress page visit times
                     
                            //end ipaddress page visit times
                            if(updateLogs.result.err)
                             return updateLogs.result.err;
                             else{
                              console.log('update user_spent_time'+user_id);
                             
                              query="DELETE FROM `user_visited_page` WHERE user_visited_page.user_spen_id in (SELECT user_spen_id from user_spent_time where user_spent_time.user_id =? )";
                              param=[user_id];
                              await dbUtils.runSqlQueryAsyncUpdate(query,param).then(async deledata =>{
                                console.log('deletedate'+user_id);
                                console.log(deledata);
                              //return deledata;
                              });
                             }
          
                          });

                         }
                       });
                     
                     });
                     /***end ip tracking */
                
                      });
                   }
                });
               }
           });
                }
                });
            }
        });
      });
      /***end ip updatin */
       }
    });
 
};

/*******end login/logout time tracking data and transfer data */
/*******End Trackign utility function */
module.exports.TrackingIdealUser = TrackingIdealUser;
module.exports.trackingloginUpdate =trackingloginUpdate;
module.exports.trackinglogoutUpdate = trackinglogoutUpdate;
module.exports.loginCheckFunction =loginCheckFunction;