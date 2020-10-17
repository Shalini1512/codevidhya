<template>
  <div class="container-fluid m-0 p-0">
   <Header>
      <section>
        <div class="sptb-4 sptb-tab" style="padding-bottom: 2rem;">
          <div class="header-text mb-0">
            <div class="container">
              <div class="row align-items-center">
                <div
                  class="col-md-6"
                  style="display: flex; flex-direction: column; justify-content: center"
                >
                  <div class="text-left text-white">
                    <h1 class="">Coupons For Individual </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Header>
   <div class="continer-fluid">
      <div class="panel panel-primary">
        <div class="tab-menu-heading">
          <div class="tabs-menu d-flex">
           <!--tabs-->
           <div class="col-sm-12 text-right">
           <button
              type="button"
              class="btn btn-success"
              onclick="showModal('AddNewUserForCoupons')"
            >
              Add User For Coupons
            </button>
           </div>
           <!--end tabs-->
    
          </div>
        </div>
              <!--view data on tabular form-->
            <div class="panel-body tabs-menu-body" v-if="userLists && userLists.length">
          <div class="tab-content">
            <div class="tab-pane active " id="tab1">
                 <div class="row p-2 d-flex bg-primary align-items-center" >
                <div class="col-sm-2">
                  <select class="form-control">
                    <option v-for="(userList,index) in userLists" :value="userList.user_id" :key="index">{{userList.name}}</option>
                  </select>
                </div>
                <div class="col-sm-10 text-right">
                  <button class="btn btn-white" onclick="cvNotify('Comming Soon','warning')">Add Coupon</button>
                </div>
                 </div>
             <!--table-->
              <div class="row mt-4" >
                <div class="col-sm-12">
                   <div class="table-responsive">
                    <table class="table card-table table-vcenter text-nowrap">
                    <thead class="bg-secondary text-white">
                        <tr>
                            <th class="text-white">Sr. No.</th>
                            <th class="text-white">Coupon Code</th>
                            <th class="text-white">Coupon Discount</th>
                            <th class="text-white">Remaining Coupon Use</th>
                            <th class="text-white">Coupont Description</th>
                            <td class="text-white">Action</td>
                        </tr>
                    </thead>
                        <template>
                          <tr>
                            <th>1</th>
                            <td>davi20</td>
                            <td>20%</td>
                            <td>1</td>
                            <td>20% off</td>
                            <td><i class="fas fa-edit text-success mr-2" onclick="cvNotify('Comming Soon','warning')"></i><i class="far fa-trash-alt text-danger" onclick="cvNotify('Comming Soon','warning')"></i></td>
                          </tr>
                        </template>
                   
                    </table>
                   </div>
                </div>
              </div>
             <!--end table-->

            </div>
          </div>
            </div>
          <!--end view data on tabular form-->
      </div>
   </div>
<!--modal for new user-->
<div id="AddNewUserForCoupons" class="cv-modal normal">
  <div
        style="display: flex; flex-direction: column; max-width:3000px; width:98%; height:98%; overflow:auto;"
      >
       <div class="row m-0 p-2 bg-primary text-white ">
        <div class="active d-inline-block">
          <h5>Add New User</h5>
        </div>
        <i class="flex-fill"></i>
        <span
          class="d-inline-block mr-4"
          onclick="hideModal('AddNewUserForCoupons')"
          ><i class="fas fa-times"></i
        ></span>
      </div>
     <div class="content active" style=" height:100%;">
