<template>
  <div id="quickbook-root">
    <Header></Header>
    <section
      class="pt-0 d-flex flex-column flex-grow-1"
      :style="'width: ' + windowWidth + 'px;'"
    >
      <div
        class="row"
        v-if="pythonEditor == false && sqlEditor == false"
        style="flex-direction: column;"
      >
        <div id="mySidepanel" class="sidepanel d-flex flex-column">
          <div class="examples-header">
            <h5>{{ selectedLanguageName }} Examples</h5>
            <i class="flex-grow-1" />
            <a href="javascript:void(0)" class="closebtn" @click="closeNav"
              >×</a
            >
          </div>
          <div class="examples-container container-fluid flex-grow-1">
            <template v-for="(quickexample, index) in quickExamples">
              <div :key="index" class="example-item">
                <h5>{{ quickexample.title }}</h5>
                <div class="d-flex justify-content-end">
                  <span
                    class="badge badge-primary"
                    style="cursor:pointer;"
                    @click="
                      loadExample(index);
                      closeNav();
                    "
                    >VIEW</span
                  >
                </div>
              </div>
            </template>
            <!--<div
                style=" width:23%; min-width:220px; box-shadow:2px 0px 6px #999; padding:8px; border-radius:3px 3px; margin:12px 1%;"
                v-for="(quickexample, index) in quickExamples"
                :key="index"
              >
                <h5>{{ quickexample.title }}</h5>
                <button
                  class="btn btn-primary"
                  style="float:right"
                  v-on:click="
                    loadExample(index);
                    closeNav();
                  "
                >
                  Run
                </button>
              </div>-->
          </div>
        </div>
        <div class="row p-2 align-items-center" v-if="windowWidth > 768">
          <h3 id="quickbook-example-heading" class="mr-4">
            {{ selectedLanguageName }}
          </h3>
          <i class="flex-grow-1" />
          <div id="language-dropdown-container" class="btn-group mr-1">
            <button
              type="button"
              class="btn btn-warning btn-pill dropdown-toggle"
              data-toggle="dropdown"
            >
              Select language <i class="fas fa-caret-down"></i>
            </button>
            <ul class="dropdown-menu" role="menu">
              <template v-for="(book, index) in books">
                <li
                  class="dropdown-plus-title"
                  :key="index"
                  :data-book-name="book.book_name"
                  @click="
                    handleLanguageSelected($event);
                    loadCode(book.className, role_id);
                  "
                >
                  {{ book.book_name }}
                </li>
              </template>
            </ul>
          </div>
          <button
            id="view-all-examples-btn"
            class="btn btn-danger btn-pill mr-1"
            title="Examples"
            @click="openNav"
            :disabled="quickExamples.length ? false : true"
          >
            View all examples
          </button>
          <!--button
            class="btn btn-success mr-1"
            title="Run Code"
            id="run_btn"
            @click="editPreview"
          >
            <i class="fas fa-play"></i> &nbsp;RUN
          </button-->
          <!--button
            class="btn btn-info mr-1"
            title="Previous Example"
            @click="nxtpre('pre')"
          >
            Previous
          </button>
          <button
            class="btn btn-info mr-1"
            title="Next Example"
            @click="nxtpre('nxt')"
          >
            Next
          </button-->

          <!--select
            class="form-control bg-warning"
            style="display:inline; width:auto;"
            v-model="editorTheme"
            @change="ApplyTheme(editorTheme.themename)"
          >
            <option value="" selected>Theme</option>
            <option
              v-for="(theme, index) in editorThemes"
              :key="index"
              v-bind:value="{ themename: theme.name }"
              >{{ theme.name }}</option
            >
          </select-->

          <!--<div class="col-sm-3">
            <div class="form-group">
              <div class="row gutters-xs">
                <div class="col">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Search QR"
                    v-model="qrCode"
                  />
                </div>
                <span class="col-auto">
                  <button
                    class="btn btn-secondary"
                    type="button"
                    @click="searchQr()"
                  >
                    <i class="fe fe-search"></i>
                  </button>
                </span>
              </div>
            </div>
          </div>-->
        </div>
        <div v-else-if="windowWidth <= 768">
          <div class="menuforMob1">
            <div class="topDrop">
              <div class="topDropa">
                Language <i class="fas fa-caret-down"></i>
              </div>
              <div class="topDropDiv">
                <div
                  v-for="(book, index) in books"
                  :key="index"
                  @click="
                    loadCode(
                      book.className,
                      $store.getters.getAuthData.auth_role_id
                    )
                  "
                >
                  {{ book.book_name }}
                </div>
              </div>
            </div>
            <div class="topDrop">
              <div class="topDropa">
                Theme <i class="fas fa-caret-down"></i>
              </div>
              <div class="topDropDiv">
                <div
                  v-for="(theme, index) in editorThemes"
                  :key="index"
                  @click="
                    themename = theme.name;
                    ApplyTheme(theme.name);
                  "
                >
                  {{ theme.name }}
                </div>
              </div>
            </div>
            <!--<span>
              <input
                type="text"
                class="navbtn"
                v-model="qrCode"
                style="width:90px;"
                placeholder="Search QR"
                aria-label="Search QR"
                aria-describedby="basic-addon2"
              />
              <button
                class="navbtn btn-outline-secondary btn-info"
                style="margin-left:-5px; padding: 7px 7px;"
                type="button"
                v-on:click="searchQr()"
              >
                <i class="fas fa-search"></i>
              </button>
            </span>-->
          </div>
          <div class="menuforMob2">
            <div
              @click="openNav"
              :disabled="quickExamples.length ? false : true"
            >
              ☰
            </div>
            <div
              @click="
                editPreview();
                tabIndex = 3;
              "
            >
              <i class="fas fa-play"></i>
            </div>
            <div @click="nxtpre('pre')">
              <i class="fas fa-angle-double-left"></i>
            </div>
            <div @click="nxtpre('nxt')">
              <i class="fas fa-angle-double-right"></i>
            </div>
            <!--<div class="topDrop">
              <div class="topDropa"><i class="fas fa-file-download"></i></div>
              <div class="topDropDiv">
                <div
                  @click="
                    exportCode = 'download';
                    exportProject();
                  "
                >
                  Download
                </div>
                <div
                  @click="
                    exportCode = 'exporttocodeplay';
                    exportProject();
                  "
                >
                  Export to CodePlay
                </div>
              </div>
            </div>-->
            <!--<div class="topDrop">
              <div class="topDropa"><i class="fas fa-share-alt"></i></div>
              <div class="topDropDiv" id="shareDiv">
                <div
                  data-href="https://www.codevidhya.com/MySharedCode/"
                  @click="SharedCode('facebook')"
                >
                  <i class="fab fa-facebook-square"></i> Facebook
                </div>
                <div @click="SharedCode('twitter')">
                  <i class="fab fa-twitter"></i> Twitter
                </div>
                <div @click="SharedCode('linkedin')">
                  <i class="fab fa-linkedin"></i> Linkedin
                </div>
                <div @click="SharedCode('whatsapp')">
                  <i class="fab fa-whatsapp"></i> WhatsApp
                </div>
              </div>
            </div>-->
          </div>
        </div>
      </div>
      <div
        id="web-editor-wrapper"
        class="flex-grow-1 w-100"
        v-if="pythonEditor == false && sqlEditor == false"
      >
        <split-pane
          :min-percent="30"
          :default-percent="windowWidth > 768 ? 50 : 100"
          split="vertical"
        >
          <template slot="paneL">
            <div
              id="html-codemirror-wrapper"
              class="panel panel-primary d-flex flex-grow-1 flex-column h-100"
            >
              <div
                class="tab-menu-heading flex-shrink-0 d-flex align-items-center"
              >
                <div class="tabs-menu flex-grow-1">
                  <!-- Tabs -->
                  <ul class="nav panel-tabs">
                    <li class="">
                      <a
                        href="#html-tab"
                        class="active"
                        data-toggle="tab"
                        @click="activateEditor"
                        >HTML</a
                      >
                    </li>
                    <li>
                      <a
                        href="#css-tab"
                        data-toggle="tab"
                        @click="activateEditor"
                        >CSS</a
                      >
                    </li>
                    <li>
                      <a
                        href="#js-tab"
                        data-toggle="tab"
                        @click="activateEditor"
                        >JS</a
                      >
                    </li>
                  </ul>
                </div>
                <button class="run-btn" @click="editPreview">
                  <i class="fas fa-play" />
                  RUN
                </button>
              </div>
              <div
                class="panel-body tabs-menu-body d-flex flex-grow-1 flex-column"
              >
                <div class="tab-content d-flex flex-grow-1 h-100 flex-column">
                  <div class="tab-pane active flex-grow-1" id="html-tab">
                    <codemirror
                      class=""
                      ref="cmHtml"
                      :options="htmlOptions"
                    ></codemirror>
                  </div>
                  <div class="tab-pane flex-grow-1" id="css-tab">
                    <codemirror ref="cmCss" :options="cmOptions"></codemirror>
                  </div>
                  <div class="tab-pane flex-grow-1" id="js-tab">
                    <codemirror ref="cmJs" :options="cmOptions"></codemirror>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template slot="paneR" v-if="windowWidth > 768">
            <!--div class=" d-flex flex-column h-100"-->
            <div
              id="html-output"
              class="panel panel-primary d-flex flex-column h-100"
            >
              <h3>Output</h3>

              <div class="d-flex flex-grow-1 flex-column h-100">
                <div
                  class="tab-pane active d-flex flex-grow-1 flex-column h-100"
                  id="editor-output"
                >
                  <div
                    id="sectionA"
                    class=" active in "
                    style="flex-grow:1;min-height:50px;"
                  >
                    <iframe frameborder="0" id="preview"></iframe>
                  </div>
                </div>
              </div>
            </div>
            <!--/div-->
          </template>
        </split-pane>

        <!--<b-modal ref="folderModal" hide-footer title="Create Folder">
          <div class="d-block text-center">
            <p>
              <input
                type="text"
                class="form-control"
                placeholder="Enter folder name"
                v-model="foldername"
              />
            </p>
          </div>
          <div class="d-block text-right">
            <b-button
              class="mt-3"
              style="width:auto; display:inline-block"
              variant="success"
              block
              @click="
                exportCode = 'moveproject';
                exportProject();
              "
              >Create</b-button
            >
            <b-button
              class="mt-3"
              style="width:auto; display:inline-block"
              variant="danger"
              block
              @click="hideModal('folderModal')"
              >Close Me</b-button
            >
          </div>
        </b-modal>-->
      </div>
      <!--<div v-if="pythonEditor==false && sqlEditor == false && windowWidth<768" style="width:100%; height:100%;">
      <split-pane1 :min-percent='50' :default-percent='100' split="horizontal" >
        <template slot="paneL">
          <div style="height:100%;">
            <b-tabs v-model="tabIndex" style="height:100%;">
              <b-tab title="HTML" id="html-tab" :title-link-class="linkClass(0)" @click="activateEditor">
                <codemirror ref="cmHtml"  :options="htmlOptions"></codemirror>
              </b-tab>
              <b-tab title="CSS" id="css-tab" :title-link-class="linkClass(1)" @click="activateEditor">
                <codemirror ref="cmCss"  :options="cmOptions" ></codemirror>
              </b-tab>
              <b-tab title="Js" id="js-tab" :title-link-class="linkClass(2)" @click="activateEditor">
                <codemirror ref="cmJs"  :options="cmOptions" ></codemirror>
              </b-tab>
              <b-tab title="Output" id="output-tab" :title-link-class="linkClass(3)">
                <div id="sectionA" class=" active in " style="flex-grow:1;min-height:0;">
                  <iframe frameborder="0" id="preview" ></iframe>
                </div>
              </b-tab>
            </b-tabs>
          </div>
        </template>
      </split-pane1>
    </div>-->

      <!-------------start sql editor----------------->
      <div v-else-if="sqlEditor == true" class="d-flex flex-column h-100">
        <!---------header--------->
        <div class="row p-2 bg-secondary">
          <div class="col-sm-12" style="padding-right:0px">
            <!--<button
              class="btn btn-info mr-1"
              title="Back to web editor"
              v-if="sqlEditor == true"
              @click="editorStatus('sql')"
            >
              Back
            </button>-->
            <button
              class="btn btn-success mr-1"
              title="Run Code"
              id="sql_run_btn"
              @click="
                cvSQLSubmit();
                tabIndex = 1;
              "
            >
              <i class="fas fa-play"></i> &nbsp;RUN
            </button>
            <div class="btn-group mr-1">
              <button
                type="button"
                class="btn btn-warning dropdown-toggle"
                data-toggle="dropdown"
              >
                Languages <span class="caret"></span>
              </button>
              <ul class="dropdown-menu" role="menu">
                <template v-for="(book, index) in books">
                  <li
                    class="dropdown-plus-title"
                    style="border-color:#999 !important;"
                    :key="index"
                    @click="loadCode(book.className, role_id)"
                  >
                    {{ book.book_name }}
                  </li>
                </template>
              </ul>
            </div>
            <!--<b-dropdown
              id="dropdown-3"
              v-model="langSelected"
              text="Language"
              variant="info"
              style="display:inline-block;position:relative; z-index:9999"
            >
              <b-dropdown-item
                v-for="(book, index) in books"
                :key="index"
                @click="
                  loadCode(
                    book.className,
                    $store.getters.getAuthData.auth_role_id
                  )
                "
              >
                {{ book.book_name }}
              </b-dropdown-item>
            </b-dropdown>-->
            <button
              class="btn btn-info"
              style="float:right"
              @click="showDatabasePane()"
              v-if="windowWidth < 768"
            >
              Database
            </button>

            <!--<span class="mdl-chip mdl-chip--contact" style="right:10px; cursor:pointer; float:right; margin-top:8px;" v-if="sqlEditor == true" >
            <span class="mdl-chip__contact mdl-color--teal mdl-color-text--white" @click="editorStatus('sql')"><i class="fas fa-arrow-left"></i></span>
            <span class="mdl-chip__text" @click="editorStatus('sql')">Web Editor</span>
          </span>-->
          </div>
        </div>
        <!-------end--------->
        <div id="sql-editor-container" class="" style="flex-grow:1;">
          <split-pane
            :min-percent="20"
            :default-percent="windowWidth > 768 ? 50 : 100"
            split="vertical"
          >
            <template slot="paneL">
              <div
                style="display:flex; flex-direction:column; height:100%;"
                v-if="windowWidth > 768"
              >
                <div
                  class="row"
                  style="margin-right:0px;margin-left:0px; color:#FFF; padding:5px 5px;"
                >
                  <span class="badge badge-pill badge-primary p-2"
                    >SQL Statement</span
                  >
                </div>
                <div style="flex-grow:1; min-height:0;">
                  <textarea
                    id="textareaCodeSQL"
                    v-model="texteditor"
                    style="display:none"
                    wrap="logical"
                  >
                  </textarea>
                  <input type="hidden" name="code" id="code" />
                  <input type="hidden" id="bt" name="bt" />
                  <codemirror
                    ref="cmSql"
                    :value="sqlStatement"
                    :options="sqlcmOptions"
                  ></codemirror>
                </div>
              </div>
              <div style="height:100%;" v-else>
                <b-tabs v-model="tabIndex" style="height:100%;">
                  <b-tab
                    title="Sql Statement"
                    id="sql-tab"
                    :title-link-class="linkClass(0)"
                  >
                    <div style="flex-grow:1; min-height:0;">
                      <textarea
                        id="textareaCodeSQL"
                        v-model="texteditor"
                        style="display:none"
                        wrap="logical"
                      >
                      </textarea>
                      <input type="hidden" name="code" id="code" />
                      <input type="hidden" id="bt" name="bt" />
                      <codemirror
                        ref="cmSql"
                        :value="sqlStatement"
                        :options="sqlcmOptions"
                      ></codemirror>
                    </div>
                  </b-tab>
                  <b-tab
                    title="Result"
                    id="result-tab"
                    :title-link-class="linkClass(1)"
                  >
                    <div id="resultSQL" style="flex-grow:1; ">
                      <iframe
                        id="iframeResultSQL"
                        style="display:none"
                        frameborder="0"
                        name="view"
                      ></iframe>
                      <div id="divResultSQL" style="margin-top:30px;">
                        <div style="margin:10px;margin-bottom:30px;">
                          Click <b>"Run SQL"</b> to execute the SQL statement
                          above.
                        </div>
                        <div style="margin:10px;">
                          Codevidhya has created an SQL database in your
                          browser.
                        </div>
                        <div style="margin:10px;">
                          The menu to the right displays the database, and will
                          reflect any changes.
                        </div>
                      </div>
                    </div>
                    <div
                      id="descriptionDIV"
                      style="text-align:center;display:none;"
                    >
                      <div id="nostatementsupport" style="display:none;">
                        <p>
                          This SQL-Statement is not supported in the WebSQL
                          Database.
                        </p>
                        <p>
                          The example still works, because it uses a modified
                          version of SQL.
                        </p>
                      </div>
                      <div id="nobrowsersupport" style="display:none;">
                        <p>Your browser does not support WebSQL.</p>
                        <p>
                          Your are now using a light-version of the Try-SQL
                          Editor, with a read-only Database.
                        </p>
                        <p>
                          If you switch to a browser with WebSQL support, you
                          can try any SQL statement, and play with the Database
                          as much as you like. The Database can also be restored
                          at any time.
                        </p>
                      </div>
                      <div id="yesbrowsersupport">
                        <p>
                          Our Try-SQL Editor uses WebSQL to demonstrate SQL.
                        </p>
                        <p>
                          A Database-object is created in your browser, for
                          testing purposes.
                        </p>
                        <p>
                          You can try any SQL statement, and play with the
                          Database as much as you like. The Database can be
                          restored at any time, simply by clicking the "Restore
                          Database" button.
                        </p>
                      </div>
                      <div id="websqlexplain">
                        <h3 style="font-size:16px;">W3C WebSQL</h3>
                        <p>
                          WebSQL stores a Database locally, on the user's
                          computer. Each user gets their own Database object.
                        </p>
                        <h3 style="font-size:16px;">WebSQL Browser Support</h3>
                        <div
                          style="width:180px;margin:auto;margin-bottom:10px;"
                        >
                          <div class="chromesupport"></div>
                          <div class="iesupport"></div>
                          <div class="safarisupport"></div>
                          <div class="firefoxsupport"></div>
                          <div class="operasupport"></div>
                          <div style="clear:both;"></div>
                        </div>
                        <p>WebSQL is supported in Chrome, Safari, and Opera.</p>
                        <div id="yesbrowsersupport2">
                          <p>
                            If you use another browser you will still be able to
                            use our Try SQL Editor, but a different version,
                            using a server-based ASP application, with a
                            read-only Access Database, where users are not
                            allowed to make any changes to the data.
                          </p>
                        </div>
                      </div>
                    </div>
                  </b-tab>
                </b-tabs>
              </div>
            </template>
            <template slot="paneR" v-if="windowWidth > 768">
              <div style="display:flex; flex-direction:column; height:100%;">
                <div class="row" style=" color:#FFF; padding:5px 5px;">
                  <div class="col-sm-10">
                    <span class="badge badge-pill badge-primary p-2"
                      >Result</span
                    >
                  </div>
                  <div
                    class="col-sm-2 text-right"
                    style="cursor:pointer;"
                    id="SQLTableButton"
                    @click="showDatabasePane()"
                  >
                    <span class="badge badge-warning p-2">Database</span>
                    >
                  </div>
                </div>
                <div id="resultSQL" style="flex-grow:1; overflow:auto; ">
                  <iframe
                    id="iframeResultSQL"
                    style="display:none"
                    frameborder="0"
                    name="view"
                  ></iframe>
                  <div id="divResultSQL" style="margin-top:30px;">
                    <div style="margin:10px;margin-bottom:30px;">
                      Click <b>"Run SQL"</b> to execute the SQL statement above.
                    </div>
                    <div style="margin:10px;">
                      Codevidhya has created an SQL database in your browser.
                    </div>
                    <div style="margin:10px;">
                      The menu to the right displays the database, and will
                      reflect any changes.
                    </div>
                  </div>
                </div>
                <div
                  id="descriptionDIV"
                  style="text-align:center;display:none;"
                >
                  <div id="nostatementsupport" style="display:none;">
                    <p>
                      This SQL-Statement is not supported in the WebSQL
                      Database.
                    </p>
                    <p>
                      The example still works, because it uses a modified
                      version of SQL.
                    </p>
                  </div>
                  <div id="nobrowsersupport" style="display:none;">
                    <p>Your browser does not support WebSQL.</p>
                    <p>
                      Your are now using a light-version of the Try-SQL Editor,
                      with a read-only Database.
                    </p>
                    <p>
                      If you switch to a browser with WebSQL support, you can
                      try any SQL statement, and play with the Database as much
                      as you like. The Database can also be restored at any
                      time.
                    </p>
                  </div>
                  <div id="yesbrowsersupport">
                    <p>Our Try-SQL Editor uses WebSQL to demonstrate SQL.</p>
                    <p>
                      A Database-object is created in your browser, for testing
                      purposes.
                    </p>
                    <p>
                      You can try any SQL statement, and play with the Database
                      as much as you like. The Database can be restored at any
                      time, simply by clicking the "Restore Database" button.
                    </p>
                  </div>
                  <div id="websqlexplain">
                    <h3 style="font-size:16px;">W3C WebSQL</h3>
                    <p>
                      WebSQL stores a Database locally, on the user's computer.
                      Each user gets their own Database object.
                    </p>
                    <h3 style="font-size:16px;">WebSQL Browser Support</h3>
                    <div style="width:180px;margin:auto;margin-bottom:10px;">
                      <div class="chromesupport"></div>
                      <div class="iesupport"></div>
                      <div class="safarisupport"></div>
                      <div class="firefoxsupport"></div>
                      <div class="operasupport"></div>
                      <div style="clear:both;"></div>
                    </div>
                    <p>WebSQL is supported in Chrome, Safari, and Opera.</p>
                  </div>
                </div>
              </div>
            </template>
          </split-pane>
        </div>
        <div id="database-pane">
          <div
            style="display:flex; flex-direction:column; height:100%; background:#FFF;"
          >
            <div
              class="row bg-secondary"
              style="margin-right:0px;margin-left:0px; color:#FFF; padding:5px 5px;"
            >
              <span>Database</span>
              <i class="flex flex-fill"></i>
              <span
                ><i
                  class="fas fa-times fa-lg"
                  style="cursor:pointer"
                  @click="showDatabasePane()"
                ></i
              ></span>
            </div>
            <div style="flex-grow:1; min-height:0;">
              <div id="yourDB">
                <!--<table class="table">
                  <tr><th>Tablename</th><th>Records</th></tr>
                  <tr v-for="(dbTable,index) in dbTables" :key="index">
                    <td style="text-align:left;cursor:pointer;text-decoration:underline;" @click="cvNoWebSQLSelectStar(dbTable.tablename)">{{dbTable.tablename}}</td><td>{{dbTable.tbrecords}}</td>
                  </tr>
                </table>-->
              </div>
              <div
                id="yourRC"
                style="margin-top:10px;margin-bottom:20px;"
              ></div>
              <div
                id="yourIX"
                style="margin-top:10px;margin-bottom:20px;"
              ></div>
              <center>
                <button
                  title="Restore the database back to its original content"
                  id="restoreDBBtn"
                  class="navbtn btn btn-danger"
                  type="button"
                  @click="ClearDatabase()"
                  style="display:block;"
                >
                  Restore Database
                </button>
              </center>
            </div>
          </div>
        </div>
      </div>
      <!-------------end SQl Editor---------->
      <div
        class="d-flex flex-grow-1 flex-column h-100"
        v-else-if="pythonEditor == true"
      >
        <iframe
          src="/static/python/index.html?book_id=5"
          style="height:100%; border:none;"
          @load="content_finished_loading($event)"
        ></iframe>
      </div>
    </section>
    <!--/end quickbook-->

    <Loader v-if="processes.length" />
  </div>
