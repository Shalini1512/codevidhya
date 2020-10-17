<template>
  <div class="w-100">
    <Header></Header>
    <div class="h-100" style="padding-top:58px;">
      <!--user basic details-->
      <div class="card">
        <div class="card-body">
          <div class="table-responsive border ">
            <table class="table row table-borderless w-100 m-0 ">
              <tbody class="col-lg-12 col-xl-6 p-0">
                <tr>
                  <td><strong>Full Name :</strong> Robert McLean</td>
                </tr>
                <tr>
                  <td><strong>Grade :</strong> 6<sup>th</sup></td>
                </tr>
                <tr>
                  <td><strong>Section :</strong>A</td>
                </tr>
                <tr>
                  <td><strong>Address :</strong>Sikar</td>
                </tr>
              </tbody>
              <tbody class="col-lg-12 col-xl-6 p-0">
                <tr>
                  <td><strong>School :</strong>Demo School</td>
                </tr>

                <tr>
                  <td><strong>Email :</strong> georgemestayer@Eudica.com</td>
                </tr>
                <tr>
                  <td><strong>Phone :</strong> +125 254 3562</td>
                </tr>
                <tr>
                  <td><strong>Status :</strong>Online/Offline</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!--end user basic details-->
      <!--start tabs-->
      <div class="wideget-user-tab wideget-user-tab3">
        <div class="tab-menu-heading">
          <div class="tabs-menu1">
            <ul class="nav">
              <li class>
                <a href="#tab-1" class="active" data-toggle="tab">IP History</a>
              </li>
              <li>
                <a href="#tab-2" data-toggle="tab" class>Online</a>
              </li>
              <li>
                <a href="#tab-5" data-toggle="tab" class
                  >Visited Page Summary</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!--tabs-->
      <!--tabs details-->
      <div class="tab-content border-left p-5 bg-white details-tab-content">
        <div class="tab-pane active" id="tab-1">
          Ip History
        </div>
        <div class="tab-pane" id="tab-2">
          Online record
        </div>
        <div class="tab-pane" id="tab-5">
          page Summary
        </div>
        <div></div>
      </div>
      <!--end tabs details-->
    </div>
    <Loader v-if="processing" />
  </div>
</template>

