<template>
  <div class="card">
    <div class="card-header bg-secondary">
      <h3 class="card-title text-white">Codevidhya Achievements</h3>
    </div>
    <div class="card-body">
      <div class="row p-2">
        <div class="col-sm-4">
          <h4 class="text-danger">
            <i class="fas fa-book-reader mr-1"></i> Courses Enrolled
          </h4>
        </div>
        <div class="col-sm-8">
          <p>
            <template v-for="(lms_user_book, key) in lms_user_books">
              <template
                v-if="sch_course == 1 && lms_user_book.other_courses == 0"
              >
                <button
                  :class="
                    'btn ' +
                      (sch_course == 1 && key == index
                        ? ' btn-primary'
                        : ' btn-outline-primary')
                  "
                  v-if="lms_user_book.sch_course == 1"
                  v-bind:key="key"
                  @click="changeProgressIndex(key)"
                >
                  {{ lms_user_book.book_name }}
                </button>
              </template>
              <template v-else>
                <button
                  :class="
                    'btn mr-2  ' +
                      (sch_course == 0 && key == index
                        ? ' btn-primary'
                        : ' btn-outline-primary')
                  "
                  v-if="!(lms_user_book.sch_course == 1)"
                  v-bind:key="key"
                  @click="changeProgressIndex(key)"
                >
                  {{ lms_user_book.book_name }}
                </button>
              </template>
            </template>
          </p>
        </div>
      </div>
      <div class="row p-2">
        <div class="col-sm-4">
          <h4 class="text-danger">
            <i class="fab fa-font-awesome-flag mr-1"></i> Milestone Achieved
          </h4>
        </div>
        <div class="col-sm-8">
          <p>
            <span class="badge badge-success">{{ complete_topic }}</span> out of
            <span class="badge badge-primary">{{ tot_topics }}</span> lessons
            completed
          </p>
          <p class="pt-2">
            <i class="fa fa-check text-success"></i> Success rate:
            <b
              >{{
                lms_user_books.length
                  ? lms_user_books[index].per
                    ? lms_user_books[index].per
                    : "0"
                  : "0"
              }}%</b
            >
          </p>
        </div>
      </div>
    </div>
    <NextLessons
      ref="SelfNextLessonsPlans"
      style="margin-top:10px;"
      :next_lessons="next_lessons"
    />
  </div>
