<template>

  <div class="dropdown dropdown-right">
    <span @click='focus = !focus' v-model='object.title' class="btn btn-secondary dropdown-toggle col-12 text-left" tabindex="0">
      <slot></slot>
      <i class="icon icon-caret text-right"></i>
    </span>

    <ul class='list' v-show='focus'>
      <li class='text-dark' v-for='item in list' @click='select(item)' >{{ item.title}}</li>
    </ul>
    </div>
</template>

<script>
export default{
  name: 'dropdown',
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
    list: Array,
    value: String
  },
  computed: {

  },
  methods: {
    func () {
      this.$emit('custom', this.object)
    },
    select (item) {
      // this.$slots.default = item.title;
      this.object = item
      this.focus = false
      this.func()
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
