<template>
  <div>
    <Header>
      <HeaderContent />
    </Header>
    <Skills />
    <Footer />
  </div>
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/home/HeaderContent.vue";
import Skills from "@/components/home/Skills.vue";
import Footer from "@/components/footer/Footer.vue";

export default {
  name: "home",
  components: {
    Header,
    HeaderContent,
    Skills,
    Footer
  }
};
</script>
