<template lang="html">
  <div class="container">
    <h3>Поиск расписания</h3>

    <!-- <selectInput data-type="country" :list='this.list.countries'  v-model='vkapi.country.id' func=''>Страна</selectInput>

    <selectInput data-type="city" :list='this.list.cities'  v-model='vkapi.city.title' func='getCities'>Город</selectInput>

    <selectInput data-type="school" :list='this.list.schools'  v-model='vkapi.school.title'>Школа</selectInput>

    <selectInput data-type="university" :list='this.list.universities'  v-model='vkapi.university.title'>Университет</selectInput> -->

    <!-- <div class="form-group">
      <label class="form-label" for="country">Страна</label>
      <div class="has-icon-right">
        <input class='form-input'
        @focus='focus.country = true'
        @blur='blur("country")'
        v-model='vkapi.country.title'
        id="country" placeholder='Выберите страну'>

        <i class="form-icon icon icon-cross"
            v-show='focus.country'
            @click='clear("country")'></i>
      </div>
      <ul class='list ' v-show='focus.country'>
        <li v-for='item in list.countries' @click='select(item, "country")' >{{ item.title }}</li>
      </ul>
    </div> -->

    <!-- <div class="form-group" v-show='vkapi.country.id'>
      <label class="form-label" for='city'>Город</label>
      <div class="has-icon-right">
      <input class='form-input'   @click="getCities"
                                  @input="getCities"
                                  @focus='focus.city = true'
                                  @blur='blur("city")'
                                  v-model='vkapi.city.title' id='city'  placeholder='Начните вводить город'>
      <i class="form-icon icon icon-cross" v-show='focus.city' @click='clear("city")'></i>
    </div>
      <ul class='list ' v-show='focus.city'>
        <li v-for='item in list.cities' @click='select(item, "city")' >{{ getFullName(item) }}</li>
      </ul>
    </div> -->
    <selectInput data-type="city" :list='list.countries' @custom="selectCountry">Страна</selectInput>

    <selectInput v-show='vkapi.country.id' data-type="city" :list='list.cities' @custom="selectCity">Город</selectInput>

    <div class="form-group select-type" v-show='vkapi.city.id'>
      <label class="form-radio form-inline">
        <input type="radio" name="type" checked='' @input='vkapi.type=false'>
        <i class="form-icon"></i>Школа или СУЗ
      </label>
      <label class="form-radio form-inline">
        <input type="radio" name="type" @input='vkapi.type=true'><i class="form-icon"></i>ВУЗ
      </label>
    </div>

    <div class="form-group" v-show='vkapi.city.id && !this.vkapi.type'>
      <label class="form-label" for='school'>Школа или СУЗ</label>
      <div class="has-icon-right">
        <input class='form-input'   @click="getSchools"
                                    @input="getSchools"
                                    @focus='focus.school = true'
                                    @blur='blur("school")'
                                    v-model='vkapi.school.title' id='city' placeholder='Начните вводить название школы или СУЗа'>
        <i class="form-icon icon icon-cross" v-show='focus.school' @click='clear("school")'></i>
      </div>
      <ul class='list ' v-show='focus.school'>
        <li v-for='item in list.schools' @click='select(item, "school")' >{{ item.title }}</li>
      </ul>
    </div>

    <div class="form-group" v-show='vkapi.city.id && this.vkapi.type'>
      <label class="form-label" for='university'>ВУЗ</label>
      <div class="has-icon-right">
        <input class='form-input'   @click="getUniversities"
                                    @input="getUniversities"
                                    @focus='focus.university = true'
                                    @blur='blur("university")'
                                    v-model='vkapi.university.title' id='university' placeholder='Начните вводить название ВУЗа'>
        <i class="form-icon icon icon-cross" v-show='focus.university' @click='clear("university")'></i>
      </div>
      <ul class='list ' v-show='focus.university'>
        <li v-for='item in list.universities' @click='select(item, "university")' >{{ item.title }}</li>
      </ul>
    </div>

    <div class="form-group" v-show='vkapi.university.id && this.vkapi.type'>
      <label class="form-label" for='faculty'>Факультет</label>
      <div class="has-icon-right">
        <input class='form-input'   @click="getFaculties"
                                    @input=""
                                    @focus='focus.faculty = true'
                                    @blur='blur("faculty")'
                                    v-model='vkapi.faculty.title' id='faculty' placeholder='Выберите факультет'>
        <i class="form-icon icon icon-cross" v-show='focus.faculty' @click='clear("faculty")'></i>
      </div>
      <ul class='list ' v-show='focus.faculty'>
        <li v-for='item in list.faculties' @click='select(item, "faculty")' >{{ item.title }}</li>
      </ul>
    </div>

    <!-- <div class="form-group" v-show='vkapi.faculty.id && this.vkapi.type'>
      <label class="form-label" for='chair'>Кафедра</label>
      <div class="has-icon-right">
        <input class='form-input'  @click="getChairs" @input="" @focus='focus.chair = true' @blur='blur("chair")'  v-model='vkapi.chair.title' id='chair'>
        <i class="form-icon icon icon-cross" v-show='focus.chair' @click='clear("chair")'></i>
      </div>
      <ul class='list ' v-show='focus.chair'>
        <li v-for='item in list.chairs' @click='select(item, "chair")' >{{ item.title }}</li>
      </ul>
    </div> -->

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
    selectCity (obj) {
      this.vkapi.city = obj
      // this.getCities();
      this.get('cities', `getCities?country_id=${this.vkapi.country.id}&q=${this.vkapi.city.title}`)
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
    get (type, request) {
      axios({
        url: `https://api.vk.com/method/database.${request}&count=50&access_token=3ae3ac593ae3ac593ae3ac593a3a84c41733ae33ae3ac5966efe83946d1c87ff1579c26&v=5.92`,
        adapter: jsonp
      }).then(response => (this.list[type] = response.data.response.items))
    },

    getCities () {
      axios({
        url: `https://api.vk.com/method/database.getCities?country_id=${this.vkapi.country.id}&q=${this.vkapi.city.title}&count=50&access_token=3ae3ac593ae3ac593ae3ac593a3a84c41733ae33ae3ac5966efe83946d1c87ff1579c26&v=5.92`,
        adapter: jsonp
      }).then(response => (this.list.cities = response.data.response.items))
    },
    getSchools () {
      axios({
        url: `https://api.vk.com/method/database.getSchools?city_id=${this.vkapi.city.id}&q=${this.vkapi.school.title}&count=50&access_token=3ae3ac593ae3ac593ae3ac593a3a84c41733ae33ae3ac5966efe83946d1c87ff1579c26&v=5.92`,
        adapter: jsonp
      }).then(response => (this.list.schools = response.data.response.items))
    },
    getUniversities () {
      axios({
        url: `https://api.vk.com/method/database.getUniversities?city_id=${this.vkapi.city.id}&q=${this.vkapi.university.title}&count=50&access_token=3ae3ac593ae3ac593ae3ac593a3a84c41733ae33ae3ac5966efe83946d1c87ff1579c26&v=5.92`,
        adapter: jsonp
      }).then(response => (this.list.universities = response.data.response.items))
    },
    getFaculties () {
      axios({
        url: `https://api.vk.com/method/database.getFaculties?university_id=${this.vkapi.university.id}&count=100&access_token=3ae3ac593ae3ac593ae3ac593a3a84c41733ae33ae3ac5966efe83946d1c87ff1579c26&v=5.92`,
        adapter: jsonp
      }).then(response => (this.list.faculties = response.data.response.items))
    },
    getChairs () {
      axios({
        url: `https://api.vk.com/method/database.getChairs?faculty_id=${this.vkapi.faculty.id}&count=100&access_token=3ae3ac593ae3ac593ae3ac593a3a84c41733ae33ae3ac5966efe83946d1c87ff1579c26&v=5.92`,
        adapter: jsonp
      }).then(response => (this.list.chairs = response.data.response.items))
    },
    getFullName (item) {
      let title = item.title ? item.title : ''
      let region = item.region ? ',' + item.region : ''
      let area = item.area ? ',' + item.area : ''
      return `${title} ${region} ${area}`
    },
    select (item, type) {
      this.focus[type] = true
      this.vkapi[type] = { id: item.id, title: item.title }
      this.focus[type] = false
    },
    clear (type) {
      this.vkapi[type] = { id: '', title: '' }
    },
    blur (type) {
      let context = this
      setTimeout(function () {
        context.focus[type] = false
      }, 300)
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