</template>
<script>
import Loader from "@/components/widgets/BlockingLoader.vue";
//import Header from "@/components/header/HeaderMenuOnly.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import WebEditor from "@/components/quickbook/WebEditor.vue";
import SqlEditor from "@/components/quickbook/SqlEditor.vue";
import PythonEditor from "@/components/quickbook/PythonEditor.vue";

import { codemirror } from "vue-codemirror";
// require styles
import "codemirror/lib/codemirror.css";
import "codemirror/lib/codemirror.js";

// require active-line.js
import "codemirror/addon/edit/closetag.js";
import "codemirror/addon/fold/xml-fold.js";

import "codemirror/addon/selection/active-line.js";
import "codemirror/addon/edit/matchbrackets.js";

// language js
import "codemirror/mode/xml/xml.js";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/css/css.js";
import "codemirror/mode/htmlmixed/htmlmixed.js";

// theme css
import "codemirror/theme/3024-day.css";
import "codemirror/theme/3024-night.css";
import "codemirror/theme/abcdef.css";
import "codemirror/theme/ambiance-mobile.css";
import "codemirror/theme/ambiance.css";
import "codemirror/theme/base16-dark.css";
import "codemirror/theme/base16-light.css";
import "codemirror/theme/bespin.css";
import "codemirror/theme/blackboard.css";
import "codemirror/theme/cobalt.css";
import "codemirror/theme/colorforth.css";
import "codemirror/theme/darcula.css";
import "codemirror/theme/dracula.css";
import "codemirror/theme/duotone-dark.css";
import "codemirror/theme/duotone-light.css";
import "codemirror/theme/eclipse.css";
import "codemirror/theme/elegant.css";
import "codemirror/theme/erlang-dark.css";
import "codemirror/theme/gruvbox-dark.css";
import "codemirror/theme/hopscotch.css";
import "codemirror/theme/icecoder.css";
import "codemirror/theme/idea.css";
import "codemirror/theme/isotope.css";
import "codemirror/theme/lesser-dark.css";
import "codemirror/theme/liquibyte.css";
import "codemirror/theme/lucario.css";
import "codemirror/theme/material.css";
import "codemirror/theme/mbo.css";
import "codemirror/theme/mdn-like.css";
import "codemirror/theme/midnight.css";
import "codemirror/theme/monokai.css";
import "codemirror/theme/neat.css";
import "codemirror/theme/neo.css";
import "codemirror/theme/night.css";
import "codemirror/theme/nord.css";
import "codemirror/theme/oceanic-next.css";
import "codemirror/theme/panda-syntax.css";
import "codemirror/theme/paraiso-dark.css";
import "codemirror/theme/paraiso-light.css";
import "codemirror/theme/pastel-on-dark.css";
import "codemirror/theme/railscasts.css";
import "codemirror/theme/rubyblue.css";
import "codemirror/theme/seti.css";
import "codemirror/theme/shadowfox.css";
import "codemirror/theme/solarized.css";
import "codemirror/theme/ssms.css";
import "codemirror/theme/the-matrix.css";
import "codemirror/theme/tomorrow-night-bright.css";
import "codemirror/theme/tomorrow-night-eighties.css";
import "codemirror/theme/ttcn.css";
import "codemirror/theme/twilight.css";
import "codemirror/theme/vibrant-ink.css";
import "codemirror/theme/xq-dark.css";
import "codemirror/theme/xq-light.css";
import "codemirror/theme/yeti.css";
import "codemirror/theme/zenburn.css";
import splitPane from "vue-splitpane";
import splitPane1 from "vue-splitpane";
export default {
  components: {
    Header,
    codemirror,
    "split-pane": splitPane,
    "split-pane1": splitPane1,
    WebEditor,
    SqlEditor,
    PythonEditor,
    Loader
  },
  data() {
    return {
      htmlCode: "",
      jsCode: "",
      cssCode: "",
      quickExamples: [],
      expNo: "",
      qrCode: "",
      cmOptions: {
        tabSize: 4,
        mode: "text/javascript",
        theme: "default",
        styleActiveLine: true,
        lineNumbers: true,
        styleActiveSelected: true,
        styleSelectedText: true,
        autoCloseTags: true,
        autoCloseBrackets: true,
        line: true,
        connect: "align",
        lineWrapping: true,
        matchTags: { bothTags: true },
        colorpicker: true
      },
      htmlOptions: {
        colorpicker: true,
        tabSize: 4,
        mode: "text/html",
        theme: "default",
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        connect: "align",
        collapseIdentical: false,
        highlightDifferences: true,
        autoCloseTags: true,
        autoCloseBrackets: true,
        matchTags: { bothTags: true }
      },
      books: [
        { book_name: "HTML, CSS", className: "4-5" },
        { book_name: "JavaScript", className: "6-7" },
        { book_name: "SQL", className: "sql" },
        { book_name: "Python", className: "8" }
      ],
      editorThemes: [
        { name: "default" },
        { name: "3024-day" },
        { name: "3024-night" },
        { name: "abcdef" },
        { name: "ambiance-mobile" },
        { name: "ambiance" },
        { name: "base16-dark" },
        { name: "base16-light" },
        { name: "bespin" },
        { name: "blackboard" },
        { name: "cobalt" },
        { name: "colorforth" },
        { name: "darcula" },
        { name: "dracula" },
        { name: "duotone-dark" },
        { name: "duotone-light" },
        { name: "eclipse" },
        { name: "elegant" },
        { name: "erlang-dark" },
        { name: "gruvbox-dark" },
        { name: "hopscotch" },
        { name: "icecoder" },
        { name: "idea" },
        { name: "isotope" },
        { name: "lesser-dark" },
        { name: "liquibyte" },
        { name: "lucario" },
        { name: "material" },
        { name: "mbo" },
        { name: "mdn-like" },
        { name: "midnight" },
        { name: "monokai" },
        { name: "neat" },
        { name: "neo" },
        { name: "night" },
        { name: "nord" },
        { name: "oceanic-next" },
        { name: "panda-syntax" },
        { name: "paraiso-dark" },
        { name: "paraiso-light" },
        { name: "pastel-on-dark" },
        { name: "railscasts" },
        { name: "rubyblue" },
        { name: "seti" },
        { name: "shadowfox" },
        { name: "solarized" },
        { name: "ssms" },
        { name: "the-matrix" },
        { name: "tomorrow-night-bright" },
        { name: "tomorrow-night-eighties" },
        { name: "ttcn" },
        { name: "twilight" },
        { name: "vibrant-ink" },
        { name: "xq-dark" },
        { name: "xq-light" },
        { name: "yeti" },
        { name: "zenburn" }
      ],
      langSelected: 1,
      editorTheme: "",
      selectedLanguageName: "HTML&CCC",
      selectedLanguage: "",
      pythonEditor: false,
      windowWidth: 0,
      windowHeight: 0,
      tabIndex: 0,
      codeId: "",
      exportCode: 0,
      foldername: "",
      //sql Editor
      sqlEditor: false,
      sqlStatement: "SELECT * FROM Customers ORDER BY CustomerName ASC",
      texteditor: "SELECT * FROM Customers ORDER BY CustomerName ASC",
      sqlcmOptions: {
        mode: "text/x-mysql",
        htmlMode: true,
        lineWrapping: true,
        smartIndent: true,
        addModeClass: true,
        lineNumbers: true,
        line: true
      },
      cvWebSQL1: "",
      cvWebSQLOK: !!window.openDatabase,
      statementSupport: "",
      databasePane: false,
      processes: []
    };
  },
  computed: {
    pageContainerHeight() {
      return this.windowHeight - 59;
    }
    /*selectedLanguageName() {
      if (this.pythonEditor) {
        return "Python";
      } else if (this.sqlEditor) {
        return "SQL";
      } else {
        return "HTML&CSS";
      }
    }*/
  },
  created() {
    if (this.$route.query.cont) {
      this.qrCode = this.$route.query.cont;
      this.searchQr();
      this.$router.push("/quickbook");
    }
  },
  beforeMount() {
    this.loadCode(
      this.$store.getters.getAuthData.auth_cls_id,
      this.$store.getters.getAuthData.auth_role_id
    );
    if (this.$store.getters.getAuthData.auth_cls_id >= 8) {
      this.pythonEditor = true;
    }
  },
  mounted: function() {
    //initCvModals();
    cvAuth.getUserId(
      function(userId) {
        if (userId) {
          this.userId = userId;
          this.cls_id = this.$store.getters.getAuthData.auth_cls_id;
          this.user_id = this.$store.getters.getAuthData.auth_user_id;
          this.sec_id = this.$store.getters.getAuthData.auth_sec_id;
          this.role_id = this.$store.getters.getAuthData.auth_role_id;
          this.sch_id = this.$store.getters.getAuthData.auth_sch_id;
        }
      }.bind(this)
    );
    hideTawk();

    this.getTopics();

    this.cvNoWebSQLInitialize();

    window.addEventListener("load", () => {
      this.loadCode(
        this.$store.getters.getAuthData.auth_cls_id,
        this.$store.getters.getAuthData.auth_role_id
      );
      this.cvNoWebSQLInitialize();
    });
    var vm = this;
    $(document).ready(function() {
      vm.windowWidth = $(window).width();
      vm.windowHeight = $(window).height();
      $(document).click(function($event) {
        if ($($event.target).attr("class") == "selectTable")
          vm.cvWebSQL1.selectStar($event.target.id);
        var editorcode = document.getElementById("textareaCodeSQL").value;
        vm.texteditor = editorcode;
        vm.sqlStatement = editorcode;
      });
    });

    $(window).resize(
      function() {
        this.windowWidth = $(window).width();
        this.windowHeight = $(window).height();
      }.bind(this)
    );

    $(document).ready(function() {
      $(".topDrop").on("click", function(event) {
        if ($(event.currentTarget.children[1]).css("display") == "none") {
          $(event.currentTarget.children[1]).css("display", "block");
          return false;
        }
      });
      $(".topDropDiv").click(function(event) {
        $(event.currentTarget).css("display", "none");
        return false;
      });
    });
  },
  methods: {
    showModal(modalId) {
      this.$refs[modalId].show();
    },
    hideModal(modalId) {
      this.$refs[modalId].hide();
    },
    getTopics() {
      this.$http
        .post("/api/quickbook/getTopics")
        .then(res => {
          console.log("HEHEHEHEHEHEHEH");
          console.log(res.body);
        })
        .catch(err => {
          console.log(err);
        });
    },
    linkClass(idx) {
      if (this.tabIndex === idx) {
        return ["bg-info", "text-light"];
      } else {
        return ["bg-light", "text-info"];
      }
    },
    activateEditor: function() {
      this.$refs.cmHtml.refresh();
      this.$refs.cmCss.refresh();
      this.$refs.cmJs.refresh();
    },
    handleLanguageSelected(e) {
      var bookName = e.currentTarget.dataset.bookName;
      if (~bookName.indexOf("HTML")) {
        this.selectedLanguageName = "HTML & CSS";
      } else if (~bookName.toLowerCase().indexOf("javascript")) {
        this.selectedLanguageName = "JavaScript";
      } else if (~bookName.toLowerCase().indexOf("sql")) {
        this.selectedLanguageName = "SQL";
      } else if (~bookName.toLowerCase().indexOf("python")) {
        this.selectedLanguageName = "Python";
      }
    },
    loadCode: function(cls_id, role_id) {
      var vm = this;
      if (cls_id == "sql") {
        this.selectedLanguage = "sql";
        this.sqlEditor = true;
        this.cvNoWebSQLInitialize();
        setTimeout(function() {
          vm.ClearDatabase();
        }, 500);
      } else if (cls_id == "8") {
        //document.getElementById("overlay").style.display = "block";
        this.processes.push({ message: "show" });
        this.sqlEditor = false;
        this.pythonEditor = true;
        this.selectedLanguage = "python";
      } else {
        this.sqlEditor = false;
        this.pythonEditor = false;
      }
      this.$http
        .post("/api/user/QuickExamples", { cls_id: cls_id, role_id: role_id })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            this.quickExamples = res.body.quickExamples;
            this.loadExample(0);
          }
        });
    },
    loadExample: function(cnt_id) {
      this.$refs.cmHtml.codemirror.setValue(this.quickExamples[cnt_id].content);
      this.$refs.cmCss.codemirror.setValue(this.quickExamples[cnt_id].css);
      this.$refs.cmJs.codemirror.setValue(this.quickExamples[cnt_id].js);
      this.expNo = cnt_id;
      this.editPreview();
      //$('#run_btn').click();
      return false;
    },
    nxtpre: function(value) {
      var totqr = this.quickExamples.length;
      var fstid = 0;
      var lstid = this.quickExamples.length - 1;
      if (value == "nxt") {
        if (this.expNo < lstid) {
          this.expNo += 1;
          this.loadExample(this.expNo);
        }
      } else if (value == "pre") {
        if (this.expNo > fstid) {
          this.expNo -= 1;
          this.loadExample(this.expNo);
        }
      }
    },
    searchQr: function() {
      for (var i = 0; i < this.quickExamples.length; i++) {
        if (
          this.quickExamples[i].qr_code.toLowerCase() ==
          this.qrCode.toLowerCase()
        ) {
          this.$refs.cmHtml.codemirror.setValue(this.quickExamples[i].content);
          this.$refs.cmCss.codemirror.setValue(this.quickExamples[i].css);
          this.$refs.cmJs.codemirror.setValue(this.quickExamples[i].js);
          this.expNo = this.quickExamples[i].id;
          this.editPreview();
          //$('#run_btn').click();
          return false;
        }
      }
      if (i == this.quickExamples.length) {
        alert("Invalid Qr.");
      }
    },
    run_code: function() {
      document.getElementById("preview").innerHTML = "";
      var previewFrame = document.getElementById("preview");
      var preview = previewFrame.contentWindow || previewFrame.contentDocument;
      if (preview.document) preview = preview.document;
      preview.open();
      preview.write(
        this.$refs.cmHtml.codemirror.getValue() +
          "<style>" +
          this.$refs.cmCss.codemirror.getValue() +
          "</style>\<\script\>" +
          this.$refs.cmJs.codemirror.getValue() +
          "\<\/script\>"
      );
      preview.close();
    },
    editPreview: function() {
      var frame = document.getElementById("preview");
      frame.parentNode.removeChild(frame);
      var ifrm = document.createElement("iframe");
      ifrm.setAttribute("frameborder", "0");
      ifrm.setAttribute("id", "preview");
      document.getElementById("sectionA").appendChild(ifrm);
      this.run_code();
    },

    exportProject: function() {
      if (this.exportCode == "download") {
        var zip = new JSZip();
        var htmlCode = this.$refs.cmHtml.codemirror.getValue().match(/\S/);
        var cssCode = this.$refs.cmCss.codemirror.getValue().match(/\S/);
        var jsCode = this.$refs.cmJs.codemirror.getValue().match(/\S/);
        if (htmlCode != null && cssCode != null && jsCode != null) {
          zip.file("index.html", this.$refs.cmHtml.codemirror.getValue());
          zip.file("style.css", this.$refs.cmCss.codemirror.getValue());
          zip.file("script.js", this.$refs.cmJs.codemirror.getValue());
        } else if (htmlCode != null && cssCode != null && jsCode == null) {
          zip.file("index.html", this.$refs.cmHtml.codemirror.getValue());
          zip.file("style.css", this.$refs.cmCss.codemirror.getValue());
        } else if (htmlCode == null && cssCode != null && jsCode != null) {
          zip.file("script.js", this.$refs.cmJs.codemirror.getValue());
          zip.file("style.css", this.$refs.cmCss.codemirror.getValue());
        } else if (htmlCode != null && cssCode == null && jsCode != null) {
          zip.file("script.js", this.$refs.cmJs.codemirror.getValue());
          zip.file("index.html", this.$refs.cmHtml.codemirror.getValue());
        } else if (htmlCode != null && cssCode == null && jsCode == null) {
          zip.file("index.html", this.$refs.cmHtml.codemirror.getValue());
        } else if (htmlCode == null && cssCode != null && jsCode == null) {
          zip.file("style.css", this.$refs.cmCss.codemirror.getValue());
        } else if (htmlCode == null && cssCode == null && jsCode != null) {
          zip.file("script.js", this.$refs.cmJs.codemirror.getValue());
        } else {
          notify("Please write some code.", "danger");
          return false;
        }
        zip.generateAsync({ type: "blob" }).then(function(content) {
          // see FileSaver.js
          saveAs(content, "project.zip");
          this.exportCode = 0;
        });
      } else if (this.exportCode == "exporttocodeplay") {
        this.$refs["folderModal"].show();
      } else if (this.exportCode == "moveproject") {
        this.$http
          .post("/api/user/ExportToCodeplay", {
            dirPath: this.$store.getters.getAuthData.auth_dir_path,
            foldername: this.foldername,
            htmlCode: this.$refs.cmHtml.codemirror.getValue(),
            cssCode: this.$refs.cmCss.codemirror.getValue(),
            jsCode: this.$refs.cmJs.codemirror.getValue()
          })
          .then(function(res) {
            if (res.body.status == "403") {
              //this.$router.push('/login');
            } else {
              if (res.body.done == true) {
                this.$refs["folderModal"].hide();
                this.exportCode = 0;
                this.foldername = "";
                notify("Success: Project exported in codeplay.", "success");
              } else if (res.body.done == false && res.body.folderexist) {
                this.exportCode = 0;
                this.foldername = "";
                notify("Unsuccess: Folder already exist.", "danger");
              }
            }
          });
      }
    },
    SharedCode: function(sharedType) {
      var htmlCode = this.$refs.cmHtml.codemirror.getValue().match(/\S/);
      var cssCode = this.$refs.cmCss.codemirror.getValue().match(/\S/);
      var jsCode = this.$refs.cmJs.codemirror.getValue().match(/\S/);
      if (htmlCode == null && cssCode == null && jsCode == null) {
        notify("Please write some code.", "danger");
        return false;
      }
      this.$http
        .post("/api/user/SharedCode", {
          user_id: this.$store.getters.getAuthData.auth_user_id,
          htmlCode: this.$refs.cmHtml.codemirror.getValue(),
          cssCode: this.$refs.cmCss.codemirror.getValue(),
          jsCode: this.$refs.cmJs.codemirror.getValue()
        })
        .then(function(res) {
          if (res.body.status == "403") {
            //this.$router.push('/login');
          } else {
            if (res.body.codeId != "") {
              if (sharedType == "facebook") {
                var a = document.createElement("a");
                a.target = "_blank";
                a.href =
                  "https://www.facebook.com/sharer/sharer.php?u=https://codevidhya.com/MySharedCode/?codeId=" +
                  res.body.codeId +
                  "&src=sdkpreparse";
                a.click();
              } else if (sharedType == "whatsapp") {
                window.open(
                  "https://api.whatsapp.com/send?text=https://codevidhya.com/MySharedCode/?codeId%3D" +
                    res.body.codeId,
                  "_blank"
                );
              } else if (sharedType == "twitter") {
                window.open(
                  "https://www.twitter.com/share?url=https://codevidhya.com/MySharedCode/?codeId%3D" +
                    res.body.codeId,
                  "_blank"
                );
              } else if (sharedType == "linkedin") {
                window.open(
                  "https://www.linkedin.com/shareArticle?mini=true&url=https://codevidhya.com/MySharedCode/?codeId%3D" +
                    res.body.codeId,
                  "_blank"
                );
              }
            }
          }
        });
    },
    ApplyTheme: function(themename) {
      this.cmOptions.theme = themename;
      this.htmlOptions.theme = themename;
    },
    openNav: function() {
      $("#mySidepanel").addClass("open");
    },
    closeNav: function() {
      $("#mySidepanel").removeClass("open");
    },
    editorStatus: function(editorType) {
      if (editorType == "python") {
        this.pythonEditor = false;
        this.quickExamples = [];
        this.langSelected = 1;
      } else if (editorType == "sql") {
        this.sqlEditor = false;
        this.quickExamples = [];
        this.langSelected = 1;
      }
    },
    content_finished_loading: function(e) {
      if (e.returnValue == true) {
        this.processes.pop();
        //document.getElementById("overlay").style.display = "none";
      }
    },
    //sql editor methods
    cvNoWebSQLInitialize: function() {
      if (this.cvWebSQLOK === true && this.statementSupport === "") {
        this.cvWebSQL1 = new w3WebSQLInit();
        /*
        this.cvWriteDBInfo();
        
        Used for showing database information.
        The implementation is incomplete.
        Required HTML isn't present.
        */
      }
    },
    cvWriteDBInfo: function() {
      var txt;
      if (this.cvWebSQLOK === true && this.statementSupport === "") {
        this.cvWebSQL1.myDatabase();
      }
    },
    cvNoWebSQLSelectStar: function(x) {
      var sql = "SELECT * FROM " + x + ";";
      this.sqlStatement = sql;
      this.$refs.cmSql.codemirror.setValue(sql);
      this.cvNoWebSQLSubmit();
    },
    cvSQLSubmit: function() {
      this.texteditor = this.$refs.cmSql.codemirror.getValue();
      var txt;
      if (this.cvWebSQLOK === true && this.statementSupport === "") {
        this.cvWebSQL1.runSQL();
      }
    },
    ClearDatabase: function() {
      this.cvWebSQL1.w3ClearDatabase();
    },
    showDatabasePane: function() {
      if (this.databasePane == false) {
        $("#database-pane").addClass("active");
        this.databasePane = true;
      } else {
        $("#database-pane").removeClass("active");
        this.databasePane = false;
      }
    }
  },

  updated: function() {
    var vm = this;
    $(document).ready(function() {
      $("iframe").each(function() {
        //Using closures to capture each one
        var iframe = $(this);
        iframe.on("load", function() {
          //Make sure it is fully loaded
          iframe.contents().click(function(event) {
            if (event.target.id == "backToWebEditor") {
              vm.pythonEditor = false;
              vm.quickExamples = [];
              vm.langSelected = 1;
              vm.loadCode(
                vm.$store.getters.getAuthData.auth_cls_id,
                vm.$store.getters.getAuthData.auth_role_id
              );
            }
            //iframe.trigger("click");
          });
        });
      });
    });
  }
};
</script>
<style lang="scss">
#quickbook-root {
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;

  #language-dropdown-container {
    button {
      padding: 8px 12px;
      line-height: 1;
    }
    ul {
      margin-top: -4px;
    }
    li {
      border: none !important;
      transition: all 200ms;
      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }

  #view-all-examples-btn {
    padding: 8px 12px;
    line-height: 1;
  }

  .vue-codemirror {
    height: 100%;
    .CodeMirror {
      height: 100%;
    }
  }

  #web-editor-wrapper {
    .splitter-paneL,
    .splitter-paneR {
      padding: 0 4px 8px;
    }
  }

  #quickbook-example-heading {
    color: #212121;
    font: bold 1.2rem/1 "Poppins", sans-serif;
  }

  #html-codemirror-wrapper {
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
    .tab-menu-heading {
      padding: 0 4px 0 0;
      border: none;
      border-bottom: 2px solid #1abc9c;
      .tabs-menu {
        a {
          display: block;
          height: 36px;
          padding: 0 16px;
          line-height: 36px;
          border-radius: 0;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
          &:hover {
            color: #2e384d;
          }
          &.active {
            background: #1abc9c;
            &:hover {
              color: #fff;
            }
          }
        }
      }
    }
    .panel-body {
      padding: 0;
      border: none;
      overflow: hidden;
    }
    .tab-content {
      min-height: 0;
    }
    .tab-pane {
      height: 100%;
    }

    .run-btn {
      position: relative;
      height: 28px;
      padding: 0 12px;
      line-height: 28px;
      border: none;
      border-radius: 4px;
      background: #ff9b18;
      color: #fff;
      transition: all 200ms;
      i {
        margin-right: 4px;
      }
      &:hover {
        opacity: 0.6;
      }
      &:active {
        opacity: 1;
      }
    }
  }

  #html-output {
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
    h3 {
      padding: 12px 16px;
      background: #1abc9c;
      font: bold 0.9rem/1 "Poppins", sans-serif;
      color: #fff;
    }
  }
}
.splitter-paneR {
  z-index: 1000;
}
.navbtn {
  width: auto;
  display: inline-block;
}

