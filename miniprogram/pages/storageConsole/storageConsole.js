// pages/storageConsole/storageConsole.js

const app = getApp()
const config = require('../../config')
const util = require('../../utils/util')

Page({

	onShareAppMessage() {
		return {
			title: '不测测你怎么知道准不准，最懂你的姨妈安全期计算器',
			path: 'pages/index/index'
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
        duration: 0, // 持续时间

		_bak: null
    },

    onLoad: function(options) {
		console.log('setting onLoad', app.globalData.menstruation)
		this.data._bak = app.globalData.menstruation

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

		console.log(`in onLoad`, date, cycle, duration)
		let datestr = util.formatDate(date, "yyyy-MM-dd")

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
		console.log(`onSettingOK`, this.data.date)
		// 检查是否有修改
		var modify = true
		var newdate = new Date(this.data.date)
		if (this.data._bak)	{
			var bak = this.data._bak
			if (bak.cycle == this.data.cycle && bak.duration == this.data.duration) {
				// 还是用年、月、日的数值比较，比字符串比较靠谱一点，毕竟选择器返回的字符串不可控
				if (bak.date.getFullYear() == newdate.getFullYear() && 
					bak.date.getMonth() == newdate.getMonth() && 
					bak.date.getDate() == newdate.getDate()
				) {
					modify = false
				}
			}
		}

		if (modify) {
			console.log(`has modify`)
			app.globalData.menstruation = {
				date: newdate,
				cycle: this.data.cycle,
				duration: this.data.duration
			}
			wx.showToast({
				icon: 'loading',
				title: '正在同步设置至云端'
			})
			app.setMenstruationViaCloud().catch()
		}
		wx.navigateBack()
	}
})