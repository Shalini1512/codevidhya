<template>
<div>
    <Header/>
    <div
        class=""
        style="display: flex; flex-direction: column;"
      >

        <div class="card">
          <div class="card-header bg-secondary text-white">
            <h4>Draft a notification</h4>
          </div>
          <div class="card-body">
            <div class="form-group">
                <div class="row mb-1 d-flex align-items-center">
                <div class="col-sm-4 col-md-4">
                  <label class="form-label">School</label>
                </div>
                <div class="col-sm-8 col-md-8">
                  <select
                    class="form-control border border-secondary"
                    v-model="notification[0].sch_id"
                  >
                  <option value="0" selected disabled>
                      Select school</option
                    >
                     <option  v-for="(school, index) in schools"
            :key="index"
            v-bind:value="school.sch_id">{{ school.name }}</option
          > 
                  </select>
                </div>
              </div>
              <div class="row mb-1 d-flex align-items-center">
                <div class="col-sm-4 col-md-4">
                  <label class="form-label">Title</label>
                </div>
                <div class="col-sm-8 col-md-8">
                  <input
                    type="text"
                    class="form-control border border-secondary"
                    id="noti-title"
                    placeholder="Enter title here"
                    v-model="notification[0].title"
                  />
                </div>
              </div>
              <div class="row mb-1 d-flex align-items-center">
                <div class="col-sm-4 col-md-4">
                  <label class="form-label">Message Type</label>
                </div>
                <div class="col-sm-8 col-md-8">
                  <select
                    class="form-control border border-secondary"
                    v-model="notification[0].type"
                  >
                    <option value="0" selected disabled>
                      Select message type</option
                    >
                   <!-- <option value="danger">Alert</option>
                    <option value="info">Information</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>-->
                    <option value="video">video</option>
                  </select>
                </div>
              </div>
              <div class="row mb-1 d-flex align-items-center" style="display:none">
                <div class="col-sm-4 col-md-4">
                  <label class="form-label">Video File</label>
                </div>
                <div class="col-sm-8 col-md-8">
                   <input
                    type="file"
                    class="form-control border border-secondary"
                    id="video"
                    accept="video/mp4"
                    placeholder="Enter title here"
                   
                  />
                </div>
              </div>
              <div class="row mb-1 d-flex align-items-center">
                <div class="col-sm-4 col-md-4">
                  <label class="form-label">Message</label>
                </div>
                <div class="col-sm-8 col-md-8">
                  <textarea
                    class="form-control border border-secondary"
                    name="message-textarea-input"
                    rows="4"
                    style="resize:none;"
                    placeholder="Type your message here.."
                    v-model="notification[0].message"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div
            class="card-footer d-flex align-items-center justify-content-center"
          >
            <button
              class="btn btn-success mr-1"
              type="button"
              @click="saveNotification()"
            >
              Save
            </button>
            <button
              class="btn btn-primary"
              onclick="hideModal('draftNotificationModal')"
            >
              Close
            </button>
          </div>
        </div>
        
      </div>
       <Loader v-if="processing" />
</div>
</template>
<script>
import moment from "vue-moment";
import Header from "@/components/header/HeaderMenuForAdmin.vue";
import Footer from "@/components/footer/Footer.vue";
import Loader from "@/components/widgets/BlockingLoader.vue";
import axios from "axios";
export default {
    name:"AdminNotification",
    components: {
    Header,
    Footer,
    Loader
  },
    data(){
        return{
             processing: false,
            schools: [],
            grades:[],
            notification: [
        {
          sch_id:3,  
          title: "",
          type: "video",
          message: "",
          filename:"",
          filetype:""
        }
      ]
        };
    },
     mounted() {
    this.getSchools();
  },
  methods:{
      getSchools: function(){
          let vm=this;
          axios.post("/api/user/getSchools").then(res => {
        vm.schools = res.data;
      }); 
      axios.post("/api/user/getGradeForNoti",{sch_id:this.notification[0].sch_id}).then(res=>{
        vm.grades =res.data;
      });
      },
      saveNotification: function()
      {
          let vm =this;
          if(!this.notification[0].sch_id)
          {
                cvNotify("Choose your school", "error");
                return false;
          }
          var formData = new FormData();
          var files=$("#video")[0].files[0];
          if(!files){
              cvNotify("Choose File before upload","error");
              return;
          }
          this.processing =true;
          formData.append("file",files);
          let config ={
               header: {
          "Content-Type": "multipart/form-data"
        }
          };
          axios.post("/api/user/uploadAdminVideoNotification",formData,config).then(res=>{
            
            this.uploadNotification(files)
          });
          
       },
       uploadNotification(file)
       {
         let vm =this;
         
         this.notification[0].filetype =file.type;
         this.notification[0].filename =file.name;
         axios.post("/api/notifications/sendAdminNotifcation",{notification:this.notification,grades:this.grades}).then(res=>{
             vm.processing=false;
         });
         
       }
      
  },
}
</script>