</template>
<script>
import AuthMixin from "@/mixins/AuthMixin.js";
import axios from "axios";
import NextLessons from "@/views/Dashboard/NextLesson.vue";
export default {
  mixins: [AuthMixin],
  props: {
    sch_course: { type: Number, required: true },
    books_group: { type: Array, required: true },
    lms_user_books: { type: Array, required: true }
  },
  components: {
    NextLessons
  },
  data() {
    return {
      userId: 0,
      index: 0,
      book_id: "",
      tot_topics: "",
      complete_topic: "",
      next_lessons: new Array()
    };
  },
  mounted() {
    this.callfunction(event);
  },
  methods: {
    callfunction(event) {
      this.activefunction(
        this.sch_course,
        this.lms_user_books,
        this.books_group
      );
      let vs = this;
      //this.$emit("loadFunctionData", event);
    },
    changeProgressIndex(index) {
      this.index = index;
      this.book_id = this.lms_user_books[index].book_id;
      let book_name = this.lms_user_books[index].book_name;
      let book_slug = this.lms_user_books[index].slug;
      let sch_c = this.lms_user_books[index].sch_course
        ? this.lms_user_books[index].sch_course
        : "0";
      let purchases_status = this.lms_user_books[index].purchases_status
        ? this.lms_user_books[index].purchases_status
        : "0";
      let for_grade = this.lms_user_books[index].for_grade
        ? this.lms_user_books[index].for_grade
        : "0";
      let sch_id = this.lms_user_books[index].sch_id;
      let vm = this;
      let st_read = 0;
      if (this.books_group.length) {
        vm.tot_topics = vm.books_group.filter(
          x => x.book_id === vm.book_id
        ).length;
        let books = vm.books_group.filter(x => x.book_id === vm.book_id);
        let count = 0;
        books = books.filter((x, index) => {
          return (
            (x.lesson_no = index + 1),
            (x.book_name = book_name),
            (x.book_slug = book_slug),
            (x.sch_course = sch_c),
            (x.for_grade = for_grade),
            (x.purchases_status = purchases_status),
            (x.sch_id = sch_id)
          );
        });
        books.reduce((accum, curr) => {
          if (curr.tot_topic == curr.st_read_topic) {
            return ++count;
          }
          return;
        }, 0);
        vm.complete_topic = count;
        vm.next_lessons = books
          .filter(x => x.tot_topic !== x.st_read_topic)
          .slice(0, 3);
      }
    },
    achievementCalling(plans, lms_user_books, books_group) {
      if (plans == "institute") {
        this.activefunction(1, lms_user_books, books_group);
      } else {
        this.activefunction(0, lms_user_books, books_group);
      }
    },
    async activefunction(sch_course, lms_user_books, books_group) {
      if (sch_course == 1) {
        let vm = this;
        if (lms_user_books.length) {
          for (let i = 0; i < lms_user_books.length; i++) {
            if (lms_user_books[i].sch_course == 1) {
              vm.index = i;
              vm.book_id = lms_user_books[i].book_id;
              let book_name = lms_user_books[i].book_name;
              let book_slug = lms_user_books[i].slug;
              let sch_c = lms_user_books[i].sch_course
                ? lms_user_books[i].sch_course
                : "0";
              let purchases_status = lms_user_books[i].purchases_status
                ? lms_user_books[i].purchases_status
                : "0";
              let for_grade = lms_user_books[i].for_grade
                ? lms_user_books[i].for_grade
                : "0";
              let sch_id = lms_user_books[i].sch_id;
              vm.tot_topics = await books_group.filter(
                x => x.book_id === vm.book_id
              ).length;

              let books = await books_group.filter(
                x => x.book_id === vm.book_id
              );
              let count = 0;
              books = await books.filter((x, index) => {
                return (
                  (x.lesson_no = index + 1),
                  (x.book_name = book_name),
                  (x.book_slug = book_slug),
                  (x.sch_course = sch_c),
                  (x.for_grade = for_grade),
                  (x.purchases_status = purchases_status),
                  (x.sch_id = sch_id)
                );
              });
              await books.reduce(async (accum, curr) => {
                if (curr.tot_topic == curr.st_read_topic) {
                  return ++count;
                }
                return;
              }, 0);
              vm.complete_topic = count;

              vm.next_lessons = await books
                .filter(x => x.tot_topic !== x.st_read_topic)
                .slice(0, 3);

              break;
            }
          }
        }
      } else {
        let vm = this;
        if (lms_user_books.length) {
          for (let i = 0; i < lms_user_books.length; i++) {
            if (lms_user_books[i].sch_course == 0) {
              vm.index = i;
              vm.book_id = lms_user_books[i].book_id;
              let book_name = lms_user_books[i].book_name;
              let book_slug = lms_user_books[i].slug;
              let sch_c = lms_user_books[i].sch_course
                ? lms_user_books[i].sch_course
                : "0";
              let purchases_status = lms_user_books[i].purchases_status
                ? lms_user_books[i].purchases_status
                : "0";
              let for_grade = lms_user_books[i].for_grade
                ? lms_user_books[i].for_grade
                : "0";
              let sch_id = lms_user_books[i].sch_id;
              vm.tot_topics = books_group.filter(
                x => x.book_id === vm.book_id
              ).length;
              let books = books_group.filter(x => x.book_id === vm.book_id);
              let count = 0;
              books = books.filter((x, index) => {
                return (
                  (x.lesson_no = index + 1),
                  (x.book_name = book_name),
                  (x.book_slug = book_slug),
                  (x.sch_course = sch_c),
                  (x.for_grade = for_grade),
                  (x.purchases_status = purchases_status),
                  (x.sch_id = sch_id)
                );
              });
              books.reduce((accum, curr) => {
                if (curr.tot_topic == curr.st_read_topic) {
                  return ++count;
                }
                return;
              }, 0);
              vm.complete_topic = count;
              vm.next_lessons = books
                .filter(x => x.tot_topic !== x.st_read_topic)
                .slice(0, 3);

              break;
            }
          }
        }
      }
    }
  }
};
</script>
