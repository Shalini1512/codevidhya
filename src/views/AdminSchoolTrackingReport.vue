<template>
  <div class="w-100">
    <Header></Header>
    <div class="h-100" style="padding-top:58px;">
      <div class="container-scroller">
        <!--main panel-->
        <div class="main-panel">
          <!--start welcome menu-->
          <!--end welcome menu-->
          <!--list of summerization-->
          <div class="row mt-1">
            <div class="col-md-12 grid-margin stretch-card">
              <div class="card" style="margin-bottom:0;">
                <div
                  class="text-center"
                  style="backgound:0 0; padding: .5rem 1.5rem;min-height:3.5rem;padding:16px 8px;"
                >
                  <div style="text-align:center;font-size:2em;margin-top:8px;">
                    {{
                      visit_basic_detail.length
                        ? visit_basic_detail[0].sch_name
                        : 0
                    }}
                  </div>
                  <div
                    style="text-align:center;font-size:1.5em;margin-top:1px;"
                    v-if="classes.length && classes[0].sch_id != 1"
                  >
                    (Codevidhya Curriculum Implemented From Grade
                    {{ classes.length ? classes[0].cls_id : "" }} To Grade
                    {{
                      classes.length ? classes[classes.length - 1].cls_id : ""
                    }})
                  </div>
                </div>
                <hr class="mb-0 mt-1" />
                <div class="p-0 mb-0">
                  <div class="tab-content py-0 px-0 mb-0">
                    <div
                      class="tab-pane fade show active mb-0"
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
                              >Registered Users</small
                            >
                            <h5 class="text-center">
                              {{
                                visit_basic_detail.length
                                  ? visit_basic_detail[0].tot_users
                                  : ""
                              }}
                            </h5>
                          </div>
                        </div>

                        <div
                          class="d-flex border-md-right flex-grow-1 align-items-center justify-content-center p-3 item"
                        >
                          <i
                            class="fas fa-user m-2 fa-2x text-primary"
                            aria-hidden="true"
                          ></i>
                          <div
                            class="d-flex flex-column justify-content-around"
                          >
                            <small class="mb-1 text-muted"
                              >Total Students</small
                            >
                            <h5 class="mb-0 text-center">
                              {{
                                visit_basic_detail.length
                                  ? visit_basic_detail[0].tot_students
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
                              >Total Teachers</small
                            >
                            <h5 class="mb-0 text-center">
                              {{
                                visit_basic_detail.length
                                  ? visit_basic_detail[0].tot_teachers
                                  : ""
                              }}
                            </h5>
                          </div>
                        </div>
                        <!-- <div class="d-flex border-md-right flex-grow-1 align-items-center justify-content-center p-3 item">
                          <i class="fa fa-users-cog m-2 fa-2x text-primary"></i>
                          <div class="d-flex flex-column justify-content-around">
                            <small class="mb-1 text-muted">Active Users</small>
                            <h5 class="mb-0 text-center">{{visited_logs_n.length?visited_logs_n[0].active_users:0}}</h5>
                          </div>
                        </div>-->
                        <div
                          class="d-flex border-md-right flex-grow-1 align-items-center justify-content-center p-3 item"
                        >
                          <i
                            class="fas fa-network-wired m-2 fa-2x text-primary"
                          ></i>
                          <div
                            class="d-flex flex-column justify-content-around"
                          >
                            <small class="mb-1 text-muted">Week Lab</small>
                            <h5 class="mb-0 text-center">
                              {{
                                visit_basic_detail.length
                                  ? visit_basic_detail[0].week_lab
                                    ? visit_basic_detail[0].week_lab
                                    : "Ideal: " + 2
                                  : 0
                              }}
                            </h5>
                          </div>
                        </div>

                        <div
                          class="d-flex border-md-right flex-grow-1 align-items-center justify-content-center p-3 item"
                        >
                          <i
                            class="fa fa-exclamation m-2 fa-2x text-primary"
                          ></i>
                          <div
                            class="d-flex flex-column justify-content-around"
                          >
                            <small class="mb-1 text-muted">Login Users</small>
                            <h5 class="mb-0 text-center">
                              {{
                                visit_basic_detail.length
                                  ? visit_basic_detail[0].login_user
                                  : 0
                              }}
                            </h5>
                          </div>
                        </div>

                        <div
                          class="d-flex border-md-right flex-grow-1 align-items-center justify-content-center p-3 item"
                        >
                          <i
                            class="fas fa-clipboard-list m-2 fa-2x text-primary"
                          ></i>
                          <div
                            class="d-flex flex-column justify-content-around"
                          >
                            <small class="mb-1 text-muted">Login Events</small>
                            <h5 class="mb-0 text-center">
                              {{ visited_logs_n.length }}
                            </h5>
                          </div>
                        </div>

                        <div
                          class="d-flex border-md-right flex-grow-1 align-items-center justify-content-center p-3 item"
                        >
                          <!--end calender-->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--end list of summerization-->
          <!--graphics representation-->
          <div class="row">
            <div class="col-md-12 stretch-card">
              <!--bar chart-->
              <div class="col-md-7">
                <div class="card" style="margin-bottom:0;">
                  <div class="card-body">
                    <p class="card-title d-flex">
                      <span class="flex-grow-1">Last 4 Month Report</span>
                      <!--tot_online_details-->

                      <span class="flex-grow:1 text-right" v-if="years.length">
                        <!-- <select class="select" id="change_year_data" style="padding: 2px 4px;" @change="change_data()">
                          <option value="0">Last 6 month</option>
                          <option v-for="(year,y_index) in years" :key="y_index" :value="year.year">
                            {{year.year}}
                          </option>
                        </select>-->
                        <!--<select class="select" id="change_month" style="padding:2px 4px;">
                          <option>Select any month</option>
                          
                        </select>-->
                      </span>
                    </p>
                    <div v-if="tot_online_details.length">
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
              <div class="col-md-5 m-0">
                <div class="card" style="margin-bottom:0;">
                  <div class="card-body">
                    <p class="card-title d-flex">
                      <span class="flex-grow-1">
                        {{
                          pre_w_t
                            ? "Last Week Users Analysis Report (" +
                              pre_w_t +
                              ")"
                            : "Last Week Users Analysis Report"
                        }}</span
                      >
                    </p>
                    <div v-if="data_pw">
                      <GChart
                        class="mt-0 p-0"
                        type="ColumnChart"
                        :data="chartData_w"
                        :options="chartOptions_w"
                      />
                      <div class="text-center g-week"></div>
                    </div>
                    <div v-else class="text-center">data not available.</div>
                  </div>
                </div>
              </div>
              <!--end bar chart-->
            </div>
          </div>
          <!--month wise data-->
          <div class="row">
            <div class="card" style="margin-bottom:0">
              <!--12th month plans graphics-->
              <p class="card-title d-flex px-3 pt-2">
                <span class="flex-grow-1">Last 6 Months Details:</span>

                <span
                  v-if="tot_online_details.length"
                  class="flex-grow-1 text-right"
                  >Months:
                  <select
                    class="select"
                    id="change_month"
                    style="padding:2px 4px;"
                    @change="monthWeekReport('', $event)"
                  >
                    <option
                      v-for="(mon,
                      indx) in tot_online_details.slice().reverse()"
                      :key="indx"
                      :value="mon.login_time"
                      >{{ mon.month }}</option
                    >
                  </select>
                </span>
              </p>
              <div class="row stretch-card" id="month-wise-chart">
                <div
                  class="col-xl-2 ml-4 p-0"
                  v-for="(mon, mon_ind) in month_wise_chart"
                  :id="'chart' + (mon_ind + 1)"
                  :key="mon_ind + 1"
                >
                  <GChart
                    :name="'month' + (mon_ind + 1)"
                    class="mt-0 p-0"
                    type="LineChart"
                    :data="chartDatas_ms[mon_ind]"
                    :options="chartData_m"
                  />
                  <div class="text-center g-monthd-all" style="font-size:9px;">
                    fig: {{ mon }} report
                  </div>
                </div>
              </div>
              <!--end 12th month plans graphics-->
            </div>
          </div>
          <!--end month wise data-->
          <!--weekly report-->
          <div class="row">
            <div class="card" style="margin-bottom:0">
              <!--weekly plans graphics-->
              <p class="card-title d-flex px-3 pt-2">
                <span class="flex-grow-1">Weeks Details:</span>
              </p>
              <div class="row stretch-card" id="week-wise-chart">
                <div
                  class="col-xl-2 m-0 p-0"
                  v-for="(week, wk_ind) in week_wise_chart"
                  :key="wk_ind"
                >
                  <GChart
                    class="mt-0 p-0"
                    type="LineChart"
                    :data="chartDatas_ws[wk_ind]"
                    :options="chartOptions_ws"
                  />
                  <div class="text-center g-monthd-all" style="font-size:9px;">
                    fig: Week {{ parseInt(week) + 1 }} report
                  </div>
                </div>
              </div>
              <!--end Weekly plans graphics-->
            </div>
          </div>

          <!--end weekly report-->
          <!--end graphics representation-->
          <!--school views-->
          <div class="row">
            <div class="col-md-12 stretch-card">
              <div class="card" style="margin-bottom:0;">
                <div class="card-body">
                  <p class="card-title d-flex">
                    <span class="flex-grow-1">Schools Report</span>
                    <span class="flex-grow-1 text-right">
                      <label class="mx-1" style="font-size:12px">
                        Sort:
                        <select
                          @change="changeType()"
                          id="option_for_choose"
                          style="margin:5px;padding:2px;"
                        >
                          <option value="0">ALL</option>
                          <option value="1">Sort by date</option>
                        </select>
                      </label>
                      <span v-if="select_filter_data != '0'">
                        <label style="font-size:12px;">
                          Start Date:
                          <input
                            type="date"
                            id="get_start_date"
                            @change="handler($event)"
                            :min="min_date"
                            v-model="date1"
                          />
                        </label>
                        <label style="font-size:12px;">
                          End Date:
                          <input
                            type="date"
                            id="get_end_date"
                            @change="handler($event)"
                            :min="min_date"
                            v-model="date2"
                          />
                        </label>
                      </span>
                      <span
                        v-if="visited_logs_n.length"
                        style="cursor:pointer; font-size:12px;"
                        @click="export_data()"
                      >
                        <u>Export As Excel</u>
                        <downloadExcel
                          ref="schoolUsersdown"
                          id="click_export"
                          :data="dataForExcel"
                          :before-generate="startDownload"
                          :before-finish="finishDownload"
                          style="display:none;"
                          :name="report_name"
                        ></downloadExcel>
                      </span>
                    </span>
                  </p>
                  <div class="table-responsive">
                    <table
                      id="recent-purchases-listing"
                      class="table"
                      v-if="visited_logs_n.length"
                    >
                      <thead>
                        <tr>
                          <th>Sr no</th>
                          <th>Name</th>
                          <th v-if="classes.length && classes[0].sch_id != 1">
                            Role
                          </th>
                          <th v-if="classes.length && classes[0].sch_id != 1">
                            Grade
                          </th>
                          <th v-if="classes.length && classes[0].sch_id != 1">
                            Section
                          </th>
                          <th>Login Time</th>
                          <!--<th>Logout Time</th>-->
                          <th>Time Spent (HH:MM:SS)</th>
                          <th>IP Address</th>
                          <!--<th>Action</th>-->
                        </tr>
                      </thead>
                      <tbody>
                        <template
                          v-for="(visited_log_n, vindex) in visited_logs_n"
                        >
                          <tr :key="vindex">
                            <td>{{ vindex + 1 }}</td>
                            <td>{{ visited_log_n.name }}</td>
                            <td v-if="classes.length && classes[0].sch_id != 1">
                              {{ visited_log_n.role }}
                            </td>
                            <td v-if="classes.length && classes[0].sch_id != 1">
                              {{ visited_log_n.cls_id }}
                            </td>
                            <td v-if="classes.length && classes[0].sch_id != 1">
                              {{ visited_log_n.sec_name }}
                            </td>

                            <td>
                              {{
                                $moment(visited_log_n.login_time).format("LLLL")
                              }}
                            </td>
                            <!-- <td>
                              {{
                                visited_log_n.logout_time
                                  ? $moment(visited_log_n.logout_time).format(
                                      "LLLL"
                                    )
                                  : ""
                              }}
                            </td>-->
                            <td>{{ visited_log_n.time_spent }}</td>
                            <td>{{ visited_log_n.login_ip_address }}</td>
                            <!--<td><button class="btn btn-primary" @click="$router.push({name:'AdminSchoolIndividualUserTrackingReport', params:{sch_username:sch_username,st_username:visited_log_n.username}})">Details</button></td>-->
                          </tr>
                        </template>
                      </tbody>
                    </table>
                    <div v-else class="text-center">no data available.</div>
                  </div>
                </div>
              </div>
            </div>
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
  name: "AdminSchoolTrackingReport",
  components: {
    Header,
    GChart,
    downloadExcel: JsonExcel,
    Loader
  },
  props: { sch_username: String },
  data() {
    return {
      select_year: 0,
      dataForExcel: [],
      processing: false,
      visited_logs_n: [],
      select_filter_data: 0,
      pre_w_t: "",
      classes: [],
      date1: new Date().toISOString().substr(0, 10),
      date2: new Date().toISOString().substr(0, 10),
      report_name: "",
      min_date: "",
      chartData: [],
      chartOptions: {
        colors: ["blue", "none"],
        height: 300,
        hAxis: {
          textStyle: {
            fontSize: 10
          }
        },
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
      chartData_w: [],
      chartOptions_w: {
        colors: ["blue", "none"],
        height: 300,
        width: 380,
        hAxis: {
          textStyle: {
            fontSize: 8
          }
        },
        vAxis: { gridlines: { count: 10 } },
        legend: {
          display: true
        },
        label: {
          display: true
        },
        line: { groupWidth: "50%" },
        chart: {
          title: "Weekly Visited Users"
        }
      },
      chartData_ms: "",
      chartDatas_ms: [],
      chartOptions_m: "",
      chartData_ws: "",
      chartDatas_ws: [],
      chartOptions_ws: [],
      years: [],
      tot_year_users: "",
      data_g: 1,
      data_pw: 0,
      tot_online_details: "",
      month_wise_chart: [],
      month_wise_all: [],
      week_wise_chart: [],
      week_wise_all: [],
      max_data_ms: [],
      max_data_ws: [],
      visit_basic_detail: []
    };
  },

  mounted() {
    this.get_active_logs();
  },
  updated() {
    initCvTablayouts();
  },
  methods: {
    monthWeekReport: function(maxDate, event) {
      if (maxDate == "") maxDate = event.target.value;

      let vm = this;
      axios
        .post("/api/usertracking/get_month_visited_weekwise_report", {
          monthWeek: maxDate,
          sch_username: this.sch_username
        })
        .then(res => {
          let data = res.data;
          let weekData = new Object();
          for (let i = 0; i < data.length; i++) {
            if (!weekData[data[i].week]) {
              weekData[data[i].week] = new Array();
            }
            weekData[data[i].week].push(data[i]);
          }

          let temp = new Array();
          for (var items in weekData) {
            temp.push(items);
          }
          vm.week_wise_all = weekData;
          vm.week_wise_chart = temp;
          vm.chartOptions_ws = {
            colors: ["blue", "none"],
            height: 140,
            width: 160,
            hAxis: {
              textStyle: {
                fontSize: 8
              }
            }
          };
          vm.chartDatas_ws.length = 0;
          vm.week_wise_chart.forEach((week, week_ind) => {
            vm.chartData_ws = [["Day", "Visited Users", " "]];
            if (vm.week_wise_all[week].length == 1)
              vm.max_data_ws.push(vm.week_wise_all[week][0].online_users);
            else
              vm.max_data_ws.push(
                vm.week_wise_all[week].reduce((maxx, p) => {
                  return typeof maxx == "object"
                    ? Math.max(maxx.online_users, p.online_users)
                    : Math.max(maxx, p.online_users);
                })
              );
            vm.week_wise_all[week].forEach((week_data, ind) => {
              vm.chartData_ws.push([
                week_data.Day,
                parseInt(week_data.online_users),
                parseInt(vm.max_data_ws[week_ind])
              ]);
            });
            vm.chartDatas_ws.push(vm.chartData_ws);
          });
          // console.log(vm.week_wise_chart);

          /*for (var items in weekData) {
            vm.week_wise_chart.push(items);
            var c_users = [["Date", "Visited Users", " "]];
            let max_data = weekData[items].reduce(
              (max, p) =>
                parseInt(p.online_users) > parseInt(max)
                  ? parseInt(p.online_users)
                  : parseInt(max),
              parseInt(weekData[items].online_users)
            );
            weekData[items].forEach((item, index) => {
              c_users.push([
                item.Day,
                parseInt(item.online_users),
                parseInt(max_data)
              ]);
            });
          }*/
        });
    },
    get_active_logs: function() {
      var vm = this;

      axios
        .post("/api/usertracking/get_visited_logs_sch_details", {
          sch_name: this.sch_username
        })
        .then(async res => {
          vm.visited_logs_n = res.data.data;

          vm.report_name = vm.visited_logs_n.length
            ? vm.visited_logs_n[0].sch_name
            : "" + " Users Overall Report";
          let min_date = vm.visited_logs_n.length
            ? vm.visited_logs_n[0].min_date
            : "";
          //console.log(min_date)
          if (min_date != 0)
            vm.min_date = new Date(min_date).toISOString().substr(0, 10);
        });
      axios
        .post("/api/usertracking/get_visited_logs_sch_basic_details", {
          sch_name: this.sch_username
        })
        .then(res1 => {
          vm.visit_basic_detail = res1.data;
        });
      axios
        .post("/api/usertracking/get_school_classes", {
          sch_name: this.sch_username
        })
        .then(res => {
          //console.log(res.data);
          vm.classes = res.data;
        });
      /**get tracking Years */
      axios
        .post("/api/usertracking/get_sch_tot_year", {
          sch_name: this.sch_username
        })
        .then(res => {
          vm.years = res.data;
        });
      /**End Trackign Years */
      //last 6 month graphics data month wise
      axios
        .post("/api/usertracking/get_month_wise_data", {
          sch_name: this.sch_username
        })
        .then(res => {
          // console.log(res.data);
          var data = res.data;
          var monthData = new Object();
          for (var i = 0; i < data.length; i++) {
            if (!monthData[data[i].month_title]) {
              monthData[data[i].month_title] = new Array();
            }
            monthData[data[i].month_title].push(data[i]);
          }
          $("#month-wise-chart").html("");
          //  console.log(monthData);

          let temp = new Array();
          for (var items in monthData) {
            temp.push(items);
            //this.month_wise_chart.push(items);
          }
          vm.month_wise_all = monthData;
          vm.month_wise_chart = temp;
          vm.chartData_m = {
            colors: ["blue", "none"],
            height: 140,
            width: 160,
            hAxis: {
              textStyle: {
                fontSize: 8
              }
            }
          };
          vm.month_wise_chart.forEach((mon, mon_ind) => {
            vm.chartData_ms = [["Day", "Visited Users", " "]];
            if (vm.month_wise_all[mon].length == 1)
              vm.max_data_ms.push(vm.month_wise_all[mon][0].online_users);
            else
              vm.max_data_ms.push(
                vm.month_wise_all[mon].reduce((maxx, p) => {
                  return typeof maxx == "object"
                    ? Math.max(maxx.online_users, p.online_users)
                    : Math.max(maxx, p.online_users);
                })
              );
            vm.month_wise_all[mon].forEach((month_data, ind) => {
              vm.chartData_ms.push([
                month_data.login_date,
                parseInt(month_data.online_users),
                parseInt(vm.max_data_ms[mon_ind])
              ]);
            });
            vm.chartDatas_ms.push(vm.chartData_ms);
          });
        });

      //end last 6 month graphics data month wise
      //bar graphics data

      axios
        .post("/api/usertracking/get_bar_graphics_data", {
          sch_name: this.sch_username
        })
        .then(res => {
          let tot_online_detail = res.data;
          vm.tot_online_details = tot_online_detail;
          let max_date =
            vm.tot_online_details[vm.tot_online_details.length - 1].login_time;
          vm.monthWeekReport(max_date.toString());
          if (tot_online_detail.length) {
            vm.data_g = 1;
            vm.tot_year_users = tot_online_detail[0].total_users;
            let max_data = tot_online_detail.reduce(
              (max, p) =>
                parseInt(p.online_users) > parseInt(max)
                  ? parseInt(p.online_users)
                  : parseInt(max),
              parseInt(tot_online_detail[0].online_users)
            );

            vm.chartData = [["Month", "Visited Users", " "]];
            tot_online_detail.map((item, i) => {
              vm.chartData.push([
                tot_online_detail[i].month +
                  "(" +
                  tot_online_detail[i].year +
                  ")",
                parseInt(tot_online_detail[i].online_users),
                parseInt(max_data)
              ]);
            });
            vm.chartData.push(["", 0, 0]);
            $(".g-month").text(
              "Fig: Last 4 Months LoggedIn(" +
                tot_online_detail.length +
                ") Users details(Total users: " +
                this.tot_year_users +
                " )"
            );
          } else {
            vm.data_g = 0;
          }
        });
      axios
        .post("/api/usertracking/get_pre_week_graphics_data", {
          sch_name: this.sch_username
        })
        .then(res => {
          let tot_online_detail = res.data;
          if (tot_online_detail.length) {
            this.pre_w_t =
              tot_online_detail[0].date +
              " to " +
              tot_online_detail[tot_online_detail.length - 1].date;

            this.data_pw = 1;
            let max_data = tot_online_detail.reduce(
              (max, p) =>
                parseInt(p.online_users) > parseInt(max)
                  ? parseInt(p.online_users)
                  : parseInt(max),
              parseInt(tot_online_detail[0].online_users)
            );
            let vm = this;
            vm.chartData_w = [["Day", "Visited Users", " "]];
            tot_online_detail.map((item, i) => {
              vm.chartData_w.push([
                tot_online_detail[i].Day,
                parseInt(tot_online_detail[i].online_users),
                parseInt(max_data)
              ]);
            });
            //this.chartData_w.push(["", 0, 0]);
            $(".g-week").text(
              "Fig: Last Week LoggedIn Users(" +
                tot_online_detail.length +
                ") details(Total users: " +
                vm.tot_year_users +
                " )"
            );
          } else {
            vm.data_pw = 0;
          }
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
        if (vm.classes.length && vm.classes[0].sch_id != 1)
          vm.dataForExcel.push({
            "Sr no": index + 1,
            name: log_data.name,
            Role: log_data.role,
            Grade: log_data.cls_id,
            Section: log_data.sec_name,
            "Login Time": vm.$moment(log_data.login_time).format("LLLL"),
            "Time Spend": log_data.time_spent,
            "IP Address": log_data.login_ip_address,
            "School Name": vm.visit_basic_detail.length
              ? vm.visit_basic_detail[0].sch_name
              : "" +
                "\n (Codevidhya Curriculum Implemented From Grade " +
                vm.classes[0].cls_id +
                " To Grade " +
                vm.classes[vm.classes.length - 1].cls_id +
                ")",
            "Registered Users": vm.visit_basic_detail.length
              ? vm.visit_basic_detail[0].tot_users
              : "",
            "Active Users": vm.visit_basic_detail.length
              ? vm.visit_basic_detail[0].active_users
              : "",
            "Login Events": vm.visited_logs_n.length
          });
        else
          vm.dataForExcel.push({
            "Sr no": index + 1,
            name: log_data.name,
            "Login Time": vm.$moment(log_data.login_time).format("LLLL"),
            "Logout Time": log_data.logout_time
              ? vm.$moment(log_data.logout_time).format("LLLL")
              : "",
            "Time Spend": log_data.time_spent,
            "IP Address": log_data.login_ip_address,
            "School Name": vm.visit_basic_detail.length
              ? vm.visit_basic_detail[0].sch_name
              : "",
            "Registered Users": vm.visit_basic_detail.length
              ? vm.visit_basic_detail[0].tot_users
              : "",
            "Active Users": vm.visit_basic_detail.length
              ? vm.visit_basic_detail[0].active_users
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
