<template lang="html">
  <div class="container bg-primary">
    <div class="columns pt-0" v-if='loaded'>
      <button class='btn col-2'  :class='{active: $store.state.default === $route.query.id}' @click='makeDefault($route.query.id)'><i class="icon icon-bookmark"></i></button>
          <div class="column col-5 text-left dropdown dropdown-left">
            <a  class="btn dropdown-toggle bg-primary text-secondary col-12" @click='showWeekSelect = true' tabindex="0">
              {{ weeks[parity] }}<i class="icon icon-caret"></i>
            </a>
            <!-- menu component -->

            <ul class="menu col-11 mx-2" :class='{"d-none": !showWeekSelect}'>
              <li class='text-dark' @click='selectWeek(0)'>Числитель</li>
              <li class='text-dark' @click='selectWeek(1)'>Знаменатель</li>
            </ul>
          </div>

          <div class="column col-5 text-right dropdown btn-primary dropdown-right">
            <a href="#" class="btn dropdown-toggle bg-primary text-secondary col-12" tabindex="0" @click='showSubGroupSelect = true'>
              {{ subgroup != undefined ? subgroups[subgroup].title : subgroups[0].title}}
              <i class="icon icon-caret"></i>
            </a>
            <ul class="menu col-11 mx-2" :class='{"d-none": !showSubGroupSelect}'>
              <li class='text-dark text-left' v-for='(item, i) in subgroups'  @click='setSubgroup(i)'>
                {{ item ? item.title : '' }}
              </li>
            </ul>
          </div>

          <div class="divider  col-12"></div>

          <div class="timer">
            <h5 class='column col-12 text-center text-normal d-inline-block'>{{ getNumClass }} </h5>
            <!-- <h2 class='column col-12 text-center'></h2> -->
          </div>

    </div>
    <div class="wrapper swiper-container"  >
      <button id='prevButton' class='slide-buttons slide-left'></button>
      <div class="my-slider swiper-wrapper" id='blocks' v-if='loaded'>

        <div v-for="day in daysOfWeek" class="block swiper-slide"  :id="day">
          <h1>{{ daysOfWeekRU[day] }}</h1>
          <ol>
            <li class="subject" v-for='(item,i) in renderSchedule(day)' v-if='item'>

              <span class="subject__time">{{ timers[1][i+1] ? getTiming(timers[1][i+1]) : "-" }}</span>
              <div class="subject__container">
                <span class="subject__name">  {{ item.title }} </span>
                <span class="subject__type">{{ item.type }}</span>
              </div>
              <span class="subject__room" >{{ item.room }}</span>
            </li>

            <li class="subject"  v-else>
              <span class="subject__time">{{ timers[1][i+1] ? getTiming(timers[1][i+1]) : "-" }}</span>
              <div class="subject__container text-dark">

              </div>
            </li>
          </ol>

        </div>
        </div>
        <button id='nextButton' class='slide-buttons slide-right'></button>
      </div>
      <div class="loading loading-lg" v-if='!loaded'></div>

    </div>

  </div>
</template>

<script>

import Swiper from 'swiper'
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