<div style="display:flex; flex-direction:column; min-height: 400px;">
  <!--registe form-->
  <div class="row">
				    <div class="single-page" >
						<div class="col-lg-8 col-xl-12 col-md-12 d-block mx-auto">
							<div class="wrapper wrapper2">
	<form id="Register" class="card-body" tabindex="500">
    <div class="trainer col-sm-12 mb-3" id="trainers">
                              <div class="com-sm-12 dropdown-contents" id="trainer_names">
                             <input type="text" placeholder="Search.." id="serach-trainer" @keyup="calfunc">
                             <div class="col-sm-12" id="expected-users" v-if="existUsersLists.length">
                               <span href="#base" v-for="(existUsersList,index) in existUsersLists" :key="index" @click="getuserdetail(existUsersList.user_id)">{{existUsersList.name}}</span>
                             </div>
                        <label>Search By Name</label>
                              </div>
                      </div>
       <div class="row" id="searchResult" v-if="Selectedkey">
          <div class="trainer col-sm-6 mb-3" id="trainers">
                              <div class="com-sm-6 dropdown-contents" id="trainer_names">
                             <input type="text" placeholder="Name" id="Name" :value="userDetail?userDetail[0].name:''">
                              <label>Name</label>
                              </div>
                              
                      </div>
                        <div class="trainer col-sm-6 mb-3" id="trainers">
                              <div class="com-sm-6 dropdown-contents" id="trainer_names">
                             <input type="text" placeholder="Email" id="email" :value="userDetail?userDetail[0].email:''" readonly>
                              <label>Email</label>
                              </div>
                              
                      </div>
                        <div class="trainer col-sm-6 mb-3" id="trainers">
                              <div class="com-sm-6 dropdown-contents" id="trainer_names">
                             <input type="text" placeholder="contact" id="contact" :value="userDetail?userDetail[0].contact:''" readonly>
                              <label>Contact</label>
                              </div>
                      </div>
                        <hr class="col-sm-12"/>
                            <div class="trainer col-sm-6 mb-3" id="trainers">
                              <div class="com-sm-6 dropdown-contents" id="trainer_names">
                             <input type="text" placeholder="Coupon Code" id="coupon_code" v-model="coupon_code">
                              <label>Coupon Code</label>
                               <small
                      v-if="registerButtonClicked && !coupon_code"
                      class="cv-error"
                      ><i class="fas fa-exclamation-circle"></i> Please Enter Coupon Code.</small
                    >
                              </div>
                      </div>
                          <div class="trainer col-sm-6 mb-3" id="trainers">
                              <div class="com-sm-6 dropdown-contents" id="trainer_names">
                             <div contenteditable="true" id="coupon_description" class="text-left" placeholder="Enter Coupon Description...." style="border:#ccc thin solid;height:80px;overflow-y:auto; color:#000"></div>
                              <label>Coupon Description</label>
                              </div>
                      </div>
                        <div class="trainer col-sm-6 mb-3" id="trainers">
                              <div class="com-sm-12 dropdown-contents" id="trainer_names">
                             <input type="text" placeholder="Coupon Discount" id="coupon_discount" v-model="coupon_dis">
                              <label>Coupon Discount</label>
                                <small
                      v-if="registerButtonClicked && !isNaN(coupon_dis) && !(this.coupon_dis>=0 && this.coupon_dis<=100)"
                      class="cv-error"
                      ><i class="fas fa-exclamation-circle"></i> Enter valid
                     discount.</small
                    >
                              </div>
                      </div>
                       <div class="col-sm-12"> 
                      <Button class="btn btn-primary" @click.prevent="AddCouponWithUser">ADD</button>
                       </div>
         </div>               

	</form>
							</div>
						</div></div></div>
  <!--end register form-->
</div>

     </div>

  </div>
</div>
<!--end modal for new user-->
<Loader v-if="processing" />
  </div>
</template>

