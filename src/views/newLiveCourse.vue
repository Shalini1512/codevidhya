<template>
  <div>
    <Header />
    <div style="min-height: 60px;"></div>
    <div class="container-fluid" style="background: #028dd2">
        <div class="container-80">
            <div class="row m-0 mt-3 course-info">
                <div class="col-lg-6 d-block">
                    <div class="text-property text-white">
                        <div class="mt-1 ml-2">
                            <span
                                style="
                                color: ;
                                font: normal 3rem/1.7 'Poppins', sans-serif;
                                font-size: 48px;
                                font-weight: 600;
                                "
                            >
                                Scratch, Your First Step!!
                            </span>
                        </div>
                        <div class="mt-2 ml-2">
                            <span
                                style="
                                    font: normal 1rem/1.2 'Poppins', sans-serif;
                                    font-size: 20px;
                                    font-weight: 600;
                                "
                            >
                                Computer Introduction & Scratch
                            </span>
                        </div>
                        <div class="mt-2 ml-2" style="display: flex; flex-direction: row;">
                            <div class="flex-grow-1" style="color: ; font: normal 1rem/1.2 'Poppins', sans-serif;" >
                                <span class="mr-2">Grade: <span class="ml-1" style="color: ;">1+</span></span>
                                <span class="mx-2">Age: <span class="ml-1">6+</span></span>
                                <span class="mx-2">Duration <i class="fas fa-clock"></i> : <span class="ml-1">6 Hours</span></span>
                            </div>
                        </div>
                        <div class="mt-4 ml-2">
                            <div class="rating-stars">
                                <div>
                                <span class="empty-stars">
                                    <span class="star">
                                    <i class="fas fa-star"></i>
                                    </span>
                                    <span class="star">
                                    <i class="fas fa-star"></i>
                                    </span>
                                    <span class="star">
                                    <i class="fas fa-star"></i>
                                    </span>
                                    <span class="star">
                                    <i class="fas fa-star"></i>
                                    </span>
                                    <span class="star">
                                    <i class="fas fa-star"></i>
                                    </span>
                                </span>
                                <span class="filled-stars" :style="'width:' + 90 + '%'">
                                    <span class="star">
                                    <i class="fas fa-star"></i>
                                    </span>
                                    <span class="star">
                                    <i class="fas fa-star"></i>
                                    </span>
                                    <span class="star">
                                    <i class="fas fa-star"></i>
                                    </span>
                                    <span class="star">
                                    <i class="fas fa-star"></i>
                                    </span>
                                    <span class="star">
                                    <i class="fas fa-star"></i>
                                    </span>
                                </span>
                                </div>
                            </div>
                        </div>
                        <div class="mt-8 ml-2 mb-4">
                            <button type="button" class="btn btn-success mr-3 btn-main" style="font: normal 1rem/1.2 'Poppins', sans-serif; font-size: 20px; font-weight: 500;">Enroll Now</button>
                            <button type="button" class="btn btn-warning ml-3 btn-main" style="font: normal 1rem/1.2 'Poppins', sans-serif; font-size: 20px; font-weight: 500;">Book A Free Trial</button>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 d-block">
                    <div class="course-card float-right">
                        <div class="p-2">
                            <img src="/assets/images/png/courses/scratch_your_first_step.jpg">
                        </div>
                        <div class="course-desc">
                            <span class="heading">Description:</span>
                            Get introduced to the the creative world of animation in a fun and interactive way.
                            <div class="price">
                                <span>INR 9999 <del>12999</del></span> <span><a href="">Apply Coupon</a></span>
                            </div>
                        </div>
                        <div>
                            <button type="button" class="btn btn-success btn-lg btn-block" style="border-radius: 0;">Buy Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="container-fluid" style="background: #fff;">
        <div class="container-80 mt-5 mb-5">
            <div class="row ml-3">
                <div class="col-lg-6">
                    <span class="list-head">This Course Offer</span>
                    <ul class="list-group">
                        <li class="listunorder">6 hours of 1:1 personalised and customised live sessions</li>
                        <li class="listunorder">Lifetime access to e-learning resources</li>
                        <li class="listunorder">After- class assignments and quizzes</li>
                        <li class="listunorder">7 Projects</li>
                        <li class="listunorder">Course Completion Certificate</li>
                        <li class="listunorder">24x7 customer support</li>
                    </ul>
                </div>
            </div>
            <div class="row mt-6 ml-3">
                <div class="col-lg-6">
                    <span class="list-head">You Will Learn:</span>
                    <ul>
                        <li class="listunorder">Basics of Computer</li>
                        <li class="listunorder">Algorithms and Flowcharts</li>
                        <li class="listunorder">Binary Numbers</li>
                        <li class="listunorder">Basics of Scratch</li>
                        <li class="listunorder">Animation in Scratch</li>
                    </ul>
                </div>
                <div class="col-lg-6">
                    <div class="float-right" style="width: 400px;">
                        <span class="list-head">Requirements:</span>
                        <ul>
                            <li class="listunorder">A laptop/desktop with webcam</li>
                            <li class="listunorder">Active and stable internet connection</li>
                            <li class="listunorder">Zeal to Learn!</li>        
                        </ul>
                    </div>
                </div>
            </div>
            <div class="row mt-6 ml-3">
                <div class="col-lg-12">
                    <span class="list-head">Skills You Will Acquire:</span>
                    <div class="skills">
                        <span class="badge badge-pill badge-danger">Scratch</span>
                        <span class="badge badge-pill badge-danger">Logical Thinking</span>
                        <span class="badge badge-pill badge-danger">Flowcharts</span>
                        <span class="badge badge-pill badge-danger">Animation</span>
                    </div>
                </div>
            </div>
            <div class="accordion m-3 mt-6" id="accordionExample">
                <div class="card">
                    <div class="card-header p-0" id="headingOne">
                        <h2 class="mb-0">
                            <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                               <span class="list-head">Curriculum</span>
                            </button>
                        </h2>
                    </div>

                    <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                        <div class="card-body">
                            <ul class="listunorder" style="list-style: none;">
                                <li>Session 1 Basics of computers <span class="float-right">Duration : 60 minutes</span></li>
                                <li>Session 2 Algorithms and flowcharts <span class="float-right">Duration : 60 minutes</span></li>
                                <li>Session 3 Understanding binary <span class="float-right">Duration : 60 minutes</span></li>
                                <li>Session 4 Introduction to Scratch <span class="float-right">Duration : 60 minutes</span></li>
                                <li>Session 5 Basics of Scratch <span class="float-right">Duration : 60 minutes</span> </li>
                                <li>Session 6 Minor project <span class="float-right">Duration : 60 minutes</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
                </div>
                <div class="row mt-6 ml-3">
                    <div class="col-lg-12">
                        <span class="list-head">Projects You Will Create:</span>
                        <div class="projects d-flex justify-content-between mt-5">
                            <img src="/assets/images/project-thumbs/scratch.png">
                            <img src="/assets/images/project-thumbs/scratch.png">
                            <img src="/assets/images/project-thumbs/scratch.png">
                            <img src="/assets/images/project-thumbs/scratch.png">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    <div class="mt-5"></div>
    <WhyUs />
    <TestimonialsTabbed />
    <div class="m-0 text-center pb-3">
        <div class="card p-0 m-0 text-center">
            <div class="text-center pt-3" style="font-size: 28px;">
                <strong>Other Courses</strong>
            </div>
            <otherCourses :liveCourseName="liveCourseName" />
        </div>
    </div>
    <Footer />
  </div>
