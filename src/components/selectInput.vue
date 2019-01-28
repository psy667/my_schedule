<template>
  <div class="form-group">
    <label class="form-label" for="country" v-if='$slots.default'><slot></slot></label>
    <div class="has-icon-right">
      <input class='form-input' @input='func'
                                @click='func'
                                @focus='focus = true'
                                @blur='blur()'
                                v-model='object.title'
                                :id="dataType"
                                :placeholder='placeholder' autocomplete="new-password">

      <i class="form-icon icon icon-cross" v-show='focus' @click='clear()'></i>
    </div>
    <ul class='list' v-show='focus'>
      <li class='text-dark' v-for='item in list' :value='item.id' @click='select(item)' >{{ item.title}}<span class='region'>{{ getRegion(item) }}</span></li>
    </ul>
  </div>
</template>

<script>
export default{
  name: 'selectInput',
  data () {
    return {
      focus: false,
      object: {
        title: '',
        id: ''
      }
    }
  },
  props: {
    dataType: String,
    list: Array,
    value: String,
    placeholder: String
  },
  computed: {

  },
  methods: {
    func () {
      console.log(this.object, this.$props)
      this.$emit('custom', this.object, this.$props.dataType)
    },
    select (item) {
      this.focus = true
      this.object = { id: item.id, title: item.title }
      this.focus = false
      this.func()
    },
    clear () {
      this.object = { id: '0', title: '' }
    },
    blur () {
      let context = this
      setTimeout(function () {
        context.focus = false
      }, 300)
    },
    getRegion (item) {
      let region = item.region ? ', ' + item.region : ''
      let area = item.area ? ',' + item.area : ''
      return `${region} ${area}`
    }

  }
}
</script>
<style lang='scss' scoped>
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
  span.region{
    color: #999;
  }
}
</style>
