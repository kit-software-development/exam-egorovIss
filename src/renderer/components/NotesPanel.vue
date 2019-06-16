<template lang="pug">
  .column.col-4.notes-panel
    label.form-switch
      input(type="checkbox" v-model="publicView")
      <i class="form-icon"></i> Показывать публичные заметки
    .note#create-new(@click="createNote")
      .main-part
        .title
          <i class="fas fa-plus"></i> Новая заметка
    
    note-preview(
      v-for="note in viewNotes"
      v-bind:key="`${note.author}${note.ID}`"
      @click.native="noteClick(note, $event)"
      v-bind:class="noteCls(note)"
    )
      template(v-slot:note-title)
        <i class="fas fa-users" v-if="note.public"></i> {{ note.title }}
      template(v-slot:note-delete)
      template(v-slot:note-text): span(v-html="renderedText(note.text)")
      template(v-slot:note-tags v-if="note.tags")
        span.tag.label.tag-ordinary(
          v-for="tag in note.tags.split(',').map((tag) => tag.trim())"
          v-bind:class="tag.type"
        ) {{ tag }}
      template(v-if="note.changed" v-slot:note-changed)
        code {{ fromNow(note.changed) }}
      template(v-if="note.author" v-slot:note-author) Автор: <code>{{ note.author }}</code>
</template>


<script>
  import NotePreview from './NotesPanel/NotePreview'
  import moment from 'moment'

  export default {
    name: 'notes-panel',
    components: { NotePreview },
    computed: {
      notes () { return this.$store.state.Notes.notes },
      currentNote () { return this.$store.state.Notes.currentNote },
      publicNotes () { return this.$store.state.Notes.publicNotes },
      username () { return this.$store.state.Notes.username },
      publicView: {
        set (val) {
          this.$store.dispatch('togglePublicView')
        },
        get () {
          return this.$store.state.Notes.publicView
        }
      },
      viewNotes () {
        if (this.publicView) {
          return Array.from(this.publicNotes).reverse()
        } else {
          return Array.from(this.notes).reverse()
        }
      }
    },
    methods: {
      fromNow (date) { return moment(date).fromNow() },
      noteClick (note, e) {
        // Нажатие на корзину => удаление карточки
        if (e.target.classList.value.includes('delete-icon')) {
          this.$store.commit('DELETE_NOTE', note.ID)
          this.$store.dispatch('deleteNoteServer', note.ID)
          this.$store.commit('SAVE_NOTES')
        // Нажатие на карточку => переключение на карточку
        } else {
          this.$store.dispatch('chooseNote', note)
        }
      },
      renderedText (text) {
        if (!text) return ''
        return text.replace(/></g, '> <')
      },
      createNote () {
        this.$store.dispatch('newNote', this.$store.state.Auth.username)
      },
      keyup (e) {
        if (!this.$store.getters.win.opened && this.$store.state.Notes.username !== '') {
          if (e.ctrlKey && !e.altKey && !e.shiftKey) {
            if (e.code === 'KeyN') this.createNote()
            if (e.code === 'KeyS') {
              this.$store.dispatch('saveNotes')
              this.$store.dispatch('sync')
            }
            if (e.code === 'KeyP') this.$store.dispatch('togglePublicView')
            if (e.code === 'KeyE' && this.currentNote) this.$store.commit('LEARN_NOTE')
          }
        }
      },
      noteCls (note) {
        let cls = []
        if (!this.mineNote(note)) cls.push('not-mine')
        if (this.currentNote && note.ID === this.currentNote.ID) cls.push('active')
        return cls
      },
      mineNote (note) {
        return !this.publicView || note.author.toLowerCase() === this.username.toLowerCase()
      }
    },
    mounted () {
      window.addEventListener('keyup', this.keyup)
    },
    destroyed () {
      window.removeEventListener('keyup', this.keyup)
    }
  }
</script>


<style lang="sass">
  @import '../../css/variables.sass';

  #note-search
    width: 100%
    margin-bottom: 0.5rem
  
  .form-switch
    margin-top: 0 !important

  #create-new
    color: $success-color

  .notes-panel
    .note + .note
      border-top: 1px solid #EEE
    .note
      padding: 0.2rem
      line-height: 1rem
      border-left: 1px solid rgba(0,0,0,0)
      border-right: 1px solid rgba(0,0,0,0)
      cursor: default
      .main-part
        display: flex
        align-items: flex-start
        justify-content: space-between
      .title
        font-weight: bold
        font-size: 0.8rem
      .title, .note-text, .note-tags
        width: 100%
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
        display: block
        h1, h2, h3, h4, h5, h6
          font-size: inherit
      .title *, .note-text *, .note-tags *
        display: inline
      .title
        width: calc(100% - 1.5rem)
        display: inline-block
      .delete
        width: 1rem
        display: inline-block
        align-items: center
        justify-content: center
      .note-text
        font-size: 0.7rem
      .tag
        font-size: 0.6rem
        background: rgba(0,0,0, 0.03)
        margin-right: 0.2rem
      .tag-primary
        color: $primary-color
      .tag-warning
        color: $warning-color
      .tag-danger
        color: $error-color
      .note-bottom
        display: flex
        justify-content: space-between
      .note-author, .note-changed
        font-size: 0.6rem

    .note:hover
      background: rgba(0,0,0, 0.03)

    .not-mine
      .title
        width: 100%
      .delete
        display: none
    
    .note.active
      border-left: 1px solid $primary-color
      border-right: 1px solid $primary-color
      background: rgba(0,0,0, 0.03)
    .note.active:hover
      background: rgba(0,0,64, 0.05)
</style>
