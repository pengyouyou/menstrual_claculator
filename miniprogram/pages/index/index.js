//index.js
const app = getApp()

Page({
    data: {
        avatarUrl: './user-unlogin.png',
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',

		info: [{
				color: "green",
				desc: "安全期"
			},
			{
				color: "yellow",
				desc: "易孕期"
			},
			{
				color: "orange",
				desc: "排卵日"
			},
			{
				color: "red",
				desc: "月经期"
			}
		],

        year: new Date().getFullYear(),      // 年份
        month: new Date().getMonth() + 1,    // 月份
        day: new Date().getDate(),
        days_color: []
    },

    onLoad: function() {
        app.getUserOpenIdViaCloud().then(res => {
			console.log('get openid ok')
			wx.showLoading({
				title: '',
			})
			app.getMenstruationViaCloud().then(res => {
				console.log('get menstruation ok')
				wx.hideLoading()
				this.setPanel()
			})
			// .catch(err => {
			// 	console.log('get menstruation failed')
			// 	wx.hideLoading()
			// })
		})

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
        let demo5_days_style = new Array;
        for (let i = 1; i <= days_count; i++) {
            const date = new Date(this.data.year, this.data.month - 1, i);
            if (date.getDay() == 0) {
                demo5_days_style.push({
                    month: 'current', day: i, color: '#f488cd'
                });
            } else {
                demo5_days_style.push({
                    month: 'current', day: i, color: '#a18ada'
                });
            }
        }

        demo5_days_style.push({ month: 'current', day: 12, color: 'white', background: '#b49eeb' });
        demo5_days_style.push({ month: 'current', day: 17, color: 'white', background: '#f5a8f0' });
        demo5_days_style.push({ month: 'current', day: 20, color: 'white', background: '#aad4f5' });
        demo5_days_style.push({ month: 'current', day: 25, color: 'white', background: '#84e7d0' });

        this.setData({
            days_color: demo5_days_style
        })

    },

	getDateDiff: function(startDate, endDate) {
		// var startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
		// var endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
		var startTime = startDate.getTime();
		var endTime = endDate.getTime();
		var dates = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24);
		return Math.floor(dates);
	},

	setPanel: function () {
		const days_count = new Date(this.data.year, this.data.month, 0).getDate()
		var diff = this.getDateDiff(new Date(), app.globalData.menstruation.date)
		console.log(days_count, diff)
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
    },

    onPrevMonth: function (event) {
        console.log(event.detail)
    },

    onDateChange: function (event) {
        console.log(event.detail)
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