export default {
  data () {
    return {
      loaded: false,
      slider: {},
      parity: 0,
      subgroup: 0,
      weeks: ['Числитель', 'Знаменатель'],
      schedule: {},
      timers: {},
      subgroups: {},
      subjects: {},
      types: [{ id: 0, title: 'Лекция' }, { id: 1, title: 'Практика' }, { id: 2, title: 'Лабораторные раб.' }],
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      daysOfWeekRU: { 'monday': 'Понедельник', 'tuesday': 'Вторник', 'wednesday': 'Среда', 'thursday': 'Четверг', 'friday': 'Пятница', 'saturday': 'Суббота', 'sunday': 'Воскресенье' },
      time: new Date(),
      showWeekSelect: false,
      showSubGroupSelect: false
    }
  },
  methods: {
    getTimer (day, num) {
      // return this.timers[this.schedule[day].timer][num][0]+":"+this.timers[this.schedule[day].timer][num][1];
      console.log(num)
      if (num != 'timer') {
        return this.timers[1][num][0] + ':' + this.timers[1][num][1]
      }
    },
    getClass (day, num) {
      return this.subjects[this.schedule[day][num].class].title
    },
    getClassType (day, num) {
      return this.types[this.schedule[day][num].type].title
    },
    getRoom (day, num) {
      if (this.schedule[day][num]) {
        return this.schedule[day][num].room
      } else {
        return ''
      }
    },
    dayExcist () {

    },
    showClass (day, num) {
      return !!(this.schedule[day] &&
        this.schedule[day][num] &&
        this.schedule[day][num].parity.includes(this.parity) &&
        this.schedule[day][num].subgroups.includes(this.subgroup))
    },

    renderSchedule (day) {
      let arr = []
      let context = this
      for (let i = 0; i < 8; i++) {
        this.schedule[day].forEach(function (item) {
          if (item.num == i &&
              context.subjects[item.class].title &&
              item.parity.includes(context.parity) &&
              item.subgroups.includes(context.subgroup)) {
            let obj = {
              time: context.timers[1][item.num],
              title: context.subjects[item.class].title,
              type: context.types[item.type].title,
              room: item.room
            }
            arr[i - 1] = obj
          }
        })

        if (!arr[i]) {
          arr[i] = false
        }
      }
      return arr
    },

    getTiming (time) {
      let startHours = time[0]
      let startMins = time[1]
      if (startMins < 10) {
        startMins = '0' + startMins
      };

      let end = time[0] * 60 + time[1] + this.timers[1].duration
      let endHours = Math.floor(end / 60)
      let endMins = (end % 60) + ''
      if (endMins.length < 2) {
        endMins = '0' + endMins
      }

      return `${startHours}:${startMins}\n${endHours}:${endMins}`
    },
    makeDefault (href) {
      if (this.$store.state.default == href) {
        this.$store.commit('SETDEFAULT', false)
      } else {
        this.$store.commit('SETDEFAULT', href)
      }
    },
    setSubgroup (id) {
      this.subgroup = id
      this.showSubGroupSelect = false
      this.$store.commit('SETSUBGROUP', id)
    },
    getWeek () {
      let now = new Date()
      let onejan = new Date(now.getFullYear(), 0, 1)
      return Math.ceil((((now - onejan) / 86400000) + onejan.getDay()) / 7)
    },
    selectWeek (i) {
      this.parity = i
      this.showWeekSelect = false
    }

  },
  computed: {
    getNumClass () {
      let now = this.time
      let timers = [0]
      for (let item in this.timers[1]) {
        let x = this.timers[1][item][0] * 60 + this.timers[1][item][1]
        timers.push(x)
        timers.push(x + 90)
      };

      let minutes = now.getHours() * 60 + now.getMinutes()
      let array = [...timers]
      let n = array[0] - minutes
      let num = -1

      for (let i = 0; i < array.length - 1; i++) {
        if (minutes >= array[i] & minutes < array[i + 1]) {
          num = i
          n = array[i + 1] - minutes
        }
      }
      if (num > -1) {
        const until = ['начала ', 'конца '][num % 2]
        const numClass = ((num - num % 2) / 2 + 1)
        const end = ((num - num % 2) / 2 + 1) === 3 ? 'eй' : 'ой'

        if (n > 60) {
          return `До ${until} ${numClass}-${end} пары ${Math.floor(n / 60)} час. ${n % 60} мин.`
        }
        return `До ${until} ${numClass}-${end} пары ${n} мин.`
      } else {
        return 'Пары закончились'
      }
    }
  },
  mounted () {
    let id = this.$route.query.id
    let query = `schedules/${id}`
    console.log(query)
    let ref = firebase.database().ref(query)

    let context = this

    let response

    ref.on('value', function (snapshot) {
      response = snapshot.val()

      context.title = response.title
      context.schedule = response.schedule
      context.timers = response.timers
      context.subgroups = response.subgroups
      context.subjects = response.subjects
      context.loaded = true

      setTimeout(function () {
        const params = {
          speed: 400,
          spaceBetween: 20,
          // direction: 'vertical',
          navigation: {
            nextEl: '#nextButton',
            prevEl: '#prevButton'
          },
          fadeEffect: {
            crossFade: true
          }
        }

        context.slider = new Swiper('.swiper-container', params)
        context.slider.slideTo(new Date().getDay() - 1)
      }, 10)

      console.log(response)
    }, function (error) {
      console.log('Error: ' + error.code)
    }

    )
    if (this.$store.state.subgroup) {
      this.subgroup = this.$store.state.subgroup
    };

    if (this.getWeek() % 2 === 1) {
      this.parity = 1
    } else {
      this.parity = 0
    };

    setInterval(() => this.time = new Date(), 1000)
  },
  updated () {

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
    overflow: hidden;

    height: 100%;
    // margin-top: -30px;
    // height: calc(100vh - 52px);
    // background: linear-gradient(0deg, #4F00BC -50%, #29ABE2 100%, );

  }

  .swiper-slide-prev, .swiper-slide-next{
     transform: scaleY(0.95);
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
      margin: 10px auto;
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
    // opacity: 0.5;
    margin-bottom: 20px;
    transition: 0.5s;
    min-width: 100%;
  }
  .swiper-slide-active{
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
.subject__name:hover{
        white-space: normal;
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
