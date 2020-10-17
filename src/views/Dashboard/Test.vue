<template>
  <div>
    <Header />
    <div id="teacher-dashboard-container">
      <div id="dashboard-sidebar" data-simplebar>
        <div id="dashboard-sidebar-scrolling-content">
          <!-- Add as many links as you need -->
          <a href="#"> <i class="fas fa-user" /> Profile</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects</a>
          <a href="#"> <i class="fas fa-table" /> Projects X</a>
        </div>
      </div>

      <div id="dashboard-main">
        <div class="d-flex flex-column h-100">
          <div class="d-flex flex-row p-3 flex-shrink-0">
            <button class="cv-button primary">Click me</button>
            <button class="cv-button primary">Click me</button>
            <button class="cv-button primary">Click me</button>
            <button class="cv-button primary">Click me</button>
          </div>
          <div class="flex-grow-1 overflow-auto">
            <table style="width: 2000px; background: #000">
              <tbody>
                <tr>
                  <td>
                    abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrs
                    tuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijkl
                    mnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcde
                    fghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwx
                    yzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopq
                    rstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghij
                    klmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabc
                    defghijklmnopqrstuvwxyzabcdefghijklmnopqrstuv
                    wxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmno
                    pqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefgh
                    ijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyza
                    bcdefghijklmnopqrstuvwxyz
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!--div id="dashboard-main-inner" data-simplebar>
          USE THIS WHEN YOU NEED ENTIRE MAIN AREA TO BE SCROLLABLE
          <div id="dashboard-main-scrolling-content">
            <div class="card p-5 m-2">
              HEHE
            </div>
            <div class="card p-5 m-2">
              HEHE
            </div>
            <div class="card p-5 m-2">
              HEHE
            </div>
            <div class="card p-5 m-2">
              HEHE
            </div>
            <div class="card p-5 m-2">
              HEHE
            </div>
            <div class="card p-5 m-2">
              HEHE
            </div>
            <div class="card p-5 m-2">
              HEHE
            </div>
            <div class="card p-5 m-2">
              HEHE
            </div>
          </div>
        </div-->
      </div>
    </div>
  </div>
</template>
<script>
import Header from "@/components/header/Header.vue";
export default {
  components: { Header }
};
</script>

<style lang="scss">
$sidebar-width: 300px;

#teacher-dashboard-container {
  position: relative;
  width: 100%;
  /*display: flex;
  flex-direction: row;
  flex: 1 1 0;
  align-items: stretch;*/
  flex-grow: 1;
  min-height: 0;
  padding-top: 59px;
}

#dashboard-sidebar {
  position: absolute;
  top: 59px;
  bottom: 0;
  width: $sidebar-width;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  z-index: 100;

  #dashboard-sidebar-scrolling-content {
    padding: 16px;
  }
  a {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px;
    border-radius: 4px;
    transition: all 200ms;
    i {
      margin-right: 16px;
    }
    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }
}

#dashboard-main {
  position: absolute;
  top: 59px;
  bottom: 0;
  width: 100%;
  padding-left: $sidebar-width;

  table {
    width: 5000px;
    height: 2000px;
    background: #f00;
  }
  #dashboard-main-inner {
    height: 100%;
  }
  #dashboard-main-scrolling-content {
    display: flex;
    flex-direction: column;
    padding: 16px;
  }
}
</style>
