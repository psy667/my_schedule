<template lang="html">
  <div class="container">
    <h1>Люблю Авушу :)</h1>
    <!-- <div class="description">
      Прогрессивное веб-приложение, для удобного просмотра расписания.
    </div> -->
    <div class="img"></div>
    <button class="btn btn-lg"><i class="icon icon-search"></i><router-link to="/search" >Поиск расписания</router-link></button>

  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
  .container{
    height: 100%;
    margin-top: -30px;
    min-height: calc(100vh - 52px);
    background: linear-gradient(105.27deg, #9C5EFF -7.54%, #4DA2FF 124.05%);
    color: #fff;
    h1{
      font-size: 48px;
      font-weight: bold;
      padding: 10px;
      padding-top: 50px;
    }
    .description{
      font-size: 24px;
      padding: 10px;
    }
    .img{
      width: 90vw;
      max-width: 100%;
      margin: auto;
      height: 80vw;
      max-height: 500px;
      background-image: url(../assets/main_pic.svg);
      background-repeat: no-repeat;
      background-size: contain;

    }
    button{
      width: 300px;
      display: block;
      border-radius: 100px;
      margin: auto;
      height: 40px;
      margin-bottom: 20px;
      i{
        margin-right: 10px;
      }
    }
  }
</style>
