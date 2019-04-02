// pages/storageConsole/storageConsole.js

const app = getApp()
const config = require('../../config')

Page({

	onShareAppMessage() {
		return {
			title: '快来测测你的大姨妈安全期',
			path: 'pages/storageConsole/storageConsole'
		}
	},

    data: {
		cycle_list: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
			34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46,47, 48, 49, 50],
		duration_list: [2, 3, 4, 5, 6, 7, 8, 9, 10],

		cycle_index: 0,
		duration_index: 0,

		date: "", // 上一次的日期，string
        cycle: 0, 	// 周期
        duration: 0 // 持续时间
    },

    onLoad: function(options) {

		let item = app.globalData.menstruation || {
			date: new Date(),
			cycle: config.default_cycle,
			duration: config.default_duration
		}

        const {
            date,
            cycle,
            duration,
		} = item

		console.log(date, cycle, duration)
		let datestr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}`

        this.setData({
			date: datestr,
			cycle,
            duration,

			cycle_index: this.data.cycle_list.indexOf(cycle),
			duration_index: this.data.duration_list.indexOf(duration),
        })
    },

	bindDateChange(e) {
		console.log(e.detail)
		this.setData({
			date: e.detail.value
		})
	},

	bindCycleChange(e) {
		console.log(e.detail)
		this.setData({
			cycle: this.data.cycle_list[e.detail.value]
		})
	},

	bindDurationChange(e) {
		console.log(e.detail)
		this.setData({
			duration: this.data.duration_list[e.detail.value]
		})
	},

	onSettingOK: function() {

		app.globalData.menstruation = {
			date: new Date(this.data.date),
			cycle: this.data.cycle,
			duration: this.data.duration
		}
		app.setMenstruationViaCloud().catch()
		wx.navigateBack()
	}
})