</template>
<script>
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import WhyUs from '@/components/home/WhyUs.vue'
import TestimonialsTabbed from '@/components/home/TestimonialsTabbed.vue'
import otherCourses from "@/components/courses/Othercourses.vue";
import Footer from "@/components/footer/Footer.vue";
import Loader from "@/components/widgets/BlockingLoader.vue";
export default {
  components: {
    Header,
    WhyUs,
    TestimonialsTabbed,
    otherCourses,
    Footer,
    Loader,
  },
  data() {
    return {
      liveCourseName: "scratch_your_first_step"
    };
  },
}
</script>
<style lang="scss" scoped>
.container-80 {
    width: 80%;
    margin: auto;
}
.btn-main {
    font-size: 20px;
    font-weight: bold;
}
.course-info {
    max-height: 330px;
    background: #028dd2;
}
.filled-stars {
  color: #ffa22b !important;
}
.course-card {
    margin-top: 20px;
    width: 400px;
    background: #fff;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    color: #000;
    font-size: 20px;
    .heading {
        font-size: 22px;
        display: block;
        margin-bottom: 10px;
    }
    .course-desc {
        padding: 10px;
        img {
            border: 5px solid #fff;
        }
        .price {
            margin-top: 25px;
            margin-bottom: 10px;
            font-size: 20px;
            font-weight: 600;
            del {
                font-size: 14px;
            }
            a {
                float: right;
                font-size: smaller;
                vertical-align: text-bottom;
            }
            .btn {
                border-radius: 0 !important;
            }
        }
    }
}
.list-head {
    font: normal 1rem/1.2 'Poppins', sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: #000;
    display: block;
}
.listunorder {
    background: none;
    border: none;
    color: #000;
    font-size: 20px;
    padding: 4px;
}
.skills {
    display: block;
    .badge {
        margin-top: 10px;
        margin-right: 12px;
        padding: 9px 12px;
        font-size: 18px;
        font-weight: bold;
    }
}
.projects {
    img {
        width: 300px;
    }
}
</style>
