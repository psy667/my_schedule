<template lang="html">
  <div class="container bg-primary">

    <button class='btn col-12 btn-lg btn-success' @click='save()'>Сохранить<i class='icon icon-upload ml-2'></i></button>
    <div class="subjects">
      <div class="form-group columns mx-2 pt-0">
        <label class="form-label col-12" for="subjects">Добавление нового предмета</label>
        <input class="form-input col-8" type="text" id="subjects"
                                        placeholder="Введите название предмета"
                                        v-model="subject">
        <button class="btn btn-secondary col-4" @click='addSubject(subject)'>Добавить</button>
      </div>
    </div>

    <div class="subgroups pb-2">
      <div class="form-group columns mx-2 pt-0">
        <label class="form-label col-12" for="subgroups">Добавление новой подгруппы</label>
        <input class="form-input col-8" type="text" id="subgroups"
                                        placeholder="Введите название подгруппы"
                                        v-model='subgroup'>
        <button class="btn btn-secondary col-4" @click='addSubgroup(subgroup)'>Добавить</button>
      </div>
    </div>

    <div class="wrapper mt-2"  >
      <button id='prevButton' class='slide-buttons slide-left'></button>
      <div class="my-slider" id='blocks' v-show='loaded'>

        <div v-for='day in daysOfWeek' class="block tns-item"  :id="day">
          <h1>{{ daysOfWeekRU[day] }}</h1>
          <ol>
            <li class='mt-0' v-for='(item,i) in schedule[day]' v-if=''>
              <!-- <span class='text-dark'>{{ item }}</span> -->
              <div class="form-group columns mx-2 pt-0">
                <span class="label col-11">Название предмета</span>

                <span class="label label-error" @click='del(day, i)'><i class="icon icon-cross"></i></span>

                <dropdown class="col-12 my-1 align-left"  data-type="class" :list='subjects'
                @custom="item.class= $event.id">{{ subjects[item.class].title === null ? "Выберите предмет" :  subjects[item.class].title }}</dropdown>

                <span class="label col-3">Номер</span><span class="label col-3">Кабинет</span><span class="label col-6">Тип пары</span>
                <input v-model='item.num'   class="form-input col-3  my-1" type="number" placeholder="Номер">

                <input v-model='item.room' class="form-input col-3  my-1" type="text" placeholder="Кабинет">

                <dropdown class="col-6 my-1"  data-type="class" :list='types'
                @custom="item.type= $event.id">{{ types[item.type].title === null ? "Выберите тип пары" :  types[item.type].title }}</dropdown>

                <!-- <dropdown  data-type="class" :list='[{id:0,title:"Числитель"},{id:1,title:"Знаменатель"}]'
                @custom="item.= $event.id">{{ subjects[item.class].title === null ? "Выберите предмет" :  subjects[item.class].title }}</dropdown>

                <dropdown  data-type="class" :list='subjects'
                @custom="item.class= $event.id">{{ subjects[item.class].title === null ? "Выберите предмет" :  subjects[item.class].title }}</dropdown> -->

              </div>
            </li>
            <!-- <li class="subject" v-for='num in Object.keys(schedule[day])' v-if='showClass(day, num)'>

              <span class="subject__time">{{ num }}</span>
              <div class="subject__container">
                <span class="subject__name">  {{ getClass(day, num) }} </span>
                <span class="subject__type">{{ getClassType(day, num) }}</span>
              </div>
              <span class="subject__room" >{{ getRoom(day, num) }}</span>

              <input type="number">

            </li>
            <li v-else><input type="number">  </li> -->
          </ol>
          <button class='btn btn-lg col-12 mt-2' @click='addClass(day)'>Добавить</button>
        </div>
        </div>
        <button id='nextButton' class='slide-buttons slide-right'></button>
      </div>

      <div class="loading loading-lg" v-if='!loaded'></div>

    </div>

  </div>
</template>

<script>
import { tns } from 'tiny-slider'
import Vue from 'vue'
import firebase from 'firebase'
import dropdown from '../components/dropdown'

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

