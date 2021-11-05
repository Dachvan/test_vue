<template>
  <section class="section-main">
    <div class="container">
      <div class="row">
        <div class="col-6">
          <h1 class="title-page">Статистика игрока в<br><b>World of Tanks</b></h1>
          <div class="desc-page">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus optio sequi, tenetur rerum omnis ipsa.</div>
          <form class="form-page" action="" @submit.prevent="getUser">
            <input v-model="nik" class="input-form" type="text" placeholder="Ник игрока" />
            <button class="btn button-form">Найти</button>
          </form>
        </div>
        <div class="col-6">
          <div v-if="error">{{error}}</div>
          <div v-if="this.user.nick" class="data-user">
            <div class="data-user__head">
              <div class="data-user__el"><i>#{{this.user.id}}</i></div>
              <div class="data-user__el"><i class="bi bi-clock"></i> {{this.user.logout}}</div>
            </div>
            <div class="data-clan" v-if="this.user.clan">
              <div class="data-clan__icon"><img :src="this.user.clan.emblems.x195.portal" alt=""></div>
              <div class="data-clan__text"><span :style="{color: this.user.clan.color}">[{{this.user.clan.tag}}]</span>{{this.user.clan.name}}</div>
            </div>
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
                    <div v-if="this.user.wn8 >= 3427" class="data-user__value text-purple">{{this.user.wn8}}</div>
                    <div v-else-if="this.user.wn8 >= 2498" class="data-user__value text-blue">{{this.user.wn8}}</div>
                    <div v-else-if="this.user.wn8 >= 1636" class="data-user__value text-green">{{this.user.wn8}}</div>
                    <div v-else-if="this.user.wn8 >= 1043" class="data-user__value text-yellow">{{this.user.wn8}}</div>
                    <div v-else-if="this.user.wn8 >= 532" class="data-user__value text-orange">{{this.user.wn8}}</div>
                    <div v-else-if="this.user.wn8 <= 531" class="data-user__value text-red">{{this.user.wn8}}</div>
                    <div v-else class="text-orange">{{this.user.wn8}}</div>
                    <div v-if="this.user.df_wn8" class="status">
                      <div class="status__group">
                        <div class="status__el" :class="{active: this.user.df_wn8 > 0}">
                          <svg width="15" height="15">
                            <use xlink:href="#arrow"></use>
                          </svg>
                        </div>
                        <div class="status__el" :class="{active: this.user.df_wn8 < 0}">
                          <svg width="15" height="15">
                            <use xlink:href="#arrow"></use>
                          </svg>
                        </div>
                      </div>
                      <div class="status__text">({{this.user.df_wn8}})</div>
                    </div>
                  </div>
                  <div class="data-user__text">
                    <b>РЭ:</b>
                    <div v-if="this.user.eff >= 1890" class="data-user__value text-purple">{{this.user.eff}}</div>
                    <div v-else-if="this.user.eff >= 1554" class="data-user__value text-blue">{{this.user.eff}}</div>
                    <div v-else-if="this.user.eff >= 1191" class="data-user__value text-green">{{this.user.eff}}</div>
                    <div v-else-if="this.user.eff >= 892" class="data-user__value text-yellow">{{this.user.eff}}</div>
                    <div v-else-if="this.user.eff >= 617" class="data-user__value text-orange">{{this.user.eff}}</div>
                    <div v-else-if="this.user.eff <= 616" class="data-user__value text-red">{{this.user.eff}}</div>
                    <div v-else class="data-user__value text-orange">{{this.user.eff}}</div>
                    <div v-if="this.user.df_eff" class="status">
                      <div class="status__group">
                        <div class="status__el" :class="{active: this.user.df_eff > 0}">
                          <svg width="15" height="15">
                            <use xlink:href="#arrow"></use>
                          </svg>
                        </div>
                        <div class="status__el" :class="{active: this.user.df_eff < 0}">
                          <svg width="15" height="15">
                            <use xlink:href="#arrow"></use>
                          </svg>
                        </div>
                      </div>
                      <div class="status__text">({{this.user.df_eff}})</div>
                    </div>
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
  </section>
</template>

<script>
import imageTank from '@/images/tank.png';
import axios from 'axios';
export default {
  data: () => ({
    nik: '',
    user: '',
    error: '',
    imageTank
  }),
  methods: {
    async getUser() {
      try {
        if(this.nik){
          const dataUser = await axios.get(
            'https://wotstatist.ru/api/statistics.php',
            {
              params: {
                user: this.nik,
              },
            }
          );
          console.log(dataUser.data);
          this.user = dataUser.data;
          this.nik = '';
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
}
</script>

<style scoped>
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