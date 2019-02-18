<template>

  <div class="dropdown dropdown-right">
    <span @click='focus = !focus' v-model='object.title' class="btn btn-secondary dropdown-toggle col-12 text-left" tabindex="0">
      <slot></slot>
      <i class="icon icon-caret text-right"></i>
    </span>

    <ul class='list' v-show='focus'>

      <!-- {{ list }} -->
      <li class='text-dark' v-for='(item, i) in list'>
        <!-- <label class="form-checkbox"> -->
          <input type="checkbox" :checked='newList[i].value' @click='select(i)'>
          <i class="form-icon"></i>{{ item.title }}
        <!-- </label> -->

      </li>
    </ul>
    </div>
</template>

<script>
export default {
  name: 'checkBoxDropdown',
  data () {
    return {
      focus: false,
      object: {
        title: '',
        id: ''
      },
      newList: []
    }
  },
  props: {
    list: Array,
    value: String,
    values: Array
  },
  computed: {

  },
  beforeMount () {
    for (let i = 0; i < this.list.length; i++) {
      this.newList.push({ id: i, value: false })
      if (this.values.includes(i)) {
        this.newList[i].value = true
      } else {
        this.newList[i].value = false
      }
    }
  },
  methods: {
    func () {
      this.$emit('custom', [...this.result])
    },
    select (i) {
      this.newList[i].value = !this.newList[i].value
      this.result = [9999]
      for (let item of this.newList) {
        if (item.value) {
          this.result.push(item.id)
        }
      };
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
