<template>
  <div id="comments">
    <div id="header" class="d-flex flex-row align-items-center">
      <h3 id="comments-heading">Comments</h3>
      <i class="flex-grow-1" />
      <span>{{ commentsCount }} comments</span>
    </div>
    <div class="comment-editor">
      <img src="/assets/images/users/user.svg" />
      <div class="flex-grow-1">
        <textarea
          v-model="commentMessage"
          placeholder="Write a comment..."
          @focus="handleCommentTextareaFocused"
        ></textarea>
        <div class="d-flex flex-row justify-content-end">
          <button
            :class="'btn btn-primary' + (addingComment ? ' btn-loading' : '')"
            @click="addComment"
          >
            Add comment
          </button>
        </div>
      </div>
    </div>
    <CommentItem
      v-for="comment in comments"
      :comment="comment"
      :key="comment.comment_id"
    />
    <div
      v-if="!allCommentsLoaded"
      class="d-flex flex-column align-items-center"
    >
      <button
        :class="
          'btn btn-sm btn-primary' + (loadingComments ? ' btn-loading' : '')
        "
        @click="loadMoreComments"
      >
        Load more comments
      </button>
    </div>
  </div>
</template>

<script>
import CommentItem from "@/components/comments/CommentItem.vue";
export default {
  components: { CommentItem },
  props: ["projectId"],
  data() {
    return {
      userId: 0,
      comments: [],
      commentMessage: "",
      latestCommentId: null,
      addingComment: false,
      loadingComments: false,
      commentsCount: 0,
      allCommentsLoaded: true
    };
  },
  mounted() {
    this.getCommentsCount();
    this.fetchComments();
    var vm = this;
    cvAuth.getUserId(function(userId) {
      vm.userId = userId;
    });
  },
  methods: {
    handleCommentTextareaFocused() {
      if (!this.userId) loginAndRedirectBack(this.$router);
    },
    addComment(e) {
      if (this.addingComment) return;
      if (!this.commentMessage) {
        cvNotify("Cannot post an empty comment.", "error");
        return;
      }
      this.addingComment = true;
      this.$http
        .post("/api/reactions/addCommentForProject", {
          project_id: this.projectId,
          message: this.commentMessage
        })
        .then(function(res) {
          this.addingComment = false;
          this.commentMessage = "";
          this.comments.unshift(res.body);

          cvNotify("Comment posted");
        })
        .catch(function(err) {
          this.addingComment = false;
          cvNotify("Failed to post comment", "error");
        });
    },
    getCommentsCount() {
      this.$http
        .post("/api/reactions/getCommentsCountForProject", {
          project_id: this.projectId
        })
        .then(function(res) {
          this.commentsCount = res.body.count;
        })
        .catch(function(err) {});
    },
    fetchComments() {
      this.loadingComments = true;
      this.$http
        .post("/api/reactions/getProjectComments", {
          project_id: this.projectId,
          latest_comment_id: this.latestCommentId
        })
        .then(function(res) {
          var comments = res.body;
          this.allCommentsLoaded = !comments.length;
          if (comments.length) {
            for (var i = 0; i < comments.length; i++) {
              this.comments.push(comments[i]);
            }
            this.latestCommentId = comments[comments.length - 1].comment_id;
          }
          this.loadingComments = false;
        })
        .catch(function(err) {
          this.loadingComments = false;
          cvNotify("Failed to fetch comments.", "error");
        });
    },
    loadMoreComments() {
      this.fetchComments();
    }
  }
};
</script>

<style lang="scss">
#comments {
  margin-bottom: 24px;
  #header {
    margin-bottom: 24px;
  }
}
.comment-editor {
  display: flex;
  flex-direction: row;
  margin-bottom: 32px;
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
  textarea {
    width: 100%;
    height: 128px;
    margin-bottom: 16px;
    padding: 16px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    &:focus {
      border-color: rgba(63, 243, 63, 0.7);
    }
  }
}
</style>
