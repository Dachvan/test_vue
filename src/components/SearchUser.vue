<template>
  <form action="" @submit.prevent="getUser">
    <h2>Статистика игрока</h2>
    <input v-model="nik" type="text" placeholder="Ник игрока" />
    <button>Найти</button>
  </form>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    nik: "dachvan",
    application_id: "2b91d4d2da44aaba463039cb79a1b5f7",
    tanksInfo: [],
    userTanksInfo: [],
  }),
  mounted() {
    this.getDataTanks();
  },
  methods: {
    async getDataTanks(element){
      this.tanksInfo = await axios.get(
          "https://static.modxvm.com/wn8-data-exp/json/wn8exp.json"
      );
      this.tanksInfo.data.data.forEach((element) => {
        this.tanksInfo[element.IDNum] = element;
      });
      return this.tanksInfo
    },
    async getUser() {
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
        const infoTanksResponse = await axios.get(
          "https://api.worldoftanks.ru/wot/tanks/stats/",
          {
            params: {
              application_id: this.application_id,
              account_id: listResponse.data.data[0].account_id,
              fields: "tank_id,all.battles,all.wins,all.damage_dealt,all.dropped_capture_points,all.frags,all.spotted"
            },
          }
        );
        
        this.userTanksInfo = infoTanksResponse.data.data[listResponse.data.data[0].account_id];

        /*const userTanksIds = []
        this.userTanksInfo.forEach((element, i) => {
          userTanksIds.push(element.tank_id)
        });
        const tempDataTanks = userTanksIds.reduce((a, key) => (a = this.tanksInfo[key], a), {});*/

        this.userTanksInfo.forEach((element, i) => {
          element.avgWinRate = (element.all.wins * 100 / element.all.battles).toFixed(2);
          element.exp_tank = this.tanksInfo[element.tank_id];
        });
        this.userTanksInfo.forEach((element, i) => {
          if(element['exp_tank'] === undefined){
            this.userTanksInfo.splice(i, 1);
          }
        });
        this.userTanksInfo.forEach((element, i) => {
          if(element['all']['battles'] == "0"){
            this.userTanksInfo.splice(i, 1);
          }
        });
        this.userTanksInfo.forEach((element, i) => {
          element.avgWinRate = Number(element.avgWinRate) * element.all.battles;
          element.expDmg = element.exp_tank.expDamage * element.all.battles;
          element.expSpot = element.exp_tank.expSpot * element.all.battles;
          element.expFrag = element.exp_tank.expFrag * element.all.battles;
          element.expDef = element.exp_tank.expDef * element.all.battles;
          element.expWinRate = element.exp_tank.expWinRate * element.all.battles;
        });
        const infoUser = {
          nickname: dataUser.nickname,
          rating: dataUser.global_rating,
          battles: dataUser.statistics.all.battles,
          wins: (
            (Number(dataUser.statistics.all.wins) * 100) /
            Number(dataUser.statistics.all.battles)
          ).toFixed(2),
        };
        
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

        console.log("-------------Итог-------------");

        console.log('rDAMAGE:' + ' avgDmg: ' + avgDmg + ' expDmg: ' + expDmg);
        console.log('rSPOT:' + ' avgSpot: ' + avgSpot + ' expSpot: ' + expSpot);
        console.log('rFRAG:' + ' avgFrag: ' + avgFrag + ' expFrag: ' + expFrag);
        console.log('rDEF:' + ' avgDef: ' + avgDef + ' expDef: ' + expDef);
        console.log('rWIN:' + ' avgWinRate: ' + avgWinRate + ' expWinRate: ' + expWinRate);
        console.log('WN8: ' + WN8);
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

<style></style>