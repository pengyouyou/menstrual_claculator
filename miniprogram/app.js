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
        openid: null
    },

    // 通过云函数获取用户 openid，支持回调或 Promise
    getUserOpenIdViaCloud() {
        return wx.cloud.callFunction({
            name: 'login',
            data: {}
        }).then(res => {
            console.log('[云函数] [login] user openid: ', res.result.openid)
            this.globalData.openid = res.result.openid
            return res.result.openid
        }).catch(err => {
            console.error('[云函数] [login] 调用失败', err)
        })
    }
})