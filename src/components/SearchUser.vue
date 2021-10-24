<template>
  <div class="container">
    <div class="row">
      <div class="col-6">
        <div class="title-page">Статистика игрока в<br><b>World of Tanks</b></div>
        <div class="desc-page">Данный сервис показывает статистику игрока по танкам, на которых сыгран хотя бы 1 бой</div>
        <form class="form-page" action="" @submit.prevent="getUser">
          <input v-model="nik" class="input-form" type="text" placeholder="Ник игрока" />
          <button class="button-form">Найти</button>
        </form>
      </div>
      <div class="col-6">
        <div v-if="error">{{error}}</div>
        <div v-if="this.user.nick" class="data-user">
          <div class="data-user__id"><i>#{{this.user.id}}</i></div>
          <div class="data-user__nik">{{this.user.nick}}</div>
          <div class="data-user__container">
            <div class="data-user__element">
              <div class="data-user__name">Боёв на аккаунте</div>
              <div class="data-user__value">{{this.user.battles}}</div>
            </div>
            <div class="data-user__element">
              <div class="data-user__name">Процент побед</div>
              <div class="data-user__value">{{this.user.wins}}%</div>
            </div>
            <div class="data-user__element">
              <div class="data-user__name">Средний урон</div>
              <div class="data-user__value">{{this.user.avg.damage}}</div>
            </div>
            <div class="data-user__element">
              <div class="data-user__name">Средний опыт</div>
              <div class="data-user__value">{{this.user.avg.xp}}</div>
            </div>
            <div class="data-user__element">
              <div class="data-user__name">Максимальный урон</div>
              <div class="data-user__value">{{this.user.max_damage}}</div>
            </div>
            <div class="data-user__element">
              <div class="data-user__name">Максимальный опыт за бой</div>
              <div class="data-user__value">{{this.user.max_xp}}</div>
            </div>
            <div class="data-user__element data-user__element--full">
              <div class="data-user__name">Оценка игры</div>
              <div class="data-user__group">
                <div class="data-user__text">
                  <b>WN8:</b>
                  <div v-if="this.user.wn8 >= 3427" class="text-purple">{{this.user.wn8}}</div>
                  <div v-else-if="this.user.wn8 >= 2498" class="text-blue">{{this.user.wn8}}</div>
                  <div v-else-if="this.user.wn8 >= 1636" class="text-green">{{this.user.wn8}}</div>
                  <div v-else-if="this.user.wn8 >= 1043 " class="text-yellow">{{this.user.wn8}}</div>
                  <div v-else-if="this.user.wn8 >= 532" class="text-orange">{{this.user.wn8}}</div>
                  <div v-else-if="this.user.wn8 <= 531" class="text-red">{{this.user.wn8}}</div>
                  <div v-else class="text-orange">{{this.user.wn8}}</div>
                </div>
                <div class="data-user__text">
                  <b>РЭ:</b>
                  <div v-if="this.user.eff >= 1890" class="text-purple">{{this.user.eff}}</div>
                  <div v-else-if="this.user.eff >= 1554" class="text-blue">{{this.user.eff}}</div>
                  <div v-else-if="this.user.eff >= 1191" class="text-green">{{this.user.eff}}</div>
                  <div v-else-if="this.user.eff >= 892 " class="text-yellow">{{this.user.eff}}</div>
                  <div v-else-if="this.user.eff >= 617" class="text-orange">{{this.user.eff}}</div>
                  <div v-else-if="this.user.eff <= 616" class="text-red">{{this.user.eff}}</div>
                  <div v-else class="text-orange">{{this.user.eff}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="image-page">
          <img :src="imageTank">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import imageTank from '@/images/tank.png';
import axios from "axios";
export default {
  data: () => ({
    nik: '',
    user: '',
    error: '',
    imageTank
  }),
  mounted() {
    //this.getDataTanks();
  },
  methods: {
    async getUser() {
      try {
        const dataUser = await axios.get(
          "https://wotstatist.ru/api/",
          {
            params: {
              user: this.nik,
            },
          }
        );
        this.user = dataUser.data;
        console.log(this.user);
      } catch (error) {
        console.log(error);
      }
    },
  },
}
</script>

<style scoped>
  .container{
    margin: 0px auto;
    max-width: 1070px;
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .row{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .col-6{
    padding: 0px 15px;
    flex: 0 0 50%;
  }
  .title-page{
    font-size: 32px;
    text-transform: uppercase;
  }
  .desc-page{
    margin: 30px 0px;
    font-size: 18px;
  }
  .image-page img{
    max-width: 100%;
  }
  .form-page{
    display: flex;
    align-items: center;
    background: #fafafa;
    padding: 10px;
    border-radius: 6px;
  }
  .input-form{
    outline: none;
    width: 100%;
    height: 55px;
    background: #f5f5f5;
    margin-right: 10px;
    border: 0px;
    padding: 0px 15px;
    border-radius: 6px;
    font-size: 16px;
  }
  .button-form{
    cursor: pointer;
    min-width: 150px;
    height: 55px;
    border-radius: 6px;
    background: #ab47bc;
    color: #ffffff;
    font-size: 16px;
    text-align: center;
    border: 0px;
  }
  .data-user {
  }
  .data-user__id {
    font-size: 14px;
    color: #757575;
  }
  .data-user__nik {
    font-size: 32px;
    font-weight: bold;
    margin: 15px 0px;
  }
  .data-user__element{
    flex: 1 0 50%;
    margin-bottom: 15px;
  }
  .data-user__element--full{
    flex: 1 0 100%;
    margin-bottom: 15px;
  }
  .data-user__name{
    font-size: 16px;
    margin-bottom: 5px;
  }
  .data-user__value{
    font-size: 24px;
  }
  .data-user__container{
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
  }
  .data-user__group{
    margin-top: 15px;
    display: flex;
    align-items: center;
  }
  .data-user__text{
    margin-right: 15px;
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
  }
  .data-user__text b{
    margin-right: 15px;
  }
  .text-purple{
    color: #8e24aa;
  }
  .text-blue{
    color: #40c4ff;
  }
  .text-green{
    color: #43a047;
  }
  .text-yellow{
    color: #ffeb3b
  }
  .text-orange{
    color: #ff6f00;
  }
  .text-red{
    color: #f44336;
  }
</style>