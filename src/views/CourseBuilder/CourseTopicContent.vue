<template>
  <div>
    <Header></Header>
    <section class="sptb" style="padding-top:72px;">
      <div class="container" id="bar-fixed">
        <div class="row">
          <div class="col-lg-12 users-list">
            <div class="card">
              <div class="card-header" id="backRow">
                <a class="btn btn-pink px-4 text-white"
                  ><i class="fas fas fa-arrow-left"></i> Back</a
                >

                <h3 class="card-title pl-5">
                  Page name
                </h3>
              </div>
              <div class="card-body p-6">
                <div id="privacy-tablayout" class="tab_wrapper second_tab">
                  <ul class="tab_list" id="lms-topic-list">
                    <span>
                      <li class="lms-sub-topic-list active">
                        1 Page name
                        <button
                          class="btn btn-sm btn-outline-dark border-0"
                          data-toggle="modal"
                          data-target="#editPageModal"
                          onclick="(function (event) { event.stopPropagation(); })(event);"
                        >
                          <i class="fas fa-pencil-alt"></i>
                        </button>
                        <button
                          class="btn btn-sm btn-outline-dark border-0"
                          data-toggle="modal"
                          data-target="#deletePageModal"
                        >
                          <i class="far fa-trash-alt"></i>
                        </button>
                      </li>
                      <!--<li
												v-else
												:id="book_page.page_id"
												class="lms-sub-topic-list"
												:style="[
													book_page.status ? { color: '#ec296b' } : ''
												]"
												@click="switch_page(book_page.page_id)"
												v-html="ind + 1 + '.&nbsp;' + book_page.page_name"
											></li> -->
                    </span>
                    <!--For new page-->
                    <span>
                      <li
                        class="lms-sub-topic-list"
                        style="color: #ec296b"
                        data-toggle="modal"
                        data-target="#createNewPageModal"
                      >
                        Create New Page
                      </li>
                    </span>
                  </ul>
                  <!--Content on right sidebar-->
                  <div class="content_wrapper lesson-content-wrapper">
                    <div class="tab_content active">
                      <h3>Page 1 heading</h3>
                      <div style="position: relative;">
                        Page content come here
                      </div>
                      <div
                        style="position: absolute; right: 0; top: 0;"
                        title="Add or edit content"
                      >
                        <button
                          class="btn btn-sm btn-outline-dark border-0"
                          data-toggle="modal"
                          data-target="#CreateAndEditPageModal"
                        >
                          <i class="fas fa-pencil-alt"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div id="lesson-bottom-controls" :data-user-id="userId">
                    <button class="btn btn-primary">
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--
      <div id="lightbox-modal" class="offscreen-modal-cv">
        <div class="modal-box-cv lightbox-cv"></div>
        <a class="modal-close-btn-cv">
          <i class="fas fa-times"></i>
        </a>
      </div> -->
    </section>
    <!-- Delete Page Modal -->
    <div id="deletePageModal" class="modal fade">
      <div class="modal-dialog" role="document">
        <div class="modal-content ">
          <div class="modal-header pd-x-20">
            <h6 class="modal-title font-weight-bold">Confirm Deletion</h6>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body pd-20">
            <p>Are you sure to delete the page 'Introduction'.</p>
          </div>
          <!-- modal-body -->
          <div class="modal-footer">
            <button type="button" class="btn btn-danger">Delete</button>
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <!-- modal-dialog -->
    </div>
    <!-- modal -->
    <!-- Create New Page Modal -->
    <div id="createNewPageModal" class="modal fade">
      <div class="modal-dialog" role="document">
        <div class="modal-content ">
          <div class="modal-header pd-x-20">
            <h6 class="modal-title font-weight-bold">New Page</h6>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body pd-20">
            <div class="form-group">
              <label class="form-label">Enter page name here</label>
              <input type="text" class="form-control" />
            </div>
          </div>
          <!-- modal-body -->
          <div class="modal-footer">
            <button type="button" class="btn btn-success">Create</button>
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <!-- modal-dialog -->
    </div>
    <!-- modal -->
    <!-- Create and edit New Page Modal -->
    <div id="CreateAndEditPageModal" class="modal fade">
      <div
        class="modal-dialog"
        role="document"
        style="min-width: 96%!important; height: 90%;"
      >
        <div class="modal-content h-100">
          <div class="modal-header pd-x-20">
            <h6 class="modal-title font-weight-bold">Page Content</h6>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body pd-20">
            <div class="form-group">
              <label class="form-label">Enter lesson name here</label>
              <input type="text" class="form-control" />
            </div>
          </div>
          <!-- modal-body -->
          <div class="modal-footer">
            <button type="button" class="btn btn-success">Save</button>
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <!-- modal-dialog -->
    </div>
    <!-- modal -->
  </div>
</template>

<script>
import Header from "@/components/header/HeaderMenuForAdmin.vue";
export default {
  components: { Header }
};
</script>