<script>
import moment from "vue-moment";
import Header from "@/components/header/HeaderMenuForAdmin.vue";
//import Header from "@/components/header/CodevidhyaNewHeader.vue";
import Loader from "@/components/widgets/BlockingLoader.vue";
import axios from "axios";
export default{
  name:"AddCouponForIndivisual",
  components:{Header,Loader},
  data: function(){
    return{
       userId: 0,
      processing: false,
      registerButtonClicked: false,
      demoCourses:[],
      Selectedkey:0,
      
      existUsersLists:[],
      userDetail:[],
      coupon_desc:'',
      coupon_dis:'',
      coupon_code:'',
      suser_id:'',
      userLists:[]
    };
  },
  mounted(){
    this.getCoupnsUser();
  },
  methods:{
getCoupnsUser(){
  let vm =this;
  axios.post("/api/liveCourse/getCouponsUsers").then(res =>{
     vm.userLists =res.data;
  });
  //axios.post()
},
 calfunc(){
     let text = $("#serach-trainer").val();
     this.Selectedkey=0;
     let vm=this;
       axios.post("/api/liveCourse/getusersfortrainer",{text:text}).then(res=>{
          vm.existUsersLists =res.data;
       });
    },
    getuserdetail(user_id){
      this.suser_id=user_id;
      this.existUsersLists=[];
      let vm =this;
   axios.post("/api/liveCourse/getUserDetails",{user_id:user_id}).then(result=>{
        vm.userDetail =result.data;
         vm.Selectedkey=1;
}); 

      //axios.post()
    },
    AddCouponWithUser(){
      this.registerButtonClicked=true;
     this.coupon_desc =$("#coupon_description").text();
     var canSubmit = true;
     if(!this.coupon_code)
     canSubmit=false;
     else if(!isNaN(this.coupon_dis) && !(this.coupon_dis>=0 && this.coupon_dis<=100))
     canSubmit=false;
      if (!canSubmit) return;
      else{
        let vm=this;
       axios.post("/api/liveCourse/saveUserCoupons",{user_id:this.suser_id,coupon_code:this.coupon_code,coupon_desc:this.coupon_desc,discount:this.coupon_dis}).then(result=>{
        hideModal("AddNewUserForCoupons");
        
}); 

      }
    }    

  },
};
</script>

<style lang="scss" scoped>
.errorclass {
  border: solid 1px red;
}

.upload-btn-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.drag-btn {
  border: 2px dashed #58d68d;
  color: gray;
  background-color: #d5f5e3;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 12px;
  height: 50px;
}

.drag-file1 {
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  height: 50px;
}

.file-upload-form,
.image-preview {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

img.preview {
  width: 130px;
  height: 100px;
  background-color: white;
  border: 2px solid #58d68d;
  padding: 2px;
}

a {
  text-decoration: none;
  color: #000;
}

.srch_btn {
  background: #ccc;
  font-size: 17px;
  border: none;
  cursor: pointer;
  width: auto;
}

/*Quiz design copied */

#assessment-admin-root {
  #main {
    padding-left: 24px;
    padding-right: 24px;
  }
}

#assessments-and-questions-tabs {
  width: 100%;
  margin: 16px 24px;
  & > .tabs {
    align-items: center;
    div {
      min-width: 140px;
      font-family: "Rubik", sans-serif;
      &:first-of-type {
        border-top-left-radius: 8px;
      }
    }
    i {
      visibility: hidden;
    }
    button {
      height: 32px;
      margin-right: 8px;
      padding: 8px;
      line-height: 1;
      background: rgb(19, 192, 71);
    }
  }
}

#assessments-tablayout,
#que-pool-tablayout {
  .tabs {
    padding: 8px;
    background: rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    div {
      min-width: 140px;
      margin-right: 8px;
      padding: 8px;
      border-radius: 8px;
      font-family: "Rubik", sans-serif;
      &.active {
        background: rgb(0, 120, 230);
        color: #fff;
      }
    }
  }
}

#assessments-tablayout {
  .content {
    & > div {
      display: flex;
      flex-direction: row;
      padding: 24px;
      .subject-tag {
        margin-left: 24px;
        padding: 4px 8px;
        background: rgb(4, 146, 23);
        border-radius: 4px;
        font: normal 12px/1 "Rubik";
        color: #fff;
      }
      p {
        margin: 0;
      }
      .spacer {
        padding-right: 24px;
      }
      & > div:last-of-type {
        display: flex;
        flex-direction: column;
        button:first-of-type {
          margin-bottom: 8px;
        }
      }
    }
  }
}

.searchadd-a {
  padding: 16px 32px;
}

.quediv-a {
  padding: 8px;
  margin: 4px;
  background: rgba(0, 0, 0, 0.05);
}

