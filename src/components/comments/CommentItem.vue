<template>
  <div class="comment-group">
    <div class="comment-item">
      <img src="/assets/images/users/user.svg" />
      <div class="message-wrapper">
        <h4>{{ comment.user_name }}</h4>
        <p>{{ comment.message }}</p>
      </div>
      <!--div class="comment-buttons">
        <button class="btn btn-sm btn-primary">
          <i class="fas fa-reply" />
          Reply
        </button>
      </div-->
    </div>
    <comment-item
      v-for="child in comment.comments"
      :comments="child"
      :key="child.comment_id"
    ></comment-item>
  </div>
</template>

<script>
export default {
  props: ["comment"],
  name: "comment-item"
};
</script>

<style scoped lang="scss">
.comment-group {
  margin-bottom: 24px;
  & > .comment-group {
    margin-left: 80px;
    margin-bottom: 24px;
  }
}
.comment-item {
  position: relative;
  display: flex;
  flex-direction: row;
  margin-bottom: 24px;
  > img {
    width: 56px;
    height: 56px;
    margin-top: 4px;
    margin-right: 24px;
    padding: 4px;
    border-radius: 50%;
    background: rgb(255, 255, 255);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  }
  > .message-wrapper {
    flex-grow: 1;
    padding: 16px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background: #fff;
  }
  .comment-buttons {
    position: absolute;
    right: 8px;
    bottom: -8px;
    opacity: 0;
    transition: all 300ms;
  }
  &:hover {
    .comment-buttons {
      bottom: 8px;
      opacity: 1;
      transition: all 300ms;
    }
  }
  h4 {
    margin-bottom: 8px;
    font-weight: bold;
  }
}
</style>
