<template lang="html">
  <div class="container">
    <h3>Поиск расписания</h3>

    <selectInput data-type="country" :list='list.countries' @custom="select">Страна</selectInput>

    <selectInput  v-show='vkapi.country.id' data-type="city"
                  :list='list.cities' @custom="select" placeholder='Начните вводить город'>Город</selectInput>

    <div class="form-group select-type" v-show='vkapi.city.id'>
      <label class="form-radio form-inline">
        <input type="radio" name="type" checked='' @input='vkapi.type=false'>
        <i class="form-icon"></i>Школа или СУЗ
      </label>
      <label class="form-radio form-inline">
        <input type="radio" name="type" @input='vkapi.type=true'><i class="form-icon"></i>ВУЗ
      </label>
    </div>

    <selectInput  v-show='vkapi.city.id && !this.vkapi.type' data-type="school"
                  :list='list.schools' @custom="select" placeholder='Начните вводить название школы или СУЗа'>Школа</selectInput>

    <selectInput  v-show='vkapi.city.id && this.vkapi.type' data-type="university"
                  :list='list.universities' @custom="select" placeholder='Начните вводить название ВУЗа'>ВУЗ</selectInput>

    <selectInput  v-show='vkapi.university.id && this.vkapi.type' data-type="faculty"
                  :list='list.faculties' @custom="select" placeholder='Выберите факультет'>Факультет</selectInput>

    <button class="btn btn-primary search" @click='search()' :disabled="!(vkapi.school.id && !vkapi.type || vkapi.faculty.id && vkapi.type)">Поиск</button>

    <div class="loading loading-lg my-2" v-if='!loaded'></div>

    <div class="text-center my-2" v-if='resultNotFound'>
      Расписаний по запросу не найдено, но Вы можете <a class="label" href='./add'>создать</a> своё!
    </div>

    <table class="table out" v-if="this.items.length > 0">
      <thead>
        <tr>
          <th>Название</th>
          <th>Дата создания</th>
        </tr>
      </thead>
      <tbody>
        <tr class="active" v-for='item in items' >
          <td><a :href="'./schedule?id='+item.href">{{ item.name }}</a></td>
          <td>{{ getDate(item.date) }}</td>
        </tr>
      </tbody>
    </table>
    <!-- <pre>{{ vkapi }}</pre> -->
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import jsonp from 'axios-jsonp'
import VueAxios from 'vue-axios'

import firebase from 'firebase'

import selectInput from '../components/selectInput'

let config = {
  apiKey: 'AIzaSyA6hIR7mCJwccJ6ndZZluTxo4WQi5olfkw',
  authDomain: 'schedule-480c2.firebaseapp.com',
  databaseURL: 'https://schedule-480c2.firebaseio.com',
  projectId: 'schedule-480c2',
  storageBucket: 'schedule-480c2.appspot.com',
  messagingSenderId: '581207968061'
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

Vue.use(VueAxios, axios)

export default {
  data () {
    return {
      items: [],
      list: {
        countries: [{
          id: '1',
          title: 'Россия'
        }, {
          id: '2',
          title: 'Украина'
        }, {
          id: '3',
          title: 'Беларусь'
        }],
        cities: [],
        schools: [],
        universities: [],
        faculties: [],
        chairs: []
      },
      focus: {
        type: false,
        country: false,
        city: false,
        school: false,
        university: false,
        faculty: false,
        chair: false
      },
      vkapi: {
        type: '', // School = false, university = true;
        country: {
          id: '',
          title: ''
        },
        city: {
          id: '',
          title: ''
        },
        school: {
          id: '',
          title: ''
        },
        university: {
          id: '',
          title: ''
        },
        faculty: {
          id: '',
          title: ''
        },
        chair: {
          id: '',
          title: ''
        }
      },
      loaded: true,
      resultNotFound: false
    }
  },
  methods: {
    select (obj, type) {
      console.log(obj, type)
      this.vkapi[type] = obj
      this.vkGet.call(this, type)
    },
    selectCountry (obj) {
      this.vkapi.country = obj
    },
    search () {
      let query
      this.loaded = false
      if (this.vkapi.type) {
        query = `countries/${this.vkapi.country.id}/cities/${this.vkapi.city.id}/university/${this.vkapi.university.id}/faculty/${this.vkapi.faculty.id}`
      } else {
        query = `countries/${this.vkapi.country.id}/cities/${this.vkapi.city.id}/schools/${this.vkapi.school.id}`
      }
      let ref = firebase.database().ref(query)
      let context = this
      let response

      ref.on('value', function (snapshot) {
        context.resultNotFound = false
        response = snapshot.val()
        context.items = []
        console.log(response)
        if (response !== null) {
          Object.keys(response).forEach((item) => { context.items.push({ name: response[item].title, date: response[item].date, href: item }) })
        } else {
          context.resultNotFound = true
        }
        context.loaded = true
      }, function (error) {
        console.log('Error: ' + error.code)
        context.loaded = false
      })
    },
    getDate (n) {
      let date = new Date(n)
      let formatted = [
        '0' + date.getDate(),
        '0' + (date.getMonth() + 1),
        '0' + date.getFullYear()
      ]

      return formatted.map(item => item.slice(-2)).join('.')
    },
    vkGet (type) {
      let request
      console.log(this, type)
      switch (type) {
        case 'city':
          request = `getCities?country_id=${this.vkapi.country.id}&q=${this.vkapi.city.title}`
          break
        case 'school':
          request = `getSchools?city_id=${this.vkapi.city.id}&q=${this.vkapi.school.title}`
          break
        case 'university':
          request = `getUniversities?city_id=${this.vkapi.city.id}&q=${this.vkapi.university.title}`
          break
        case 'faculty':
          request = `getFaculties?university_id=${this.vkapi.university.id}`
          break
        case 'chair':
          request = `getChairs?faculty_id=${this.vkapi.faculty.id}`
          break
        default:
          return false
      }
      type = type.slice(-1) === 'y' ? type.slice(0, -1) + 'ies' : type + 's'

      axios({
        url: `https://api.vk.com/method/database.${request}&count=50&access_token=3ae3ac593ae3ac593ae3ac593a3a84c41733ae33ae3ac5966efe83946d1c87ff1579c26&v=5.92`,
        adapter: jsonp
      }).then(response => (this.list[type] = response.data.response.items))
    // }).then(response => console.log(response))
    },

    getFullName (item) {
      let title = item.title ? item.title : ''
      let region = item.region ? ',' + item.region : ''
      let area = item.area ? ',' + item.area : ''
      return `${title} ${region} ${area}`
    }
  },
  components: {
    selectInput
  }

}
</script>

<style lang="scss" scoped>
 .form-group{
   ul.list{
     max-height: 200px;
     overflow-y: scroll;
     border: 1px solid #aaa;
     margin: 10px 0;
     li{
       list-style: none;
       padding: 2px 10px;
     }
   }
 }
 button.search{
   margin-top: 20px;
   width: 100%;
 }
 .select-type{
   label{
     margin-right: 30px;
   }
   // display: flex;
   // justify-content: space-around;
 }
</style>