.quedivinner-a {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.small-abutton {
  width: auto;
  margin: 0;
  padding: 4px 12px;
  background: #fff;
  border-radius: 24px;
  color: #7700ff;
  font: normal 1rem/1 "Rubik";
  border: thin solid #7700ff;
}

.small-abutton:hover {
  border-color: #fff;
  background: #7700ff;
  cursor: pointer;
  color: #fff;
}

/*ankit design */

.mbody-a {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 8px 8px;
  border-radius: 8px;
}

.modaltopic-a {
  min-width: 140px;
  padding: 8px;
  border-radius: 8px;
  background: rgb(0, 120, 230);
  color: #fff;
  text-align: center;
}

.modal-row-a {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: 50px;
  padding: 8px;
}

.subtype-a {
  input[type="radio"] {
    height: auto;
    margin: 8px 8px 0px 18px;
    width: 16px;
    height: 16px;
  }
}

.modal-left-right {
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 370px;
  border-radius: 12px;
  padding: 8px;
  background: rgb(217, 232, 251);
  justify-content: flex-start;
}

.modal-left-row1 {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-direction: row;
  padding: 8px 8px;
  background: rgb(30, 150, 255);
  border-radius: 8px;
  color: #fff;
  p,
  label {
    margin: 0;
    line-height: 1;
    font-family: "Rubik", sans-serif;
    font-size: 16px;
  }
  input[type="button"] {
    border-radius: 20px;
    font-family: "Rubik", sans-serif;
    background: #fff;
    padding: 0px 12px;
    height: 32px;
    line-height: 1.5;
    &:hover {
      background: rgb(67, 203, 254);
      color: #fff;
      border: none;
    }
  }
}

.modal-left-row2 {
  padding: 12px 8px;
  font-family: "Rubik", sans-serif;
  span {
    font-size: 16px;
    margin-right: 8px;
  }
  label {
    margin: 0;
    line-height: 1;
    font-family: "Rubik", sans-serif;
    font-size: 16px;
  }
  input[type="radio"] {
    height: auto;
    margin: 0 4px 0 24px;
  }
}

.modal-right-row2 {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  overflow: auto;
  word-break: break-word;
  background: #fff;
  margin-top: 8px;
}

.modal-right-row2 > div {
  padding: 8px;
  width: 100%;
}

.uimage-a {
  font-size: 16px;
  margin-right: 12px;
  font-family: "Rubik", sans-serif;
}

.checkbox-a {
  height: auto;
  margin: 0 16px 0 8px;
  line-height: 1;
  font-family: "Rubik", sans-serif;
  font-size: 16px;
  input {
    height: 16px;
    margin-right: 8px;
    width: 16px;
  }
  label {
    margin: 0px;
  }
}

.input-valid {
  border: thin solid #e74c3c;
}
#demo-course-modal {
  & > div {
    padding: 0 16px 16px;
    overflow: auto;
  }
  h3 {
    padding: 24px 0 16px;
    font-display: "Poppins";
    font-weight: bold;
  }
  img {
    display: block;
    width: 300px;
    margin: 0 auto 16px;
    border-radius: 8px;
  }

  .course-details{
    padding: 0 0 16px;
    font-size:1rem;
    text-align:left;
    
  }
  p {
    padding: 0 0 16px;
    font-size: 1rem;
    text-align: left;
  }

  .btn-link {
    color: #212121;
  }
}



#trainers {
  background-color: #fff;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

#trainers:hover, #trainers:focus {
  background-color: #fff;
}
#serach-trainer{
  box-sizing: border-box;
  border-bottom:1px solid #ddd;
}
#search-trainer:focus{outline: 3px slid #ddd;}

#trainer_names{
   background-color: #f6f6f6;
  overflow: auto;
  border: 1px solid #ddd;
  z-index: 1;
}

 #trainer_names span{
   color:#000;
   padding:8px 8px;
   text-decoration: none;
   display: block;
   cursor:pointer;
 }
 #trainers > span :hover {
background: #ccc;
 }
 #expected-users{
   height:100px;
   overflow:auto;
 }
 #expected-users span{
   color: #000;
   padding: 12px 16px;
   text-decoration: none;
    display: block;
 }
  #expected-users span:hover{
  background-color: #ddd;
 }

</style>