.quickbook-header {
  margin-top: 56px;
}
#preview {
  color: #000;
  width: 100%;
  height: 100%;
}

#overlay {
  width: 100%;
  position: absolute;
  display: none;
  z-index: 150000;
  height: 100%;
  top: 58px;
  left: 0;
  overflow: hidden;
  transition: 0.5s;
  padding-top: 60px;
  padding-bottom: 60px;
  background: #fff;
}

#mySidepanel {
  width: 0;
  position: fixed;
  z-index: 150000;
  width: 300px;
  height: calc(100% - 59px);
  min-height: 0;
  top: 59px;
  right: -300px;
  overflow: hidden;
  transition: 0.3s;
  background: #f1f1f1;
  &.open {
    right: 0;
    box-shadow: -4px 0 8px rgba(0, 0, 0, 0.2);
  }

  .examples-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    h5 {
      margin-left: 16px;
      font-weight: bold;
    }
    a {
      margin: 4px;
      padding: 10px;
      line-height: 1;
      &:hover {
        opacity: 0.5;
      }
    }
  }

  .examples-container {
    overflow-y: scroll;
  }

  .example-item {
    h5 {
      margin-bottom: 8px;
    }
    width: 100%;
    margin: 4px 0;
    padding: 16px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }
}

.sidepanel a {
  padding: 8px 8px 8px 32px;
  text-decoration: none;
  font-size: 25px;
  color: #818181;
  display: block;
  transition: 0.3s;
}

