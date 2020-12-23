<template>
  <div class="calendar-wrapper">
    <div class="calendar-toolbar">
      <div class="prev" @click="prevMonth">pre</div>
      <div class="current">{{ currentDateStr }}</div>
      <div class="next" @click="nextMonth">next</div>
    </div>
    <div class="calendar-week">
      <div class="week-item" v-for="item of weekList" :key="item">{{ item }}</div>
    </div>
    <div class="calendar-inner">
      <div
        class="calendar-item"
        v-for="(item, index) of calendarList"
        :key="index"
        :class="[item.disable ? 'disabled' : '', item.hasSchedule ? 'hasSchedule': '', item.overdue ? 'overdue': '', item.checked ? 'checked' : '']"
        @click="handleCheck(item)"
      >{{ item.date }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Calendar',
  props: {
      interval: {
          type: Number,
          default: 0
      }
  },
  data() {
    return {
      current: {}, // 当前时间
      calendarList: [], // 用于遍历显示
      shareDate: new Date(), // 享元模式，用来做优化的
      checkedValue: "",
      onpresscTime: 0
    };
  },
  computed: {
    weekList() {
      // if (this.$i18n.locale === 'zh_CN') {
      //   return ["日", "一", "二", "三", "四", "五", "六"]
      // } else {
      //   return ['Sun','Mon','Tues',' Wed','Thur','Fri','Sat']
      // }
      return ["日", "一", "二", "三", "四", "五", "六"]
    },
    // 显示当前时间
    currentDateStr() {
      let { year, month } = this.current;
      // if (this.$i18n.locale === 'zh_CN') {
      //   return `${year}年${this.pad(month + 1)}月`;
      // } else {
      //   return `${year} - ${this.pad(month + 1)}`;
      // }
      return `${year}年${this.pad(month + 1)}月`;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.checkedValue = this.getDateValue(new Date());
      this.$emit('handleCalendar', this.checkedValue)
      // 初始化当前时间
      this.setCurrent();
      this.calendarCreator();
    },
    handleCheck(item) {
      console.log(item);
      if (item.disable) return;
      this.checkedValue = item.value;
      this.$emit('handleCalendar', item.value)
      this.calendarList.forEach((i) => {
        if (i.value === item.value) {
          i.checked = true;
        } else {
          i.checked = false;
        }
      });
    },
    // 判断当前月有多少天
    getDaysByMonth(year, month) {
      return new Date(year, month + 1, 0).getDate();
    },
    getFirstDayByMonths(year, month) {
      return new Date(year, month, 1).getDay();
    },
    getLastDayByMonth(year, month) {
      return new Date(year, month + 1, 0).getDay();
    },
    // 对小于 10 的数字，前面补 0
    pad(str) {
      return str < 10 ? `0${str}` : str;
    },
    // 点击上一月
    prevMonth() {
      if ((Date.now() - this.onpresscTime) > this.interval) {
        this.onpresscTime = Date.now()
        this.current.month--;
        // 因为 month的变化 会超出 0-11 的范围， 所以需要重新计算
        this.correctCurrent();
        // 生成新日期
        this.calendarCreator();
      }
    },
    // 点击下一月
    nextMonth() {
      if ((Date.now() - this.onpresscTime) > this.interval) {
        this.onpresscTime = Date.now()
        this.current.month++;
        // 因为 month的变化 会超出 0-11 的范围， 所以需要重新计算
        this.correctCurrent();
        // 生成新日期
        this.calendarCreator();
      }
    },
    // 通过某天生成某月的日历
    jumpTo(date) {
      let checkedValue = new Date(date)
      this.setCurrent(checkedValue)
      this.checkedValue = this.getDateValue(checkedValue);
      this.calendarCreator()
    },
    // 设置或初始化 current
    setCurrent(d = new Date()) {
      let year = d.getFullYear();
      let month = d.getMonth();
      let date = d.getDate();
      this.current = {
        year,
        month,
        date,
      };
    },
    // 修正 current
    correctCurrent() {
      let { year, month, date } = this.current;

      let maxDate = this.getDaysByMonth(year, month);
      // 预防其他月跳转到2月，2月最多只有29天，没有30-31
      date = Math.min(maxDate, date);
      let instance = new Date(year, month, date);
      this.setCurrent(instance);
    },
    // 生成日期
    calendarCreator() {
      // 一天有多少毫秒
      const oneDayMS = 24 * 60 * 60 * 1000;

      let list = [];
      let { year, month } = this.current;

      // 当前月份第一天是星期几, 0-6
      let firstDay = this.getFirstDayByMonths(year, month);
      // 填充多少天
      // let prefixDaysLen = firstDay === 0 ? 6 : firstDay - 1; // 星期日在最后
      let prefixDaysLen = firstDay; // 星期日在最前
      // 毫秒数
      let begin = new Date(year, month, 1).getTime() - oneDayMS * prefixDaysLen;
      // 当月第一天时间戳
      this.currentFirstDay = new Date(year, month, 1).getTime()
      // 当前月份最后一天是星期几, 0-6
      let lastDay = this.getLastDayByMonth(year, month);
      // 填充多少天， 和星期的排放顺序有关
      // let suffixDaysLen = lastDay === 0 ? 0 : 7 - lastDay; // 星期日在最后
      let suffixDaysLen = 6 - lastDay; // 星期日在最前
      // 毫秒数
      let end =
        new Date(year, month + 1, 0).getTime() + oneDayMS * suffixDaysLen;
      // 当月最后一天时间戳
      this.currentEndDay = new Date(year, month + 1, 0).getTime()
      // 当月一共有多少天
      this.days = new Date(year, month + 1, 0).getDate()
      let now = new Date()
      let nowYear = now.getFullYear();
      let nowMonth = now.getMonth();
      let nowDate = now.getDate();
      let curYear;
      let curMonth
      while (begin <= end) {
        // 享元模式，避免重复 new Date
        this.shareDate.setTime(begin);
        curYear = this.shareDate.getFullYear();
        curMonth = this.shareDate.getMonth();
        let date = this.shareDate.getDate();
        let value = this.getDateValue(this.shareDate)
        list.push({
          year: year,
          month: curMonth,
          date: date,
          disable: curMonth !== month,
          value,
          checked: this.checkedValue === value ? true : false,
          overdue: Number(`${nowYear}${this.pad(nowMonth)}${this.pad(nowDate)}`) > Number(`${curYear}${this.pad(curMonth)}${this.pad(date)}`)
        });
        begin += oneDayMS;
      }
      this.calendarList = list;
      // 生成日历以后再请求日程数据
      this.$emit('handleChangeMonth', this.currentFirstDay, this.currentEndDay, this.days, this.checkedValue, curYear + '/' + curMonth)
    },
    getDateValue(dateObj) {
        let year = dateObj.getFullYear();
        let curMonth = dateObj.getMonth() + 1;
        let date = dateObj.getDate();
        return year +'/' + curMonth +'/'+date;
    },
    // initData() {
    //   this.calendarList.forEach((cItem) => {
    //     this.scheduleList.forEach((sItem, sIndex) => {
    //             let sItemValue = this.getDateValue(new Date(sItem.date))
    //             if (sItemValue === cItem.value) {
    //                 if (sItem.list && sItem.list.length > 0) {
    //                   this.$set(cItem, 'hasSchedule', true)
    //                   // if (new Date(cItem.value).getTime() < new Date(this.getDateValue(new Date())).getTime()) {
    //                   //   this.$set(cItem, 'overdue', true)
    //                   // } 
    //                 }
    //             }
    //         })
    //     })
    // },
    // setData(selectedIndex = -1) {
    //   this.calendarList.forEach((cItem) => {
    //     this.$set(cItem, 'checked', false)
    //     this.scheduleList.forEach((sItem, sIndex) => {
    //             let sItemValue = this.getDateValue(new Date(sItem.date))
    //             if (sItemValue === cItem.value) {
    //                 if(selectedIndex > -1) {
    //                   if (sIndex === selectedIndex) {
    //                     this.$set(cItem, 'checked', true)
    //                   }
    //                   if (cItem.checked) {
    //                       this.checkedValue = sItemValue
    //                   }
    //                 }
    //             }
    //         })
    //     })
    // }
  },
};
</script>

<style lang="scss">
.calendar-wrapper {
  width: 326px;
  overflow: hidden;
  text-align: center;
  .calendar-toolbar {
    display: flex;
    height: 35px;
    align-items: center;
    // margin: 0 12px;
    font-size: 16px;
    .prev,
    .next {
        cursor: pointer;
    }
    .current {
        flex: 1;
    }
    }

    .calendar-week {
    display: flex;
    justify-content: center;
    margin-top: 8px;
    font-size: 13px;
    font-weight: 700;
    .week-item {
        width: 32px;
        margin: 7px;
    }
    }
    .calendar-inner {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .calendar-item {
        float: left;
        width: 32px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        margin: 7px;
        font-size: 13px;
        font-weight: 700;
        color: #1e1e1e;
        cursor: pointer;
        &.disabled {
        color: #b0b0b0;
        cursor: not-allowed;
        }
        &.hasSchedule {
        background: #ebf7fd;
        border-radius: 18px;
        }
        &.overdue.hasSchedule {
          background: #f5f5f5;
        }
        &.hasSchedule.disabled {
        background: #f5f5f5;

        color: #b0b0b0;
        }
        &.checked {
        color: white;
        background: #00b6ff !important;
        border-radius: 18px;
        }
    }
    }
}


</style>