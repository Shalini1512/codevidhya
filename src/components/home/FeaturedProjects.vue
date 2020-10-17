<template>
  <!--Section-->
  <section class="sptb">
    <div class="container">
      <div class="section-title center-block text-center">
        <h2 class="mb-4">Featured Projects</h2>
        <p>See Amazing Projects Created By Codevidhya Kids</p>
      </div>
      <div class="row news justify-content-between">
        <div class="card">
          <a
            href="https://codevidhya.com/Codeplay/euro_i_school/harshitadeewan/Challenge18/index.html"
            target="_blank"
          >
            <img
              src="/assets/images/featured-projects/harshita.JPG"
              alt="img"
              class="cover-image"
          /></a>
          <div class="card-body p-5">
            <a
              href="https://codevidhya.com/Codeplay/euro_i_school/harshitadeewan/Challenge18/index.html"
              class="text-dark"
              target="_blank"
            >
              <h3 class="mb-2 font-weight-semibold">
                Abolish Food Poverty
              </h3>
            </a>
            <p>
              Developed by Harshita Deewan, a grade 8 student studying in Euro
              International School, Sikar.
            </p>
          </div>
        </div>

        <div class="card">
          <a href="http://www.eisnews.org" target="_blank">
            <img
              src="/assets/images/featured-projects/eisnews.png"
              alt="img"
              class="cover-image"
          /></a>
          <div class="card-body p-5">
            <a href="http://www.eisnews.org" class="text-dark" target="_blank">
              <h3 class="mb-2 font-weight-semibold">
                Eisnews.Org
              </h3>
            </a>
            <p>
              News platform developed by students at Euro International School,
              Sikar.
            </p>
          </div>
        </div>

        <div class="card">
          <a href="hhttp://ekunit.org" target="_blank">
            <img
              src="/assets/images/featured-projects/ekunit.png"
              alt="img"
              class="cover-image"
          /></a>
          <div class="card-body p-5">
            <a href="http://ekunit.org" class="text-dark" target="_blank">
              <h3 class="mb-4 font-weight-semibold">
                Ekunit.Org
              </h3>
            </a>
            <p>
              Ekunit is an online community for blood donation developed by
              students from Euro International School, Sikar.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!--/Section-->
</template>

<style scoped>
.card {
  width: 32%;
  padding-bottom: 24px;
  border-radius: 8px;
  overflow: hidden;
}

@media only screen and (max-width: 425px) {
  .card {
    width: 88%;
  }
  .row {
    justify-content: center!important;
  }
}
</style>
