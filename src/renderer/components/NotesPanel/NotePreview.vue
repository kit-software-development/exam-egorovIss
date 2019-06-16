<template lang="pug">
  .note
    .main-part
      .title
        slot(name="note-title")
      slot(name="note-delete"): .delete
        <i class="delete delete-icon far fa-trash-alt"></i>
    .describing-part
      .note-text
        slot(name="note-text")
      .note-tags
        slot(name="note-tags")
      .note-bottom
        .note-changed
          slot(name="note-changed")
        .note-author
          slot(name="note-author")
</template>


<script>
  export default {
    name: 'note-preview'
  }
</script>