<script>
import Header from "@/components/header/HeaderMenuForAdmin.vue";
import moment from "vue-moment";
//import { GChart } from 'vue-google-charts'
import axios from "axios";
import JsonExcel from "vue-json-excel";
import Loader from "@/components/widgets/BlockingLoader.vue";
export default {
  name: "AdminSchoolIndividualUserTrackingReport",
  components: {
    Header,
    // GChart,
    // downloadExcel:JsonExcel,
    Loader
  },
  props: { sch_username: String, st_username: String },
  data() {
    return {
      select_year: 0,
      dataForExcel: [],
      processing: false,
      visited_logs_n: [],
      select_filter_data: 0,
      classes: [],
      date1: new Date().toISOString().substr(0, 10),
      date2: new Date().toISOString().substr(0, 10),
      report_name: "",
      min_date: ""
    };
  },
  beforeMount() {
    //console.log(this.sch_username);
    // this.get_logs();

    this.get_active_logs();
  },
  mounted() {
    /* $(document).ready(function(){
      
      let today = new Date();
   $('#get_start_date').datepicker({
format: "mm/dd/yyyy",
todayHighlight: true,
startDate: today,
//endDate: end,
autoclose: true
  });
  $('#get_end_date').datepicker({
format: "mm/dd/yyyy",
todayHighlight: true,
startDate: today,
//endDate: end,
autoclose: true
  });
$('#get_start_date,#get_end_date').datepicker('setDate', today);
    });*/
  },
  updated() {
    initCvTablayouts();
  },
  methods: {
    get_active_logs: function() {
      //user basic details
      //axios.post("/api/user")
      axios
        .post("/api/usertracking/get_visited_logs_individual_ips", {
          username: this.st_username
        })
        .then(res => {
          this.visited_logs_n = res.data;
          // console.log(this.visited_logs_n);
          //this.report_name =this.visited_logs_n.length?this.visited_logs_n[0].sch_name:''+' Users Overall Report';
          //let min_date =this.visited_logs_n.length?this.visited_logs_n[0].min_date:'';
          //console.log(min_date)
          // if(min_date!=0)
          //this.min_date =new Date(min_date).toISOString().substr(0,10);
        });
      axios
        .post("/api/usertracking/get_school_classes", {
          sch_name: this.sch_username
        })
        .then(res => {
          //console.log(res.data);
          this.classes = res.data;
        });
    },
    handler: function() {
      // console.log(new Date(this.date1)>new Date(this.date2))
      if (new Date(this.date1) > new Date(this.date2)) {
        window.cvNotify("Please choose date in correct format", "error");

        this.date1 = new Date().toISOString().substr(0, 10);
        this.date2 = new Date().toISOString().substr(0, 10);
      }
      let date2 = new Date(this.date2);
      date2 = new Date(date2.setDate(date2.getDate() + 1))
        .toISOString()
        .substr(0, 10);
      this.report_name = this.visited_logs_n.length
        ? this.visited_logs_n[0].sch_name
        : "" + " Users Report From " + this.date1 + " to " + this.date2;
      axios
        .post("/api/usertracking/get_visited_logs_sch_datails_cal", {
          start_date: this.date1,
          end_date: date2,
          sch_name: this.sch_username
        })
        .then(res => {
          this.visited_logs_n = res.data.data;
        });
    },
    changeType: function() {
      this.select_filter_data = $("#option_for_choose").val();
      if (this.select_filter_data == "0") {
        this.get_active_logs();
        this.date1 = new Date().toISOString().substr(0, 10);
        this.date2 = new Date().toISOString().substr(0, 10);
      } else {
        this.handler();
      }
    },
    startDownload() {
      this.processing = true;
    },
    finishDownload() {
      this.processing = false;
    },
    export_data: function() {
      let vm = this;
      this.visited_logs_n.forEach(async function(log_data, index) {
        if (index == 0) {
          vm.dataForExcel = [];
        }
        vm.dataForExcel.push({
          "Sr no": index + 1,
          name: log_data.name,
          Role: log_data.role,
          Grade: log_data.cls_id,
          Section: log_data.sec_name,
          "Login Time": vm.$moment(log_data.login_time).format("LLLL"),
          "Logout Time": log_data.logout_time
            ? vm.$moment(log_data.logout_time).format("LLLL")
            : "",
          "Time Spend": log_data.time_spent,
          "IP Address": log_data.login_ip_address,
          "School Name": vm.visited_logs_n.length
            ? vm.visited_logs_n[0].sch_name
            : "" +
              "\n (cv curriculum implemented from grade" +
              vm.classes[0].cls_id +
              " to grade" +
              vm.classes[vm.classes.length - 1].cls_id +
              ")",
          "Registered Users": vm.visited_logs_n.length
            ? vm.visited_logs_n[0].tot_users
            : "",
          "Active Users": vm.visited_logs_n.length
            ? vm.visited_logs_n[0].active_users
            : "",
          "Login Events": vm.visited_logs_n.length
        });
      });
      this.$refs.schoolUsersdown.generate();
    }
    /* viewmoreless: function()
      {
        if(this.view_more==1)
          this.view_more=0;
          else
          this.view_more=1;
      },
    change_data: function(){
     let yr = document.getElementById("change_year_data").value;
     this.select_year = yr;
     
      if(this.select_year==0)
      {
        this.get_logs();
      }
      else
      {
        let vm =this;
        axios.post("/api/userTracking/get_per_year", {
          year:yr}).then(function(res) {
        let tot_online_detail = res.data;
        if(tot_online_detail.length)
        {
          vm.data_g = 1;
           vm.chartData =[['Month', 'Active Users',' ']];
        vm.tot_year_users =tot_online_detail[0].total_users;
         let max_data = tot_online_detail.reduce((max, p) => parseInt(p.online_users) > parseInt(max) ? parseInt(p.online_users) : parseInt(max),parseInt(tot_online_detail[0].online_users));
          tot_online_detail.map((item,i)=>{
            vm.chartData.push([tot_online_detail[i].month,parseInt(tot_online_detail[i].online_users),parseInt(max_data)]);
          });
                 vm.chartData.push(['',0,0]);
                 $(".g-month").text("Fig: Active users details(Total users: "+vm.tot_year_users+" )");
        }
        else
        {
          vm.data_g = 0;
        }
      });
      axios.post("/api/userTracking/get_y_visted_rec",{year:yr}).then(res =>{

        this.chartData_v = [["data", "users"]];
        this.chartData_v.push(['Unactive Users('+parseInt(res.data[0].offine_users)+')',parseInt(res.data[0].offine_users)]);
        this.chartData_v.push(['Active Users('+res.data[0].online_users+')',parseInt(res.data[0].online_users)]);
        $(".g-visit").text("Fig: Active Users details (Total users: "+res.data[0].total_users+")");

      });
      axios.post("/api/userTracking/get_y_onlne_rec",{year:yr}).then(res =>{
        this.chartData_o = [["data", "users"]];
        this.chartData_o.push(['Offline Users('+(parseInt(res.data[0].offline_users))+')',parseInt(res.data[0].offline_users)]);
        this.chartData_o.push(['Online Users('+res.data[0].online_users+')',parseInt(res.data[0].online_users)]);
         $(".g-onlne").text("Fig: Online Users details (Active users: "+res.data[0].active_users+")");
      });
      axios.post("/api/userTracking/get_y_register_logs_details",{year:yr}).then(res =>{
        this.sch_logs_detail =res.data;
        //console.log(this.sch_logs_detail);
      });

      }
      

    },
    get_logs:function(){
      
      axios.post("/api/userTracking/get_log_analysis_reports").then(res =>{
        this.tot_analysis_report =res.data;
      });
      axios.post("/api/userTracking/get_register_logs_details").then(res=>{
        this.sch_logs_detail =res.data.data;
     
      });
      axios.post("/api/userTracking/get_visted_rec").then(res =>{
        this.chartData_v = [["data", "users"]];
        this.chartData_v.push(['Unactive Users('+parseInt(res.data[0].offine_users)+')',parseInt(res.data[0].offine_users)]);
        this.chartData_v.push(['Active Users('+res.data[0].online_users+')',parseInt(res.data[0].online_users)]);
        $(".g-visit").text("Fig: Active Users details (Total users: "+res.data[0].total_users+")");

      });
      axios.post("/api/userTracking/get_onlne_rec").then(res =>{
      //  console.log(res.data);
        this.chartData_o = [["data", "users"]];
        this.chartData_o.push(['Offline Users('+(parseInt(res.data[0].offline_users))+')',parseInt(res.data[0].offline_users)]);
        this.chartData_o.push(['Online Users('+res.data[0].online_users+')',parseInt(res.data[0].online_users)]);
         $(".g-onlne").text("Fig: Online Users details (Active users: "+res.data[0].active_users+")");


      });

     axios.post("/api/user/get_tot_users").then((res) =>{
        if (res.data.status != "200") {
        } else {
          this.tot_user_detail = res.data.data;
        }
     });
    axios.post("/api/user/get_tot_year").then((res) =>{
        if (res.data.status != "200") {
        } else {
          this.years = res.data.data;
         // this.select_year = this.years[0].year;
        }
     });
     axios.post("/api/user/get_month_users").then((res) =>{
        if (res.data.status != "200") {
        } else {
          let tot_online_detail = res.data.data;
          if(tot_online_detail.length)
           {
             this.data_g =1;
              this.tot_year_users =tot_online_detail[0].total_users;
           let max_data = tot_online_detail.reduce((max, p) => parseInt(p.online_users) > parseInt(max) ? parseInt(p.online_users) : parseInt(max),parseInt(tot_online_detail[0].online_users));
                  let vm = this;
                  this.chartData = [ ['Month', 'Visited Users', ' ']];
                  tot_online_detail.map((item,i)=>{
                     vm.chartData.push([tot_online_detail[i].month,parseInt(tot_online_detail[i].online_users),parseInt(max_data)]);
                  });
                  this.chartData.push(['',0,0]);
                   $(".g-month").text("Fig: Active users details(Total users: "+this.tot_year_users+" )");
           }
           else
           {
             this.data_g =0;
           }
          
        }
     });
    }*/
  }
};
</script>

<style lang="scss"></style>