export default {
  data () {
    return {
      loaded: false, // индикатор загрузки
      weeks: ['Числитель', 'Знаменатель'], // Четности недель в дропдауне
      schedule: {}, // объект с расписанием
      timers: {}, // объект с расписанием звонков
      subgroups: {}, // список подгрупп
      title: '', // название расписания
      subjects: {}, // список предметов
      types: [{ id: 0, title: 'Лекция' }, { id: 1, title: 'Практика' }, { id: 2, title: 'Лабораторные раб.' }], // список типов пар
      subject: '', // название, при добавлении нового предмета
      subgroup: '', // название, при добавлении новой подгруппы
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], // дни недели для итерации при рендере расписания
      daysOfWeekRU: { 'monday': 'Понедельник',
        'tuesday': 'Вторник',
        'wednesday': 'Среда',
        'thursday': 'Четверг',
        'friday': 'Пятница',
        'saturday': 'Суббота',
        'sunday': 'Воскресенье' } // локализация дней недели
    }
  },
  methods: {
    select (obj, type) {
      console.log(event.target)
    },
    // TODO: перенести следующие два метода в "schedule"
    checkParity (item) {
      return item.parity.includes(this.parity)
    },
    checkSubGroups (item) {
      return item.subgroups.includes(this.subgroup)
    },
    addClass (day) { // добавление нового урока/пары
      let index = Object.keys(this.schedule[day]).length
      console.log(index)

      let obj = {
        num: index + 1,
        class: 0,
        type: 0,
        room: '',
        parity: [0],
        subgroups: [0]
      }
      Vue.set(this.schedule[day], index, obj)
    },
    del (day, index) {
      Vue.delete(this.schedule[day], index)
    },
    addSubject (value) {
      console.log(value)
      if (!value.length) { return 0 }; // проверка на пустой ввод
      let index = Object.keys(this.subjects).length
      let obj = {
        id: index,
        title: value
      }
      Vue.set(this.subjects, index, obj)
      this.subject = ''
    },
    addSubgroup (value) {
      if (!value.length) { return 0 }; // проверка на пустой ввод
      let index = Object.keys(this.subgroups).length
      let obj = {
        id: index,
        title: value
      }
      Vue.set(this.subgroups, index, obj)
      this.subgroup = ''
    },
    save () {
      // let db = firebase.database();
      let userID = 0
      let creatorID = 0
      let query = '/schedules/' + this.$route.query.id
      let ref = firebase.database().ref(query)
      let context = this

      firebase.auth().onAuthStateChanged(function (user) {
        // console.log(user);
        if (user) {
          userID = user.uid

          ref.on('value', function (snapshot) {
            let response = snapshot.val()
            creatorID = response.creator
          }, function (error) {
            console.log('Error: ' + error.code)
          })
          if (userID === creatorID) {
            ref.update({ schedule: context.schedule, subjects: context.subjects, subgroups: context.subgroups })
            console.log('Сохранено')
          };
        }
      })
      // console.log(userID)

      // if()

      // let ref = firebase.database().ref('/schedules'+this.$route.query.id)
    }
  },
  computed: {

  },
  mounted () {
    let slider = tns({
      'container': '#blocks',
      'items': 1,
      'center': true,
      'loop': false,
      'swipeAngle': false,
      'speed': 400,
      'controls': true,
      'prevButton': '#prevButton',
      'nextButton': '#nextButton',
      'nav': false,
      'gutter': 16,
      'arrowKeys': true
    })

    let id = this.$route.query.id
    let query = `schedules/${id}`
    console.log(query)
    let ref = firebase.database().ref(query)
    let context = this

    let response

    ref.on('value', function (snapshot) {
      response = snapshot.val()
      // console.log(response);
      context.title = response.title,
      context.schedule = response.schedule,
      context.timers = response.timers,
      context.subgroups = response.subgroups,
      context.subjects = response.subjects
      context.loaded = true

      console.log(response)
    }, function (error) {
      console.log('Error: ' + error.code)
    }
    )
  },
  components: {
    dropdown
  }
}
</script>

<style lang="scss" scoped>
  .loading{
    height: 100%;
    &::after{
      border-color: #0002;
      border-bottom-color: #fff;
      border-left-color: #fff;
    }
  }
  .container{
    overflow-x: hidden;

    height: 100%;
    margin-top: -30px;
    height: calc(100vh - 52px);
    // background: linear-gradient(0deg, #4F00BC -50%, #29ABE2 100%, );

  }
  .columns{
    padding-top: 20px;
    h5, h2{
      color: #fff;
    }
    .divider{
      opacity: 0.2;
    }
    .timer{
      margin: 20px auto;
      width: 100%;
    }
  }
  .wrapper{
    padding: 10px;
    position: relative;
    .slide-buttons{
      height: 100%;
      width: 40px;
      position: absolute;
      top: 0;
      border: 0;
      background: #fff;
      opacity: 0;
      z-index: 20;
    }
    .slide-left{
      left: -20px;
    }
    .slide-right{
      right: -20px;
    }
  }

  #blocks{
    display: flex;
    // padding: 50px !important;
  }
  .block{
    // background: #f44;
    // height: 400px;
    // margin: 10px;
    opacity: 0.5;
    transition: 0.3s;
  }
  .tns-slide-active{
    opacity: 1;
  }

  .block {
  // width: 94%;
  // max-width: 350px;
  // margin: -140px 0 0 0px;
  // padding-top: 150px;
}

.block ol {
  margin: 0;
  padding: 0;
  padding-bottom: 10px;
  border-radius: 0 0 5px 5px;
  background-color: #fff;
  box-shadow: 0 3px 8px rgba(0, 0, 0, .13);
}

.block h1 {
  font-size: 14px;
  font-weight: bold;
  line-height: 40px;
  width: 100%;
  height: 42px;
  margin: 0;
  padding: 0;
  text-align: center;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #69666d;
  border-radius: 5px 5px 0 0;
  background-color: #f2f2f2;
}

.block .subject {
  display: flex;
  flex-direction: row;
  height: 40px;
  margin: 0;
  padding: 10px;
  padding-top: 0;
  border-bottom: 1px solid #e0e0e0;
  background-color: #fff;
  justify-content: space-between;
}

.subject__time {
  font-size: 10px;
  line-height: 10px;
  min-width: 30px;
  margin-top: 10px;
  text-align: right;
  white-space: 20px;
  color: #828282;
  flex-basis: 30px;
}

.subject__container {
  overflow: hidden;
  width: auto;
  height: 35px;
  margin: 5px 10px 0 10px;
  flex-basis: 70%;
}

.subject__name {
  font-size: 12px;
  font-weight: 600;
  display: block;
  white-space: nowrap;
  word-wrap: break-word;
  color: #69666d;
}

.subject__type {
  font-size: 10px;
  display: block;
  overflow: hidden;
  color: #828282;
}

.subject__room {
  font-size: 10px;
  font-weight: bold;
  line-height: 28px;
  display: block;
  box-sizing: border-box;
  min-width: 30px;
  height: 30px;
  margin-top: 5px;
  text-align: center;
  letter-spacing: .5px;
  color: #69666d;
  border: 1px solid #baa0ff;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .14);
  flex-basis: 30px;
}

.block .no-classes {
  font-size: 12px;
  line-height: 40px;
  margin-left: 10px;
  color: #69666d;
}
</style>
