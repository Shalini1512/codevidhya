<template>
  <div class="col-xl-3 col-md-4 m-5">
    <div class="card">
      <div class="card-header"><div class="card-title">Top Scorers</div></div>
      <div class="card-body scoreHover">
        <div
          class="row py-2 my-1"
          v-for="(top_user, top_index) in top_users"
          v-bind:key="top_index"
        >
          <div class="mr-3 scoreNum">{{ top_index + 1 }}</div>
          <div class="scoreUser">
            <img
              :src="
                '/assets/images/users/' +
                  [top_user.profile_pic ? top_user.profile_pic : 'user.svg']
              "
            />{{ top_user.name }}
          </div>
          <div class="scoreScore">
            <img src="/assets/images/quiz/coin-animated.svg" />{{
              top_user.grant_points
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "top-scorer",
  props: ["top_users"]
};
</script>
<style lang="scss">
.scoreNum {
  font-weight: 700;
  border-radius: 4px;
  padding: 4px 12px;
}
.scoreUser {
  width: 160px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  > img {
    width: 32px;
    height: 32px;
    padding: 2px;
    background: #d9e8fb;
    border-radius: 50%;
    margin-right: 8px;
  }
}
.scoreScore {
  width: 82px;
  font-weight: 600;
  > img {
    width: 32px;
    height: 32px;
    margin-right: 2px;
  }
}
.scoreHover {
  > .row:hover {
    background: #ffaaaa;
    color: #fff;
    cursor: pointer;
  }
}
</style>
