<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
        <!--Coupon tabs start here-->
        <div class="wideget-user-tab wideget-user-tab3">
          <div class="tab-menu-heading">
            <div class="tabs-menu1">
              <ul class="nav">
                <li class="">
                  <a href="#tab-5" class="active" data-toggle="tab"
                    >View Coupons</a
                  >
                </li>
                <li>
                  <a href="#tab-6" data-toggle="tab" class="">Create Coupons</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!--/Coupon tabs end here-->
        <div class="border-0">
          <div
            class="tab-content  border-left border-right details-tab-content bg-white"
          >
            <div class="tab-pane active" id="tab-5">
              <div class=" p-5 ">
                <div class="card mb-0">
                  <div class="card-header">
                    <h3 class="card-title">Coupons</h3>
                  </div>
                  <div class="card-body">
                    <div class="table-responsive border-top">
                      <table
                        class="table table-bordered table-hover text-nowrap"
                      >
                        <thead>
                          <tr>
                            <th>Coupon name</th>
                            <th>Discount</th>
                            <th>Max. discount</th>
                            <th>Start date</th>
                            <th>Expiry date</th>
                            <th>Valid for</th>
                            <th>Applies to</th>
                            <th>Resource Category</th>
                            <th>Used</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td class="text-primary">DIWALI40</td>
                            <td>40%</td>
                            <td>Rs. 500</td>
                            <td>Jul 21, 2019</td>
                            <td>Nov 14, 2019</td>
                            <td>Everyone</td>
                            <td>HTML & CSS</td>
                            <td>Web development</td>
                            <td class="font-weight-semibold fs-16">12</td>
                            <td>
                              <a href="#" class="badge badge-success">Active</a>
                            </td>
                            <td>
                              <a
                                class="btn btn-secondary btn-sm text-white mr-1"
                                data-toggle="tooltip"
                                data-original-title="View"
                                >Edit</a
                              >
                              <a
                                class="btn btn-danger btn-sm text-white"
                                data-toggle="tooltip"
                                data-original-title="Delete"
                                >Delete</a
                              ><br />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <ul class="pagination">
                      <li class="page-item page-prev disabled">
                        <a class="page-link" href="#" tabindex="-1">Prev</a>
                      </li>
                      <li class="page-item active">
                        <a class="page-link" href="#">1</a>
                      </li>
                      <li class="page-item">
                        <a class="page-link" href="#">2</a>
                      </li>
                      <li class="page-item">
                        <a class="page-link" href="#">3</a>
                      </li>
                      <li class="page-item page-next">
                        <a class="page-link" href="#">Next</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-pane userprof-tab" id="tab-6">
              <div class=" p-5">
                <div class="card mb-0">
                  <div class="card-header">
                    <h3 class="card-title">Create new coupon</h3>
                  </div>
                  <div class="card-body">
                    <form class="form-horizontal">
                      <div class="form-group px-5">
                        <div class="row">
                          <div class="col-md-2">
                            <label class="form-label" id="examplenameInputname2"
                              >Coupon name<span style="color:rgb(238, 0, 0);"
                                >*</span
                              ></label
                            >
                          </div>
                          <div class="col-md-4">
                            <input
                              type="text"
                              class="form-control"
                              id="name1"
                              placeholder="Enter coupon name"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="form-group px-5">
                        <div class="row">
                          <div class="col-md-2">
                            <label class="form-label" id="examplenameInputname2"
                              >Coupon description<span
                                style="color:rgb(238, 0, 0);"
                                >*</span
                              ></label
                            >
                          </div>
                          <div class="col-md-4">
                            <textarea
                              class="form-control"
                              name="example-textarea-input"
                              rows="2"
                              placeholder="Describe coupon here.."
                            ></textarea>
                          </div>
                        </div>
                      </div>
                      <div class="form-group px-5">
                        <div class="row">
                          <div class="col-md-2">
                            <label class="form-label"
                              >Discount type<span style="color:rgb(238, 0, 0);"
                                >*</span
                              ></label
                            >
                          </div>
                          <div class="col-md-4">
                            <div class="custom-controls-stacked d-md-flex">
                              <label class="custom-control custom-radio mr-4">
                                <input
                                  type="radio"
                                  class="custom-control-input"
                                  name="example-radios3"
                                  value="option1"
                                  checked
                                />
                                <span class="custom-control-label"
                                  >Percentage discount</span
                                >
                              </label>
                              <label class="custom-control custom-radio">
                                <input
                                  type="radio"
                                  class="custom-control-input"
                                  name="example-radios3"
                                  value="option2"
                                />
                                <span class="custom-control-label"
                                  >Flat amount</span
                                >
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="form-group px-5">
                        <div class="row">
                          <div class="col-md-2">
                            <label class="form-label" id="examplenameInputname2"
                              >Discount amount / percentage<span
                                style="color:rgb(238, 0, 0);"
                                >*</span
                              ></label
                            >
                          </div>
                          <div class="col-md-4">
                            <input
                              type="number"
                              class="form-control"
                              id="name1"
                              placeholder="Enter discount value"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="form-group px-5">
                        <div class="row">
                          <div class="col-md-2">
                            <label class="form-label" id="examplenameInputname2"
                              >Max. discount (In Rs.)<span
                                style="color:rgb(238, 0, 0);"
                                >*</span
                              ></label
                            >
                          </div>
                          <div class="col-md-4">
                            <input
                              type="number"
                              class="form-control"
                              id="name1"
                              placeholder="Max. discount value"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="form-group px-5">
                        <div class="row">
                          <div class="col-md-2">
                            <label class="form-label" id="examplenameInputname2"
                              >Coupon start date<span
                                style="color:rgb(238, 0, 0);"
                                >*</span
                              ></label
                            >
                          </div>
                          <div class="col-md-4">
                            <input
                              type="date"
                              class="form-control"
                              id="name1"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="form-group px-5">
                        <div class="row">
                          <div class="col-md-2">
                            <label class="form-label" id="examplenameInputname2"
                              >Coupon expiry date<span
                                style="color:rgb(238, 0, 0);"
                                >*</span
                              ></label
                            >
                          </div>
                          <div class="col-md-4">
                            <input
                              type="date"
                              class="form-control"
                              id="name1"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="form-group px-5">
                        <div class="row">
                          <div class="col-md-2">
                            <label class="form-label">Valid for </label>
                          </div>
                          <div class="col-md-4">
                            <div class="custom-controls-stacked d-md-flex">
                              <label class="custom-control custom-radio mr-4">
                                <input
                                  type="radio"
                                  class="custom-control-input"
                                  name="example-radios3"
                                  value="option1"
                                  checked
                                />
                                <span class="custom-control-label"
                                  >Selected user(s)</span
                                >
                              </label>
                              <label class="custom-control custom-radio">
                                <input
                                  type="radio"
                                  class="custom-control-input"
                                  name="example-radios3"
                                  value="option2"
                                />
                                <span class="custom-control-label"
                                  >Everyone</span
                                >
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="form-group px-5">
                        <div class="row">
                          <div class="col-md-2">
                            <label class="form-label" id="examplenameInputname3"
                              >Minimum spend<span style="color:rgb(238, 0, 0);"
                                >*</span
                              ></label
                            >
                          </div>
                          <div class="col-md-4">
                            <select
                              data-placeholder="Choose a Language..."
                              class="form-control select2-show-search custom-select languages"
                            >
                              <option value="0">No minimum</option>
                              <option value="XH">Enter amount</option>
                            </select>
                            <input
                              type="number"
                              class="form-control mt-2"
                              id="name1"
                              placeholder="Enter amount"
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                      <div class="form-group px-5">
                        <div class="row">
                          <div class="col-md-2">
                            <label class="form-label" id="examplenameInputname3"
                              >Applies to<span style="color:rgb(238, 0, 0);"
                                >*</span
                              ></label
                            >
                          </div>
                          <div class="col-md-4">
                            <select
                              class="form-control select2"
                              data-placeholder="Choose the product"
                              multiple
                              style="width:100%"
                            >
                              <option value="everything" selected>
                                All content
                              </option>
                              <option value="HTMLCourse">
                                HTML & CSS
                              </option>
                              <option value="JavaScript">
                                JavaScript
                              </option>
                              <option value="Python">
                                Python
                              </option>
                              <option value="Robotics">
                                Robotics
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div class="form-group px-5">
                        <div class="row">
                          <div class="col-md-2">
                            <label class="form-label" id="examplenameInputname3"
                              >Resource Category<span
                                style="color:rgb(238, 0, 0);"
                                >*</span
                              ></label
                            >
                          </div>
                          <div class="col-md-4">
                            <select
                              class="form-control select2"
                              data-placeholder="Choose the product"
                              multiple
                              style="width:100%"
                            >
                              <option value="everything" selected>
                                All
                              </option>
                              <option value="webDev">
                                Web development
                              </option>
                              <option value="AppDev">
                                App development
                              </option>
                              <option value="Python">
                                Python
                              </option>
                              <option value="Robotics">
                                Robotics
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div class="form-group px-5 mb-0">
                        <div class="row">
                          <div class="col-md-2">
                            <label class="form-label" id="inputPassword5"
                              >Usage limit (per user)</label
                            >
                          </div>
                          <div class="col-md-3">
                            <div class="custom-controls-stacked d-md-flex">
                              <label class="custom-control custom-radio mr-4">
                                <input
                                  type="radio"
                                  class="custom-control-input"
                                  name="example-radios4"
                                  value="option1"
                                  checked
                                />
                                <span class="custom-control-label"
                                  >Once use</span
                                >
                              </label>
                              <label class="custom-control custom-radio">
                                <input
                                  type="radio"
                                  class="custom-control-input"
                                  name="example-radios4"
                                  value="option2"
                                />
                                <span class="custom-control-label"
                                  >Multi-use</span
                                >
                              </label>
                            </div>
                          </div>
                          <div class="col-md-2">
                            <input
                              type="number"
                              class="form-control"
                              id="name1"
                              placeholder="No. of times use"
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div class="card-footer">
                    <a href="#" class="btn btn-primary mx-2">Save</a>
                    <a href="#" class="btn btn-secondary">Cancel</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  mounted() {
    window.jQuery(".select2").select2({
      minimumResultsForSearch: Infinity
    });
  }
};
</script>
