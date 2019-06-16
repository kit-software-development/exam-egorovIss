<template lang="pug">
  #app
    top-menu
    .main.columns.col-gapless
      notes-panel
      notes-content
</template>


<script>
  import TopMenu from '@/components/TopMenu'
  import NotesPanel from '@/components/NotesPanel'
  import NotesContent from '@/components/NotesContent'

  export default {
    name: 'vue-notes',
    components: {
      TopMenu,
      NotesPanel,
      NotesContent
    }
  }
</script>


<style lang="sass">
  @import '../css/font-awesome.css';
  @import '../css/spectre.css';

  @font-face
    font-family: 'Roboto'
    src: url("../../static/roboto/Roboto.ttf")
  @font-face
    font-family: "Fira Code Regular"
    src: url(../../static/FiraCode-Regular.ttf)
  
  *
    -webkit-box-sizing: border-box
    box-sizing: border-box
  
  h1, h2, h3, h4, h5, h6, p, li, input, div
    font-family: 'Roboto', Helvetica, Trebuchet MS, Verdana

  pre, pre *, code, code *, .table-SQL, kbd
    font-family: "Fira Code Regular", "Fira Code", monospace, Consolas
    color: #0077AA
  kbd
    color: #F8F8F8

  input
    padding: 0.3rem
    height: 1.5rem

  .top-menu
    height: 1.3rem
    padding: 0 0.5rem 0 0.5rem
  .top-menu, .menu-item
    display: flex
    align-items: center
    justify-content: space-between
  .top-menu div
    cursor: default
  .menu-item > div + div
    margin-left: 0.5rem
  
  .notes-panel, .notes-content
    height: calc(100vh - 1.3rem)
    padding: 0.5rem !important
    overflow-y: auto
  
  // Стили скролл-бара
  ::-webkit-scrollbar
    width: 0.3rem
  ::-webkit-scrollbar-track
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3)
    -webkit-border-radius: 10px
    border-radius: 10px
  ::-webkit-scrollbar-thumb
    -webkit-border-radius: 10px
    border-radius: 10px
    background: rgba(51, 51, 51, 0.8)
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5)
  ::-webkit-scrollbar-thumb:window-inactive
    background: rgba(51, 51, 51, 0.4)
</style>
