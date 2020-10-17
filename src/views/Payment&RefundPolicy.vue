<template>
  <div>
    <Header>
      <section>
        <div class="sptb-2 bannerimg">
          <div class="header-text mb-0">
            <div class="container">
              <div class="text-center text-white">
                <h1 class>Payment & Refund Policy</h1>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!--/Section-->
    </Header>

    <!--section-->
    <section class="sptb bg-white">
      <div class="container">
        <div class="section-title center-block text-center">
          <h2>Payment Policy</h2>
          <span class="sectiontitle-design"><span class="icons"></span></span>
        </div>
        <div>
          <ol style="list-style-type: 1;">
            <li style="padding-bottom: 4px;">
              The pricing would vary as per the product and service were chosen by the customer, it is solely the responsibility of the customer to validate and verify before making the payment.
            </li>
            <br />
            <li style="padding-bottom: 4px;">
              The total price reflected in your billing will include the price of the course plus any applicable tax; such tax is based on the bill-to address and the tax rate in effect at the time you purchase the course.
            </li>
            <br />
            <li style="padding-bottom: 4px;">
              The price for the courses offered by Codevidhya India Private Limited may change at any time, and courses do not provide price protection or refunds in the event of a price reduction or promotional offering.
            </li>
            <br />
            <li style="padding-bottom: 4px;">
              The service will be limited to the type of product purchased. Irrespective of the type of product purchased, the fulfillment happens online and customers can view the relevant course/product/service under their profile.
            </li>
            <br />
            <li style="padding-bottom: 4px;">
              The payment mechanism on the online platform is processed by a third party using a payment gateway and will be governed as per the agreement between the financial institute and the customer. Customers can contact the customer care for an alternate method of payment.
            </li>
            <br />
            <li style="padding-bottom: 4px;">
              Codevidhya is not liable for any fraud, unauthorized usage, delay in payment refund, or reduction in refund amount due to this payment gateway.
            </li>
            <br />
            <li style="padding-bottom: 4px;">
              It is the customer's ownership to ensure the Tech Requirements are met before making payment of any of the courses.
            </li>
          </ol>
        </div>
      </div>
    </section>
    <!--/Section-->
    <!--section-->
    <section class="sptb bg-white">
      <div class="container">
        <div class="section-title center-block text-center">
          <h2>Refund Policy</h2>
          <span class="sectiontitle-design"><span class="icons"></span></span>
        </div>
        <div>
          <ol style="list-style-type: 1;">
            <li style="padding-bottom: 4px;">
              If the customer reaches out to cancel the LIVE sessions due to some tech issue at their end, then the amount will be converted to credit and can be used to purchase other offerings on the platform.
            </li>
            <br />
            <li style="padding-bottom: 4px;">
              If the customer reaches out to cancel the LIVE sessions due to lack of some problem with the trainer, then the trainer would be replaced with other available trainers at that point in time.
            </li>
            <br />
            <li style="padding-bottom: 4px;">
              If the customer reaches out to cancel the LIVE sessions due to dissatisfaction from the course, they would have to speak to the customer care and explain the reason for cancellation post an action would be taken on mutual agreement.
            </li>
            <br />
            <li style="padding-bottom: 4px;">
              The refund, if processed will be initiated immediately form Codevidhya’s end, however it might take time for money to be credited to your account as per the processing time of the payment gateway and your bank SLA.
            </li>
            <br />
            <li style="padding-bottom: 4px;">
              Any fees if deducted during the payment/refund processing will be reduced from the refund amount.
            </li>
            <br />
            <li style="padding-bottom: 4px;">
              NO refund will be provided for any other service or course.
            </li>
          </ol>
        </div>
      </div>
    </section>
    <!--/Section-->

    <Footer />
  </div>
</template>

<script>
//import Header from "@/components/header/Header.vue";
import Header from "@/components/header/CodevidhyaNewHeader.vue";
import HeaderContent from "@/components/terms/HeaderContent.vue";
import Footer from "@/components/footer/Footer.vue";
export default {
  name: "home",
  components: {
    Header,
    HeaderContent,
    Footer
  },
  mounted() {}
};
</script>
