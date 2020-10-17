<template>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">View / Edit Profile</h3>
      </div>
      <div class="card-body">
        <label class="form-label text-dark font-weight-bold"
          >Teacher's Details</label
        >
        <div class="row">
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label"
                >Name<span style="color:rgb(238,0,0)">*</span></label
              >
              <input
                type="text"
                class="form-control"
                placeholder="Name"
                readonly
              />
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label">Email Id</label>
              <input
                type="email"
                class="form-control"
                placeholder="Email"
                readonly
              />
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label">Mobile No.</label>
              <input
                type="tel"
                class="form-control"
                placeholder="9xxxxxxxxx"
                pattern="[0-9]{10}"
                readonly
              />
            </div>
          </div>
          <div class="col-sm-4 ">
            <div class="form-group">
              <label class="form-label"
                >School<span style="color:rgb(238,0,0)">*</span></label
              >
              <input
                type="text"
                class="form-control"
                placeholder="School Name"
                readonly
              />
            </div>
          </div>
          <div class="col-sm-4 ">
            <div class="form-group">
              <label class="form-label"
                >Grade<span style="color:rgb(238,0,0)">*</span></label
              >
              <select class="form-control">
                <option selected disabled>Select Grade</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>
              </select>
            </div>
          </div>
          <div class="col-sm-4 ">
            <div class="form-group">
              <label class="form-label"
                >Section<span style="color:rgb(238,0,0)">*</span></label
              >
              <select class="form-control">
                <option selected disabled>Select Section</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
                <option>E</option>
                <option>F</option>
                <option>G</option>
                <option>H</option>
                <option>I</option>
                <option>J</option>
                <option>K</option>
                <option>L</option>
                <option>M</option>
                <option>N</option>
                <option>O</option>
                <option>P</option>
                <option>Q</option>
                <option>R</option>
                <option>S</option>
                <option>T</option>
                <option>U</option>
                <option>V</option>
                <option>W</option>
                <option>X</option>
                <option>Y</option>
                <option>Z</option>
              </select>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label">Department</label>
              <input
                type="text"
                class="form-control"
                placeholder="Department"
                readonly
              />
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label">State</label>
              <input
                type="text"
                class="form-control"
                placeholder="State"
                readonly
              />
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label">City</label>
              <input
                type="text"
                class="form-control"
                placeholder="City"
                readonly
              />
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group">
              <label class="form-label">Country</label>
              <select
                class="form-control select2-show-search border-bottom-0 w-100 select2-show-search"
                data-placeholder="Select"
              >
                <optgroup label="Categories">
                  <option>--Select--</option>
                  <option value="1">Germany</option>
                  <option value="2">Italy</option>
                  <option value="3">Canada</option>
                  <option value="4">US</option>
                  <option value="5">Afghanistan</option>
                  <option value="6">Albania</option>
                  <option value="7">China</option>
                  <option value="8">Denmark</option>
                  <option value="9">Finland</option>
                  <option value="10">India</option>
                  <option value="11">Kiribati</option>
                  <option value="12">Kuwait</option>
                  <option value="13">Mexico</option>
                  <option value="14">Japan</option>
                </optgroup>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer text-right">
        <button type="submit" class="btn btn-success">Update</button>
      </div>
    </div>
  </div>
</template>
