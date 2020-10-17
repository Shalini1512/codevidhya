<template>
  <div>
    <Header />
    <div id="sales-followup-container">
      <div id="sales-followup-inner">
        <div class="cv-card mb-1">
          <button class="cv-button primary">
            Click me
          </button>
        </div>
        <table class="cv-card table">
          <tbody>
            <tr id="sale-item-1" class="toggle" @click="toggleSaleItemClicked">
              <th>Sr. no.</th>
              <th>Assigned to</th>
              <th>Lead date</th>
              <th>Student name</th>
              <th>Action</th>
            </tr>

            <tr id="sale-item-1-info" style="display: none;">
              <td>
                <div>
                  <h3>Info</h3>
                </div>
              </td>
            </tr>

            <tr>
              <td>Sr. no.</td>
              <td>Assigned to</td>
              <td>Lead date</td>
              <td>
                Student name
                <i
                  class="fas fa-info-circle student-info-btn"
                  @click="showStudentInfo(1)"
                />
              </td>
              <td>Action</td>
            </tr>

            <tr>
              <td>Sr. no.</td>
              <td>Assigned to</td>
              <td>Lead date</td>
              <td>Student name</td>
              <td>Action</td>
            </tr>

            <tr>
              <td>Sr. no.</td>
              <td>Assigned to</td>
              <td>Lead date</td>
              <td>Student name</td>
              <td>Action</td>
            </tr>

            <tr>
              <td>Sr. no.</td>
              <td>Assigned to</td>
              <td>Lead date</td>
              <td>Student name</td>
              <td>Action</td>
            </tr>

            <tr>
              <td>Sr. no.</td>
              <td>Assigned to</td>
              <td>Lead date</td>
              <td>Student name</td>
              <td>Action</td>
            </tr>

            <tr>
              <td>Sr. no.</td>
              <td>Assigned to</td>
              <td>Lead date</td>
              <td>Student name</td>
              <td>Action</td>
            </tr>

            <tr>
              <td>Sr. no.</td>
              <td>Assigned to</td>
              <td>Lead date</td>
              <td>Student name</td>
              <td>Action</td>
            </tr>

            <tr>
              <td>Sr. no.</td>
              <td>Assigned to</td>
              <td>Lead date</td>
              <td>Student name</td>
              <td>Action</td>
            </tr>

            <tr>
              <td>Sr. no.</td>
              <td>Assigned to</td>
              <td>Lead date</td>
              <td>Student name</td>
              <td>Action</td>
            </tr>

            <tr>
              <td>Sr. no.</td>
              <td>Assigned to</td>
              <td>Lead date</td>
              <td>Student name</td>
              <td>Action</td>
            </tr>

            <tr>
              <td>Sr. no.</td>
              <td>Assigned to</td>
              <td>Lead date</td>
              <td>Student name</td>
              <td>Action</td>
            </tr>

            <tr>
              <td>Sr. no.</td>
              <td>Assigned to</td>
              <td>Lead date</td>
              <td>Student name</td>
              <td>Action</td>
            </tr>

            <tr>
              <td>Sr. no.</td>
              <td>Assigned to</td>
              <td>Lead date</td>
              <td>Student name</td>
              <td>Action</td>
            </tr>

            <tr>
              <td>Sr. no.</td>
              <td>Assigned to</td>
              <td>Lead date</td>
              <td>Student name</td>
              <td>Action</td>
            </tr>
          </tbody>
        </table>
        
      </div>

      <div id="student-info-modal" class="cv-modal large">
        <div>
          <div class="header">
            <h3>Student info</h3>
          </div>

          <div class="body">
            <div class="student-info-row">
              <p>Name</p>
              <p>John</p>
            </div>

            <div class="student-info-row">
              <p>City</p>
              <p>Lost Vegus</p>
            </div>
          </div>

          <div class="footer">
            <button
              class="cv-button neutral noshadow"
              onclick="hideModal('student-info-modal')"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
//import Header from "@/components/header/HeaderMenuOnly.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
export default {
  components: { Header },
  methods: {
    showStudentInfo() {
      
      showModal("student-info-modal");
    },
    toggleSaleItemClicked(e) {
    
      var id = e.currentTarget.id;
    
      $("#"+id +"-info").show()
    }
  }
};
</script>

<style lang="scss">
#sales-followup-container {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  align-items: stretch;
  min-height: 0;
  padding-top: 59px;

  #sales-followup-inner {
    position: absolute;
    top: 59px;
    bottom: 0;
    width: 100%;
    padding: 16px;
    overflow: auto;
    tr {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    th {
      font-weight: bold;
    }
    td,
    th {
      padding: 16px;
    }

    tr.toggle {
      cursor: pointer;
      transition: all 200ms;
      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }

  .student-info-btn {
    cursor: pointer;
  }

  #student-info-modal {
    .body {
      padding: 16px;
    }
    .student-info-row {
      display: flex;
      flex-direction: row;
      padding-bottom: 8px;
      p:first-of-type {
        min-width: 240px;
        font-weight: bold;
      }
    }
  }
}
</style>