.splitter-pane-resizer {
  z-index: 99999 !important;
}

#html-tab___BV_tab_button__,
#css-tab___BV_tab_button__,
#js-tab___BV_tab_button__,
#output-tab___BV_tab_button__ {
  font-size: 1rem;
  border-radius: 0;
  min-width: 64px;
  padding: 0 16px;
  text-align: center;
  transition-duration: 0ms;
  line-height: 18px !important;
}

#sql-editor-container .vue-splitter-container > div:nth-of-type(3) {
  overflow-y: auto;
}

.menuforMob1 {
  display: flex;
  width: 100%;
  justify-content: space-around;
  background: slateblue;
  color: #fff;
  > div {
    padding: 8px 8px;
  }
  > span {
    padding: 0px 8px;
    input[type="text"] {
      padding: 2px 6px;
      margin: 0px;
    }
    button {
      margin: 0px;
      height: 100%;
    }
  }
}
.menuforMob2 {
  display: flex;
  justify-content: space-between;
  background: slateblue;
  color: #fff;
  > div {
    padding: 10px 18px;
    i {
      font-size: 16px;
    }
  }
}

.row {
  margin-left: 0px !important;
  margin-right: 0px !important;
}

.menuforMob1 > div:hover {
  background: rgba(255, 255, 255, 0.15);
  cursor: pointer;
}
.menuforMob2 > div:hover {
  background: rgba(255, 255, 255, 0.15);
  cursor: pointer;
}
.topDrop {
  position: relative;
  display: inline-block;
}
.topDropa {
}
.topDropDiv {
  position: absolute;
  display: none;
  background: #fff;
  color: #212529;
  min-width: 120px;
  border-radius: 4px;
  box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  > div {
    padding: 3px 12px;
    display: block;
  }
  &#shareDiv {
    right: 20px;
  }
}
.topDropDiv > div:hover {
  background: rgba(0, 0, 0, 0.1);
}
.topDrop:hover {
  .topDropDiv {
    display: block;
  }
}

.SQLTableButton {
  background: rgba(0, 0, 0, 0.2);
  padding: 2px 6px;
  margin-right: 4px;
  border-radius: 4px;
}
.SQLTableButton:hover {
  cursor: pointer;
}
@media only screen and (max-width: 425px) {
  #exampleMenuCard {
    justify-content: space-around;
    > div {
      flex-wrap: nowrap;
    }
  }
}

#database-pane {
  background: #fff;
  width: 230px;
  right: -230px;
  position: fixed;
  z-index: 99999;
  height: 70%;
  top: 148px;
  padding: 4px 2px 4px 8px;
  border-radius: 2px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: all 300ms;
  &.active {
    right: 0;
    opacity: 1;
  }
}
</style>
