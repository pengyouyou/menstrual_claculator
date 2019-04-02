//app.js
const config = require('./config')

App({
    onLaunch(opts) {
        console.log('App Launch', opts)
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                env: config.envId,
                traceUser: true,
            })
        }
    },

    onShow(opts) {
        console.log('App Show', opts)
    },

    onHide() {
        console.log('App Hide')
    },

    globalData: {
        hasLogin: false,
        openid: null,

		menstruation: null,
    },

    // 通过云函数获取用户 openid，支持回调或 Promise
    getUserOpenIdViaCloud() {
		return new Promise((resolve, reject) => {
			wx.cloud.callFunction({
				name: 'login',
				data: {}
			}).then(res => {
				console.log('[云函数] [login] user openid: ', res.result.openid)
				this.globalData.openid = res.result.openid
				resolve(res.result.openid)
			}).catch(err => {
				console.error('[云函数] [login] 调用失败', err)
				reject(err)
			})
		})
    },

	getMenstruationViaCloud () {
		return new Promise((resolve, reject) => {
			if (!this.globalData.openid) {
				return reject(`未登录`)
			}

			const db = wx.cloud.database()
			// 查询当前用户所有的 menstruation
			db.collection('menstruation').where({
				_openid: this.globalData.openid
			}).get().then(res => {
				// console.log(JSON.stringify(res.data, null, 2))
				this.globalData.menstruation = res.data[0];

				console.log('[数据库] [查询记录] 成功: ', res);
				resolve(res)
			}).catch(err => {
				wx.showToast({
					icon: 'none',
					title: '查询记录失败'
				})
				console.error('[数据库] [查询记录] 失败：', err)
				reject(err)
			})
		})
	},

	setMenstruationViaCloud() {
		return new Promise((resolve, reject) => {
			if (!this.globalData.openid) {
				return reject(`未登录`)
			} else if (!this.globalData.menstruation) {
				return reject(`未设置有效数据`)
			}

			const db = wx.cloud.database()
			// 新增当前用户记录 menstruation
			db.collection('menstruation').add({
				// 注意：data 字段表示需新增的 JSON 数据
				data: this.globalData.menstruation
			}).then(res => {
				console.log(res)

				console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
				resolve(res)
			}).catch(err => {
				wx.showToast({
					icon: 'none',
					title: '新增记录失败'
				})
				console.error('[数据库] [新增记录] 失败：', err)
				reject(err)
			})
		})
	}
})