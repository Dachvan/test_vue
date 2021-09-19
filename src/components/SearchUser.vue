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
        <div v-if="userInfo.nickname" class="data-user">
          <div class="data-user__id"><i>#{{userInfo.account_id}}</i></div>
          <div class="data-user__nik">{{userInfo.nickname}}</div>
          <div class="data-user__container">
            <div class="data-user__element">
              <div class="data-user__name">Боёв на аккаунте</div>
              <div class="data-user__value">{{userInfo.battles}}</div>
            </div>
            <div class="data-user__element">
              <div class="data-user__name">Процент побед</div>
              <div class="data-user__value">{{userInfo.wins}}%</div>
            </div>
            <div class="data-user__element">
              <div class="data-user__name">Средний урон</div>
              <div class="data-user__value">{{userInfo.avg_damage}}</div>
            </div>
            <div class="data-user__element">
              <div class="data-user__name">Средний опыт</div>
              <div class="data-user__value">{{userInfo.avg_xp}}</div>
            </div>
            <div class="data-user__element">
              <div class="data-user__name">Максимальный урон</div>
              <div class="data-user__value">{{userInfo.max_damage}}</div>
            </div>
            <div class="data-user__element">
              <div class="data-user__name">Максимальный опыт за бой</div>
              <div class="data-user__value">{{userInfo.max_xp}}</div>
            </div>
            <div class="data-user__element data-user__element--full">
              <div class="data-user__name">Оценка игры</div>
              <div class="data-user__group">
                <div class="data-user__text">
                  <b>WN8:</b>
                  <div v-if="userInfo.wn8 >= 3427" class="text-purple">{{userInfo.wn8}}</div>
                  <div v-else-if="userInfo.wn8 >= 2498" class="text-blue">{{userInfo.wn8}}</div>
                  <div v-else-if="userInfo.wn8 >= 1636" class="text-green">{{userInfo.wn8}}</div>
                  <div v-else-if="userInfo.wn8 >= 1043 " class="text-yellow">{{userInfo.wn8}}</div>
                  <div v-else-if="userInfo.wn8 >= 532" class="text-orange">{{userInfo.wn8}}</div>
                  <div v-else-if="userInfo.wn8 <= 531" class="text-red">{{userInfo.wn8}}</div>
                  <div v-else class="text-orange">{{userInfo.wn8}}</div>
                </div>
                <div class="data-user__text">
                  <b>РЭ:</b>
                  <div v-if="userInfo.eff >= 1890" class="text-purple">{{userInfo.eff}}</div>
                  <div v-else-if="userInfo.eff >= 1554" class="text-blue">{{userInfo.eff}}</div>
                  <div v-else-if="userInfo.eff >= 1191" class="text-green">{{userInfo.eff}}</div>
                  <div v-else-if="userInfo.eff >= 892 " class="text-yellow">{{userInfo.eff}}</div>
                  <div v-else-if="userInfo.eff >= 617" class="text-orange">{{userInfo.eff}}</div>
                  <div v-else-if="userInfo.eff <= 616" class="text-red">{{userInfo.eff}}</div>
                  <div v-else class="text-orange">{{userInfo.eff}}</div>
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
    nik: "",
    application_id: "2b91d4d2da44aaba463039cb79a1b5f7",
    expTanksInfo: [],
    userTanksInfo: [],
    tanksInfo: [],
    userInfo: [],
    error: '',
    imageTank
  }),
  mounted() {
    this.getDataTanks();
  },
  methods: {
    async getDataTanks(element){
      this.expTanksInfo = await axios.get(
          "https://static.modxvm.com/wn8-data-exp/json/wn8exp.json"
      );
      this.expTanksInfo.data.data.forEach((element) => {
        this.expTanksInfo[element.IDNum] = element;
      });
      this.tanksInfo = await axios.get(
        "https://api.worldoftanks.ru/wot/encyclopedia/vehicles/",
        {
          params: {
            application_id: this.application_id,
            fields: 'tier, name',
          },
        }
      );
      return this.expTanksInfo
    },
    async getUser() {
      this.error = "";
      this.userTanksInfo = [];
      try {
        const listResponse = await axios.get(
          "https://api.worldoftanks.ru/wot/account/list/",
          {
            params: {
              application_id: this.application_id,
              search: this.nik,
              fields: "account_id",
              type: "exact",
            },
          }
        );
        const infoResponse = await axios.get(
          "https://api.worldoftanks.ru/wot/account/info/",
          {
            params: {
              application_id: this.application_id,
              account_id: listResponse.data.data[0].account_id,
            },
          }
        );
        const dataUser = infoResponse.data.data[listResponse.data.data[0].account_id];
        
        if(dataUser.statistics.all.battles < 100){
          this.error = 'Для отображения статистики необходимо сыграть больше 100 боёв.'
          this.userInfo = '';
          return false
        }

        const infoTanksResponse = await axios.get(
          "https://api.worldoftanks.ru/wot/account/tanks/",
          {
            params: {
              application_id: this.application_id,
              account_id: listResponse.data.data[0].account_id,
            },
          }
        );
        
        this.userTanksInfo = infoTanksResponse.data.data[listResponse.data.data[0].account_id];
        
        /*const tempDataTanks = userTanksIds.reduce((a, key) => (a = this.tanksInfo[key], a), {});*/

        const userTanksIds = [];
        this.userTanksInfo.forEach((element, i) => {
          userTanksIds.push(element.tank_id)
          element.avgWinRate = (element.statistics.wins * 100 / element.statistics.battles).toFixed(2);
          element.exp_tank = this.expTanksInfo[element.tank_id];
        });
        
        this.userTanksInfo.forEach((element, i) => {
          if(element['exp_tank'] === undefined){
            this.userTanksInfo.splice(i, 1);
          }
        });

        console.log(this.tanksInfo);
        
        this.userTanksInfo.forEach((element, i) => {
          element.tank = this.tanksInfo.data.data[element.tank_id];
          element.avgTank = element.tank.tier * element.statistics.battles;
          element.avgWinRate = Number(element.avgWinRate) * element.statistics.battles;
          element.expDmg = element.exp_tank.expDamage * element.statistics.battles;
          element.expSpot = element.exp_tank.expSpot * element.statistics.battles;
          element.expFrag = element.exp_tank.expFrag * element.statistics.battles;
          element.expDef = element.exp_tank.expDef * element.statistics.battles;
          element.expWinRate = element.exp_tank.expWinRate * element.statistics.battles;
        });
        
        const avgDmg = dataUser.statistics.all.damage_dealt; //суммарный нанесенный урон игрока
        const avgSpot = dataUser.statistics.all.spotted; //суммарное количество обнаруженных
        const avgFrag = dataUser.statistics.all.frags; //суммарное количество уничтоженных
        const avgDef = dataUser.statistics.all.dropped_capture_points; //суммарное количество очков защиты
        const avgWinRate = Math.ceil(this.userTanksInfo.reduce((s, i) => (s = s + i.avgWinRate), 0)); //суммарное количество побед

        const expDmg = Math.ceil(this.userTanksInfo.reduce((s, i) => (s = s + i.expDmg), 0)); //ожидаемый нанесенный урон
        const expSpot = Math.ceil(this.userTanksInfo.reduce((s, i) => (s = s + i.expSpot), 0)); //ожидаемое количество обнаруженных
        const expFrag = Math.ceil(this.userTanksInfo.reduce((s, i) => (s = s + i.expFrag), 0)); //ожидаемое количество уничтоженных
        const expDef = Math.ceil(this.userTanksInfo.reduce((s, i) => (s = s + i.expDef), 0)); //ожидаемое количество очков защиты
        const expWinRate = Math.ceil(this.userTanksInfo.reduce((s, i) => (s = s + i.expWinRate), 0)); //ожидаемое количество побед

        const rWN8 = {
          rDAMAGE: avgDmg / expDmg,
          rSPOT: avgSpot / expSpot,
          rFRAG: avgFrag / expFrag,
          rDEF: avgDef / expDef,
          rWIN: avgWinRate / expWinRate,
        };
        const rWN8c = {
          rWINc: max(0, (rWN8.rWIN - 0.71) / (1 - 0.71)),
          rDAMAGEc: max(0, (rWN8.rDAMAGE - 0.22) / (1 - 0.22)),
          rFRAGc: min(rWN8.rDAMAGEc + 0.2, max(0, (rWN8.rFRAG - 0.12) / (1 - 0.12))),
          rSPOTc: min(rWN8.rDAMAGEc + 0.1, max(0, (rWN8.rSPOT - 0.38) / (1 - 0.38))),
          rDEFc: min(rWN8.rDAMAGEc + 0.1, max(0, (rWN8.rDEF - 0.1) / (1 - 0.1))),
        };
        const WN8 =
          980 * rWN8c.rDAMAGEc +
          210 * rWN8c.rDAMAGEc * rWN8c.rFRAGc +
          155 * rWN8c.rFRAGc * rWN8c.rSPOTc +
          75 * rWN8c.rDEFc * rWN8c.rFRAGc +
          145 * min(1.8, rWN8c.rWINc);

        console.log(dataUser);
        this.userInfo = {
          account_id: dataUser.account_id,
          nickname: dataUser.nickname,
          avg_damage: Math.ceil(dataUser.statistics.all.damage_dealt / dataUser.statistics.all.battles),
          avg_lvl: this.userTanksInfo.reduce((s, i) => (s = s + i.avgTank), 0) / dataUser.statistics.all.battles,
          avg_frags: dataUser.statistics.all.frags / dataUser.statistics.all.battles,
          avg_spotted: dataUser.statistics.all.spotted / dataUser.statistics.all.battles,
          avg_cap: dataUser.statistics.all.capture_points / dataUser.statistics.all.battles,
          avg_def: dataUser.statistics.all.dropped_capture_points / dataUser.statistics.all.battles,
          avg_xp: Math.ceil(dataUser.statistics.all.xp / dataUser.statistics.all.battles),
          max_xp: dataUser.statistics.all.max_xp,
          max_damage: dataUser.statistics.all.max_damage,
          rating: dataUser.global_rating,
          battles: dataUser.statistics.all.battles,
          wn8: WN8.toFixed(2),
          eff: '',
          wins: (
            (Number(dataUser.statistics.all.wins) * 100) /
            Number(dataUser.statistics.all.battles)
          ).toFixed(2),
        };
        
        const DAMAGE = Number(this.userInfo.avg_damage.toFixed(2));
        const TIER = Number(this.userInfo.avg_lvl.toFixed(2));
        const FRAGS = Number(this.userInfo.avg_frags.toFixed(2));
        const SPOT = Number(this.userInfo.avg_spotted.toFixed(2));
        const CAP = Number(this.userInfo.avg_cap.toFixed(2));
        const DEF = Number(this.userInfo.avg_def.toFixed(2));

        console.log(DAMAGE+" Средний дамаг");
        console.log(TIER+" Средний лвл");
        console.log(FRAGS+" среднее кол-во фрагов за бой");
        console.log(SPOT+" среднее кол-во обнаруженных за бой");
        console.log(CAP+" среднее кол-во захвата за бой");
        console.log(DEF+" среднее кол-во защиты за бой");

        const EFF = 
        DAMAGE * (10 / (TIER + 2)) * (0.23 + 2 * TIER / 100) +
        FRAGS * 250 +
        SPOT * 150 +
        (Math.log(CAP + 1)/Math.log(1.732)) * 150 +
        DEF * 150;
        
        this.userInfo.eff = EFF.toFixed(2);

        console.log(this.userInfo);
        console.log(EFF);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
function min(a, b) {
  if (a < b) {
    return a;
  } else {
    return b;
  }
}
function max(a, b) {
  if (a > b) {
    return a;
  } else {
    return b;
  }
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