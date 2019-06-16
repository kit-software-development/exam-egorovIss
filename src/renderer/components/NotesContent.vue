<template lang="pug">
  .column.col-8.notes-content(v-if="currentNote && mineNote(currentNote)")
    .input-group
      .has-icon-left
        input#note-title.form-input(
          type="text"
          autofocus
          placeholder="Название"
          v-model="title"
        )
        i.form-icon.icon.fas.fa-heading
      .has-icon-left
        input#note-tags.form-input(
          type="text"
          placeholder="Тэги"
          v-model="tags"
        )
        i.form-icon.icon.fas.fa-tags
    label.form-checkbox(v-model:checked="isPublic")
      input(type="checkbox" v-model="isPublic")
      <i class="form-icon"></i> <i class="fas fa-users"></i> Публичная заметка
    notes-editor(v-model="text")

  .column.col-8.notes-content(v-else-if="currentNote && !mineNote(currentNote)")
    h2 {{ title }}
    div(v-html="text")

  .column.col-8.notes-content.greeting(v-else)
    .greeting-box
      h1 Добро пожаловать в Notes!
      h4 Горячие клавишы
      ul
        li <kbd>ctrl</kbd> + <kbd>n</kbd> — новая заметка,
        li <kbd>ctrl</kbd> + <kbd>p</kbd> — показывать публичные заметки,
        li <kbd>ctrl</kbd> + <kbd>s</kbd> — сохранить все заметки (есть так же автосохранения),
        li <kbd>esc</kbd> — закрыть заметку/окно.
</template>


<script>
  import NotesEditor from './NotesContent/NotesEditor'

  export default {
    name: 'notes-content',
    components: { NotesEditor },
    computed: {
      currentNote () { return this.$store.state.Notes.currentNote },
      username () { return this.$store.state.Notes.username },
      text: {
        set (text) {
          this.$store.commit('CHANGE_TEXT', text)
        },
        get () {
          return this.$store.state.Notes.currentNote.text
        }
      },
      title: {
        set (val) {
          this.$store.commit('CHANGE_TITLE', val)
        },
        get () {
          return this.$store.state.Notes.currentNote.title
        }
      },
      tags: {
        set (val) {
          this.$store.commit('CHANGE_TAGS', val)
        },
        get () {
          return this.$store.state.Notes.currentNote.tags
        }
      },
      isPublic: {
        set (val) {
          this.$store.commit('TOGGLE_PUBLIC')
        },
        get () {
          return this.$store.state.Notes.currentNote.public
        }
      },
      publicView: {
        set (val) {
          this.$store.dispatch('togglePublicView')
        },
        get () {
          return this.$store.state.Notes.publicView
        }
      }
    },
    methods: {
      joinBy (arr, attr, joiner = ',') {
        if (!arr) return ''
        return arr.map((elem) => elem[attr]).join(joiner)
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
    }
  }
</script>


<style lang="sass">
  @import '../../css/variables.sass';

  .main
    .input-group
      margin-bottom: 0.5rem
      display: flex
      justify-content: space-between
      .has-icon-left
        width: 49%
    #note-title, #note-tags
      outline-bottom: none
    #note-title
      margin-right: 0.2rem
    #note-tags, #note-title
      width: 100%

  .greeting
    display: flex
    align-items: center
    justify-content: center
</style>
