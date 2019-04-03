//index.js
const app = getApp()

Page({
	onShareAppMessage() {
		return {
			title: '还在掰手指头计算姨妈安全期？你看这灯，多亮！',
			path: 'pages/index/index'
		}
	},

    data: {
        avatarUrl: './user-unlogin.png',
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',

		info: [{
				color: `#84e7d0`,
				desc: "安全期"
			},
			{
				color: '#b49eeb',
				desc: "易孕期"
			},
			{
				color: "orange",
				desc: "排卵日"
			},
			{
				color: '#f5a8f0',
				desc: "月经期"
			}
		],

		// 记录当前日期的年、月、日
        year: new Date().getFullYear(),      // 年份
        month: new Date().getMonth() + 1,    // 月份
        day: new Date().getDate(),
        days_color: [],

    },

    onLoad: function() {
		console.log('onLoad')

        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            this.setData({
                                avatarUrl: res.userInfo.avatarUrl,
                                userInfo: res.userInfo
                            })
                        }
                    })
                }
            }
        })

        const days_count = new Date(this.data.year, this.data.month, 0).getDate();
        console.log(days_count);
		let days_style = new Array;
		// 1号星期几
		let weekn = new Date(this.data.year, this.data.month - 1, 1).getDay()
        for (let i = 1; i <= days_count; i++) {
            if (i == this.data.day) {
				days_style.push({
					month: 'current', day: i, color: '#ff0033'
				});
			} else {
				// 如果星期天
				if ((weekn + i - 1) % 7 == 0) {
					days_style.push({
						month: 'current', day: i, color: '#f488cd'
					});
				} else {
					days_style.push({
						month: 'current', day: i, color: '#a18ada'
					});
				}
			}
        }

        this.setData({
			days_color: days_style
        })

    },

	onShow() {
		console.log('index onShow')

		if (app.globalData.menstruation) {
			this.setPanel()
		} else {
			app.getUserOpenIdViaCloud().then(res => {
				console.log('get openid ok')
				wx.showLoading({
					title: '',
				})
				app.getMenstruationViaCloud().then(res => {
					console.log('get menstruation ok')
					wx.hideLoading()
					// 查询成功情况下得到的data可能是空数组，这发生在手动在数据库删除记录的情况

					if (app.globalData.menstruation) {
						this.setPanel()
					} else {
						wx.showToast({
							icon: 'none',
							title: '请设置你的例假信息'
						})
					}
				})
				.catch(err => {
					console.log('get menstruation failed')
					wx.hideLoading()
					wx.showToast({
						icon: 'none',
						title: '未获取到云端记录，请设置你的例假信息'
					})
				})
			})
		}
	},

	getDateDiff: function(startDate, endDate) {
		// var startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
		// var endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
		console.log(`in getDateDiff`, startDate, endDate)
		const preday = 1000 * 60 * 60 * 24
		var startTime = Math.floor(startDate.getTime() / preday)
		var endTime = Math.floor(endDate.getTime() / preday)
		console.log(startTime, endTime)
		return startTime - endTime;
	},

	setPanel: function () {
		if (!app.globalData.menstruation) return

		var menst = app.globalData.menstruation
		const days_count = new Date(this.data.year, this.data.month, 0).getDate()
		// var first_day = `${this.data.year}-${this.data.month}-1`
		// var last_day = `${menst.date.getFullYear()}-${menst.date.getMonth() + 1}-${menst.date.getDate()}`
		// var diff = this.getDateDiff(new Date(first_day), new Date(last_day))
		var first_day = new Date(this.data.year, this.data.month, 1)
		var last_day = new Date(menst.date.getFullYear(), menst.date.getMonth() + 1, menst.date.getDate())
		var diff = this.getDateDiff(first_day, last_day)
		console.log(days_count, diff, diff % menst.cycle)

		let cfg = this.getConfig()
		console.log("cfg:", cfg)

		let days_style = new Array;
		for (let i = 1; i <= days_count; i++) {
			var offset = ((i - 1) + diff) % menst.cycle
			if (offset < 0) offset += menst.cycle
			var info = this.getStage(cfg, offset)
			if (info) days_style.push({ month: 'current', day: i, color: 'white', background: info.color })
		}

		// 标注今天
		var today = new Date()
		if (this.data.year == today.getFullYear() && this.data.month == today.getMonth() + 1) {
			var iday = today.getDate()
			days_style[iday - 1].color = '#ff0033'
		}

		this.setData({
			days_color: days_style
		})
	},

	getConfig() {
		var default_cfg = [6, 9, 9]
		var menst = app.globalData.menstruation
		var len = menst.cycle - menst.duration

		var cfg = null
		if (len >= 24) {
			cfg = default_cfg
			cfg[0] = len - 18
		} else if (len <= 24 - 18) {
			cfg = [0, len, 0]
		} else {
			var floor = Math.floor((24 - len) / 3)
			var yu = (24 - len) % 3
			cfg = default_cfg
			if (yu == 1) {
				cfg[2]--
			} else if (yu == 2) {
				cfg[1]--
				cfg[2]--
			}
			cfg[0] -= floor
			cfg[1] -= floor
			cfg[2] -= floor
		}
		cfg.unshift(menst.duration)

		return cfg
	},

	getStage(cfg, offset) {
		if (offset < 0) return null

		var idx = 0
		var nuan = cfg[0] + cfg[1] + Math.ceil((cfg[2] + 1) / 2) - 1
		if (offset == nuan) {
			idx = 4
		} else {
			let sum = 0
			for (let i = 0; i < cfg.length; i++) {
				sum += cfg[i]
				if (offset < sum) {
					idx = i
					break
				}
			}
		}
		// console.log(cfg, offset, idx)

		var map = [3, 0, 1, 0, 2]
		return this.data.info[map[idx]]
	},

	dateChange(info) {
		this.data.year = info.currentYear
		this.data.month = info.currentMonth

		this.setPanel()
	},

    onGetUserInfo: function(e) {
        if (!this.logged && e.detail.userInfo) {
            this.setData({
                logged: true,
                avatarUrl: e.detail.userInfo.avatarUrl,
                userInfo: e.detail.userInfo
            })
        }
    },

    onNextMonth: function (event) {
        console.log(event.detail)
		this.dateChange(event.detail)
    },

    onPrevMonth: function (event) {
        console.log(event.detail)
		this.dateChange(event.detail)
    },

    onDateChange: function (event) {
        console.log(event.detail)
		this.dateChange(event.detail)
    },

    onDayClick: function (event) {
        console.log(event.detail)
        this.setData({
            days_color: [{
                month: 'current',
                day: event.detail.day,
                color: `white`,
                background: `#007aff`
            }]
        })
    },

	onSetting: function() {
		wx.navigateTo({
			url: '../storageConsole/storageConsole'
		})
	}

})