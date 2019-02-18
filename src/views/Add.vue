<template lang="html">
  <div class="container">
    <h3>Добавление расписания</h3>

    <div class="form-group">
      <label class="form-label" for="country">Страна</label>
      <div class="has-icon-right">
        <input class='form-input' @focus='focus.country = true'
                                  @blur='blur("country")'
                                  v-model='vkapi.country.title' id="country" placeholder='Выберите страну'>
        <i class="form-icon icon icon-cross" v-show='focus.country' @click='clear("country")'></i>
      </div>
      <ul class='list ' v-show='focus.country'>
        <li v-for='item in list.countries' @click='select(item, "country")' >{{ item.title }}</li>
      </ul>
    </div>

    <div class="form-group" v-show='vkapi.country.id'>
      <label class="form-label" for='city'>Город</label>
      <div class="has-icon-right">
      <input class='form-input'   @click="getCities"
                                  @input="getCities"
                                  @focus='focus.city = true'
                                  @blur='blur("city")'
                                  v-model='vkapi.city.title'  placeholder='Начните вводить город'>
      <i class="form-icon icon icon-cross" v-show='focus.city' @click='clear("city")'></i>
    </div>
      <ul class='list ' v-show='focus.city'>
        <li v-for='item in list.cities' @click='select(item, "city")' >{{ getFullName(item) }}</li>
      </ul>
    </div>

    <div class="form-group select-type"  v-show='vkapi.city.id'>
      <label class="form-radio form-inline">
        <input type="radio" name="type" checked='' @input='vkapi.type=false'>
        <i class="form-icon"></i>Школа или СУЗ
      </label>
      <label class="form-radio form-inline">
        <input type="radio" name="type" @input='vkapi.type=true'><i class="form-icon"></i>ВУЗ
      </label>
    </div>

    <div class="form-group" v-show='vkapi.city.id && !this.vkapi.type'>
      <label class="form-label" for='school'>Школа</label>
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

    <div class="form-group" v-show='vkapi.faculty.id && this.vkapi.type'>
      <label class="form-label" for='chair'>Кафедра</label>
      <div class="has-icon-right">
        <input class='form-input'   @click="getChairs"
                                    @input=""
                                    @focus='focus.chair = true'
                                    @blur='blur("chair")'  v-model='vkapi.chair.title' id='chair' placeholder='Выберите кафедру(необязательно)'>
        <i class="form-icon icon icon-cross" v-show='focus.chair' @click='clear("chair")'></i>
      </div>
      <ul class='list ' v-show='focus.chair'>
        <li v-for='item in list.chairs' @click='select(item, "chair")' >{{ item.title }}</li>
      </ul>
    </div>

    <div class="form-group" v-show='vkapi.school.id && !vkapi.type || vkapi.faculty.id && vkapi.type'>
      <label class="form-label" for='name'>Название</label>
      <div class="has-icon-right">
        <input class='form-input'   @focus='focus.name = true'
                                    @blur='focus.name = false'
                                    v-model='vkapi.name' id='name' placeholder='Введите название вашего расписания'>
        <i class="form-icon icon icon-cross" v-show='focus.name'
        @click='clear("name")'></i>
      </div>
    </div>

    <button class="btn btn-primary search" @click='add()' :disabled='!nameValid'>Создать</button>
    <!-- <pre>{{ vkapi }}</pre> -->
    <div class="toast toast-error mt-2" v-if="itemsCount >= 5">
      У вас имеется максимально возможное количество расписаний.
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import jsonp from 'axios-jsonp'
import VueAxios from 'vue-axios'

import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

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
      list: {
        countries: [{
          id: 1,
          title: 'Россия'
        }, {
          id: 2,
          title: 'Украина'
        }, {
          id: 3,
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
        name: '',
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
      obj: [{ // пустой шаблон расписания
        num: '',
        class: 0,
        type: 0,
        room: '',
        parity: [0, 1],
        subgroups: [0, 1]
      }],
      itemsCount: 0
    }
  },
  methods: {
    add () {
      if (this.itemsCount >= 5) {
        return 0
      };
      let context = this
      let query
      let info
      if (this.vkapi.type) {
        query = `countries/${this.vkapi.country.id}/cities/${this.vkapi.city.id}/university/${this.vkapi.university.id}/faculty/${this.vkapi.faculty.id}`
        info = {
          title: context.vkapi.name,
          date: Date.now(),
          chair: context.vkapi.chair.title
        }
      } else {
        query = `countries/${this.vkapi.country.id}/cities/${this.vkapi.city.id}/schools/${this.vkapi.school.id}`
        info = {
          title: context.vkapi.name,
          date: Date.now()
        }
      }

      let db = firebase.database()

      let r = db.ref(query).push(info)

      let href = r.path.pieces_.pop()

      let query2 = `schedules/${href}`

      let schedule = {
        creator: context.$store.state.user.uid,
        title: context.vkapi.name,
        date: Date.now(),
        subjects: {
          0: { id: 0, title: '' }
        },
        subgroups: {
          0: { id: 0, title: 'Подгруппа 1' }
        },
        timers: {
          '1': {
            'duration': 90,
            '1': [8, 30],
            '2': [10, 10],
            '3': [12, 0],
            '4': [14, 0],
            '5': [15, 50],
            '6': [17, 30],
            '7': [19, 10]
          }

        },

        schedule: {
          'monday': this.obj,
          'tuesday': this.obj,
          'wednesday': this.obj,
          'thursday': this.obj,
          'friday': this.obj,
          'saturday': this.obj,
          'sunday': this.obj
        }
      }

      console.log(schedule)
      db.ref(query2).set(schedule, function () {
        context.$router.push('edit?id=' + href)
      })

      // ref.on('value', function (snapshot) {
      //   response = snapshot.val()
      //   context.items = []
      //
      //   Object.keys(response).forEach((item) => { context.items.push({ name: response[item].title, date: response[item].date, href: item }) })
      //   console.log(response);
      //
      //
      //
      //
      //   context.loaded = true;
      // }, function (error) {
      //   console.log('Error: ' + error.code)
      // });
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
      this.vkapi[type] = {
        id: item.id,
        title: item.title
      }
      this.focus[type] = false
    },
    clear (type) {
      this.vkapi[type] = {
        id: 0,
        title: ''
      }
    },
    blur (type) {
      let context = this
      setTimeout(function () {
        context.focus[type] = false
      }, 300)
    }
  },
  computed: {
    nameValid () {
      let re = /^[а-яА-ЯёЁa-zA-Z0-9-_#№ !"':]{2,40}$/
      return re.test(this.vkapi.name)
    }

  },
  mounted () {
    if (!this.$store.state.logged) {
      this.$router.push('login')
    };

    const context = this
    let response
    let ref = firebase.database().ref('/schedules').orderByChild('creator').equalTo(this.$store.state.user.uid)

    ref.on('value', function (snapshot) {
      response = snapshot.val()
      console.log(response)
      context.itemsCount = 0
      // , chair : response[item].chair
      Object.keys(response).forEach((item) => context.itemsCount++)

      context.loaded = true
    }, function (error) {
      console.log('Error: ' + error.code)
    })
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
