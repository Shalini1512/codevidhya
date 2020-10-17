<template>
  <div class="w-100">
    <Header></Header>
    <div class="h-100" style="padding-top:58px;">
      <div class="container-scroller">
        <!--main panel-->
        <div class="main-panel">
          <!--start welcome menu-->
          <div class="row">
            <div class="col-md-12 grid-margin m-3">
              <div class="d-flex justify-content-between flex-wrap">
                <div class="d-flex align-items-end flex-wrap p-3">
                  <div class="mr-md-3 mr-xl-5">
                    <h2>Welcome back,</h2>
                    <p class="mb-md-0">Codevidhya analytics dashboard.</p>
                  </div>
                  <!--<div class="d-flex">
                    <i class="mdi mdi-home text-muted hover-cursor"></i>
                    <p class="text-primary mb-0 hover-cursor">Analytics</p>
                  </div>-->
                </div>
                <!--other menu-->
                <div
                  class="d-flex justify-content-between align-items-end flex-wrap mr-3"
                >
                  <!--<button type="button" class="btn btn-light bg-white btn-icon mr-3 d-none d-md-block ">
                    <i class="mdi mdi-download text-muted"></i>
                  </button>
                  <button type="button" class="btn btn-light bg-white btn-icon mr-3 mt-2 mt-xl-0">
                    <i class="mdi mdi-clock-outline text-muted"></i>
                  </button>
                  <button type="button" class="btn btn-light bg-white btn-icon mr-3 mt-2 mt-xl-0">
                    <i class="mdi mdi-plus text-muted"></i>
                  </button>-->
                  <!-- <button class="btn btn-primary mt-2 mt-xl-0">Generate report</button>-->
                </div>
                <!--end other menu-->
              </div>
            </div>
          </div>
          <!--end welcome menu-->
          <!--list of summerization-->
          <div class="row">
            <div class="col-md-12 grid-margin stretch-card">
              <div class="card">
                <div class="card-body dashboard-tabs p-0">
                  <!--<ul class="nav nav-tabs px-4" role="tablist">
                    <li class="nav-item">
                      <a class="nav-link active" id="overview-tab" data-toggle="tab" href="#overview" role="tab" aria-controls="overview" aria-selected="true">Overview</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" id="sales-tab" data-toggle="tab" href="#sales" role="tab" aria-controls="sales" aria-selected="false">Sales</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" id="purchases-tab" data-toggle="tab" href="#purchases" role="tab" aria-controls="purchases" aria-selected="false">Purchases</a>
                    </li>
                  </ul>-->
                  <div class="tab-content py-0 px-0">
                    <div
                      class="tab-pane fade show active"
                      id="overview"
                      role="tabpanel"
                      aria-labelledby="overview-tab"
                    >
                      <div class="d-flex flex-wrap justify-content-xl-between">
                        <div
                          class="d-none d-xl-flex border-md-right flex-grow-1 align-items-center justify-content-center p-3 item"
                        >
                          <i class="fa fa-users m-2 fa-2x text-primary"></i>
                          <div
                            class="d-flex flex-column justify-content-around"
                          >
                            <small class="mb-1 text-muted"
                              >Total Registered Users(A+B+C+D)</small
                            >
                            <h5 class="text-center">
                              {{
                                tot_analysis_report.length
                                  ? tot_analysis_report[0].total_users
                                  : ""
                              }}
                            </h5>
                          </div>
                        </div>
                        <div
                          class="d-flex border-md-right flex-grow-1 align-items-center justify-content-center p-3 item"
                        >
                          <i class="fa fa-school m-2 fa-2x text-primary"></i>
                          <div
                            class="d-flex flex-column justify-content-around"
                          >
                            <small class="mb-1 text-muted"
                              >Total Institute(A)</small
                            >
                            <h5 class="mb-0 text-center">
                              {{
                                tot_analysis_report.length
                                  ? tot_analysis_report[0].total_school
                                  : ""
                              }}
                            </h5>
                          </div>
                        </div>
                        <div
                          class="d-flex border-md-right flex-grow-1 align-items-center justify-content-center p-3 item"
                        >
                          <i
                            class="fas fa-chalkboard-teacher m-2 fa-2x text-primary"
                          ></i>
                          <div
                            class="d-flex flex-column justify-content-around"
                          >
                            <small class="mb-1 text-muted"
                              >Total Teachers(B)</small
                            >
                            <h5 class="mb-0 text-center">
                              {{
                                tot_analysis_report.length
                                  ? tot_analysis_report[0].total_teachers
                                  : ""
                              }}
                            </h5>
                          </div>
                        </div>
                        <div
                          class="d-flex border-md-right flex-grow-1 align-items-center justify-content-center p-3 item"
                        >
                          <i
                            class="fa fa-graduation-cap m-2 fa-2x text-primary"
                            aria-hidden="true"
                          ></i>
                          <div
                            class="d-flex flex-column justify-content-around"
                          >
                            <small class="mb-1 text-muted"
                              >Total Students(C)</small
                            >
                            <h5 class="mb-0 text-center">
                              {{
                                tot_analysis_report.length
                                  ? tot_analysis_report[0].total_students
                                  : ""
                              }}
                            </h5>
                          </div>
                        </div>
                        <div
                          class="d-flex border-md-right flex-grow-1 align-items-center justify-content-center p-3 item"
                        >
                          <i class="fas fa-user m-2 fa-2x text-primary"></i>
                          <div
                            class="d-flex flex-column justify-content-around"
                          >
                            <small class="mb-1 text-muted"
                              >Individual Users(D)</small
                            >
                            <h5 class="mb-0 text-center">
                              {{
                                tot_analysis_report.length
                                  ? tot_analysis_report[0].total_individual
                                  : ""
                              }}
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--end list of summerization-->
          <!--analysis report via graph-->
          <div class="row mx-1">
            <div class="col-md-8 grid-margin stretch-card">
              <div class="card">
                <div class="card-body">
                  <p class="card-title d-flex ">
                    <span class="flex-grow-1"
                      >Users analysis report
                      {{ select_year == 0 ? "overall" : select_year }}</span
                    >
                    <span class="flex-grow-1 text-right" v-if="years.length"
                      >Year:
                      <select
                        class="select"
                        id="change_year_data"
                        style="padding:4px 8px;"
                        @change="change_data()"
                      >
                        <option value="0">overall</option>
                        <option
                          v-for="(year, y_index) in years"
                          :key="y_index"
                          :option="year.uear"
                          >{{ year.year }}</option
                        >
                      </select>
                    </span>
                  </p>

                  <div v-if="data_g">
                    <GChart
                      class="mt-0 p-0"
                      type="ColumnChart"
                      :data="chartData"
                      :options="chartOptions"
                    />
                    <div class="text-center g-month"></div>
                  </div>
                  <div v-else class="text-center">data not available.</div>
                </div>
              </div>
            </div>
            <div class="col-md-4 grid-margin stretch-card">
              <div class="card">
                <div class="card-body">
                  <p class="card-title">
                    Visited Users Report
                    {{ select_year == 0 ? "overall" : select_year }}
                  </p>
                  <GChart
                    class="m-0 p-0"
                    type="PieChart"
                    :data="chartData_v"
                    :options="chartOptions_v"
                  />
                  <div class="text-center g-visit"></div>
                </div>
              </div>
            </div>
          </div>
          <!--end analysis report via graph-->
          <!--school views-->
          <div class="row mx-1">
            <div class="col-md-8 stretch-card">
              <div class="card">
                <div class="card-body">
                  <p class="card-title d-flex">
                    <span class="flex-grow-1">
                      Institute Report
                      {{ select_year == 0 ? "overall" : select_year }}
                    </span>
                    <span
                      class="flex-grow-1 text-right"
                      style="cursor:pointer; font-size:12px;"
                      @click="export_data()"
                      ><u>Export As Excel</u>
                      <downloadExcel
                        ref="schooldown"
                        id="click_export"
                        :data="dataForExcel"
                        :before-generate="startDownload"
                        :before-finish="finishDownload"
                        style="display:none;"
                        :name="
                          select_year == 0
                            ? 'Codevidhya overall Schools Tracking Report'
                            : 'Codevidhya School Tracking Report ' + select_year
                        "
                      ></downloadExcel>
                    </span>
                  </p>
                  <div class="table-responsive">
                    <table id="recent-purchases-listing" class="table">
                      <thead>
                        <tr>
                          <th>Sr no</th>
                          <th>Institute name</th>
                          <th>Registered Users</th>
                          <th>Active Users</th>
                          <th>Total login Event</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <template
                          v-for="(sch_det, sch_index) in sch_logs_detail"
                        >
                          <tr
                            :key="sch_index"
                            v-if="view_more == 1 ? sch_index < 5 : sch_index"
                          >
                            <td>{{ sch_index + 1 }}</td>
                            <td>{{ sch_det.name }}</td>
                            <td
                              v-html="
                                sch_det.sch_by_users ? sch_det.sch_by_users : 0
                              "
                            ></td>
                            <td>
                              {{
                                sch_det.active_user ? sch_det.active_user : 0
                              }}
                            </td>
                            <!--<td v-html="sch_det.per_day_log?sch_det.per_day_log:0"></td>-->
                            <td
                              v-html="
                                sch_det.each_ip_entry
                                  ? sch_det.each_ip_entry
                                  : 0
                              "
                            ></td>
                            <td v-if="sch_det.sch_by_user == 0">
                              <button
                                class="cv-button"
                                @click="notify('unlock', 'success')"
                              >
                                view
                              </button>
                            </td>
                            <td v-else>
                              <button
                                class="btn btn-primary"
                                @click="
                                  $router.push({
                                    name: 'AdminSchoolTrackingReport',
                                    params: {
                                      sch_username: sch_det.sch_user_name
                                    }
                                  })
                                "
                              >
                                view
                              </button>
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                    <div class="text-center">
                      <button
                        class="btn btn-primary"
                        v-if="sch_logs_detail.length > 5"
                        @click="viewmoreless"
                      >
                        {{ view_more == 1 ? "view more" : "view less" }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--online users-->
            <div class="col-md-4 grid-margin stretch-card">
              <div class="card">
                <div class="card-body">
                  <p class="card-title">
                    Current Online Users Report
                    {{ select_year == 0 ? "overall" : select_year }}
                  </p>
                  <GChart
                    class="m-0 p-0"
                    type="PieChart"
                    :data="chartData_o"
                    :options="chartOptions_o"
                  />
                  <div class="text-center g-onlne"></div>
                </div>
              </div>
            </div>
            <!--end online users-->
          </div>
          <!--end schools views-->
        </div>
        <!--end main panel-->
      </div>
    </div>
    <Loader v-if="processing" />
  </div>
</template>

<script>
import Header from "@/components/header/HeaderMenuForAdmin.vue";

import moment from "vue-moment";
import { GChart } from "vue-google-charts";
import axios from "axios";
import JsonExcel from "vue-json-excel";
import Loader from "@/components/widgets/BlockingLoader.vue";

export default {
  name: "AdminHome",
  components: {
    Header,
    GChart,
    downloadExcel: JsonExcel,
    Loader
  },

  data() {
    return {
      log_detail: [],
      select_year: 0,
      tot_user_detail: [],
      tot_analysis_report: [],
      chartData: [],
      chartOptions: {
        colors: ["blue", "none"],
        height: 300,
        vAxis: { gridlines: { count: 10 } },

        legend: {
          display: true
        },
        label: {
          display: true
        },
        bar: { groupWidth: "50%" },
        chart: {
          title: "Visited Users"
        }
      },
      years: [],
      tot_year_users: "",
      chartData_o: [],
      chartOptions_o: {
        height: 300,
        colors: ["#868e96", "#ec296b"],
        is3D: true,
        chart: {
          title: "Platform used users"
        }
      },
      chartData_v: [],
      chartOptions_v: {
        height: 300,

        colors: ["#868e96", "#ec296b"],
        is3D: true,
        chart: {
          title: "Platform used users"
        }
      },
      sch_logs_detail: [],
      view_more: 1,
      dataForExcel: [],
      processing: false,
      data_g: 1
    };
  },
  beforeMount() {
    this.get_logs();
  },
  updated() {
    initCvTablayouts();
  },
  methods: {
    startDownload() {
      this.processing = true;
    },
    finishDownload() {
      this.processing = false;
    },
    export_data: function() {
      let vm = this;
      this.sch_logs_detail.forEach(async function(log_data, index) {
        if (index == 0) {
          vm.dataForExcel = [];
        }
        vm.dataForExcel.push({
          "Sr no": index + 1,
          "School name": log_data.name,
          "Registerd users": log_data.sch_by_users,
          "Active users": log_data.active_user ? log_data.active_user : 0,
          "Total Login Active": log_data.each_ip_entry
            ? log_data.each_ip_entry
            : 0
        });
      });

      this.$refs.schooldown.generate();
    },
    viewmoreless: function() {
      if (this.view_more == 1) this.view_more = 0;
      else this.view_more = 1;
    },
    change_data: function() {
      let yr = document.getElementById("change_year_data").value;
      this.select_year = yr;

      if (this.select_year == 0) {
        this.get_logs();
      } else {
        let vm = this;
        axios
          .post("/api/userTracking/get_per_year", {
            year: yr
          })
          .then(function(res) {
            let tot_online_detail = res.data;
            if (tot_online_detail.length) {
              vm.data_g = 1;
              vm.chartData = [["Month", "Active Users", " "]];
              vm.tot_year_users = tot_online_detail[0].total_users;
              let max_data = tot_online_detail.reduce(
                (max, p) =>
                  parseInt(p.online_users) > parseInt(max)
                    ? parseInt(p.online_users)
                    : parseInt(max),
                parseInt(tot_online_detail[0].online_users)
              );
              tot_online_detail.map((item, i) => {
                vm.chartData.push([
                  tot_online_detail[i].month,
                  parseInt(tot_online_detail[i].online_users),
                  parseInt(max_data)
                ]);
              });
              vm.chartData.push(["", 0, 0]);
              $(".g-month").text(
                "Fig: Active users details(Total users: " +
                  vm.tot_year_users +
                  " )"
              );
            } else {
              vm.data_g = 0;
            }
          });
        axios
          .post("/api/userTracking/get_y_visted_rec", { year: yr })
          .then(res => {
            this.chartData_v = [["data", "users"]];
            this.chartData_v.push([
              "Unactive Users(" + parseInt(res.data[0].offine_users) + ")",
              parseInt(res.data[0].offine_users)
            ]);
            this.chartData_v.push([
              "Active Users(" + res.data[0].online_users + ")",
              parseInt(res.data[0].online_users)
            ]);
            $(".g-visit").text(
              "Fig: Active Users details (Total users: " +
                res.data[0].total_users +
                ")"
            );
          });
        axios
          .post("/api/userTracking/get_y_onlne_rec", { year: yr })
          .then(res => {
            this.chartData_o = [["data", "users"]];
            this.chartData_o.push([
              "Offline Users(" + parseInt(res.data[0].offline_users) + ")",
              parseInt(res.data[0].offline_users)
            ]);
            this.chartData_o.push([
              "Online Users(" + res.data[0].online_users + ")",
              parseInt(res.data[0].online_users)
            ]);
            $(".g-onlne").text(
              "Fig: Online Users details (Active users: " +
                res.data[0].active_users +
                ")"
            );
          });
        axios
          .post("/api/userTracking/get_y_register_logs_details", { year: yr })
          .then(res => {
            this.sch_logs_detail = res.data;
            //console.log(this.sch_logs_detail);
          });
      }
    },
    get_logs: function() {
      axios.post("/api/userTracking/get_log_analysis_reports").then(res => {
        this.tot_analysis_report = res.data;
      });
      axios.post("/api/userTracking/get_register_logs_details").then(res => {
        this.sch_logs_detail = res.data.data;
      });
      axios.post("/api/userTracking/get_visted_rec").then(res => {
        this.chartData_v = [["data", "users"]];
        this.chartData_v.push([
          "Unactive Users(" + parseInt(res.data[0].offine_users) + ")",
          parseInt(res.data[0].offine_users)
        ]);
        this.chartData_v.push([
          "Active Users(" + res.data[0].online_users + ")",
          parseInt(res.data[0].online_users)
        ]);
        $(".g-visit").text(
          "Fig: Active Users details (Total users: " +
            res.data[0].total_users +
            ")"
        );
      });
      axios.post("/api/userTracking/get_onlne_rec").then(res => {
        //  console.log(res.data);
        this.chartData_o = [["data", "users"]];
        this.chartData_o.push([
          "Offline Users(" + parseInt(res.data[0].offline_users) + ")",
          parseInt(res.data[0].offline_users)
        ]);
        this.chartData_o.push([
          "Online Users(" + res.data[0].online_users + ")",
          parseInt(res.data[0].online_users)
        ]);
        $(".g-onlne").text(
          "Fig: Online Users details (Active users: " +
            res.data[0].active_users +
            ")"
        );
      });
      /* axios.post("/api/user/get_logs_details", {
         product_slug: this.product_slug}).then(function(res) {
        if (res.data.status != "200") {
        } else {
          this.logs_detail = res.data.data;
       }
      });*/
      axios.post("/api/user/get_tot_users").then(res => {
        if (res.data.status != "200") {
        } else {
          this.tot_user_detail = res.data.data;
        }
      });
      axios.post("/api/user/get_tot_year").then(res => {
        if (res.data.status != "200") {
        } else {
          this.years = res.data.data;
          // this.select_year = this.years[0].year;
        }
      });
      axios.post("/api/user/get_month_users").then(res => {
        if (res.data.status != "200") {
        } else {
          let tot_online_detail = res.data.data;
          if (tot_online_detail.length) {
            this.data_g = 1;
            this.tot_year_users = tot_online_detail[0].total_users;
            let max_data = tot_online_detail.reduce(
              (max, p) =>
                parseInt(p.online_users) > parseInt(max)
                  ? parseInt(p.online_users)
                  : parseInt(max),
              parseInt(tot_online_detail[0].online_users)
            );
            let vm = this;
            this.chartData = [["Month", "Visited Users", " "]];
            tot_online_detail.map((item, i) => {
              vm.chartData.push([
                tot_online_detail[i].month,
                parseInt(tot_online_detail[i].online_users),
                parseInt(max_data)
              ]);
            });
            this.chartData.push(["", 0, 0]);
            $(".g-month").text(
              "Fig: Active users details(Total users: " +
                this.tot_year_users +
                " )"
            );
          } else {
            this.data_g = 0;
          }
        }
      });
    }
  }
};
</script>

<style lang="scss"></style>
