import moment from 'moment'
import _ from 'lodash'
import Store from 'electron-store'

import requests from '../../requests'

const store = new Store()

moment.locale('ru')

const username = store.get('username') || ''
const notes = store.get(`${username}.notes`) || []

const state = {
  notes,
  username,
  currentNote: null,
  publicView: false,
  publicNotes: []
}

const mutations = {
  CHOOSE_NOTE (state, note) {
    // Проверяем, есть ли текущая заметка
    if (state.currentNote) {
      // Проверяем, пуста ли текущая заметка, если да, то удаляем её
      if ([ // проверяем, что каждое поле пусто
        state.currentNote.title,
        state.currentNote.text.replace(/<[^>]*>/g, ''), // убираем HTML-тэги
        state.currentNote.tags
      ].every((item) => item.trim() === '')) {
        let deleteIndex = state.notes.findIndex(note => note.ID === state.currentNote.ID)
        if (deleteIndex !== -1) state.notes.splice(deleteIndex, 1)
      }
    }
    state.currentNote = note
    state.learning = false
  },
  TOGGLE_PUBLIC_VIEW (state) {
    state.publicView = !state.publicView
    state.currentNote = null
  },
  LOAD_PUBLIC_NOTES (state, notes) {
    state.publicNotes = notes
  },
  CHANGE_TEXT (state, text) {
    if (state.currentNote.text !== text) {
      state.currentNote.changed = new Date()
    }
    state.currentNote.text = text
  },
  CHANGE_TITLE (state, title) {
    if (state.currentNote.title !== title) {
      state.currentNote.changed = new Date()
    }
    state.currentNote.title = title
  },
  CHANGE_TAGS (state, tags) {
    if (state.currentNote.title !== tags) {
      state.currentNote.changed = new Date()
    }
    state.currentNote.tags = tags
  },
  TOGGLE_PUBLIC (state) {
    state.currentNote.changed = new Date()
    state.currentNote.public = !state.currentNote.public
  },
  COPY_NOTE (state, note) {
    let newNote = Object.assign({}, note)
    // Добавляем новую заметку в конец, ID = max(ID) + 1
    newNote.ID = state.notes.length === 0
      ? 1
      : state.notes[state.notes.length - 1].ID + 1
    state.notes.push(newNote)
  },
  NEW_NOTE (state, author) {
    // Добавляем новую заметку в конец, ID = max(ID) + 1
    let ID = state.notes.length === 0
      ? 1
      : state.notes[state.notes.length - 1].ID + 1
    state.notes.push({
      ID,
      title: '',
      text: '',
      tags: '',
      author,
      created: new Date(),
      changed: new Date(),
      public: false
    })
  },
  RELOAD_NOTES (state, username) {
    state.username = username
    state.notes = store.get(`${username}.notes`) || []
  },
  DELETE_NOTE (state, ID) {
    // Ищем заметку с ID из параметра, если находим, то удаляем
    let deleteIndex = state.notes.findIndex(note => note.ID === ID)
    // Если удаляем текущую заметку
    if (state.currentNote && state.currentNote.ID === ID) state.currentNote = null
    if (deleteIndex !== -1) {
      state.notes.splice(deleteIndex, 1)
      store.set(`${state.username}.notes`, state.notes)
    }
  },
  SAVE_NOTES (state) {
    store.set(`${state.username}.notes`, state.notes)
  }
}

const actions = {
  chooseNote ({ commit }, note) {
    commit('CHOOSE_NOTE', note)
    commit('SAVE_NOTES')
  },
  newNote ({ commit }, author) {
    commit('NEW_NOTE', author)
    commit('CHOOSE_NOTE', state.notes[state.notes.length - 1])
  },
  saveNotes ({ commit }) {
    commit('SAVE_NOTES')
  },
  deleteNoteServer ({ commit }, ID) {
    requests.deleteNote(state.username, ID)
      .then(console.log)
      .catch(console.log)
  },
  togglePublicView ({ commit }) {
    commit('TOGGLE_PUBLIC_VIEW')
    console.log('toggle')
    requests.getPublic()
      .then(res => {
        if (res.public_notes) commit('LOAD_PUBLIC_NOTES', res.public_notes)
      })
      .catch(console.log)
  },
  copyNote ({ commit }, note) {
    commit('COPY_NOTE', note)
    commit('SAVE_NOTES')
    commit('CHOOSE_NOTE', _.last(state.notes))
  },
  sync ({ commit }) {
    requests.syncTest(state.username, state.notes)
      .then(res => {
        // если нужно отправить заметки на сервер
        if (res.needed_notes && res.needed_notes.length > 0) {
          console.log('trying to send notes', res.needed_notes)
          requests.sendNotes(
            state.username,
            state.notes.filter(note => res.needed_notes.includes(note.ID))
          )
            .then(console.log)
        }
        // если есть заметки, которые есть на сервере, но нет у нас
        if (res.sync_notes && res.sync_notes.length > 0) {
          console.log('got new notes ', res.sync_notes)
          for (let note of res.sync_notes) commit('COPY_NOTE', note)
        }
        commit('SAVE_NOTES')
      })
      .catch(err => {
        console.log(err)
      })
  }
}

const getters = {
  // main() { return state.main }`
}

export default {
  state,
  mutations,
  actions,
  getters
}
